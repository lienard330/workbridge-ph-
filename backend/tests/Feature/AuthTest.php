<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function register_creates_user_seeker_record_and_returns_token()
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Test Seeker',
            'email'                 => 'seeker@test.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
            'role'                  => 'seeker',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' => ['id', 'email', 'role'], 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'seeker@test.com',
            'role'  => 'seeker',
        ]);

        // Seeker profile row should be auto-created on register
        $user = User::where('email', 'seeker@test.com')->first();
        $this->assertDatabaseHas('seekers', ['user_id' => $user->id]);

        // Password must be hashed, not stored plaintext
        $this->assertNotEquals('password', $user->password);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    /** @test */
    public function login_returns_token_for_valid_credentials_and_rejects_wrong_password()
    {
        User::create([
            'name'     => 'Existing User',
            'email'    => 'existing@test.com',
            'password' => Hash::make('correct-password'),
            'role'     => 'seeker',
            'status'   => 'active',
        ]);

        // Happy path
        $this->postJson('/api/auth/login', [
            'email'    => 'existing@test.com',
            'password' => 'correct-password',
        ])->assertStatus(200)
          ->assertJsonStructure(['user' => ['id', 'email', 'role'], 'token']);

        // Wrong password — must NOT issue token, must not leak which field was wrong
        $this->postJson('/api/auth/login', [
            'email'    => 'existing@test.com',
            'password' => 'wrong-password',
        ])->assertStatus(422);
    }

    /** @test */
    public function login_upgrades_legacy_plaintext_seeker_passwords()
    {
        $userId = DB::table('users')->insertGetId([
            'name'       => 'Legacy Seeker',
            'email'      => 'legacy-seeker@test.com',
            'password'   => 'password',
            'role'       => 'seeker',
            'status'     => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->postJson('/api/auth/login', [
            'email'    => 'legacy-seeker@test.com',
            'password' => 'password',
        ])->assertStatus(200)
          ->assertJsonStructure(['user' => ['id', 'email', 'role'], 'token']);

        $user = User::findOrFail($userId);
        $this->assertNotEquals('password', $user->password);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    /** @test */
    public function forgot_and_reset_password_completes_full_cycle()
    {
        $user = User::create([
            'name'     => 'Forgetful User',
            'email'    => 'forgot@test.com',
            'password' => Hash::make('old-password'),
            'role'     => 'seeker',
            'status'   => 'active',
        ]);

        // Step 1: request reset → backend returns demo URL containing the token
        $forgotResponse = $this->postJson('/api/auth/forgot-password', [
            'email' => 'forgot@test.com',
        ])->assertStatus(200)
          ->assertJsonStructure(['message', 'demo_reset_url']);

        $resetUrl = $forgotResponse->json('demo_reset_url');
        $this->assertNotEmpty($resetUrl, 'Reset URL should be returned in demo mode');

        // Extract the raw token from the URL query string
        parse_str(parse_url($resetUrl, PHP_URL_QUERY), $params);
        $this->assertArrayHasKey('token', $params);
        $this->assertArrayHasKey('email', $params);

        // The DB stores the HASH of the token, not the raw token
        $this->assertDatabaseHas('password_reset_tokens', ['email' => 'forgot@test.com']);

        // Step 2: submit new password with the token
        $this->postJson('/api/auth/reset-password', [
            'email'                 => $params['email'],
            'token'                 => $params['token'],
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertStatus(200);

        // Token row should be deleted (single use)
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => 'forgot@test.com']);

        // Old password should no longer work
        $this->postJson('/api/auth/login', [
            'email'    => 'forgot@test.com',
            'password' => 'old-password',
        ])->assertStatus(422);

        // New password should work
        $this->postJson('/api/auth/login', [
            'email'    => 'forgot@test.com',
            'password' => 'new-password',
        ])->assertStatus(200);
    }

    /** @test */
    public function forgot_password_does_not_leak_email_existence()
    {
        // No user with this email exists, but the response should still be 200
        // and look identical to a successful request — prevents email enumeration.
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'never-registered@test.com',
        ])->assertStatus(200);

        // Should NOT include the demo URL when the email isn't registered
        $this->assertArrayNotHasKey('demo_reset_url', $response->json());
    }
}
