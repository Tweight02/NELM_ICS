<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    //
    protected $table = 'participants';

    protected $primaryKey = 'participant_id';

    public $timestamps = false;

    protected $fillable = [
        'event_id',
        'church_id',
        'registration_status',
        'first_name',
        'middle_name',
        'last_name',
        'extension_name',
        'birthdate',
        'age',
        'gender',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'age' => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function event()
    {
        return $this->belongsTo(
            Event::class, 'event_id', 'event_id'
        );
    }

    public function church()
    {
        return $this->belongsTo(
            Church::class, 'church_id', 'church_id'
        );
    }
}
