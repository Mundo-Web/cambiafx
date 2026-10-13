<?php

namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends PublicController
{
    public $model = Post::class;

    public $prefix4filter = 'posts';

    public function setPaginationInstance(string $model)
    {

        return $model::select(['posts.*'])
            ->with(['category'])
            ->join('categories AS category', 'category.id', 'posts.category_id')
            ->where('posts.status', true)
            ->where('category.status', true)
            ->orderBy('post_date', 'desc');
    }
}
