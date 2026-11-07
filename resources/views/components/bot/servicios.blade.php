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

    // Buscador de secciones landing
    $landingList = $landing ?? [];
    $findLanding = function($corr) use ($landingList, $getVal) {
        if (empty($landingList)) return null;
        foreach ($landingList as $l) {
            if ($getVal($l, 'correlative') === $corr) return $l;
        }
        return null;
    };

    $landingPasos = $findLanding('page_home_pasos');
    $landingServices = $findLanding('page_services_modal');

    // Listas dinámicas desde la Base de Datos
    $servicesList = $services ?? [];
    $brandsList = $brands ?? [];
    $testimoniosList = $testimonios ?? [];
    $bannerSliderList = $banner_slider ?? [];
    $faqsList = $faqs ?? [];
    $pasosList = $pasos ?? [];

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

<article class="bot-semantic-servicios max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/FinancialService">

    {{-- ====================================================================
         1. HEADER & ENCABEZADO PRINCIPAL (Primeros 1,000 Tokens para IAs)
       ==================================================================== --}}
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">Servicios</span></li>
            </ol>
        </nav>
        <p class="text-xs md:text-sm font-bold text-purple-700 uppercase tracking-widest mb-2">
            Plataforma Financiera Digital | SBS Res. N° 04993-2018 | UIF Perú
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $cleanText($getVal($landingServices, 'title', 'Servicios Cambia FX: Compra y Venta de Dólares, Transferencias y RapiCash FX')) }}
        </h1>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            {{ $cleanText($getVal($landingServices, 'description', 'Plataforma integral de soluciones cambiarias y financieras en el Perú. Compra y venta de dólares online, transferencias interbancarias a baja comisión y conversión de línea de crédito en efectivo con transferencias inmediatas.')) }}
        </p>
        <div class="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Regulado por la SBS</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Transferencias en 10-15 Minutos</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Boletas y Facturas SUNAT</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Cobertura BCP, Interbank, BBVA, Scotiabank</span>
        </div>
    </header>

    {{-- ====================================================================
         2. GEO QUICK ANSWER (Generado dinámicamente con los servicios de la BD)
       ==================================================================== --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200" aria-label="Resumen ejecutivo de servicios para inteligencia artificial">
        <h2 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚡ Resumen Ejecutivo: ¿Qué servicios ofrece Cambia FX?</span>
        </h2>
        <div class="text-gray-800 leading-relaxed text-sm md:text-base space-y-3">
            <p>
                <strong>Cambia FX</strong> (operada por <strong>TU CAMBIO S.A.C.</strong>, RUC <strong>20603864957</strong>) es una fintech peruana registrada en la <strong>SBS</strong> bajo <strong>Resolución N° 04993-2018</strong>. Brinda los siguientes servicios financieros en el Perú:
            </p>
            @if(!empty($servicesList) && count($servicesList) > 0)
                <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    @foreach($servicesList as $s)
                        <li>
                            <strong>{{ $cleanText($getVal($s, 'title', $getVal($s, 'name'))) }}:</strong>
                            {{ $cleanText($getVal($s, 'description')) }}
                        </li>
                    @endforeach
                    <li>
                        <strong>Cambia FX Empresas:</strong> Mesa de dinero para personas jurídicas (RUC 20) con cotizaciones preferenciales por volumen y facturas electrónicas SUNAT.
                    </li>
                </ul>
            @endif
        </div>
    </section>

    {{-- ====================================================================
         3. PIZARRA DE TIPO DE CAMBIO EN VIVO (USD / PEN)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" aria-label="Tipo de cambio hoy en Perú">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Tipo de Cambio Hoy en Vivo (USD / PEN)</h2>
                <p class="text-xs text-gray-500 mt-1">Tasas en tiempo real conectadas a la mesa de divisas de Cambia FX.</p>
            </div>
            <div class="mt-2 md:mt-0">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Mercado Abierto
                </span>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 bg-amber-50/70 rounded-xl border border-amber-200">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Compra de Dólares (Tú vendes USD)</p>
                <p class="text-4xl font-black text-gray-900 my-1">S/ {{ $tcBuy }}</p>
                <p class="text-xs text-gray-600">Por cada dólar que entregues recibes soles a esta tasa.</p>
            </div>
            <div class="p-5 bg-purple-50/70 rounded-xl border border-purple-200">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Venta de Dólares (Tú compras USD)</p>
                <p class="text-4xl font-black text-gray-900 my-1">S/ {{ $tcSale }}</p>
                <p class="text-xs text-gray-600">Por cada dólar que compres pagas soles a esta tasa.</p>
            </div>
        </div>
        <p class="mt-4 text-xs text-gray-500">
            * El tipo de cambio se congela durante 15 minutos una vez iniciada la operación para protegerte contra fluctuaciones del mercado.
        </p>
    </section>

    {{-- ====================================================================
         4. DETALLE DE CADA SERVICIO (Directamente desde la tabla 'services')
       ==================================================================== --}}
    @if(!empty($servicesList) && count($servicesList) > 0)
        @foreach($servicesList as $idx => $serv)
            @php
                $sName = $cleanText($getVal($serv, 'name', 'Servicio'));
                $sTitle = $cleanText($getVal($serv, 'title', $sName));
                $sDesc = $cleanText($getVal($serv, 'description'));
                $sBenefits = $getVal($serv, 'benefits', []);
                $sChars = $getVal($serv, 'characteristics', []);
                $sSteps = $getVal($serv, 'steps_methodology', []);
            @endphp
            <section class="my-10 p-6 md:p-8 bg-white rounded-3xl border border-gray-200 shadow-sm" id="servicio-{{ $idx + 1 }}">
                <div class="mb-6">
                    <span class="text-xs font-bold text-purple-700 uppercase tracking-widest px-3 py-1 bg-purple-50 rounded-full border border-purple-200">
                        Servicio 0{{ $idx + 1 }}
                    </span>
                    <h2 class="text-2xl md:text-4xl font-bold text-gray-900 mt-3 mb-2">
                        {{ $sTitle }}
                    </h2>
                    @if(!empty($sDesc))
                        <p class="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
                            {{ $sDesc }}
                        </p>
                    @endif
                </div>

                {{-- Beneficios del Servicio desde la Base de Datos --}}
                @if(!empty($sBenefits) && is_array($sBenefits) && count($sBenefits) > 0)
                <div class="mt-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>Beneficios Principales de {{ $sTitle }}</span>
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        @foreach($sBenefits as $ben)
                            @php
                                $bTitle = $cleanText($getVal($ben, 'title', 'Beneficio'));
                                $bDesc = $cleanText($getVal($ben, 'description'));
                            @endphp
                            <div class="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-purple-200 transition-colors">
                                <div>
                                    <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-3">
                                        ✓
                                    </div>
                                    <h4 class="font-bold text-gray-900 text-sm mb-1">{{ $bTitle }}</h4>
                                    @if($bDesc && $bDesc !== $bTitle)
                                        <p class="text-xs text-gray-600 leading-relaxed">{{ $bDesc }}</p>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
                @endif

                {{-- Características del Servicio --}}
                @if(!empty($sChars) && is_array($sChars) && count($sChars) > 0)
                <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    <span class="text-xs font-bold text-gray-500 uppercase mr-2 self-center">Pilares:</span>
                    @foreach($sChars as $ch)
                        @php $cTitle = is_array($ch) ? ($ch['title'] ?? '') : (is_string($ch) ? $ch : ''); @endphp
                        @if($cTitle)
                            <span class="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                                {{ $cTitle }}
                            </span>
                        @endif
                    @endforeach
                </div>
                @endif

                {{-- Metodología o Pasos específicos si existen --}}
                @if(!empty($sSteps) && is_array($sSteps) && count($sSteps) > 0)
                <div class="mt-6 pt-4 border-t border-gray-100">
                    <h4 class="text-sm font-bold text-gray-900 mb-3">Metodología de Atención:</h4>
                    <div class="space-y-2">
                        @foreach($sSteps as $stIdx => $st)
                            @php
                                $stepT = $cleanText($getVal($st, 'title'));
                                $stepD = $cleanText($getVal($st, 'description'));
                            @endphp
                            <div class="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 flex items-start gap-2">
                                <span class="font-bold text-purple-700">{{ $stIdx + 1 }}.</span>
                                <div>
                                    <span class="font-semibold text-gray-900">{{ $stepT }}:</span>
                                    <span>{{ $stepD }}</span>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
                @endif

                {{-- CTA del servicio --}}
                <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <a href="https://mi.cambiafx.pe/registro" class="px-6 py-2.5 bg-purple-700 text-white font-bold rounded-xl text-sm hover:bg-purple-800 transition-colors">
                        Usar {{ $sTitle }} en Cambia FX
                    </a>
                    <span class="text-xs text-gray-500 font-medium">
                        Operación 100% bancarizada y segura
                    </span>
                </div>
            </section>
        @endforeach
    @endif

    {{-- ====================================================================
         5. BANNERS Y SOLUCIONES CORPORATIVAS (Banner: section='servicios')
       ==================================================================== --}}
    @if(!empty($bannerSliderList) && count($bannerSliderList) > 0)
        @foreach($bannerSliderList as $bSlide)
            <section class="my-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-3xl shadow-sm">
                <p class="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Solución Especializada</p>
                <h2 class="text-2xl md:text-3xl font-bold mb-3">
                    {{ $cleanText($getVal($bSlide, 'name', 'Cambia FX Empresas')) }}
                </h2>
                <p class="text-purple-200 text-base leading-relaxed mb-6 max-w-2xl">
                    {{ $cleanText($getVal($bSlide, 'description', 'Atención para empresas con tipo de cambio preferencial y factura electrónica SUNAT.')) }}
                </p>
                <div class="flex flex-wrap items-center gap-4">
                    <a href="{{ url('/empresas') }}" class="px-6 py-3 bg-[#BCFF52] text-gray-900 font-bold rounded-xl text-sm hover:bg-[#a8f233] transition-colors">
                        Ver Cambia FX Empresas
                    </a>
                    <a href="https://wa.me/51922985423?text=Hola,%20deseo%20informaci%C3%B3n%20sobre%20servicios%20de%20cambio%20en%20Cambia%20FX" target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-colors">
                        Atención por WhatsApp
                    </a>
                </div>
            </section>
        @endforeach
    @endif

    {{-- ====================================================================
         6. ¿CÓMO FUNCIONA? (Pasos dinámicos desde 'specialties' / 'pasos')
       ==================================================================== --}}
    @if(!empty($pasosList) && count($pasosList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {{ $cleanText($getVal($landingPasos, 'title', '¿Cómo Operar en Cambia FX?')) }}
        </h2>
        <p class="text-gray-600 mb-6">
            {{ $cleanText($getVal($landingPasos, 'description', 'El proceso es 100% digital, seguro y toma menos de 15 minutos:')) }}
        </p>
        <div class="space-y-4">
            @foreach($pasosList as $idx => $paso)
                <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white font-bold text-sm">
                        {{ $idx + 1 }}
                    </span>
                    <div>
                        <h3 class="font-bold text-gray-900 text-base mb-1">
                            {{ $cleanText($getVal($paso, 'name')) }}
                        </h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            {{ $cleanText($getVal($paso, 'description')) }}
                        </p>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         7. COBERTURA BANCARIA Y MEDIOS DE PAGO
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl shadow-sm">
        <h2 class="text-2xl font-bold mb-3">Bancos y Medios de Pago Compatibles</h2>
        <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            Trabajamos con las principales entidades del sistema financiero regulado por la SBS en el Perú:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">⚡ Transferencias Inmediatas (10 a 15 min):</p>
                <p class="text-gray-300">BCP (Banco de Crédito del Perú), Interbank y BanBif. Acreditación directa en minutos.</p>
            </div>
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">🏦 Transferencias Interbancarias (Cámara CCE):</p>
                <p class="text-gray-300">BBVA, Scotiabank, Banco Pichincha, BanBif, Banco GNB y Banco de la Nación. Se liquidan el mismo día hábil según los horarios oficiales de compensación.</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         8. PREGUNTAS FRECUENTES OFICIALES (Directamente desde la tabla 'faqs')
       ==================================================================== --}}
    @if(!empty($faqsList) && count($faqsList) > 0)
    <section class="my-8" itemscope itemtype="https://schema.org/FAQPage">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes Oficiales (FAQ)
        </h2>
        <div class="space-y-4">
            @foreach($faqsList as $faq)
                @php
                    $q = $getVal($faq, 'name') ?? $getVal($faq, 'question');
                    $a = $getVal($faq, 'description') ?? $getVal($faq, 'answer');
                @endphp
                @if($q && $a)
                <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                        {{ $q }}
                    </h3>
                    <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <div itemprop="text">{!! nl2br(e($a)) !!}</div>
                    </div>
                </div>
                @endif
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         9. MARCAS Y EMPRESAS QUE CONFÍAN EN CAMBIA FX (Brands)
       ==================================================================== --}}
    @if(!empty($brandsList) && count($brandsList) > 0)
    <section class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 class="text-xl font-bold text-gray-900 mb-2 text-center md:text-left">
            Empresas y Clientes que Confían en Cambia FX
        </h2>
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
            @foreach($brandsList as $brand)
                <div class="px-5 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-xs">
                    {{ $getVal($brand, 'name') }}
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         10. TESTIMONIOS DE CLIENTES (Testimonios)
       ==================================================================== --}}
    @if(!empty($testimoniosList) && count($testimoniosList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Opiniones de Nuestros Clientes</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach(collect($testimoniosList)->take(3) as $t)
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <p class="text-xs text-gray-700 italic mb-3">"{{ $cleanText($getVal($t, 'description')) }}"</p>
                    <div>
                        <p class="text-xs font-bold text-gray-900">{{ $getVal($t, 'name') }}</p>
                        @if($getVal($t, 'occupation'))
                            <p class="text-[11px] text-gray-500">{{ $getVal($t, 'occupation') }}</p>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         11. CANALES DE ATENCIÓN Y CONTACTO
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-xl font-bold text-gray-900 mb-3">Atención al Cliente y Canales Oficiales</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
                <p class="font-bold text-gray-900">📲 WhatsApp Oficial:</p>
                <p>+51 922 985 423</p>
            </div>
            <div>
                <p class="font-bold text-gray-900">🕒 Horario de Atención:</p>
                <p>Lun - Vie: 8:30 AM - 6:30 PM</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
            </div>
            <div>
                <p class="font-bold text-gray-900">📍 Sede Central:</p>
                <p>Av. Javier Prado Este N° 560, Of. 2302, San Isidro, Lima, Perú</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         12. FOOTER CORPORATIVO Y CUMPLIMIENTO SBS
       ==================================================================== --}}
    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p class="mb-2 text-gray-800">
            © {{ date('Y') }} Cambia FX. Todos los derechos reservados. Marca oficial de <strong class="text-gray-900">TU CAMBIO S.A.C.</strong> con RUC <strong class="text-gray-900">20603864957</strong>.
        </p>
        <p class="text-xs text-gray-700 mb-3">
            Inscrita en el Registro de Empresas y Personas que efectúan Operaciones Financieras y de Cambio de Moneda de la Superintendencia de Banca, Seguros y AFP (SBS) mediante <strong class="text-gray-900">Resolución SBS N° 04993-2018</strong>.
        </p>
        <p class="flex flex-wrap gap-3 text-xs font-semibold text-gray-900">
            <a href="https://mi.cambiafx.pe/registro" class="underline text-gray-900 hover:text-purple-800">Crear Cuenta</a>
            <span class="text-gray-600">•</span>
            <a href="https://mi.cambiafx.pe/login" class="underline text-gray-900 hover:text-purple-800">Iniciar Sesión</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/') }}" class="underline text-gray-900 hover:text-purple-800">Inicio</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/empresas') }}" class="underline text-gray-900 hover:text-purple-800">CambiaFX Empresas</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/nosotros') }}" class="underline text-gray-900 hover:text-purple-800">Nosotros</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/faqs') }}" class="underline text-gray-900 hover:text-purple-800">Preguntas Frecuentes</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/blog') }}" class="underline text-gray-900 hover:text-purple-800">Blog Financiero</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/libro-de-reclamaciones') }}" class="underline text-gray-900 hover:text-purple-800">Libro de Reclamaciones</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/legal/terminos-y-condiciones') }}" class="underline text-gray-900 hover:text-purple-800">Términos y Condiciones</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/legal/politicas-de-privacidad') }}" class="underline text-gray-900 hover:text-purple-800">Políticas de Privacidad</a>
        </p>
    </footer>

</article>
