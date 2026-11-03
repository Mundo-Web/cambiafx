<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\ClearsPublicCache;

class LandingHome extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image',
        'link',
        'status',
        'visible',
        'correlative',
        'is_video',
        'video',
        'lang_id',
        'original_id',
    ];

    protected $casts = [
        'status' => 'boolean',
        'visible' => 'boolean',
        'is_video' => 'boolean',
    ];
    public function lang(): BelongsTo
    {
        return $this->belongsTo(Lang::class);
    }

    public function original()
    {
        return $this->belongsTo(LandingHome::class, 'original_id');
    }

    public function translations()
    {
        return $this->hasMany(LandingHome::class, 'original_id')
            ->where('id', '!=', $this->id);
    }

    // Obtener el registro original (idioma base)
    public function getOriginalRecord()
    {
        return $this->original_id ? $this->original : $this;
    }
}
