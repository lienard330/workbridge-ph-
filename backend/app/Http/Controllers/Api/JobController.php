<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\JobTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['company', 'tags', 'category'])
            ->where('status', 'Open');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                  ->orWhere('location', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($location = $request->query('location')) {
            $query->where('location', 'like', "%$location%");
        }

        if ($category = $request->query('category_id')) {
            $query->where('category_id', $category);
        }

        if ($experience = $request->query('experience_level')) {
            $query->where('experience_level', $experience);
        }

        $jobs = $query->latest()->paginate(15);

        return response()->json($jobs);
    }

    public function show($id)
    {
        $job = JobListing::with(['company', 'tags', 'category'])->findOrFail($id);
        return response()->json($job);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (! $company) {
            return response()->json(['message' => 'No company profile found.'], 403);
        }

        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'required|string',
            'requirements'     => 'nullable|string',
            'location'         => 'required|string|max:255',
            'type'             => 'required|in:Full-time,Part-time,Contract,Internship,Freelance',
            'experience_level' => 'required|in:Entry-level,Mid-level,Senior,Executive',
            'salary_min'       => 'nullable|numeric|min:0',
            'salary_max'       => 'nullable|numeric|min:0',
            'slots'            => 'nullable|integer|min:1',
            'deadline'         => 'nullable|date',
            'category_id'      => 'nullable|exists:categories,id',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
        ]);

        $job = JobListing::create([
            ...$data,
            'company_id' => $company->id,
            'status'     => 'Open',
        ]);

        if (! empty($data['tags'])) {
            foreach ($data['tags'] as $tag) {
                JobTag::create(['job_listing_id' => $job->id, 'tag' => $tag]);
            }
        }

        return response()->json($job->load(['tags', 'category']), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $job = JobListing::findOrFail($id);

        if ($job->company->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'description'      => 'sometimes|string',
            'requirements'     => 'nullable|string',
            'location'         => 'sometimes|string|max:255',
            'type'             => 'sometimes|in:Full-time,Part-time,Contract,Internship,Freelance',
            'experience_level' => 'sometimes|in:Entry-level,Mid-level,Senior,Executive',
            'salary_min'       => 'nullable|numeric|min:0',
            'salary_max'       => 'nullable|numeric|min:0',
            'slots'            => 'nullable|integer|min:1',
            'deadline'         => 'nullable|date',
            'status'           => 'sometimes|in:Open,Closed,Draft',
            'category_id'      => 'nullable|exists:categories,id',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
        ]);

        $job->update($data);

        if (isset($data['tags'])) {
            $job->tags()->delete();
            foreach ($data['tags'] as $tag) {
                JobTag::create(['job_listing_id' => $job->id, 'tag' => $tag]);
            }
        }

        return response()->json($job->load(['tags', 'category']));
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $job = JobListing::findOrFail($id);

        if ($job->company->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $job->delete();
        return response()->json(['message' => 'Job listing deleted.']);
    }

    public function byCompany(Request $request, $companyId)
    {
        $jobs = JobListing::with(['tags', 'category'])
            ->where('company_id', $companyId)
            ->latest()
            ->paginate(15);

        return response()->json($jobs);
    }

    public function myJobs(Request $request)
    {
        $company = $request->user()->company;

        if (! $company) {
            return response()->json(['data' => []]);
        }

        $jobs = JobListing::with(['tags', 'category'])
            ->where('company_id', $company->id)
            ->withCount('applications')
            ->latest()
            ->paginate(20);

        return response()->json($jobs);
    }

    /**
     * Aggregated dashboard data for the logged-in employer.
     * Returns 4 totals + 4 chart datasets in one call so the frontend
     * doesn't spam the API on page load.
     */
    public function employerDashboard(Request $request)
    {
        $company = $request->user()->company;

        // Defensive: an employer without a company record (shouldn't happen post-register, but…)
        if (! $company) {
            return response()->json([
                'totals' => ['active_jobs' => 0, 'total_applicants' => 0, 'shortlisted' => 0, 'hires' => 0],
                'applications_by_status'    => (object) [],
                'jobs_by_status'            => (object) [],
                'top_jobs'                  => [],
                'applications_last_30_days' => (object) [],
            ]);
        }

        $companyId = $company->id;
        $jobIds    = JobListing::where('company_id', $companyId)->pluck('id');

        // Top-line counters (used by the 4 stat cards)
        $activeJobs      = JobListing::where('company_id', $companyId)->where('status', 'Open')->count();
        $totalApplicants = Application::whereIn('job_listing_id', $jobIds)->count();
        $shortlisted     = Application::whereIn('job_listing_id', $jobIds)
                              ->whereIn('status', ['Reviewing', 'Interview'])->count();
        $hires           = Application::whereIn('job_listing_id', $jobIds)
                              ->where('status', 'Hired')->count();

        // Pipeline donut: applications grouped by status
        $appsByStatus = Application::whereIn('job_listing_id', $jobIds)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')->pluck('count', 'status');

        // Jobs by status (Open / Draft / Closed) — bar chart
        $jobsByStatus = JobListing::where('company_id', $companyId)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')->pluck('count', 'status');

        // Top 5 jobs by applicant volume — horizontal bar chart
        $topJobs = JobListing::where('company_id', $companyId)
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->limit(5)
            ->get(['id', 'title']);

        // Applications over the last 30 days — line chart time series.
        // We fill in zero-count days client-side so the line is continuous.
        $thirtyDaysAgo = now()->subDays(29)->startOfDay();
        $appsLast30 = Application::whereIn('job_listing_id', $jobIds)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')->pluck('count', 'date');

        return response()->json([
            'totals' => [
                'active_jobs'      => $activeJobs,
                'total_applicants' => $totalApplicants,
                'shortlisted'      => $shortlisted,
                'hires'            => $hires,
            ],
            'applications_by_status'    => $appsByStatus,
            'jobs_by_status'            => $jobsByStatus,
            'top_jobs'                  => $topJobs->map(fn ($j) => [
                'id'                 => $j->id,
                'title'              => $j->title,
                'applications_count' => $j->applications_count,
            ]),
            'applications_last_30_days' => $appsLast30,
        ]);
    }
}
