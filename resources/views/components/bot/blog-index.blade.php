@php
    $getVal = function($item, $key, $default = null) {
        if (is_array($item)) return $item[$key] ?? $default;
        if (is_object($item)) return $item->$key ?? $default;
        return $default;
    };

    $clean = function($str) {
        if (empty($str)) return '';
        return trim(str_replace('*', '', strip_tags($str)));
    };

    $categoriesList = $categories ?? [];
    $postRecentList = $postRecent ?? [];
@endphp

<article class="bot-semantic-blog max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/Blog">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">Blog</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Educación Financiera y Noticias de Divisas
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            Blog Cambia FX: Tipo de Cambio, Dólar en Perú y Consejos Financieros
        </h1>
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            Aprende sobre la fluctuación del dólar en el Perú, proyecciones del tipo de cambio, guías tributarias y mejores prácticas para el cambio de moneda de personas y empresas.
        </p>
    </header>

    {{-- Categorías del Blog --}}
    @if(!empty($categoriesList) && count($categoriesList) > 0)
    <section class="my-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Categorías:</h2>
        <div class="flex flex-wrap gap-2">
            @foreach($categoriesList as $cat)
                <span class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800">
                    {{ $getVal($cat, 'name') }}
                </span>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Artículos Recientes --}}
    @if(!empty($postRecentList) && count($postRecentList) > 0)
    <section class="my-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Artículos Recientes</h2>
        <div class="space-y-6">
            @foreach($postRecentList as $post)
                @php
                    $pTitle = $getVal($post, 'name') ?? $getVal($post, 'title');
                    $pSummary = $getVal($post, 'summary') ?? Str::limit(strip_tags($getVal($post, 'description', '')), 200);
                    $pSlug = $getVal($post, 'slug');
                    $pCat = $getVal($getVal($post, 'category'), 'name', 'Finanzas');
                @endphp
                <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" itemscope itemprop="blogPost" itemtype="https://schema.org/BlogPosting">
                    <span class="text-xs font-bold text-purple-700 uppercase tracking-wider">{{ $pCat }}</span>
                    <h3 class="text-xl font-bold text-gray-900 mt-1 mb-2 hover:text-purple-700" itemprop="headline">
                        <a href="{{ url('/blog/' . $pSlug) }}">{{ $pTitle }}</a>
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed mb-4" itemprop="description">
                        {{ $pSummary }}
                    </p>
                    <a href="{{ url('/blog/' . $pSlug) }}" class="text-xs font-bold text-purple-700 hover:underline">
                        Leer artículo completo →
                    </a>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Footer --}}
    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>© {{ date('Y') }} Cambia FX. Blog financiero oficial. Todos los derechos reservados.</p>
    </footer>
</article>
