<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'job_listing_id', 'seeker_id', 'resume_id', 'cover_letter',
        'status', 'skill_fit', 'notes',
    ];

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    public function seeker()
    {
        return $this->belongsTo(Seeker::class);
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }

    public function timelines()
    {
        return $this->hasMany(ApplicationTimeline::class);
    }
}
