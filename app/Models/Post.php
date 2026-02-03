<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'summary',
        'category_id',
        'description',
        'image',
        'slug',
        'content',
        'post_date',
        'featured',
        'status',
        'lang_id',
        'seo_title',
        'seo_description',
        'seo_keywords'
    ];

    protected $casts = [
        'featured' => 'boolean',
        'status' => 'boolean',
        'post_date' => 'date',
    ];

    public function category()
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function tags()
    {
        return $this->hasManyThrough(Tag::class, PostTag::class, 'post_id', 'id', 'id', 'tag_id');
    }

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
