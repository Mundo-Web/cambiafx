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

    $isTerms = ($policyType ?? '') === 'terms_conditions';
    $title = $isTerms ? 'Términos y Condiciones de Uso' : 'Políticas de Privacidad y Protección de Datos';
    $content = $getVal($policyContent, 'description') ?? '';
@endphp

<article class="bot-semantic-legal max-w-4xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/WebPage">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">{{ $title }}</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Marco Legal y Normativo Oficial | Cambia FX
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $title }}
        </h1>
        <p class="text-sm text-gray-600">
            Operado por <strong>TU CAMBIO S.A.C.</strong> (RUC 20603864957), empresa regulada por la Superintendencia de Banca, Seguros y AFP (SBS) bajo Resolución SBS N° 04993-2018.
        </p>
    </header>

    <section class="prose prose-sm md:prose-base max-w-none text-gray-800 leading-relaxed bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
        @if(!empty($content))
            {!! $content !!}
        @else
            <p>
                El presente documento establece las condiciones legales bajo las cuales TU CAMBIO S.A.C. presta sus servicios digitales de compra y venta de divisas en el territorio de la República del Perú.
            </p>
        @endif
    </section>

    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p>© {{ date('Y') }} Cambia FX. Todos los derechos reservados. RUC: <strong class="text-gray-900">20603864957</strong>.</p>
    </footer>
</article>
