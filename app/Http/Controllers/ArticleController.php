<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\LandingHome;
use App\Models\Banner;
use App\Models\Faq;

class ArticleController extends BasicController
{
    public $reactView = 'BlogArticle';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $currentArticle = Post::with(['category', 'tags'])->where('status', true)->where('slug', $request->slug)->first();

        if (!$currentArticle) {
            abort(404);
        }

        $landing = LandingHome::where('correlative', '=', 'page_blog_footer')->first();
        $posts = Post::where('status', true)->orderBy('created_at', 'desc')->with('category')->limit(3)->get();
        
        $banner = Banner::where('status', true)
            ->where('visible', true)
            ->where('section', 'blog')
            ->where('position', 'article')
            ->orderBy('created_at', 'desc')
            ->first();

        $faqs = Faq::where('status', true)
            ->where('visible', true)
            ->where(function($query) use ($currentArticle) {
                $query->where('service_id', $currentArticle->category_id)
                      ->orWhereNull('service_id');
            })
            ->where('lang_id', app('current_lang_id'))
            ->get();

        return [
            'article' => $currentArticle,
            'posts' => $posts,
            'landing' => $landing,
            'banner' => $banner,
            'seoTitle' => $currentArticle->seo_title,
            'seoDescription' => $currentArticle->seo_description,
            'seoKeywords' => $currentArticle->seo_keywords,
            'seoImage' => $currentArticle->image ? url("/api/posts/media/{$currentArticle->image}") : null,
            'seoUrl' => url("/blog/{$currentArticle->slug}"),
            'generals' => \App\Models\General::where('lang_id', app('current_lang_id'))->get(),
            'breadcrumbs' => [
                ['name' => 'Inicio', 'url' => '/'],
                ['name' => 'Blog', 'url' => '/blog'],
                ['name' => $currentArticle->category->name ?? 'Categoría', 'url' => '/blog?category=' . ($currentArticle->category->id ?? '')],
                ['name' => $currentArticle->name, 'url' => '/blog/' . $currentArticle->slug],
            ],
            'faqs' => $faqs
        ];
    }
}
