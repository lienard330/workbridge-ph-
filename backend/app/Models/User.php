<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * App\Models\User
 *
 * PHPDoc property declarations so static analysers (Intelephense, PHPStan)
 * understand the columns that Eloquent exposes through __get(). Otherwise
 * every $user->id / $user->role access lights up as a warning even though
 * the code runs fine.
 *
 * @property int                              $id
 * @property string                           $name
 * @property string                           $email
 * @property string                           $password
 * @property string                           $role     seeker|employer|admin
 * @property string                           $status   active|banned
 * @property \Illuminate\Support\Carbon|null  $email_verified_at
 * @property \Illuminate\Support\Carbon|null  $created_at
 * @property \Illuminate\Support\Carbon|null  $updated_at
 *
 * @property-read \App\Models\Seeker|null     $seeker
 * @property-read \App\Models\Company|null    $company
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function seeker()
    {
        return $this->hasOne(Seeker::class);
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    public function notifications()
    {
        return $this->hasMany(WbNotification::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }
}
