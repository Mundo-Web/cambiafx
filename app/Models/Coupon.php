<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ClearsPublicCache;

class Coupon extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'type',
        'amount',
        'sale_amount',
        'initial_stock',
        'stock',
        'date_begin',
        'date_end',
        'one_time_use',
        'status'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'sale_amount' => 'decimal:2',
        'initial_stock' => 'integer',
        'stock' => 'integer',
        'date_begin' => 'date',
        'date_end' => 'date',
        'one_time_use' => 'boolean',
        'status' => 'boolean',
    ];
}
