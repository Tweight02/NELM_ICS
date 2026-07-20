<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class Pastor extends Model
{
    protected $table = 'users';
    public $timestamps = false;
    //
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];
}
