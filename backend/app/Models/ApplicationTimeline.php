<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationTimeline extends Model
{
    protected $fillable = ['application_id', 'status', 'note', 'changed_by'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
