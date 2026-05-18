<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    protected $fillable = [
        'company_id', 'category_id', 'title', 'description', 'requirements',
        'location', 'type', 'experience_level', 'salary_min', 'salary_max',
        'slots', 'deadline', 'status',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->hasMany(JobTag::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedByUsers()
    {
        return $this->hasMany(SavedJob::class);
    }
}
