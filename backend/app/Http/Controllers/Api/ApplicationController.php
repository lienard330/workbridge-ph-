<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationTimeline;
use App\Models\JobListing;
use App\Models\WbNotification;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function apply(Request $request, int $jobId)
    {
        $user = $request->user();
        $seeker = $user->seeker;

        if (! $seeker) {
            return response()->json(['message' => 'Seeker profile not found.'], 403);
        }

        $job = JobListing::findOrFail($jobId);

        if ($job->status !== 'Open') {
            return response()->json(['message' => 'This job is no longer accepting applications.'], 422);
        }

        $existing = Application::where('job_listing_id', $jobId)
            ->where('seeker_id', $seeker->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied to this job.'], 422);
        }

        $data = $request->validate([
            'resume_id'    => 'nullable|exists:resumes,id',
            'cover_letter' => 'nullable|string|max:2000',
            'skill_fit'    => 'nullable|integer|min:0|max:100',
        ]);

        $app = Application::create([
            'job_listing_id' => $jobId,
            'seeker_id'      => $seeker->id,
            'resume_id'      => $data['resume_id'] ?? null,
            'cover_letter'   => $data['cover_letter'] ?? null,
            'skill_fit'      => $data['skill_fit'] ?? null,
            'status'         => 'Pending',
        ]);

        ApplicationTimeline::create([
            'application_id' => $app->id,
            'status'         => 'Pending',
            'note'           => 'Application submitted.',
            'changed_by'     => $user->id,
        ]);

        WbNotification::create([
            'user_id' => $job->company->user_id,
            'type'    => 'new_application',
            'title'   => 'New Application',
            'body'    => "{$user->name} applied to \"{$job->title}\".",
            'link'    => "/employer/applicants.html",
        ]);

        return response()->json($app->load('timelines'), 201);
    }

    public function myApplications(Request $request)
    {
        $seeker = $request->user()->seeker;

        if (! $seeker) {
            return response()->json(['data' => []]);
        }

        $apps = Application::with(['jobListing.company', 'jobListing.tags', 'timelines'])
            ->where('seeker_id', $seeker->id)
            ->latest()
            ->paginate(20);

        return response()->json($apps);
    }

    public function forJob(Request $request, int $jobId)
    {
        $user = $request->user();
        $company = $user->company;

        $job = JobListing::findOrFail($jobId);

        if ($company && $job->company_id !== $company->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $apps = Application::with(['seeker.user', 'seeker.skills', 'resume', 'timelines'])
            ->where('job_listing_id', $jobId)
            ->latest()
            ->paginate(20);

        return response()->json($apps);
    }

    public function updateStatus(Request $request, int $appId)
    {
        $user = $request->user();
        $app = Application::with('jobListing.company')->findOrFail($appId);

        if ($app->jobListing->company->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:Pending,Reviewing,Interview,Hired,Rejected',
            'note'   => 'nullable|string|max:500',
        ]);

        $app->update(['status' => $data['status']]);

        ApplicationTimeline::create([
            'application_id' => $app->id,
            'status'         => $data['status'],
            'note'           => $data['note'] ?? null,
            'changed_by'     => $user->id,
        ]);

        WbNotification::create([
            'user_id' => $app->seeker->user_id,
            'type'    => 'application_status',
            'title'   => 'Application Update',
            'body'    => "Your application for \"{$app->jobListing->title}\" is now {$data['status']}.",
            'link'    => "/seeker/applications.html",
        ]);

        return response()->json($app->load('timelines'));
    }

    public function show(Request $request, int $appId)
    {
        $user = $request->user();
        $app = Application::with(['jobListing.company', 'jobListing.tags', 'seeker.user', 'seeker.skills', 'timelines'])->findOrFail($appId);

        $isOwner = $app->seeker?->user_id === $user->id;
        $isEmployer = $app->jobListing->company?->user_id === $user->id;

        if (! $isOwner && ! $isEmployer && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($app);
    }

    public function withdraw(Request $request, int $appId)
    {
        $user = $request->user();
        $seeker = $user->seeker;
        $app = Application::findOrFail($appId);

        if ($app->seeker_id !== $seeker?->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if (in_array($app->status, ['Hired', 'Rejected'])) {
            return response()->json(['message' => 'Cannot withdraw a finalized application.'], 422);
        }

        $app->delete();
        return response()->json(['message' => 'Application withdrawn.']);
    }
}
