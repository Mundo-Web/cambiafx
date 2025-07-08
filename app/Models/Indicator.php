<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'symbol',
        'name',
        'description',
        'percentage',
        'visible',
        'status',
        'lang_id',
        'correlative',
        'order',
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
