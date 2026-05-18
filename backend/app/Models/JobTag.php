<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobTag extends Model
{
    public $timestamps = false;

    protected $fillable = ['job_listing_id', 'tag'];

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }
}
