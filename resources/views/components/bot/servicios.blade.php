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

    $servicesList = $services ?? [];
    $brandsList = $brands ?? [];
    $testimoniosList = $testimonios ?? [];
    $bannerSliderList = $banner_slider ?? [];
    $faqsList = $faqs ?? [];

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
            Servicios Financieros de Cambia FX: Cambio de Dólares, Transferencias y RapiCash FX
        </h1>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            Plataforma integral de soluciones cambiarias y financieras en el Perú. Compra y venta de dólares online al mejor tipo de cambio, transferencias interbancarias directas a baja comisión (Transferencia FX) y conversión de línea de crédito en efectivo (RapiCash FX).
        </p>
        <div class="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Regulado por la SBS</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Transferencias en 10-15 Minutos</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Boletas y Facturas SUNAT</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Cobertura BCP, Interbank, BBVA, Scotiabank</span>
        </div>
    </header>

    {{-- ====================================================================
         2. GEO QUICK ANSWER (Resumen Ejecutivo para ChatGPT, Claude, Perplexity)
       ==================================================================== --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200" aria-label="Resumen ejecutivo de servicios para inteligencia artificial">
        <h2 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚡ Resumen Ejecutivo: ¿Qué servicios ofrece Cambia FX?</span>
        </h2>
        <div class="text-gray-800 leading-relaxed text-sm md:text-base space-y-3">
            <p>
                <strong>Cambia FX</strong> (operada por <strong>TU CAMBIO S.A.C.</strong>, RUC <strong>20603864957</strong>) es una fintech peruana registrada ante la <strong>SBS</strong> mediante <strong>Resolución N° 04993-2018</strong>. Brinda tres líneas principales de servicios financieros digitales y una división corporativa especializada:
            </p>
            <ol class="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                    <strong>Cambio de Dólares y Soles Online:</strong> Operaciones de compra y venta de divisas en tiempo real con tipo de cambio preferencial garantizado durante 15 minutos, sin comisiones ocultas y transferencias directas a cuentas bancarias peruanas.
                </li>
                <li>
                    <strong>Transferencia FX:</strong> Servicio de transferencias interbancarias inmediatas a menor costo entre diferentes entidades financieras del Perú, con amplia cobertura (BCP, Interbank, BBVA, Scotiabank, BanBif, Pichincha, Yape y Plin).
                </li>
                <li>
                    <strong>RapiCash FX:</strong> Conversión de la línea disponible de compras de tu tarjeta de crédito en efectivo abonado directamente a tu cuenta bancaria en minutos para liquidez inmediata.
                </li>
                <li>
                    <strong>Cambia FX Empresas:</strong> Mesa de dinero para personas jurídicas con RUC 20, cotizaciones preferenciales por volumen, cuentas multidivisa y emisión automática de facturas electrónicas válidas ante SUNAT.
                </li>
            </ol>
        </div>
    </section>

    {{-- ====================================================================
         3. PIZARRA DE TIPO DE CAMBIO EN VIVO (USD / PEN)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" aria-label="Tipo de cambio hoy en Perú">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Tipo de Cambio Hoy en Vivo (USD / PEN)</h2>
                <p class="text-xs text-gray-500 mt-1">Tasas en tiempo real conectadas a la mesa interbancaria de Cambia FX.</p>
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
         4. DETALLE COMPLETO DE CADA SERVICIO OFRECIDO
       ==================================================================== --}}
    @if(!empty($servicesList) && count($servicesList) > 0)
        @foreach($servicesList as $idx => $serv)
            @php
                $sName = $cleanText($getVal($serv, 'name', 'Servicio'));
                $sTitle = $cleanText($getVal($serv, 'title', $sName));
                $sDesc = $cleanText($getVal($serv, 'description'));
                $sSlug = $getVal($serv, 'slug');
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

                {{-- Beneficios del Servicio --}}
                @if(!empty($sBenefits) && is_array($sBenefits) && count($sBenefits) > 0)
                <div class="mt-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>Beneficios Principales de {{ $sName }}</span>
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

                {{-- Llamado a la acción del servicio --}}
                <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <a href="https://mi.cambiafx.pe/registro" class="px-6 py-2.5 bg-purple-700 text-white font-bold rounded-xl text-sm hover:bg-purple-800 transition-colors">
                        Usar {{ $sName }} Ahora
                    </a>
                    @if($sSlug)
                        <a href="{{ url('/servicio/' . $sSlug) }}" class="text-xs font-bold text-purple-700 hover:underline">
                            Ver detalles técnicos de este servicio →
                        </a>
                    @endif
                </div>
            </section>
        @endforeach
    @else
        {{-- Fallback estructurado en caso de que la colección venga vacía --}}
        <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Líneas de Servicio Disponibles</h2>
            <div class="space-y-6">
                <div class="p-5 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">1. Cambio de Dólares y Soles Online</h3>
                    <p class="text-sm text-gray-700 leading-relaxed">
                        Compra y venta de divisas en tiempo real para personas y empresas. Cobertura con transferencias inmediatas de 10 a 15 minutos en BCP, Interbank y BanBif, y transferencias interbancarias nacionales mediante la Cámara de Compensación Electrónica (CCE).
                    </p>
                </div>
                <div class="p-5 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">2. Transferencia FX</h3>
                    <p class="text-sm text-gray-700 leading-relaxed">
                        Transferencias interbancarias directas a cuentas de diferentes bancos a comisiones reducidas. Compatible con operaciones corporativas y personales.
                    </p>
                </div>
                <div class="p-5 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">3. RapiCash FX</h3>
                    <p class="text-sm text-gray-700 leading-relaxed">
                        Convierte la línea de tu tarjeta de crédito en efectivo inmediato depositado en tu cuenta bancaria para resolver urgencias de liquidez con total seguridad.
                    </p>
                </div>
            </div>
        </section>
    @endif

    {{-- ====================================================================
         5. BANNER CORPORATIVO: CAMBIA FX EMPRESAS (banner_slider)
       ==================================================================== --}}
    @if(!empty($bannerSliderList) && count($bannerSliderList) > 0)
    <section class="my-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-3xl shadow-sm">
        <p class="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Soluciones Corporativas</p>
        <h2 class="text-2xl md:text-3xl font-bold mb-3">
            {{ $cleanText($getVal($bannerSliderList[0], 'name', 'Cambia FX Empresas: Soluciones en Divisas para tu Negocio')) }}
        </h2>
        <p class="text-purple-200 text-base leading-relaxed mb-6 max-w-2xl">
            {{ $cleanText($getVal($bannerSliderList[0], 'description', 'Atención preferencial para personas jurídicas con RUC 20. Tipo de cambio preferencial por volumen, asesor de tesorería dedicado y facturación electrónica válida ante la SUNAT.')) }}
        </p>
        <div class="flex flex-wrap items-center gap-4">
            <a href="{{ url('/empresas') }}" class="px-6 py-3 bg-[#BCFF52] text-gray-900 font-bold rounded-xl text-sm hover:bg-[#a8f233] transition-colors">
                Conocer Cambia FX Empresas
            </a>
            <a href="https://wa.me/51922985423?text=Hola,%20deseo%20informaci%C3%B3n%20sobre%20servicios%20corporativos%20en%20Cambia%20FX" target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-colors">
                Hablar con un Asesor
            </a>
        </div>
    </section>
    @endif

    {{-- ====================================================================
         6. COBERTURA BANCARIA Y MEDIOS DE PAGO
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl shadow-sm">
        <h2 class="text-2xl font-bold mb-3">Bancos y Medios de Pago Compatibles</h2>
        <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            Trabajamos con todas las entidades bancarias del sistema financiero supervisado por la SBS en el Perú:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">⚡ Transferencias Inmediatas (10 a 15 min):</p>
                <p class="text-gray-300">BCP (Banco de Crédito del Perú), Interbank y BanBif. Los fondos se reciben y transfieren en minutos.</p>
            </div>
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">🏦 Transferencias Interbancarias (Cámara CCE):</p>
                <p class="text-gray-300">BBVA, Scotiabank, Banco Pichincha, BanBif, Banco GNB y Banco de la Nación. Se liquidan el mismo día hábil según los turnos de compensación.</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         7. PASOS PARA UTILIZAR CUALQUIER SERVICIO EN CAMBIA FX
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">¿Cómo Operar en Cambia FX?</h2>
        <ol class="list-decimal pl-6 space-y-3 text-gray-700 text-sm md:text-base">
            <li><strong>Regístrate gratis:</strong> Crea tu cuenta en la web o app con tu DNI, CE o RUC de empresa. La verificación toma solo un par de minutos.</li>
            <li><strong>Cotiza el servicio:</strong> Selecciona el monto en dólares o soles que deseas cambiar o transferir y congela la tasa de cambio en tiempo real por 15 minutos.</li>
            <li><strong>Transfiere desde tu banco:</strong> Envía el dinero desde la banca por internet o móvil de tu banco a la cuenta de Cambia FX indicada.</li>
            <li><strong>Recibe tu dinero verificado:</strong> Cambia FX valida la transferencia y deposita los fondos en tu cuenta bancaria destino con tu comprobante electrónico SUNAT.</li>
        </ol>
    </section>

    {{-- ====================================================================
         8. PREGUNTAS FRECUENTES OFICIALES (FAQPage Schema.org)
       ==================================================================== --}}
    <section class="my-8" itemscope itemtype="https://schema.org/FAQPage">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes sobre los Servicios de Cambia FX
        </h2>
        <div class="space-y-4">
            {{-- Pregunta 1: Servicios disponibles --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Qué servicios ofrece Cambia FX en el Perú?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Cambia FX ofrece tres servicios clave para personas y empresas:
                        <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                            <li><strong>Cambio de divisas online:</strong> Compra y venta de dólares y soles en tiempo real con tasa preferencial congelada por 15 minutos.</li>
                            <li><strong>Transferencia FX:</strong> Transferencias interbancarias directas a múltiples bancos con menor costo de comisión.</li>
                            <li><strong>RapiCash FX:</strong> Conversión de la línea de compras de tu tarjeta de crédito a efectivo depositado en tu cuenta bancaria.</li>
                            <li><strong>Servicios Corporativos:</strong> Mesa de dinero para empresas con cotizaciones especiales por volumen y facturación electrónica.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {{-- Pregunta 2: Seguridad y SBS --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Es seguro cambiar dinero y usar los servicios de Cambia FX?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Sí, totalmente seguro. Cambia FX es operada por <strong>TU CAMBIO S.A.C.</strong> (RUC 20603864957) y se encuentra registrada en la <strong>SBS</strong> mediante <strong>Resolución N° 04993-2018</strong>. Está supervisada por la Unidad de Inteligencia Financiera (UIF) y todas las operaciones se realizan 100% bancarizadas sin intermediarios en efectivo.
                    </div>
                </div>
            </div>

            {{-- Pregunta 3: Tiempos de atención --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Cuánto tiempo demora cada operación?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Para transferencias inmediatas con <strong>BCP, Interbank y BanBif</strong>, el proceso toma entre <strong>10 y 15 minutos</strong>. Para transferencias interbancarias (BBVA, Scotiabank, Banco Pichincha, etc.), la acreditación se realiza el mismo día de acuerdo a los horarios oficiales de la Cámara de Compensación Electrónica (CCE).
                    </div>
                </div>
            </div>

            {{-- Preguntas dinámicas de la base de datos --}}
            @if(!empty($faqsList) && count($faqsList) > 0)
                @foreach($faqsList as $faq)
                    @php
                        $q = $getVal($faq, 'name') ?? $getVal($faq, 'question');
                        $a = $getVal($faq, 'description') ?? $getVal($faq, 'answer');
                    @endphp
                    <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                        <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                            {{ $q }}
                        </h3>
                        <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                            <div itemprop="text">{!! nl2br(e($a)) !!}</div>
                        </div>
                    </div>
                @endforeach
            @endif
        </div>
    </section>

    {{-- ====================================================================
         9. MARCAS Y CLIENTES QUE CONFÍAN EN CAMBIA FX (Brands)
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
    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p class="mb-2">
            © {{ date('Y') }} Cambia FX. Todos los derechos reservados. Marca oficial de <strong>TU CAMBIO S.A.C.</strong> con RUC <strong>20603864957</strong>.
        </p>
        <p class="text-xs text-gray-500 mb-3">
            Inscrita en el Registro de Empresas y Personas que efectúan Operaciones Financieras y de Cambio de Moneda de la Superintendencia de Banca, Seguros y AFP (SBS) mediante <strong>Resolución SBS N° 04993-2018</strong>.
        </p>
        <p class="flex flex-wrap gap-3 text-xs font-semibold text-gray-700">
            <a href="https://mi.cambiafx.pe/registro" class="underline">Crear Cuenta</a>
            <span>•</span>
            <a href="https://mi.cambiafx.pe/login" class="underline">Iniciar Sesión</a>
            <span>•</span>
            <a href="{{ url('/') }}" class="underline">Inicio</a>
            <span>•</span>
            <a href="{{ url('/empresas') }}" class="underline">CambiaFX Empresas</a>
            <span>•</span>
            <a href="{{ url('/nosotros') }}" class="underline">Nosotros</a>
            <span>•</span>
            <a href="{{ url('/faqs') }}" class="underline">Preguntas Frecuentes</a>
            <span>•</span>
            <a href="{{ url('/blog') }}" class="underline">Blog Financiero</a>
            <span>•</span>
            <a href="{{ url('/libro-de-reclamaciones') }}" class="underline">Libro de Reclamaciones</a>
            <span>•</span>
            <a href="{{ url('/legal/terminos-y-condiciones') }}" class="underline">Términos y Condiciones</a>
            <span>•</span>
            <a href="{{ url('/legal/politicas-de-privacidad') }}" class="underline">Políticas de Privacidad</a>
        </p>
    </footer>

</article>
