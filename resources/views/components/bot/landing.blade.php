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

    $h1 = $getVal($landing, 'h1') ?? $getVal($landing, 'meta_title') ?? 'Cambio de Dólares Online en Perú';
    $h2 = $getVal($landing, 'h2') ?? $getVal($landing, 'meta_description') ?? '';
    $seoContent = $getVal($landing, 'seo_content') ?? '';
    $coupon = $getVal($landing, 'coupon');
    $landingFaqs = $getVal($landing, 'schema_faq') ?? $faqs ?? [];
    $landingSteps = $getVal($landing, 'steps') ?? $pasos ?? [];
    $landingBenefits = $getVal($landing, 'benefits') ?? [];
@endphp

<article class="bot-semantic-landing max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/FinancialService">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">{{ $clean($h1) }}</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Cambia FX | Casa de Cambio Digital SBS
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $clean($h1) }}
        </h1>
        @if(!empty($h2))
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            {{ $clean($h2) }}
        </p>
        @endif
    </header>

    {{-- GEO Quick Answer --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200">
        <h2 class="text-lg font-bold text-gray-900 mb-2">
            ⚡ Resumen del Servicio de Cambio Online
        </h2>
        <div class="text-sm md:text-base text-gray-800 space-y-2">
            <p>
                En <strong>Cambia FX</strong> (TU CAMBIO S.A.C., RUC 20603864957, Res. SBS N° 04993-2018) puedes cambiar dólares y soles online al mejor tipo de cambio del mercado peruano, de forma 100% bancarizada y con acreditación en minutos.
            </p>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700">
                <li><strong>Transferencias Inmediatas (10 a 15 min):</strong> BCP, Interbank y BanBif.</li>
                <li><strong>Transferencias Interbancarias:</strong> BBVA, Scotiabank, Pichincha y otros bancos vía CCE.</li>
                <li><strong>Garantía:</strong> Tasa congelada por 15 minutos sin comisiones ocultas.</li>
            </ul>
        </div>
    </section>

    {{-- Cupón Destacado si existe --}}
    @if(!empty($coupon))
    <section class="my-6 p-5 bg-purple-50 rounded-xl border border-purple-200">
        <span class="font-mono text-xs font-extrabold uppercase px-2 py-1 bg-purple-200 text-purple-800 rounded">
            CUPÓN DISPONIBLE: {{ $getVal($coupon, 'name') }}
        </span>
        <h3 class="font-bold text-gray-900 text-base mt-2">{{ $getVal($coupon, 'name') }}</h3>
        <p class="text-sm text-gray-700">{{ $getVal($coupon, 'description') }}</p>
    </section>
    @endif

    {{-- Pasos para cambiar --}}
    @if(!empty($landingSteps) && count($landingSteps) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Cómo funciona el cambio en Cambia FX?</h2>
        <div class="space-y-4">
            @foreach($landingSteps as $idx => $step)
                <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm">
                        {{ $idx + 1 }}
                    </span>
                    <div>
                        <h3 class="font-bold text-gray-900 text-base mb-1">
                            {{ $clean($getVal($step, 'name') ?? $getVal($step, 'title')) }}
                        </h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            {{ $clean($getVal($step, 'description')) }}
                        </p>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Beneficios --}}
    @if(!empty($landingBenefits) && count($landingBenefits) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Beneficios de cambiar con nosotros</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach($landingBenefits as $benefit)
                <div class="p-4 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-gray-900 text-sm mb-1">
                        {{ $clean($getVal($benefit, 'name') ?? $getVal($benefit, 'title')) }}
                    </h3>
                    <p class="text-xs text-gray-600 leading-relaxed">
                        {{ $clean($getVal($benefit, 'description')) }}
                    </p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Contenido SEO detallado --}}
    @if(!empty($seoContent))
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200 prose prose-sm max-w-none text-gray-800 leading-relaxed">
        {!! $seoContent !!}
    </section>
    @endif

    {{-- FAQs de la Landing --}}
    @if(!empty($landingFaqs) && count($landingFaqs) > 0)
    <section class="my-8" itemscope itemtype="https://schema.org/FAQPage">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
        <div class="space-y-4">
            @foreach($landingFaqs as $faq)
                @php
                    $q = $getVal($faq, 'name') ?? $getVal($faq, 'question');
                    $a = $getVal($faq, 'description') ?? $getVal($faq, 'answer');
                @endphp
                <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 class="font-bold text-base text-gray-900 mb-2" itemprop="name">
                        {{ $q }}
                    </h3>
                    <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <div itemprop="text">{!! nl2br(e($a)) !!}</div>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Footer con CTA --}}
    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <div class="p-6 bg-gray-900 text-white rounded-2xl text-center mb-6">
            <h3 class="text-xl font-bold mb-2">¿Listo para cambiar tus dólares o soles?</h3>
            <p class="text-sm text-gray-300 mb-4">Cotiza tu cambio en tiempo real y recibe tus fondos de forma segura en tu cuenta bancaria.</p>
            <a href="https://mi.cambiafx.pe/registro" class="inline-block px-6 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl text-sm">
                Crear Cuenta Gratis
            </a>
        </div>
        <p>© {{ date('Y') }} Cambia FX. Regulada por la SBS (Res. N° 04993-2018). RUC: 20603864957.</p>
    </footer>
</article>
