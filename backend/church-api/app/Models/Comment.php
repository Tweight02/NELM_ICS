<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    //
    protected $table = 'comments';

    protected $primaryKey = 'comment_id';

    public $timestamps = false;

    protected $fillable = [
        'par_item_id',
        'commented_by',
        'details',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
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

    public function commentedBy()
    {
        return $this->belongsTo(
            User::class, 'commented_by', 'user_id'
        );
    }
}
