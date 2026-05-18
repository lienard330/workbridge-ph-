<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        return response()->json([
            // Top-line counters (existing — used by stat cards)
            'total_users'     => User::count(),
            'total_jobs'      => JobListing::count(),
            'open_jobs'       => JobListing::where('status', 'Open')->count(),
            'total_companies' => Company::count(),
            'pending_verif'   => Company::where('verified_status', 'Pending')->count(),
            'open_reports'    => Report::where('status', 'Open')->count(),

            // Breakdowns for charts. groupBy returns Collection<string, count>.
            'users_by_role'             => User::select('role', DB::raw('count(*) as count'))
                                              ->groupBy('role')->pluck('count', 'role'),
            'jobs_by_status'            => JobListing::select('status', DB::raw('count(*) as count'))
                                              ->groupBy('status')->pluck('count', 'status'),
            'applications_by_status'    => Application::select('status', DB::raw('count(*) as count'))
                                              ->groupBy('status')->pluck('count', 'status'),
            'companies_by_verification' => Company::select('verified_status', DB::raw('count(*) as count'))
                                              ->groupBy('verified_status')->pluck('count', 'verified_status'),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query();

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function banUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot ban an admin.'], 403);
        }

        $user->update(['status' => 'banned']);
        $this->audit($request, 'ban_user', 'user', $userId);

        return response()->json(['message' => 'User banned.']);
    }

    public function unbanUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['status' => 'active']);
        $this->audit($request, 'unban_user', 'user', $userId);

        return response()->json(['message' => 'User unbanned.']);
    }

    public function pendingVerifications(Request $request)
    {
        // Return all companies so the admin can review history (Verified/Rejected/Suspended too)
        // and filter client-side. The original "pending only" filter was misnamed for the use case.
        $query = Company::with(['user', 'verificationDocuments'])->latest();

        if ($status = $request->query('status')) {
            $query->where('verified_status', $status);
        }

        return response()->json($query->paginate(50));
    }

    public function verifyCompany(Request $request, $companyId)
    {
        $data = $request->validate([
            'status' => 'required|in:Verified,Rejected,Suspended',
            'note'   => 'nullable|string|max:500',
        ]);

        $company = Company::findOrFail($companyId);
        $company->update([
            'verified_status' => $data['status'],
            'verified_at'     => $data['status'] === 'Verified' ? now() : null,
        ]);

        $this->audit($request, 'verify_company:' . $data['status'], 'company', $companyId);

        return response()->json($company->fresh());
    }

    public function reports(Request $request)
    {
        $query = Report::with('reporter');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function resolveReport(Request $request, $reportId)
    {
        $data = $request->validate([
            'status' => 'required|in:Resolved,Dismissed',
            'note'   => 'nullable|string|max:500',
        ]);

        $report = Report::findOrFail($reportId);
        $report->update([
            'status'      => $data['status'],
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        $this->audit($request, 'resolve_report:' . $data['status'], 'report', $reportId);

        return response()->json($report->fresh());
    }

    public function allJobs(Request $request)
    {
        $jobs = JobListing::with(['company', 'category'])
            ->withCount('applications')
            ->latest()
            ->paginate(20);

        return response()->json($jobs);
    }

    public function takedownJob(Request $request, $jobId)
    {
        $job = JobListing::findOrFail($jobId);
        $job->update(['status' => 'Closed']);
        $this->audit($request, 'takedown_job', 'job_listing', $jobId);

        return response()->json(['message' => 'Job listing closed.']);
    }

    public function auditLogs(Request $request)
    {
        $logs = AuditLog::with('actor')->latest('created_at')->paginate(50);
        return response()->json($logs);
    }

    public function approveJob(Request $request, $jobId)
    {
        $job = JobListing::findOrFail($jobId);
        $job->update(['status' => 'Open']);
        $this->audit($request, 'approve_job', 'job_listing', $jobId);

        return response()->json(['message' => 'Job approved.']);
    }

    public function categories(Request $request)
    {
        return response()->json(Category::withCount('jobListings')->get());
    }

    public function addCategory(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:100|unique:categories,name']);
        $cat = Category::create(['name' => $data['name'], 'slug' => Str::slug($data['name'])]);
        $this->audit($request, 'add_category', 'category', $cat->id);

        return response()->json($cat, 201);
    }

    public function deleteCategory(Request $request, $id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();
        $this->audit($request, 'delete_category', 'category', $id);

        return response()->json(['message' => 'Deleted.']);
    }

    private function audit(Request $request, string $action, string $targetType, int $targetId): void
    {
        $user = $request->user();
        AuditLog::create([
            'actor_id'    => $user->id,
            'actor_email' => $user->email,
            'action'      => $action,
            'target_type' => $targetType,
            'target_id'   => $targetId,
            'ip_address'  => $request->ip(),
        ]);
    }
}
