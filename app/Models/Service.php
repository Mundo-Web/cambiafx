<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'status',
        'visible',
        'slug',
        'characteristics',
        'gallery',
        'featured',
        'lang_id',
        //SEDNA
        'how_it_helps',
        'description_helps',
        'value_proposition',
        'innovation_focus',
        'customer_relation',
        'benefits',
        'image_secondary',
        'image_banner',
        'category_service_id',

    ];
    protected $casts = [
        'characteristics' => 'array', // Convierte automáticamente el JSON a array de PHP
        'gallery' => 'array',
        'benefits' => 'array'
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }

    public function category()
    {
        return $this->belongsTo(CategoryService::class, 'category_service_id');
    }
}
