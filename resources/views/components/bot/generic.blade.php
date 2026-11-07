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

    $title = $seoTitle ?? $pageProps['title'] ?? $pageProps['name'] ?? config('app.name', 'Cambia FX');
    $description = $seoDescription ?? $pageProps['description'] ?? 'Casa de cambio online registrada en la SBS (Res. 04993-2018) para cambio de dólares y soles en Perú.';
    $faqsList = $pageProps['faqs'] ?? [];
@endphp

<article class="bot-semantic-generic max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/WebPage">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">{{ $clean($title) }}</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Cambia FX | Casa de Cambio Digital SBS
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $clean($title) }}
        </h1>
        @if(!empty($description))
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            {{ $clean($description) }}
        </p>
        @endif
    </header>

    {{-- Quick Answer Resumen --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200">
        <h2 class="text-lg font-bold text-gray-900 mb-2">
            ⚡ Información Oficial del Servicio
        </h2>
        <div class="text-sm md:text-base text-gray-800 space-y-2">
            <p>
                <strong>Cambia FX</strong> (TU CAMBIO S.A.C., RUC 20603864957) es una plataforma fintech peruana registrada en la <strong>SBS</strong> (Resolución N° 04993-2018).
            </p>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700">
                <li>Cambio de dólares y soles online con tasas preferenciales en tiempo real.</li>
                <li>Transferencias inmediatas (10 a 15 min): BCP, Interbank y BanBif.</li>
                <li>Transferencias interbancarias CCE: BBVA, Scotiabank, Pichincha y otros bancos.</li>
                <li>Cero comisiones ocultas y garantía de tasa congelada durante tu operación.</li>
            </ul>
        </div>
    </section>

    @if(!empty($faqsList) && count($faqsList) > 0)
    <section class="my-8" itemscope itemtype="https://schema.org/FAQPage">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
        <div class="space-y-4">
            @foreach($faqsList as $faq)
                @php
                    $q = $getVal($faq, 'name') ?? $getVal($faq, 'question');
                    $a = $getVal($faq, 'description') ?? $getVal($faq, 'answer');
                @endphp
                @if($q && $a)
                <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 class="font-bold text-base text-gray-900 mb-2" itemprop="name">{{ $q }}</h3>
                    <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <div itemprop="text">{!! nl2br(e($a)) !!}</div>
                    </div>
                </div>
                @endif
            @endforeach
        </div>
    </section>
    @endif

    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p>© {{ date('Y') }} Cambia FX. <strong class="text-gray-900">TU CAMBIO S.A.C.</strong> (RUC <strong class="text-gray-900">20603864957</strong>). Res. SBS N° 04993-2018.</p>
        <p class="mt-2"><a href="{{ url('/') }}" class="text-purple-800 font-semibold underline">Ir al cotizador en la página principal</a></p>
    </footer>
</article>
