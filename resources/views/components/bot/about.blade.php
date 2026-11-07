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

    $coreValuesList = $core_values ?? [];
    $strengthsList = $strengths ?? [];
    $benefitsList = $benefits ?? [];
    $aboutusList = $aboutus ?? [];
@endphp

<article class="bot-semantic-about max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/AboutPage">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">Sobre Nosotros</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Quiénes Somos | TU CAMBIO S.A.C.
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            Sobre Cambia FX: Innovación, Seguridad y Confianza Financiera
        </h1>
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            Somos una casa de cambio digital peruana registrada y regulada por la SBS (Resolución N° 04993-2018), comprometida con ofrecer a personas y empresas una forma segura, rápida y transparente de cambiar divisas.
        </p>
    </header>

    {{-- Resumen Corporativo --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200">
        <h2 class="text-lg font-bold text-gray-900 mb-2">
            ⚡ Identidad Legal y Regulatoria
        </h2>
        <div class="text-sm md:text-base text-gray-800 space-y-2">
            <p>
                <strong>Razón Social:</strong> TU CAMBIO S.A.C. (RUC: 20603864957).<br>
                <strong>Registro SBS:</strong> Inscrita en el Registro de Empresas de Préstamos y Casas de Cambio mediante Resolución SBS N° 04993-2018.<br>
                <strong>Supervisión UIF:</strong> Sujeta a los controles de prevención del lavado de activos y financiamiento del terrorismo (PLAFT).<br>
                <strong>Oficina Principal:</strong> Av. Javier Prado Este N° 560, Of. 2302, San Isidro, Lima, Perú.
            </p>
        </div>
    </section>

    {{-- Pilares y Valores Fundamentales (Core Values) --}}
    @if(!empty($coreValuesList) && count($coreValuesList) > 0)
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl">
        <h2 class="text-2xl font-bold mb-4 text-amber-400">Nuestros Pilares y Valores</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @foreach($coreValuesList as $pilar)
                <div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <h3 class="font-bold text-white text-base mb-1">{{ $getVal($pilar, 'name') }}</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">{{ $clean($getVal($pilar, 'description')) }}</p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Beneficios y Fortalezas --}}
    @if(!empty($strengthsList) && count($strengthsList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Por qué confiar en Cambia FX?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach($strengthsList as $st)
                <div class="p-4 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-gray-900 text-sm mb-1">{{ $getVal($st, 'name') }}</h3>
                    <p class="text-xs text-gray-600 leading-relaxed">{{ $clean($getVal($st, 'description')) }}</p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- Footer --}}
    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p>© {{ date('Y') }} Cambia FX. <strong class="text-gray-900">TU CAMBIO S.A.C.</strong> (RUC <strong class="text-gray-900">20603864957</strong>). Todos los derechos reservados.</p>
    </footer>
</article>
