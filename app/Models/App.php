<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ClearsPublicCache;

class App extends Model
{
     use HasFactory, HasUuids, ClearsPublicCache;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'image',
        'link',
        'app_scheme',
        'order',
        'platform',
        'status',
        'visible'
    ];

    protected $casts = [
        'status' => 'boolean',
        'visible' => 'boolean',
        'order' => 'integer',
        'platform' => 'string',
    ];



    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
