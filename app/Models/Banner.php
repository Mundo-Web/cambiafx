<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ClearsPublicCache;

class Banner extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'image',
        'button_text',
        'button_link',
        'section',
        'position',
        'order',
        'status',
        'visible'
    ];

    protected $casts = [
        'status' => 'boolean',
        'visible' => 'boolean',
        'order' => 'integer'
    ];

    // Scope para obtener banners activos
    public function scopeActive($query)
    {
        return $query->where('status', true)->where('visible', true);
    }

    // Scope para obtener banners ordenados
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('created_at', 'desc');
    }

    // Scope para obtener banners por sección
    public function scopeBySection($query, $section)
    {
        return $query->where('section', $section);
    }

    // Scope para obtener banners por posición
    public function scopeByPosition($query, $position)
    {
        return $query->where('position', $position);
    }
}
