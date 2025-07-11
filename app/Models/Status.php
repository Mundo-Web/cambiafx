<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'color',
        'reversible',
        'visible',
        'status',
    ];

    protected $casts = [
        'reversible' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];
}
