<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:seeker,employer',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
            'status'   => 'active',
        ]);

        if ($data['role'] === 'seeker') {
            Seeker::create(['user_id' => $user->getKey()]);
        } elseif ($data['role'] === 'employer') {
            $companyName = $request->input('company_name', $data['name'] . "'s Company");
            Company::create([
                'user_id'         => $user->getKey(),
                'name'            => $companyName,
                'slug'            => Str::slug($companyName) . '-' . $user->getKey(),
                'verified_status' => 'Unverified',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $this->userPayload($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $storedPassword = (string) $user->getAttribute('password');

        try {
            $passwordMatches = Hash::check($data['password'], $storedPassword);
        } catch (\RuntimeException) {
            $passwordMatches = false;
        }

        // Older local/demo accounts were created before password hashing was
        // fixed. Let them sign in once, then immediately upgrade the stored
        // password to Laravel's normal hashed format.
        if (! $passwordMatches && hash_equals($storedPassword, (string) $data['password'])) {
            $user->forceFill(['password' => Hash::make($data['password'])])->save();
            $passwordMatches = true;
        }

        if (! $passwordMatches) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->getAttribute('status') === 'banned') {
            return response()->json(['message' => 'Your account has been banned.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $this->userPayload($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $this->currentUser($request)->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        return response()->json($this->userPayload($this->currentUser($request)));
    }

    /**
     * Issue a one-time password reset token. Stores a hashed token in
     * password_reset_tokens (Laravel's default scaffolding). The email
     * existence is not leaked — same response either way.
     *
     * Demo mode: since SMTP isn't configured, the reset URL is returned in
     * the JSON response so the frontend can display it. In production this
     * field is removed and the URL is emailed instead.
     */
    public function forgotPassword(Request $request)
    {
        $data = $request->validate(['email' => 'required|email']);

        $user = User::where('email', $data['email'])->first();
        $response = ['message' => 'If that email is registered, a reset link has been sent.'];

        if ($user) {
            $token = Str::random(64);
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $data['email']],
                [
                    'email'      => $data['email'],
                    'token'      => Hash::make($token),
                    'created_at' => now(),
                ]
            );

            $frontend = config('app.frontend_url') ?: 'http://localhost/workbridge';
            $response['demo_reset_url'] = $frontend . '/auth/reset.html?token=' . $token
                . '&email=' . urlencode($data['email']);
        }

        return response()->json($response);
    }

    /**
     * Verify the reset token and update the password. Tokens expire after
     * 60 minutes and are single-use (deleted on success).
     */
    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $row = DB::table('password_reset_tokens')->where('email', $data['email'])->first();

        $reset = $row ? (array) $row : null;

        if (! $reset || ! Hash::check($data['token'], (string) $reset['token'])) {
            return response()->json(['message' => 'Invalid or expired reset link.'], 422);
        }

        if (Carbon::parse($reset['created_at'])->diffInMinutes(now()) > 60) {
            DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
            return response()->json(['message' => 'Reset link has expired. Request a new one.'], 422);
        }

        $user = User::where('email', $data['email'])->first();
        if (! $user) {
            return response()->json(['message' => 'Invalid or expired reset link.'], 422);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        // Invalidate the token (single use) and revoke any existing API tokens
        // so anyone with stolen credentials is logged out.
        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
        $user->tokens()->delete();

        return response()->json(['message' => 'Password reset successful.']);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:6|different:current_password',
        ]);

        $user = $this->currentUser($request);

        if (! Hash::check($data['current_password'], (string) $user->getAttribute('password'))) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($data['new_password'])]);

        return response()->json(['message' => 'Password updated.']);
    }

    private function userPayload(User $user): array
    {
        $payload = [
            'id'     => $user->getKey(),
            'name'   => $user->getAttribute('name'),
            'email'  => $user->getAttribute('email'),
            'role'   => $user->getAttribute('role'),
            'status' => $user->getAttribute('status'),
        ];

        if ($user->getAttribute('role') === 'seeker') {
            $seeker = $user->seeker()->with('skills')->first();
            $payload['seeker'] = $seeker;
        } elseif ($user->getAttribute('role') === 'employer') {
            $payload['company'] = $user->company()->first();
        }

        return $payload;
    }

    private function currentUser(Request $request): User
    {
        $user = $request->user();

        if (! $user instanceof User) {
            abort(401, 'Unauthenticated.');
        }

        return $user;
    }
}
