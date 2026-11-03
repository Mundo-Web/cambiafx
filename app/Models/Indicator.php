<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ClearsPublicCache;

class Indicator extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;

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

    protected $casts = [
        'percentage' => 'decimal:2',
        'visible' => 'boolean',
        'status' => 'boolean',
        'order' => 'integer',
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
