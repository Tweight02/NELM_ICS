<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Death extends Model
{
    //
    protected $table = 'deaths';

    protected $primaryKey = 'death_id';

    public $timestamps = false;

    protected $fillable = [
        'baptism_id',
        'date_of_death',
    ];

    protected $casts = [
        'date_of_death' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function baptism()
    {
        return $this->belongsTo(
            Baptism::class, 'baptism_id', 'baptism_id'
        );
    }
}
