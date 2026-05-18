<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    /**
     * The saved_jobs table uses a composite primary key (seeker_id + job_listing_id)
     * and a custom `saved_at` column instead of Laravel's default created_at/updated_at.
     * Without these flags Eloquent tries to insert created_at/updated_at columns
     * that don't exist, causing a 500 on every save.
     */
    public $timestamps  = false;
    public $incrementing = false;

    protected $fillable = ['seeker_id', 'job_listing_id'];

    protected $casts = [
        'saved_at' => 'datetime',
    ];

    public function seeker()
    {
        return $this->belongsTo(Seeker::class);
    }

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }
}
