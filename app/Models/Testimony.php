<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ClearsPublicCache;

class Testimony extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'correlative',
        'description',
        'position',
        'visible',
        'status',
        'image',
        'lang_id',

    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
