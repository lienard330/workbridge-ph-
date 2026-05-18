<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\JobListing;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SavedJobTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Regression target for Bug #11: SavedJob model used to assume default
     * created_at/updated_at columns, but the saved_jobs table uses a composite
     * primary key + custom `saved_at` column. INSERT failed with SQL error,
     * returning 500 to the seeker on every save attempt.
     *
     * @test
     */
    public function seeker_can_save_a_job_then_list_their_saved_jobs()
    {
        // Set up an employer + company + job
        $employer = User::create([
            'name' => 'Employer', 'email' => 'emp@test.com',
            'password' => Hash::make('password'), 'role' => 'employer', 'status' => 'active',
        ]);
        $company = Company::create([
            'user_id' => $employer->id, 'name' => 'Test Co.',
            'slug' => 'test-' . $employer->id, 'verified_status' => 'Verified',
        ]);
        $job = JobListing::create([
            'company_id' => $company->id, 'title' => 'Engineer',
            'description' => 'desc', 'location' => 'Remote',
            'type' => 'Full-time', 'experience_level' => 'Mid-level', 'status' => 'Open',
        ]);

        // Set up a seeker
        $seekerUser = User::create([
            'name' => 'Seeker', 'email' => 'seek@test.com',
            'password' => Hash::make('password'), 'role' => 'seeker', 'status' => 'active',
        ]);
        Seeker::create(['user_id' => $seekerUser->id]);

        Sanctum::actingAs($seekerUser);

        // Save the job — this hits SavedJob::create() which previously errored on
        // the missing created_at column. Should return 201.
        $this->postJson("/api/seeker/saved-jobs/{$job->id}")
            ->assertStatus(201);

        // Listing the saved jobs hits ->orderByDesc('saved_at') — previously
        // used ->latest() which expanded to ORDER BY created_at, also a SQL error.
        $list = $this->getJson('/api/seeker/saved-jobs')
            ->assertStatus(200)
            ->json();

        // Pagination wrapper from Laravel: {data: [...], current_page, ...}
        $items = $list['data'] ?? $list;
        $this->assertCount(1, $items);
        $this->assertEquals($job->id, $items[0]['job_listing_id']);

        // Saving the same job twice should be rejected with 422 (already saved)
        $this->postJson("/api/seeker/saved-jobs/{$job->id}")
            ->assertStatus(422);

        // Unsaving works
        $this->deleteJson("/api/seeker/saved-jobs/{$job->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('saved_jobs', [
            'seeker_id'      => $seekerUser->seeker->id,
            'job_listing_id' => $job->id,
        ]);
    }
}
