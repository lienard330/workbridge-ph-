<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seeker extends Model
{
    protected $fillable = [
        'user_id', 'headline', 'bio', 'location', 'phone',
        'profile_photo', 'profile_strength',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->hasMany(SeekerSkill::class);
    }

    public function resumes()
    {
        return $this->hasMany(Resume::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }
}
