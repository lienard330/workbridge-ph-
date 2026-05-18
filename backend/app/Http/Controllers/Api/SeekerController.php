<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use App\Models\SavedJob;
use App\Models\Seeker;
use App\Models\SeekerSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SeekerController extends Controller
{
    public function profile(Request $request)
    {
        $seeker = $request->user()->seeker()->with('skills', 'resumes')->first();
        return response()->json($seeker);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $seeker = $user->seeker;

        if (! $seeker) {
            $seeker = Seeker::create(['user_id' => $user->id]);
        }

        $data = $request->validate([
            'headline' => 'nullable|string|max:255',
            'bio'      => 'nullable|string|max:2000',
            'location' => 'nullable|string|max:255',
            'phone'    => 'nullable|string|max:20',
            'skills'   => 'nullable|array',
            'skills.*' => 'string|max:100',
        ]);

        $seeker->update([
            'headline' => $data['headline'] ?? $seeker->headline,
            'bio'      => $data['bio'] ?? $seeker->bio,
            'location' => $data['location'] ?? $seeker->location,
            'phone'    => $data['phone'] ?? $seeker->phone,
        ]);

        if (isset($data['skills'])) {
            $seeker->skills()->delete();
            foreach ($data['skills'] as $skill) {
                SeekerSkill::create(['seeker_id' => $seeker->id, 'skill' => $skill]);
            }
        }

        $strength = $this->calcStrength($seeker->fresh(['skills']));
        $seeker->update(['profile_strength' => $strength]);

        return response()->json($seeker->fresh(['skills', 'resumes']));
    }

    public function uploadPhoto(Request $request)
    {
        // 2MB cap (Laravel `max:` is in KB) on common image types.
        $request->validate(['photo' => 'required|image|max:2048']);

        $seeker = $request->user()->seeker;
        if (! $seeker) {
            return response()->json(['message' => 'Seeker profile not found.'], 404);
        }

        // Delete the previous photo if one exists — avoids orphaned files in storage.
        if ($seeker->profile_photo) {
            Storage::disk('public')->delete($seeker->profile_photo);
        }

        $path = $request->file('photo')->store('avatars', 'public');
        $seeker->update(['profile_photo' => $path]);

        return response()->json([
            'profile_photo'     => $path,
            // Storage::url() (static facade) is properly typed; disk('public')->url()
            // works at runtime but trips Intelephense because url() is on the
            // FilesystemAdapter concrete class, not the Filesystem interface.
            'profile_photo_url' => Storage::url($path),
        ]);
    }

    public function uploadResume(Request $request)
    {
        $request->validate(['resume' => 'required|file|mimes:pdf,doc,docx|max:5120']);
        $user   = $request->user();
        $seeker = $user->seeker;

        if (! $seeker) {
            return response()->json(['message' => 'No seeker profile.'], 403);
        }

        $file = $request->file('resume');

        // Store in private disk (storage/app/resumes) — NOT web-accessible
        $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path       = $file->storeAs('resumes', $storedName, 'local');

        $resume = Resume::create([
            'seeker_id'     => $seeker->id,
            'file_path'     => $path,
            'original_name' => $file->getClientOriginalName(),
            'is_primary'    => $seeker->resumes()->count() === 0,
        ]);

        return response()->json($resume, 201);
    }

    public function downloadResume(Request $request, $resumeId)
    {
        $user   = $request->user();
        $resume = Resume::findOrFail($resumeId);
        $seeker = $resume->seeker;

        // Allow: the owning seeker, employers who have an application for this seeker, or admin
        $isOwner    = $seeker?->user_id === $user->id;
        $isEmployer = $user->role === 'employer' && $seeker?->applications()
            ->whereHas('jobListing', fn ($q) => $q->where('company_id', $user->company?->id))
            ->exists();
        $isAdmin    = $user->role === 'admin';

        if (! $isOwner && ! $isEmployer && ! $isAdmin) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if (! Storage::disk('local')->exists($resume->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        // response()->download() is properly typed and gives us the same result
        // as the Filesystem download() method that Intelephense can't see.
        return response()->download(
            storage_path('app/' . $resume->file_path),
            $resume->original_name
        );
    }

    public function deleteResume(Request $request, $resumeId)
    {
        $seeker = $request->user()->seeker;
        $resume = Resume::findOrFail($resumeId);

        if ($resume->seeker_id !== $seeker?->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        Storage::disk('local')->delete($resume->file_path);
        $resume->delete();

        return response()->json(['message' => 'Resume deleted.']);
    }

    public function savedJobs(Request $request)
    {
        $seeker = $request->user()->seeker;

        if (! $seeker) {
            return response()->json(['data' => []]);
        }

        // Order by saved_at — the saved_jobs table doesn't have created_at,
        // so the default `->latest()` (which assumes created_at) errors with
        // "Unknown column 'created_at'" on MySQL.
        $saved = SavedJob::with(['jobListing.company', 'jobListing.tags'])
            ->where('seeker_id', $seeker->id)
            ->orderByDesc('saved_at')
            ->paginate(20);

        return response()->json($saved);
    }

    public function saveJob(Request $request, $jobId)
    {
        $seeker = $request->user()->seeker;

        if (! $seeker) {
            return response()->json(['message' => 'No seeker profile.'], 403);
        }

        $existing = SavedJob::where('seeker_id', $seeker->id)
            ->where('job_listing_id', $jobId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already saved.'], 422);
        }

        SavedJob::create(['seeker_id' => $seeker->id, 'job_listing_id' => $jobId]);
        return response()->json(['message' => 'Job saved.'], 201);
    }

    public function unsaveJob(Request $request, $jobId)
    {
        $seeker = $request->user()->seeker;

        SavedJob::where('seeker_id', $seeker?->id)
            ->where('job_listing_id', $jobId)
            ->delete();

        return response()->json(['message' => 'Job removed from saved.']);
    }

    private function calcStrength(Seeker $seeker): int
    {
        $score = 0;
        if ($seeker->headline)              $score += 20;
        if ($seeker->bio)                   $score += 20;
        if ($seeker->location)              $score += 10;
        if ($seeker->phone)                 $score += 10;
        if ($seeker->profile_photo)         $score += 10;
        if ($seeker->skills->count() > 0)   $score += 15;
        if ($seeker->resumes()->count() > 0) $score += 15;
        return min($score, 100);
    }
}
