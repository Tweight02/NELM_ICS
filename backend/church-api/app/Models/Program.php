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
    public function particulars()
    {
        return $this->hasMany(Particular::class, 'program_id', 'program_id');
    }
    
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function children()
    {
        return $this->hasMany(
            Program::class,
            'parent_id',
            'program_id'
        );
    }

    public function parent()
    {
        return $this->belongsTo(
            Program::class,
            'parent_id',
            'program_id'
        );
    }
}
