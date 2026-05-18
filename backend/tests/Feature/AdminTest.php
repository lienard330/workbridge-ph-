<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Regression target for Bug #6: the audit_logs migration was missing
     * target_type, target_id, meta, ip_address columns that the AdminController
     * tries to insert. Verifying a company writes an audit log — if the schema
     * drifts again, this test fails at the verify step with a SQL error.
     *
     * @test
     */
    public function admin_can_verify_company_and_audit_log_is_created()
    {
        // Set up an admin
        $admin = User::create([
            'name' => 'Admin', 'email' => 'admin@test.com',
            'password' => Hash::make('password'), 'role' => 'admin', 'status' => 'active',
        ]);

        // Set up an employer + company in pending verification status
        $employer = User::create([
            'name' => 'Pending Employer', 'email' => 'pending@test.com',
            'password' => Hash::make('password'), 'role' => 'employer', 'status' => 'active',
        ]);
        $company = Company::create([
            'user_id' => $employer->id, 'name' => 'Pending Co.',
            'slug' => 'pending-' . $employer->id,
            'verified_status' => 'Pending',
        ]);

        // Authenticate as admin
        Sanctum::actingAs($admin);

        // Verify the company
        $this->patchJson("/api/admin/companies/{$company->id}/verify", [
            'status' => 'Verified',
            'note'   => 'All documents look good.',
        ])->assertStatus(200);

        // Company status updated
        $this->assertDatabaseHas('companies', [
            'id'              => $company->id,
            'verified_status' => 'Verified',
        ]);

        // Audit log row was inserted — this is the regression target.
        // If audit_logs is missing target_type/target_id columns, this insert
        // fails with a SQL error and the whole request returns 500.
        $this->assertDatabaseHas('audit_logs', [
            'actor_id'    => $admin->id,
            'actor_email' => 'admin@test.com',
            'action'      => 'verify_company:Verified',
            'target_type' => 'company',
            'target_id'   => $company->id,
        ]);
    }

    /**
     * Sanity check that role middleware actually blocks non-admins.
     * @test
     */
    public function non_admin_cannot_call_admin_endpoints()
    {
        $seeker = User::create([
            'name' => 'Just a seeker', 'email' => 'seeker@test.com',
            'password' => Hash::make('password'), 'role' => 'seeker', 'status' => 'active',
        ]);

        Sanctum::actingAs($seeker);

        $this->getJson('/api/admin/users')->assertStatus(403);
        $this->getJson('/api/admin/dashboard')->assertStatus(403);
    }
}
