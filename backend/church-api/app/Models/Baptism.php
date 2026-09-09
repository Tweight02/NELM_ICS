<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Baptism extends Model
{
    //
    protected $table = 'baptisms';

    protected $primaryKey = 'baptism_id';

    public $timestamps = false;

    protected $fillable = [
        'churches_id',
        'first_name',
        'middle_name',
        'last_name',
        'extension_name',
        'birthdate',
        'gender',
        'address',
        'church',
        'officiating_minister',
        'place_of_baptism',
        'date_of_baptism',
        'age',
        'marital',
        'is_reclaimed',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'date_of_baptism' => 'date',
        'age' => 'integer',
        'is_reclaimed' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function church()
    {
        return $this->belongsTo(
            Church::class, 'churches_id', 'church_id'
        );
    }
}
