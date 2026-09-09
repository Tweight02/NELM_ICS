<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticularItem extends Model
{
    //
    protected $table = 'particular_items';
    public $timestamps = false;

    protected $primaryKey = 'par_item_id';
    protected $fillable = [
        'particular_id',
        'approved_by',
        'endorsed_by',
        'submitted_by',
        'churches_id',
        'quarter',
        'year',
        'date_submitted',
        'date_approved',
        'particulars_value',
        'status',
    ];

    protected $casts = [
        'date_submitted' => 'date',
        'date_approved' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function particular()
    {
        return $this->belongsTo(Particular::class, 'particular_id', 'particular_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by', 'user_id');
    }

    public function endorsedBy()
    {
        return $this->belongsTo(User::class, 'endorsed_by', 'user_id');
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by', 'user_id');
    }

    public function church()
    {
        return $this->belongsTo(Church::class, 'churches_id', 'church_id');
    }
}
