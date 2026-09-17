<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    //
    protected $table = 'events';

    protected $primaryKey = 'event_id';

    public $timestamps = false;

    protected $fillable = [
        'par_item_id',
        'type',
        'title',
        'date_start',
        'date_end',
        'description',
        'status',
        'time',
        'address',
    ];

    protected $casts = [
        'date_start' => 'date',
        'date_end' => 'date',
        'time' => 'datetime:H:i',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function particularItem()
    {
        return $this->belongsTo(
            ParticularItem::class, 'par_item_id', 'par_item_id'
        );
    }
}
