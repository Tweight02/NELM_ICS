<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Church extends Model
{
    //
    protected $table = 'churches';
    public $timestamps = false;

    protected $primaryKey = 'church_id';
    protected $fillable = [
        'name',
        'address',
        'parent_id'
    ];
}
