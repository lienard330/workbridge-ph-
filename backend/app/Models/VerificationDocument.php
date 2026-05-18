<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationDocument extends Model
{
    protected $fillable = ['company_id', 'file_path', 'original_name', 'doc_type'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
