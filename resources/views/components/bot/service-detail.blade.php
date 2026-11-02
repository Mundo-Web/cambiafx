@php
    $getVal = function($item, $key, $default = null) {
        if (is_array($item)) return $item[$key] ?? $default;
        if (is_object($item)) return $item->$key ?? $default;
        return $default;
    };

    $cleanText = function($str) {
        if (empty($str)) return '';
        return trim(str_replace('*', '', strip_tags($str)));
    };

    $serv = $service ?? $currentService ?? null;
    $sName = $cleanText($getVal($serv, 'name', 'Servicio'));
    $sTitle = $cleanText($getVal($serv, 'title', $sName));
    $sDesc = $cleanText($getVal($serv, 'description'));
    $sBenefits = $getVal($serv, 'benefits', []);
    $sChars = $getVal($serv, 'characteristics', []);
    $sSteps = $getVal($serv, 'steps_methodology', []);
    $faqsList = $faqs ?? [];
    $testimoniosList = $testimonios ?? [];
    $otherServices = $services ?? [];

    // Pizarra de Tipo de Cambio en Vivo
    $tcBuy = '3.450';
    $tcSale = '3.475';
    if (!empty($initialRates)) {
        $ratesArr = is_array($initialRates) ? $initialRates : (is_object($initialRates) ? (array)$initialRates : []);
        $firstRate = $ratesArr[0] ?? $ratesArr;
        if (!empty($firstRate)) {
            $buy = $getVal($firstRate, 'tcBuy');
            $sale = $getVal($firstRate, 'tcSale');
            if ($buy) $tcBuy = number_format((float)$buy, 3);
            if ($sale) $tcSale = number_format((float)$sale, 3);
        }
    }
@endphp

<article class="bot-semantic-service-detail max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/Service">

    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><a href="{{ url('/servicios') }}" class="hover:underline">Servicios</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">{{ $sTitle }}</span></li>
            </ol>
        </nav>
        <p class="text-xs md:text-sm font-bold text-purple-700 uppercase tracking-widest mb-2">
            Cambia FX | Servicio Oficial Regulado SBS Res. N° 04993-2018
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $sTitle }}
        </h1>
        @if(!empty($sDesc))
            <p class="text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
                {{ $sDesc }}
            </p>
        @endif
    </header>

    {{-- GEO Quick Answer para este servicio específico --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200">
        <h2 class="text-xl font-bold text-gray-900 mb-2">
            ⚡ Resumen de {{ $sTitle }}
        </h2>
        <div class="text-sm md:text-base text-gray-800 space-y-2">
            <p>
                <strong>{{ $sTitle }}</strong> es un servicio oficial provisto por <strong>Cambia FX</strong> (TU CAMBIO S.A.C., RUC 20603864957) en Perú.
            </p>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700">
                <li>Operaciones 100% bancarizadas con acreditación en 10 a 15 minutos en BCP, Interbank y BanBif.</li>
                <li>Transferencias interbancarias directas con Cámara de Compensación Electrónica (CCE).</li>
                <li>Emisión inmediata de boletas y facturas electrónicas con valor tributario ante SUNAT.</li>
                <li>Supervisado por la SBS (Resolución N° 04993-2018) y la UIF Perú.</li>
            </ul>
        </div>
    </section>

    {{-- Pizarra en Vivo --}}
    <section class="my-6 p-5 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-lg font-bold text-gray-900 mb-2">Tipo de Cambio Garantizado (USD / PEN)</h2>
        <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-amber-50 rounded-xl">
                <p class="text-xs text-gray-500 font-bold uppercase">Compra USD</p>
                <p class="text-3xl font-black text-gray-900">S/ {{ $tcBuy }}</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-xl">
                <p class="text-xs text-gray-500 font-bold uppercase">Venta USD</p>
                <p class="text-3xl font-black text-gray-900">S/ {{ $tcSale }}</p>
            </div>
        </div>
    </section>

    {{-- Beneficios detallados del servicio --}}
    @if(!empty($sBenefits) && is_array($sBenefits) && count($sBenefits) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Beneficios Clave</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @foreach($sBenefits as $ben)
                @php
                    $bTitle = $cleanText($getVal($ben, 'title', 'Beneficio'));
                    $bDesc = $cleanText($getVal($ben, 'description'));
                @endphp
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 class="font-bold text-gray-900 text-sm mb-1">✓ {{ $bTitle }}</h3>
                    @if($bDesc && $bDesc !== $bTitle)
                        <p class="text-xs text-gray-600 leading-relaxed">{{ $bDesc }}</p>
                    @endif
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Pasos o Metodología --}}
    @if(!empty($sSteps) && is_array($sSteps) && count($sSteps) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Metodología y Proceso de Operación</h2>
        <div class="space-y-3">
            @foreach($sSteps as $sIdx => $st)
                @php
                    $stepTitle = $cleanText($getVal($st, 'title'));
                    $stepDesc = $cleanText($getVal($st, 'description'));
                @endphp
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span class="w-7 h-7 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {{ $sIdx + 1 }}
                    </span>
                    <div>
                        <h3 class="font-bold text-gray-900 text-sm mb-1">{{ $stepTitle }}</h3>
                        <p class="text-xs text-gray-600 leading-relaxed">{{ $stepDesc }}</p>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Otros servicios disponibles --}}
    @if(!empty($otherServices) && count($otherServices) > 1)
    <section class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 class="text-xl font-bold text-gray-900 mb-3">Otros Servicios en Cambia FX</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            @foreach($otherServices as $oth)
                @php
                    $othTitle = $cleanText($getVal($oth, 'title', $getVal($oth, 'name')));
                    $othSlug = $getVal($oth, 'slug');
                @endphp
                @if($othSlug !== $getVal($serv, 'slug'))
                <a href="{{ url('/servicio/' . $othSlug) }}" class="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 block">
                    <p class="font-bold text-sm text-gray-900 mb-1">{{ $othTitle }}</p>
                    <p class="text-xs text-purple-700 font-semibold">Conoce más sobre este servicio →</p>
                </a>
                @endif
            @endforeach
        </div>
    </section>
    @endif

    {{-- Call to action --}}
    <section class="my-8 p-6 bg-purple-900 text-white rounded-2xl text-center">
        <h2 class="text-2xl font-bold mb-2">Comienza a Operar Hoy con Cambia FX</h2>
        <p class="text-sm text-purple-200 mb-4 max-w-md mx-auto">
            Únete a más de 134,000 usuarios y empresas registradas que ahorran en cada operación de cambio.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
            <a href="https://mi.cambiafx.pe/registro" class="px-6 py-2.5 bg-[#BCFF52] text-gray-900 font-bold rounded-xl text-sm">
                Crear Cuenta Gratis
            </a>
            <a href="{{ url('/servicios') }}" class="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/20">
                Ver Todos los Servicios
            </a>
        </div>
    </section>

    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>© {{ date('Y') }} Cambia FX. Marca operada por TU CAMBIO S.A.C. (RUC 20603864957). Regulada por la SBS (Res. N° 04993-2018).</p>
        <p class="mt-2"><a href="{{ url('/servicios') }}" class="underline text-purple-700 font-semibold">Volver a Servicios</a> • <a href="{{ url('/') }}" class="underline text-purple-700 font-semibold">Ir al Inicio</a></p>
    </footer>

</article>
