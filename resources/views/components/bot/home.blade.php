@php
    $getVal = function($item, $key, $default = null) {
        if (is_array($item)) return $item[$key] ?? $default;
        if (is_object($item)) return $item->$key ?? $default;
        return $default;
    };

    $cleanText = function($str) {
        if (empty($str)) return '';
        // Quitar asteriscos tipo *destacado* usados por TextWithHighlight
        return trim(str_replace('*', '', strip_tags($str)));
    };

    // Pizarra de Tipo de Cambio
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

    // Buscador de secciones landing
    $landingList = $landing ?? [];
    $findLanding = function($corr) use ($landingList, $getVal) {
        if (empty($landingList)) return null;
        foreach ($landingList as $l) {
            if ($getVal($l, 'correlative') === $corr) return $l;
        }
        return null;
    };

    $landingInicio = $findLanding('page_home_inicio');
    $landingPasos = $findLanding('page_home_pasos');
    $landingCupones = $findLanding('page_home_cupones');
    $landingPilares = $findLanding('page_home_pilares');
    $landingBlog = $findLanding('page_home_blog');

    $coreValuesList = $core_values ?? [];
    $pasosList = $pasos ?? [];
    $cuponesList = $cupones ?? [];
    $strengthsList = $strengths ?? [];
    $postsList = $posts ?? [];
    $testimoniosList = $testimonios ?? [];
    $faqsList = $faqs ?? [];
    $bannerSliderList = $banner_slider ?? [];
    $bannerOperacion = $banner_operacion ?? null;
@endphp

<article class="bot-semantic-home max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/FinancialService">
    
    {{-- ====================================================================
         0. NAVEGACIÓN SEMÁNTICA ACCESIBLE (HTML5 nav)
       ==================================================================== --}}
    <nav aria-label="Navegación principal" class="mb-4 pb-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-sm font-medium">
        <a href="{{ url('/') }}" class="font-extrabold text-xl text-purple-800 tracking-tight flex items-center gap-2">
            <span>Cambia FX</span>
        </a>
        <div class="flex flex-wrap items-center gap-4 text-gray-700">
            <a href="{{ url('/tipo-de-cambio-hoy') }}" class="hover:text-purple-700">Tipo de Cambio</a>
            <a href="{{ url('/soles-a-dolares') }}" class="hover:text-purple-700">Soles a Dólares</a>
            <a href="{{ url('/empresas') }}" class="hover:text-purple-700">Empresas</a>
            <a href="{{ url('/nosotros') }}" class="hover:text-purple-700" title="Sobre nosotros" rel="about">Sobre nosotros</a>
            <a href="{{ url('/contacto') }}" class="hover:text-purple-700" title="Contacto">Contacto</a>
            <a href="{{ url('/blog') }}" class="hover:text-purple-700">Blog</a>
            <a href="{{ url('/faqs') }}" class="hover:text-purple-700">Preguntas Frecuentes</a>
            <a href="https://mi.cambiafx.pe/login" class="px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Iniciar Sesión</a>
        </div>
    </nav>

    {{-- ====================================================================
         0.1 MIGAS DE PAN VISIBLES (Breadcrumbs accesibles y Schema.org)
       ==================================================================== --}}
    <nav aria-label="Migas de pan" class="breadcrumbs mb-6 text-xs text-gray-700">
        <ol class="flex items-center gap-1.5 list-none p-0 m-0" itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="flex items-center gap-1.5">
                <a href="{{ url('/') }}" itemprop="item" class="text-purple-700 hover:underline">
                    <span itemprop="name">Inicio</span>
                </a>
                <meta itemprop="position" content="1" />
                <span class="text-gray-500" aria-hidden="true">/</span>
            </li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="text-gray-900 font-semibold">
                <span itemprop="name">Casa de Cambio Online en Perú</span>
                <meta itemprop="position" content="2" />
            </li>
        </ol>
    </nav>

    {{-- ====================================================================
         1. HERO & ENCABEZADO PRINCIPAL (Primeros 1,000 Tokens para IAs)
       ==================================================================== --}}
    <header class="mb-8">
        <p class="text-sm font-semibold text-purple-700 uppercase tracking-widest mb-2">
            Casa de Cambio Digital en Perú | Regulada por la SBS
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $cleanText($getVal($landingInicio, 'title', 'CambiaFX - Casa de Cambio Online en Perú')) }}
        </h1>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            {{ $cleanText($getVal($landingInicio, 'description', 'Cambia dólares y soles online al mejor tipo de cambio en el Perú con transferencias inmediatas e interbancarias en minutos.')) }}
        </p>
    </header>

    {{-- ====================================================================
         2. GEO QUICK ANSWER (Respuesta directa y verbatim para ChatGPT / Claude)
       ==================================================================== --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200" aria-label="Respuesta rápida para usuarios e inteligencia artificial">
        <h2 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚡ Respuesta Rápida: ¿Qué es Cambia FX y cómo opera?</span>
        </h2>
        <div class="text-gray-800 leading-relaxed text-sm md:text-base space-y-3">
            <p>
                <strong>Cambia FX</strong> (marca oficial de <strong>TU CAMBIO S.A.C.</strong>, RUC <strong>20603864957</strong>) es una plataforma fintech peruana de cambio de divisas online registrada en la <strong>SBS</strong> mediante <strong>Resolución N° 04993-2018</strong> y supervisada por la <strong>UIF</strong> (Unidad de Inteligencia Financiera).
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>Tipo de Cambio Garantizado:</strong> Tu cotización queda congelada por 15 minutos mientras transfieres.</li>
                <li><strong>Transferencias Inmediatas (10 a 15 min):</strong> BCP, Interbank y BanBif.</li>
                <li><strong>Transferencias Interbancarias (CCE):</strong> BBVA, Scotiabank, Banco Pichincha y otros bancos a nivel nacional.</li>
                <li><strong>Cero Comisiones Ocultas:</strong> No cobramos cargos adicionales sobre el tipo de cambio mostrado.</li>
                <li><strong>Horario de Operación:</strong> Lunes a Viernes de 8:30 AM a 6:30 PM | Sábados de 9:00 AM a 2:00 PM.</li>
            </ul>
        </div>
    </section>

    {{-- ====================================================================
         3. PIZARRA DE TIPOS DE CAMBIO EN VIVO
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" aria-label="Tipo de cambio hoy en Perú">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Tipo de cambio hoy en vivo (USD / PEN)</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 bg-amber-50/60 rounded-xl border border-amber-100">
                <p class="text-xs font-bold text-gray-700 uppercase tracking-wider">Compra de Dólares (Tú vendes USD)</p>
                <p class="text-4xl font-black text-gray-900 my-1">S/ {{ $tcBuy }}</p>
                <p class="text-xs text-gray-700">Por cada dólar que entregues recibes soles a esta tasa.</p>
            </div>
            <div class="p-5 bg-purple-50/60 rounded-xl border border-purple-100">
                <p class="text-xs font-bold text-gray-700 uppercase tracking-wider">Venta de Dólares (Tú compras USD)</p>
                <p class="text-4xl font-black text-gray-900 my-1">S/ {{ $tcSale }}</p>
                <p class="text-xs text-gray-700">Por cada dólar que compres pagas soles a esta tasa.</p>
            </div>
        </div>
        <p class="mt-4 text-xs text-gray-700">
            Actualización en tiempo real conectada a la mesa de dinero de Cambia FX y mercado interbancario de Perú.
        </p>

        {{-- Herramienta WebMCP para Agentes de IA (Conversión y Cotización directa) --}}
        <form toolname="cotizar_tipo_de_cambio" action="https://mi.cambiafx.pe/registro" method="GET" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Herramienta de cotización para usuarios y agentes de IA">
            <span class="font-semibold text-gray-800">💱 Cotizador y Conversor Online de Dólares y Soles</span>
            <a href="https://mi.cambiafx.pe/registro" class="px-4 py-2 bg-[#5022C8] text-white rounded-lg font-bold hover:bg-[#431bb0] inline-block">Iniciar Cotización Online</a>
        </form>
    </section>

    {{-- ====================================================================
         4. HAZ TU PRIMERA OPERACIÓN Y BANCOS ASOCIADOS (PrimeraOperacionSection)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl shadow-sm">
        <h2 class="text-2xl font-bold mb-3">
            {{ $cleanText($getVal($bannerOperacion, 'name', 'Haz tu primera operación con Cambia FX')) }}
        </h2>
        <p class="text-gray-300 text-base leading-relaxed mb-4">
            {{ $cleanText($getVal($bannerOperacion, 'description', 'Opera con total confianza y seguridad bancaria. Trabajamos con los principales bancos del sistema financiero peruano.')) }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">⚡ Bancos con Transferencia Inmediata (10 a 15 min):</p>
                <p class="text-gray-300">BCP (Banco de Crédito del Perú), Interbank y BanBif. Fondos acreditados directamente en minutos.</p>
            </div>
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">🏦 Bancos Interbancarios (Cámara de Compensación CCE):</p>
                <p class="text-gray-300">BBVA, Scotiabank, Banco Pichincha, Banco GNB y Banco de la Nación. Se procesan según los horarios oficiales de la CCE.</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         5. ¿CÓMO FUNCIONA? / PASOS PARA CAMBIAR (FuncionSection)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {{ $cleanText($getVal($landingPasos, 'title', '¿Cómo cambiar dólares online en Cambia FX?')) }}
        </h2>
        <p class="text-gray-600 mb-6">
            {{ $cleanText($getVal($landingPasos, 'description', 'El proceso es 100% digital, seguro y toma menos de 15 minutos en 4 simples pasos:')) }}
        </p>
        <div class="space-y-4">
            @if(!empty($pasosList) && count($pasosList) > 0)
                @foreach($pasosList as $idx => $paso)
                    <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm">
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
            @else
                <ol class="list-decimal pl-6 space-y-3 text-gray-700">
                    <li><strong>Regístrate y valida tu cuenta:</strong> Crea tu cuenta personal o empresarial gratis con tu DNI, CE o RUC.</li>
                    <li><strong>Cotiza tu cambio:</strong> Ingresa el monto en dólares o soles y congela la cotización preferencial por 15 minutos.</li>
                    <li><strong>Transfiere desde tu banco:</strong> Transfiere los fondos desde la banca móvil o web de tu banco a la cuenta de Cambia FX indicada.</li>
                    <li><strong>Recibe tu dinero:</strong> Tras validar la transferencia, Cambia FX abona el dinero cambiado en tu cuenta bancaria destino en minutos.</li>
                </ol>
            @endif
        </div>
    </section>

    {{-- ====================================================================
         6. SECCIÓN CUPONES DE DESCUENTO (CuponesSection)
       ==================================================================== --}}
    @if(!empty($cuponesList) && count($cuponesList) > 0)
    <section class="my-8 p-6 bg-purple-50 rounded-2xl border border-purple-200">
        <h2 class="text-2xl font-bold text-purple-950 mb-2">
            {{ $cleanText($getVal($landingCupones, 'title', 'Cupones de Descuento y Ahorro Extra')) }}
        </h2>
        <p class="text-sm text-purple-800 mb-4">
            {{ $cleanText($getVal($landingCupones, 'description', 'Aplica estos cupones oficiales al momento de cotizar para mejorar aún más tu tipo de cambio:')) }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @foreach($cuponesList as $cupon)
                @php
                    $code = $getVal($cupon, 'code') ?? $getVal($cupon, 'name');
                    $desc = $getVal($cupon, 'description');
                @endphp
                <div class="p-4 bg-white rounded-xl border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-mono text-xs font-extrabold uppercase px-3 py-1 bg-purple-100 text-purple-700 rounded-md">
                                CUPÓN: {{ $code }}
                            </span>
                        </div>
                        <h3 class="font-bold text-gray-900 text-base mb-1">{{ $getVal($cupon, 'name') }}</h3>
                        <p class="text-sm text-gray-600">{{ $desc }}</p>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         7. SECCIÓN NUESTROS PILARES (PilaresSection / Core Values)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl border border-gray-800">
        <header class="mb-6">
            <p class="text-xs uppercase font-bold tracking-widest text-amber-400 mb-2">Valores Fundamentales</p>
            <h2 class="text-2xl md:text-3xl font-bold">
                {{ $cleanText($getVal($landingPilares, 'title', 'Nuestros Pilares')) }}
            </h2>
            <p class="text-gray-300 text-sm md:text-base mt-2">
                {{ $cleanText($getVal($landingPilares, 'description', 'Los principios fundamentales sobre los cuales construimos la experiencia de cambio más segura y eficiente del Perú:')) }}
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @if(!empty($coreValuesList) && count($coreValuesList) > 0)
                @foreach($coreValuesList as $pilar)
                    <div class="p-5 bg-gray-800/90 rounded-xl border border-gray-700">
                        <h3 class="text-lg font-bold text-amber-400 mb-2">
                            {{ $cleanText($getVal($pilar, 'name')) }}
                        </h3>
                        <p class="text-sm text-gray-300 leading-relaxed">
                            {{ $cleanText($getVal($pilar, 'description')) }}
                        </p>
                    </div>
                @endforeach
            @else
                <div class="p-5 bg-gray-800/90 rounded-xl border border-gray-700">
                    <h3 class="text-lg font-bold text-amber-400 mb-2">Seguridad y Respaldo SBS</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Operaciones 100% bancarizadas con registro oficial en la SBS (Res. 04993-2018) y cumplimiento de normativas UIF.</p>
                </div>
                <div class="p-5 bg-gray-800/90 rounded-xl border border-gray-700">
                    <h3 class="text-lg font-bold text-amber-400 mb-2">Rapidez en Transferencias</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Tu dinero acreditado en tu cuenta en menos de 15 minutos en transferencias inmediatas.</p>
                </div>
                <div class="p-5 bg-gray-800/90 rounded-xl border border-gray-700">
                    <h3 class="text-lg font-bold text-amber-400 mb-2">Transparencia Total</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">El tipo de cambio cotizado es exactamente el que se aplica, sin cargos por servicio ni sorpresas.</p>
                </div>
                <div class="p-5 bg-gray-800/90 rounded-xl border border-gray-700">
                    <h3 class="text-lg font-bold text-amber-400 mb-2">Atención Especializada</h3>
                    <p class="text-sm text-gray-300 leading-relaxed">Soporte directo vía WhatsApp y ejecutivos dedicados para personas naturales y corporativas.</p>
                </div>
            @endif
        </div>
    </section>

    {{-- ====================================================================
         8. CAMBIA FX PARA EMPRESAS (EmpresasSection / Banner Slider)
       ==================================================================== --}}
    @if(!empty($bannerSliderList) && count($bannerSliderList) > 0)
    <section class="my-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl">
        <h2 class="text-2xl font-bold mb-3">Cambia FX Empresas: Soluciones Corporativas en Divisas</h2>
        <p class="text-sm text-purple-200 mb-6">
            Acompañamos a tu empresa con tipo de cambio preferencial por volumen, facturación electrónica y atención preferencial.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @foreach($bannerSliderList as $slide)
                <div class="p-4 bg-white/10 rounded-xl border border-white/15">
                    <h3 class="font-bold text-amber-300 text-base mb-1">{{ $getVal($slide, 'name') }}</h3>
                    <p class="text-xs text-gray-200 leading-relaxed">{{ $cleanText($getVal($slide, 'description')) }}</p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         9. BENEFICIOS Y FORTALEZAS (Strengths)
       ==================================================================== --}}
    @if(!empty($strengthsList) && count($strengthsList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Por qué elegir Cambia FX?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            @foreach($strengthsList as $st)
                <div class="p-4 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-gray-900 text-sm mb-1">{{ $getVal($st, 'name') }}</h3>
                    <p class="text-xs text-gray-600 leading-relaxed">{{ $cleanText($getVal($st, 'description')) }}</p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         10. PREGUNTAS FRECUENTES OFICIALES (FAQ) con Schema.org
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
                <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
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

    {{-- ====================================================================
         11. ARTÍCULOS RECIENTES DEL BLOG (BlogSection)
       ==================================================================== --}}
    @if(!empty($postsList) && count($postsList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">
                {{ $cleanText($getVal($landingBlog, 'title', 'Blog de Finanzas y Divisas')) }}
            </h2>
            <a href="{{ url('/blog') }}" class="text-sm font-semibold text-purple-700 hover:underline">
                Ver todos los artículos →
            </a>
        </div>
        <p class="text-sm text-gray-600 mb-6">
            {{ $cleanText($getVal($landingBlog, 'description', 'Consejos financieros, análisis del tipo de cambio del dólar en Perú y guías para tus operaciones.')) }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach(collect($postsList)->take(3) as $post)
                @php
                    $pTitle = $getVal($post, 'name') ?? $getVal($post, 'title');
                    $pSummary = $getVal($post, 'summary') ?? Str::limit(strip_tags($getVal($post, 'description', '')), 120);
                    $pSlug = $getVal($post, 'slug');
                @endphp
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-gray-900 text-sm mb-2 hover:text-purple-700">
                            <a href="{{ url('/blog/' . $pSlug) }}">{{ $pTitle }}</a>
                        </h3>
                        <p class="text-xs text-gray-600 leading-relaxed mb-3">{{ $pSummary }}</p>
                    </div>
                    <a href="{{ url('/blog/' . $pSlug) }}" class="text-xs font-bold text-purple-700 hover:underline">
                        Leer artículo completo →
                    </a>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         12. OPINIONES, TESTIMONIOS Y VALORACIONES VISIBLES (AggregateRating)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200" aria-label="Opiniones y valoraciones de clientes" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Opiniones y Reseñas de Clientes</h2>
                <p class="text-sm text-gray-600">Calificación de usuarios reales por transacciones de cambio de divisas en Perú.</p>
            </div>
            <div class="reviews-rating-badge flex items-center gap-2 p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                <span class="text-amber-500 font-bold text-xl tracking-widest" aria-label="Calificación 5 estrellas">★★★★★</span>
                <span class="font-extrabold text-gray-900 text-lg"><span itemprop="ratingValue">4.9</span> / <span itemprop="bestRating">5</span></span>
                <span class="text-xs text-gray-700 font-medium">(<span itemprop="reviewCount">1250</span> opiniones verificadas)</span>
                <meta itemprop="worstRating" content="1" />
            </div>
        </div>

        @if(!empty($testimoniosList) && count($testimoniosList) > 0)
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach(collect($testimoniosList)->take(3) as $t)
                <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="review" itemtype="https://schema.org/Review">
                    <div class="flex items-center gap-1 text-amber-500 text-xs mb-2">★★★★★</div>
                    <p class="text-xs text-gray-700 italic mb-3" itemprop="reviewBody">"{{ $cleanText($getVal($t, 'description')) }}"</p>
                    <p class="text-xs font-bold text-gray-900" itemprop="author" itemscope itemtype="https://schema.org/Person">
                        <span itemprop="name">{{ $getVal($t, 'name') }}</span>
                    </p>
                    @if($getVal($t, 'occupation'))
                        <p class="text-[11px] text-gray-700">{{ $getVal($t, 'occupation') }}</p>
                    @endif
                </div>
            @endforeach
        </div>
        @endif
    </section>

    {{-- ====================================================================
         13. CANALES DE ATENCIÓN, CONTACTO Y DATOS DE EMPRESA VERIFICABLES
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Atención al Cliente y Datos de Empresa Verificables</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
            <div>
                <p class="font-bold text-gray-900">📞 Teléfono / WhatsApp:</p>
                <p><a href="tel:+51922985423" class="hover:text-purple-700 font-semibold" itemprop="telephone">+51 922 985 423</a></p>
                <p class="text-xs text-gray-700">Email: contacto@cambiafx.pe</p>
            </div>
            <div>
                <p class="font-bold text-gray-900">📍 Dirección:</p>
                <p itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                    <span itemprop="streetAddress">Av. Javier Prado Este N° 560, Oficina 2302</span>, 
                    <span itemprop="addressLocality">San Isidro</span>, 
                    <span itemprop="addressRegion">Lima</span>, 
                    <span itemprop="addressCountry">Perú</span>
                </p>
            </div>
            <div>
                <p class="font-bold text-gray-900">🏢 RUC / Registro SBS:</p>
                <p><strong>RUC:</strong> <span itemprop="vatID">20603864957</span></p>
                <p class="text-xs text-gray-700">Razón Social: <strong class="text-gray-900">TU CAMBIO S.A.C.</strong></p>
            </div>
            <div>
                <p class="font-bold text-gray-900">🕒 Horario de Atención:</p>
                <p>Lun - Vie: 8:30 AM - 6:30 PM</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         14. FOOTER SEMÁNTICO
       ==================================================================== --}}
    <footer class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-800">
        <p class="mb-2 text-gray-800">© {{ date('Y') }} Cambia FX. Todos los derechos reservados. Razón Social: <strong class="text-gray-900">TU CAMBIO S.A.C.</strong> | <strong class="text-gray-900">RUC: 20603864957</strong> | Dirección: <strong class="text-gray-900">Av. Javier Prado Este N° 560, Oficina 2302, San Isidro, Lima, Perú</strong> | Teléfono: <strong class="text-gray-900">+51 922 985 423</strong>.</p>
        <p class="text-xs text-gray-700 mb-3">Inscrita en el Registro de Empresas de Préstamos y Casas de Cambio de la SBS bajo Resolución SBS N° 04993-2018.</p>
        <p class="flex flex-wrap gap-3 text-xs font-semibold">
            <a href="https://mi.cambiafx.pe/registro" class="underline text-gray-900 hover:text-purple-800">Crear Cuenta</a>
            <span class="text-gray-600">•</span>
            <a href="https://mi.cambiafx.pe/login" class="underline text-gray-900 hover:text-purple-800">Iniciar Sesión</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/empresas') }}" class="underline text-gray-900 hover:text-purple-800">CambiaFX Empresas</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/sobre-nosotros') }}" class="underline text-gray-900 hover:text-purple-800" title="Sobre nosotros" rel="about">Sobre nosotros</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/contacto') }}" class="underline text-gray-900 hover:text-purple-800">Contacto</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/faqs') }}" class="underline text-gray-900 hover:text-purple-800">Preguntas Frecuentes</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/blog') }}" class="underline text-gray-900 hover:text-purple-800">Blog</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/libro-de-reclamaciones') }}" class="underline text-gray-900 hover:text-purple-800">Libro de Reclamaciones</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/legal/terminos-y-condiciones') }}" class="underline text-gray-900 hover:text-purple-800">Aviso Legal y Términos</a>
            <span class="text-gray-600">•</span>
            <a href="{{ url('/legal/politicas-de-privacidad') }}" class="underline text-gray-900 hover:text-purple-800">Privacidad y Cookies</a>
        </p>
    </footer>
</article>
