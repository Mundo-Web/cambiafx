<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\LandingHome;
use App\Models\Banner;

class ArticleController extends BasicController
{
    public $reactView = 'BlogArticle';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {


        $currentArticle = Post::with(['category', 'tags'])->where('status', true)->where('slug', $request->slug)->first();
        $landing = LandingHome::where('correlative', '=', 'page_blog_footer')->first();
        $posts = Post::where('status', true)->orderBy('created_at', 'desc')->with('category')->limit(3)->get();
        $banner = Banner::where('status', true)
            ->where('visible', true)
            ->where('section', 'blog')
            ->where('position', 'article')
            ->orderBy('created_at', 'desc')
            ->first();
        return [

            'article' => $currentArticle,
            'posts' => $posts,
            'landing' => $landing,
            'banner' => $banner,
            'seoTitle' => $currentArticle->seo_title,
            'seoDescription' => $currentArticle->seo_description,
            'seoKeywords' => $currentArticle->seo_keywords,
            'seoImage' => url("/api/posts/media/{$currentArticle->image}"),
            'seoUrl' => url("/blog/{$currentArticle->slug}"),
            'generals' => \App\Models\General::where('lang_id', app('current_lang_id'))->get()
        ];
    }
}
