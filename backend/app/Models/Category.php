<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'icon'];

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }
}
