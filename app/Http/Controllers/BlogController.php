<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\LandingHome;
use App\Models\Slider;

class BlogController extends PublicController
{
    public $reactView = 'Blog';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $categories = Category::select([
            DB::raw('DISTINCT(categories.id)'),
            'categories.name',
            'categories.slug'
        ])
            ->join('posts', 'posts.category_id', 'categories.id')
            ->where('categories.visible', true)
            ->where('posts.lang_id', $langId)
            ->where('categories.status', true)
            ->get();
        $postRecent = Post::where('status', true)->with('category')->where('lang_id', $langId)->latest()->take(3)->get();
        $landing = LandingHome::where('correlative', 'like', 'page_blog%')->where('lang_id', $langId)->get();
        
        // Obtener los sliders y añadir button_text y button_link personalizados
        $sliders = [];

          $banner= Banner::where('status', true)
            ->where('visible', true)
            ->where('section', 'blog')
            ->where('position', 'header')
            ->orderBy('created_at', 'desc')
            ->first();

        return [
            'categories' => $categories,
            'postRecent' => $postRecent,
            'landing' => $landing,
            'sliders' => $sliders,
            'banner' => $banner
        ];
    }
}
