<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WbNotification extends Model
{
    protected $table = 'wb_notifications';

    protected $fillable = [
        'user_id', 'type', 'title', 'body', 'link', 'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
