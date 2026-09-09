<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    //
    protected $table = 'programs';
    public $timestamps = false;

    protected $primaryKey = 'program_id';
    protected $fillable = [
        'department_id',
        'program_name',
        'parent_id'
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}
