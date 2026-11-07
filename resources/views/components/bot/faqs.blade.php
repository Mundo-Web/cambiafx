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

    $faqsList = $faqs ?? [];
@endphp

<article class="bot-semantic-faqs max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/FAQPage">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">Preguntas Frecuentes</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Centro de Ayuda Oficial | Cambia FX
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            Preguntas Frecuentes sobre el Cambio de Dólares Online en Perú
        </h1>
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            Encuentra respuestas inmediatas a todas tus dudas sobre seguridad, tiempos de transferencia, bancos, comisiones y límites de operación en Cambia FX.
        </p>
    </header>

    @if(!empty($faqsList) && count($faqsList) > 0)
    <div class="space-y-4">
        @foreach($faqsList as $faq)
            @php
                $q = $getVal($faq, 'name') ?? $getVal($faq, 'question');
                $a = $getVal($faq, 'description') ?? $getVal($faq, 'answer');
            @endphp
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h2 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    {{ $q }}
                </h2>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">{!! nl2br(e($a)) !!}</div>
                </div>
            </div>
        @endforeach
    </div>
    @endif

    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p>© {{ date('Y') }} Cambia FX. <strong class="text-gray-900">TU CAMBIO S.A.C.</strong> (RUC <strong class="text-gray-900">20603864957</strong>). Res. SBS N° 04993-2018.</p>
    </footer>
</article>
