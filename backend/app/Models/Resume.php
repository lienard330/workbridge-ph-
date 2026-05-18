<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    protected $fillable = ['seeker_id', 'file_path', 'original_name', 'is_primary'];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function seeker()
    {
        return $this->belongsTo(Seeker::class);
    }
}
