<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeekerSkill extends Model
{
    public $timestamps = false;

    protected $fillable = ['seeker_id', 'skill'];

    public function seeker()
    {
        return $this->belongsTo(Seeker::class);
    }
}
