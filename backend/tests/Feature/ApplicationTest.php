<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * This test was the regression target for Bug #1: applying to a job inserts
     * into wb_notifications, which had a schema mismatch (missing type/body/link
     * columns). If the migration ever drifts from the model again, this test
     * will fail at the apply step with a SQL error.
     *
     * @test
     */
    public function seeker_can_apply_to_job_and_notification_is_created()
    {
        // Set up an employer + company + job listing
        $employerUser = User::create([
            'name' => 'Test Employer', 'email' => 'employer@test.com',
            'password' => Hash::make('password'), 'role' => 'employer', 'status' => 'active',
        ]);
        $company = Company::create([
            'user_id' => $employerUser->id, 'name' => 'Acme Corp', 'slug' => 'acme-' . $employerUser->id,
            'verified_status' => 'Verified',
        ]);
        $job = JobListing::create([
            'company_id' => $company->id, 'title' => 'Software Engineer',
            'description' => 'Build things.', 'location' => 'Remote',
            'type' => 'Full-time', 'experience_level' => 'Mid-level',
            'status' => 'Open',
        ]);

        // Set up a seeker
        $seekerUser = User::create([
            'name' => 'Test Seeker', 'email' => 'seeker@test.com',
            'password' => Hash::make('password'), 'role' => 'seeker', 'status' => 'active',
        ]);
        Seeker::create(['user_id' => $seekerUser->id]);

        // Authenticate as the seeker (bypasses login flow for test speed)
        Sanctum::actingAs($seekerUser);

        // Apply to the job
        $response = $this->postJson("/api/jobs/{$job->id}/apply", [
            'skill_fit' => 75,
        ])->assertStatus(201);

        // Application row created
        $this->assertDatabaseHas('applications', [
            'job_listing_id' => $job->id,
            'seeker_id'      => $seekerUser->seeker->id,
            'status'         => 'Pending',
        ]);

        // Timeline entry was logged
        $appId = Application::where('job_listing_id', $job->id)->first()->id;
        $this->assertDatabaseHas('application_timelines', [
            'application_id' => $appId,
            'status'         => 'Pending',
        ]);

        // Notification fired to the employer (this is the regression target)
        // Insert into wb_notifications must succeed — if columns drift again, this fails.
        $this->assertDatabaseHas('wb_notifications', [
            'user_id' => $employerUser->id,
            'type'    => 'new_application',
            'is_read' => false,
        ]);
    }
}
