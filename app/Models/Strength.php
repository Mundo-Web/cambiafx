<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ClearsPublicCache;

class Strength extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'image',
        'visible',
        'status',
        'lang_id'
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
