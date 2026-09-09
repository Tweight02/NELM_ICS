<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Particular extends Model
{
    //
    protected $table = 'particulars';
    public $timestamps = false;

    protected $primaryKey = 'particular_id';
    protected $fillable = [
        'program_id',
        'particular_name'
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id', 'program_id');
    }
}
