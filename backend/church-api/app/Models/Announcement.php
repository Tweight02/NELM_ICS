<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    //
    protected $table = 'announcements';

    protected $fillable = [
        'announce_by',
        'church_id',
        'details',
        'date_announced',
    ];

    protected $casts = [
        'date_announced' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function announcedBy()
    {
        return $this->belongsTo(
            User::class, 'announce_by', 'user_id'
        );
    }

    public function church()
    {
        return $this->belongsTo(
            Church::class, 'church_id', 'church_id'
        );
    }
}
