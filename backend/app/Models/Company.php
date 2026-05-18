<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'user_id', 'name', 'slug', 'industry', 'size', 'founded_year',
        'website', 'description', 'address', 'city', 'province',
        'logo', 'cover_photo', 'verified_status', 'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }

    public function verificationDocuments()
    {
        return $this->hasMany(VerificationDocument::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'target_id')->where('type', 'company');
    }
}
