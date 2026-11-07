@php
    $title = $article['name'] ?? '';
    $summary = $article['summary'] ?? '';
    $description = $article['description'] ?? '';
    $author = $article['author'] ?? 'Equipo Cambia FX';
    $categoryName = $article['category']['name'] ?? 'Finanzas y Tecnología';
    $postDate = $article['post_date'] ?? $article['created_at'] ?? now();
    $formattedDate = \Carbon\Carbon::parse($postDate)->locale('es')->isoFormat('LL');
    $imageUrl = !empty($article['image']) ? url("/api/posts/media/{$article['image']}") : url('/assets/img/icon.png');
    $wordCount = str_word_count(strip_tags($description));
    $readingTime = max(1, (int)ceil($wordCount / 200));
@endphp

<article class="bot-semantic-article max-w-4xl mx-auto px-4 py-8" itemscope itemtype="https://schema.org/BlogPosting">
    <!-- Breadcrumb Semántico -->
    <nav aria-label="Breadcrumb" class="mb-4 text-sm text-gray-500">
        <ol class="flex items-center gap-2 flex-wrap">
            <li><a href="{{ url('/') }}">Inicio</a></li>
            <li>/</li>
            <li><a href="{{ url('/blog') }}">Blog</a></li>
            <li>/</li>
            <li><span>{{ $categoryName }}</span></li>
        </ol>
    </nav>

    <!-- Encabezado del Artículo -->
    <header class="mb-6">
        <p class="text-sm font-semibold uppercase tracking-wider text-[#3E2F4D] mb-2">
            {{ $categoryName }}
        </p>
        <h1 class="text-3xl md:text-5xl font-bold text-[#1F1827] leading-tight mb-4" itemprop="headline">
            {{ $title }}
        </h1>

        <div class="flex items-center gap-3 text-sm text-gray-600 border-t border-b border-gray-200 py-3 my-4">
            <span class="font-semibold" itemprop="author">{{ $author }}</span>
            <span>•</span>
            <time datetime="{{ \Carbon\Carbon::parse($postDate)->toIso8601String() }}" itemprop="datePublished">
                Publicado el {{ $formattedDate }}
            </time>
            <span>•</span>
            <span>Tiempo de lectura: {{ $readingTime }} min</span>
        </div>
    </header>

    <!-- Imagen destacada -->
    @if(!empty($article['image']))
    <figure class="mb-8">
        <img src="{{ $imageUrl }}" alt="{{ $title }}" class="w-full h-auto rounded-xl shadow-md" itemprop="image">
    </figure>
    @endif

    <!-- SECCIÓN: RESPUESTA RÁPIDA (Lectura óptima para IAs / ChatGPT) -->
    @if(!empty($summary))
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] rounded-2xl border-l-4 border-[#3E2F4D]" aria-label="Respuesta rápida">
        <h2 class="text-xl font-bold text-[#1F1827] mb-2">
            ⚡ Respuesta rápida
        </h2>
        <div class="text-gray-800 leading-relaxed text-base" itemprop="description">
            {{ $summary }}
        </div>
    </section>
    @endif

    <!-- CONTENIDO COMPLETO DEL ARTÍCULO (HTML Semántico) -->
    <section class="article-content prose prose-lg max-w-none text-gray-900 leading-relaxed" itemprop="articleBody">
        {!! $description !!}
    </section>

    <!-- Información adicional del editor / Casa de cambio -->
    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p><strong class="text-gray-900">Publicado por:</strong> Cambia FX (TU CAMBIO S.A.C., Registro SBS Res. 04993-2018)</p>
        <p>Casa de cambio digital en Perú con las mejores tasas para compra y venta de dólares online.</p>
        <p><a href="{{ url('/') }}" class="text-[#3E2F4D] underline font-semibold">Ir a CambiaFX.pe para cambiar dólares online</a></p>
    </footer>
</article>
