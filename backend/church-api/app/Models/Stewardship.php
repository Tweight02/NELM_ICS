<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stewardship extends Model
{
    //
    protected $table = 'stewardships';

    protected $primaryKey = 'stewardship_id';

    public $timestamps = false;

    protected $fillable = [
        'par_item_id',
        'type',
        'month',
        'value',
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
