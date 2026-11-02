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

    $landingHero = $findLanding('page_empresas_hero');
    $landingPasos = $findLanding('page_empresas_pasos');
    $landingBeneficios = $findLanding('page_empresas_beneficios');
    $landingContacto = $findLanding('page_empresas_contacto');

    // Listas de datos
    $indicatorsList = $indicators ?? [];
    $beneficiosList = $beneficios ?? [];
    $pasosList = $pasos ?? [];
    $bannerOperacion = $banner ?? null;
    $bannerCorp = $bannerEmpresas ?? null;
    $brandsList = $brands ?? [];
    $strengthsList = $strengths ?? [];
    $faqsList = $faqs ?? [];
    $testimoniosList = $testimonios ?? [];
    $postsList = $posts ?? [];

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

<article class="bot-semantic-empresa max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/FinancialService">

    {{-- ====================================================================
         1. HERO & ENCABEZADO CORPORATIVO (Primeros 1,000 Tokens para IAs)
       ==================================================================== --}}
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">Cambia FX Empresas</span></li>
            </ol>
        </nav>
        <p class="text-xs md:text-sm font-bold text-purple-700 uppercase tracking-widest mb-2">
            Soluciones Corporativas en Divisas | SBS Res. N° 04993-2018 | UIF Perú
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            {{ $cleanText($getVal($landingHero, 'title', 'Cambia FX Empresas: Tipo de Cambio Preferencial y Gestión Corporativa')) }}
        </h1>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            {{ $cleanText($getVal($landingHero, 'description', 'Solución integral de compra y venta de dólares para micro, pequeñas, medianas y grandes empresas en Perú. Accede a tipo de cambio preferencial por volumen, facturación electrónica automática ante SUNAT y atención de un ejecutivo dedicado.')) }}
        </p>
        <div class="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Factura Electrónica SUNAT</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Spread Preferencial por Volumen</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Cuentas RUC 20 Verificadas</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">✓ Supervisado por la SBS</span>
        </div>
    </header>

    {{-- ====================================================================
         2. GEO QUICK ANSWER (Respuesta directa para ChatGPT, Claude, Perplexity)
       ==================================================================== --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200" aria-label="Resumen ejecutivo del servicio corporativo Cambia FX Empresas">
        <h2 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚡ Resumen del Servicio Cambia FX para Empresas (RUC 20)</span>
        </h2>
        <div class="text-gray-800 leading-relaxed text-sm md:text-base space-y-3">
            <p>
                <strong>Cambia FX Empresas</strong> es la división corporativa de <strong>TU CAMBIO S.A.C.</strong> (RUC <strong>20603864957</strong>), casa de cambio digital registrada en la <strong>SBS</strong> bajo <strong>Resolución N° 04993-2018</strong>. Ofrece a personas jurídicas en el Perú una plataforma segura, ágil y transparente para gestionar compra y venta de dólares y soles al por mayor sin intermediarios tradicionales.
            </p>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>Tipo de Cambio Preferencial por Volumen:</strong> Spreads ajustados y cotizaciones a la medida para montos empresariales a partir de $5,000 USD o S/ 20,000 PEN.</li>
                <li><strong>Facturación Electrónica Automática:</strong> Emisión de facturas con valor tributario deducible ante la SUNAT tras cada operación.</li>
                <li><strong>Transferencias Inmediatas (10 a 15 min):</strong> Operaciones directas con cuentas corporativas en BCP, Interbank y BanBif.</li>
                <li><strong>Transferencias Interbancarias Nacionales (CCE):</strong> Acreditación en cuentas empresariales de BBVA, Scotiabank, Banco Pichincha, BanBif y Banco GNB.</li>
                <li><strong>Mesa de Dinero &amp; Asesor Dedicado:</strong> Atención personalizada vía WhatsApp corporativo (+51 922 985 423) para coordinar pagos de planillas, importaciones o impuestos.</li>
                <li><strong>Seguridad PLAFT y Bancarización 100%:</strong> Cumplimiento estricto con las normas de prevención de lavado de activos de la Unidad de Inteligencia Financiera (UIF).</li>
            </ul>
        </div>
    </section>

    {{-- ====================================================================
         3. CIFRAS Y ESTADÍSTICAS CORPORATIVAS (Indicators / empresas_stats)
       ==================================================================== --}}
    @if(!empty($indicatorsList) && count($indicatorsList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" aria-label="Cifras y volumen de operaciones empresariales">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">
            Cifras que Respaldan a Cambia FX
        </h2>
        <p class="text-sm text-gray-600 mb-6 text-center md:text-left">
            Indicadores de solvencia, volumen de transacciones y confianza del sector empresarial peruano:
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            @foreach($indicatorsList as $ind)
                @php
                    $indNum = $cleanText($getVal($ind, 'name'));
                    $indDesc = $cleanText($getVal($ind, 'description'));
                @endphp
                <div class="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 flex flex-col justify-center">
                    <p class="text-2xl lg:text-3xl font-black text-purple-700 mb-1">{{ $indNum }}</p>
                    <p class="text-xs text-gray-600 font-medium leading-snug">{{ $indDesc }}</p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         4. PIZARRA DE TIPO DE CAMBIO EN VIVO (USD / PEN)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" aria-label="Tipo de cambio corporativo hoy en Perú">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Tipo de Cambio Hoy en Vivo (USD / PEN)</h2>
                <p class="text-xs text-gray-500 mt-1">Conectado a la mesa de divisas interbancaria de Cambia FX.</p>
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
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Compra Corporativa (Tu Empresa Vende USD)</p>
                <p class="text-4xl font-black text-gray-900 my-1">S/ {{ $tcBuy }}</p>
                <p class="text-xs text-gray-600">Por cada dólar que transfiera tu empresa recibes soles a esta tasa preferencial.</p>
            </div>
            <div class="p-5 bg-purple-50/70 rounded-xl border border-purple-200">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Venta Corporativa (Tu Empresa Compra USD)</p>
                <p class="text-4xl font-black text-gray-900 my-1">S/ {{ $tcSale }}</p>
                <p class="text-xs text-gray-600">Por cada dólar que requiera tu empresa pagas soles a esta tasa preferencial.</p>
            </div>
        </div>
        <p class="mt-4 text-xs text-gray-500">
            * Para operaciones corporativas mayores a $10,000 USD o S/ 40,000 PEN, comunícate con la mesa de dinero para cotizar spreads reducidos en tiempo real.
        </p>
    </section>

    {{-- ====================================================================
         5. PRIMERA OPERACIÓN EMPRESARIAL Y BANCOS ASOCIADOS (PrimeraOperacionSection)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl shadow-sm">
        <h2 class="text-2xl font-bold mb-3">
            {{ $cleanText($getVal($bannerOperacion, 'name', 'Haz tu primera operación con Cambia FX y optimiza tu tesorería')) }}
        </h2>
        <p class="text-gray-300 text-base leading-relaxed mb-4">
            {{ $cleanText($getVal($bannerOperacion, 'description', 'Opera con total confianza y seguridad bancaria. Conectamos directamente con los principales bancos del sistema financiero del Perú para transferir en minutos.')) }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">⚡ Transferencias Inmediatas (10 a 15 min):</p>
                <p class="text-gray-300">BCP (Banco de Crédito del Perú), Interbank y BanBif. Acreditación directa en cuentas corporativas de tu empresa.</p>
            </div>
            <div class="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
                <p class="font-bold text-amber-400 mb-1">🏦 Transferencias Interbancarias (Cámara CCE):</p>
                <p class="text-gray-300">BBVA, Scotiabank, Banco Pichincha, BanBif, Banco GNB y Banco de la Nación. Se liquidan el mismo día dentro de los horarios de compensación interbancaria.</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         6. ¿CÓMO FUNCIONA PARA EMPRESAS? (page_empresas_pasos + Specialty)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {{ $cleanText($getVal($landingPasos, 'title', '¿Cómo funciona Cambia FX Empresas?')) }}
        </h2>
        <p class="text-gray-600 mb-6">
            {{ $cleanText($getVal($landingPasos, 'description', 'El proceso de cambio corporativo es 100% digital, seguro y toma menos de 15 minutos en 4 sencillos pasos:')) }}
        </p>
        <div class="space-y-4">
            @if(!empty($pasosList) && count($pasosList) > 0)
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
            @else
                <ol class="list-decimal pl-6 space-y-3 text-gray-700 text-sm md:text-base">
                    <li><strong>Registra la cuenta corporativa:</strong> Crea la cuenta con el RUC 20 de tu empresa, adjunta la ficha RUC y los datos del representante legal o apoderado autorizado.</li>
                    <li><strong>Cotiza montos empresariales:</strong> Ingresa el importe en dólares o soles y congela la cotización preferencial en tiempo real por 15 minutos.</li>
                    <li><strong>Transfiere desde las cuentas de tu empresa:</strong> Realiza la transferencia bancaria desde la banca móvil o banca empresas de tu banco local.</li>
                    <li><strong>Recibe las divisas con Factura Electrónica:</strong> Validamos la operación y abonamos los fondos en la cuenta destino de tu empresa, emitiendo tu factura electrónica automáticamente.</li>
                </ol>
            @endif
        </div>
    </section>

    {{-- ====================================================================
         7. BANNER CORPORATIVO (BannerFxEmpresas / cambia_empresas)
       ==================================================================== --}}
    @if(!empty($bannerCorp))
    <section class="my-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl shadow-sm">
        <p class="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Plataforma Especializada</p>
        <h2 class="text-2xl md:text-3xl font-bold mb-3">
            {{ $cleanText($getVal($bannerCorp, 'name', 'Cambia FX Empresas: Aliado Estratégico de tu Negocio')) }}
        </h2>
        <p class="text-purple-200 text-base leading-relaxed mb-6 max-w-2xl">
            {{ $cleanText($getVal($bannerCorp, 'description', 'Mejora la rentabilidad de tus operaciones cambiarias con la seguridad, rapidez y transparencia que tu empresa necesita.')) }}
        </p>
        <div class="flex flex-wrap items-center gap-4">
            <a href="https://mi.cambiafx.pe/registro" class="px-6 py-3 bg-[#BCFF52] text-gray-900 font-bold rounded-xl text-sm hover:bg-[#a8f233] transition-colors">
                {{ $cleanText($getVal($bannerCorp, 'button_text', 'Registrar Empresa Ahora')) }}
            </a>
            <a href="https://wa.me/51922985423?text=Hola,%20deseo%20informaci%C3%B3n%20sobre%20el%20tipo%20de%20cambio%20corporativo%20para%20mi%20empresa" target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-colors">
                Contactar Asesor por WhatsApp
            </a>
        </div>
    </section>
    @endif

    {{-- ====================================================================
         8. BENEFICIOS EXCLUSIVOS PARA EMPRESAS (page_empresas_beneficios + Benefit)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {{ $cleanText($getVal($landingBeneficios, 'title', 'Las Empresas Cambian Dólares con Cambia FX para:')) }}
        </h2>
        <p class="text-gray-600 mb-6">
            {{ $cleanText($getVal($landingBeneficios, 'description', 'Aprovecha nuestro tipo de cambio competitivo y asesoría personalizada para maximizar el rendimiento del capital de trabajo de tu empresa.')) }}
        </p>

        @if(!empty($beneficiosList) && count($beneficiosList) > 0)
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            @foreach($beneficiosList as $ben)
                <div class="p-5 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-gray-900 text-base mb-2">
                            {{ $cleanText($getVal($ben, 'name')) }}
                        </h3>
                        @if($getVal($ben, 'description'))
                            <p class="text-xs text-gray-600 leading-relaxed">
                                {{ $cleanText($getVal($ben, 'description')) }}
                            </p>
                        @endif
                    </div>
                    <div class="mt-3 text-xs font-semibold text-purple-700">
                        ✓ Gestión optimizada
                    </div>
                </div>
            @endforeach
        </div>
        @else
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-5 bg-purple-50/50 rounded-xl border border-purple-100">
                <h3 class="font-bold text-gray-900 text-base mb-2">Pago de Planilla en Dólares o Soles</h3>
                <p class="text-xs text-gray-600 leading-relaxed">Convierte divisas en el momento oportuno para abonar sueldos y beneficios laborales a tiempo sin perder por comisiones bancarias.</p>
            </div>
            <div class="p-5 bg-purple-50/50 rounded-xl border border-purple-100">
                <h3 class="font-bold text-gray-900 text-base mb-2">Pago de Impuestos y Tributos SUNAT</h3>
                <p class="text-xs text-gray-600 leading-relaxed">Mantén tus obligaciones fiscales al día cambiando a soles al mejor tipo de cambio del mercado interbancario.</p>
            </div>
            <div class="p-5 bg-purple-50/50 rounded-xl border border-purple-100">
                <h3 class="font-bold text-gray-900 text-base mb-2">Pago a Proveedores e Importaciones</h3>
                <p class="text-xs text-gray-600 leading-relaxed">Compra dólares para pagar facturas del exterior o insumos locales asegurando la tasa más conveniente.</p>
            </div>
        </div>
        @endif

        {{-- Fortalezas adicionales si existen --}}
        @if(!empty($strengthsList) && count($strengthsList) > 0)
        <div class="pt-6 border-t border-gray-100">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Fortalezas Institucionales</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($strengthsList as $st)
                    <div class="p-4 bg-gray-50 rounded-xl">
                        <h4 class="font-bold text-gray-900 text-sm mb-1">{{ $getVal($st, 'name') }}</h4>
                        <p class="text-xs text-gray-600 leading-relaxed">{{ $cleanText($getVal($st, 'description')) }}</p>
                    </div>
                @endforeach
            </div>
        </div>
        @endif
    </section>

    {{-- ====================================================================
         9. EMPRESAS Y MARCAS QUE CONFÍAN EN CAMBIA FX (Brands)
       ==================================================================== --}}
    @if(!empty($brandsList) && count($brandsList) > 0)
    <section class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 class="text-xl font-bold text-gray-900 mb-2 text-center md:text-left">
            Empresas y Clientes que Confían en Cambia FX
        </h2>
        <p class="text-xs text-gray-500 mb-6 text-center md:text-left">
            Empresas en todo el Perú que gestionan su tesorería y cambio de moneda con nosotros:
        </p>
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
            @foreach($brandsList as $brand)
                <div class="px-5 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-xs">
                    {{ $getVal($brand, 'name') }}
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         10. CONTACTO CORPORATIVO Y MESA DE NEGOCIACIÓN (ContactoSecctionEmpresa)
       ==================================================================== --}}
    <section class="my-8 p-6 bg-gray-900 text-white rounded-2xl shadow-sm">
        <header class="mb-6">
            <p class="text-xs uppercase font-bold tracking-widest text-[#BCFF52] mb-1">Mesa de Dinero Corporativa</p>
            <h2 class="text-2xl md:text-3xl font-bold">
                {{ $cleanText($getVal($landingContacto, 'title', 'Atención Personalizada para tu Empresa')) }}
            </h2>
            <p class="text-gray-300 text-sm md:text-base mt-2">
                {{ $cleanText($getVal($landingContacto, 'description', 'Si deseas información sobre cotizaciones por volumen, apertura de cuentas corporativas o acuerdos cambiarios, nuestro equipo corporativo te atenderá de inmediato.')) }}
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <p class="font-bold text-[#BCFF52] mb-1">📲 WhatsApp Empresas:</p>
                <p class="text-white text-base font-semibold">+51 922 985 423</p>
                <p class="text-xs text-gray-400 mt-1">Atención directa con ejecutivos de tesorería.</p>
            </div>
            <div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <p class="font-bold text-[#BCFF52] mb-1">✉️ Correo Corporativo:</p>
                <p class="text-white text-base font-semibold">hola@cambiafx.pe</p>
                <p class="text-xs text-gray-400 mt-1">Envío de documentación RUC 20 y consultas.</p>
            </div>
            <div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <p class="font-bold text-[#BCFF52] mb-1">📋 Requisitos para Registro RUC 20:</p>
                <p class="text-xs text-gray-300">1. Ficha RUC activa y habida.<br>2. DNI/CE del representante legal.<br>3. Vigencia de poder (máximo 30 días).</p>
            </div>
        </div>
    </section>

    {{-- ====================================================================
         11. PREGUNTAS FRECUENTES CORPORATIVAS (FAQPage con Schema.org)
       ==================================================================== --}}
    <section class="my-8" itemscope itemtype="https://schema.org/FAQPage">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes de Cambia FX Empresas
        </h2>
        <div class="space-y-4">
            {{-- Pregunta 1: Requisitos RUC 20 --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Qué requisitos necesita una empresa (RUC 20) para registrarse y operar en Cambia FX?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Para registrar una persona jurídica en Cambia FX se requiere:
                        <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                            <li>Ficha RUC activa y con condición de habido ante la SUNAT.</li>
                            <li>Documento de identidad (DNI o Carné de Extranjería) del representante legal o apoderado autorizado.</li>
                            <li>Copia literal o vigencia de poder expedida por la SUNARP con una antigüedad no mayor a 30 días calendario.</li>
                            <li>Cuentas bancarias en soles y dólares a nombre de la razón social de la empresa en bancos peruanos autorizados.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {{-- Pregunta 2: Facturación electrónica --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Cambia FX emite factura electrónica deducible para SUNAT?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Sí. Por cada operación de cambio de moneda completada por tu empresa, Cambia FX emite de forma automática una <strong>Factura Electrónica</strong> autorizada por la SUNAT con valor fiscal y tributario, la cual se envía al correo registrado de la empresa y queda archivada en tu panel corporativo para auditorías y contabilidad.
                    </div>
                </div>
            </div>

            {{-- Pregunta 3: Spreads preferenciales por volumen --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Ofrecen tipo de cambio preferencial por volumen para transacciones corporativas?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Sí. Cambia FX ofrece tarifas y spreads preferenciales para operaciones a partir de $5,000 USD o S/ 20,000 PEN. A mayor volumen de cambio mensual o por operación, nuestros ejecutivos de la mesa de divisas brindan cotizaciones personalizadas más competitivas que los bancos tradicionales.
                    </div>
                </div>
            </div>

            {{-- Pregunta 4: Tiempos de transferencia --}}
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 class="font-bold text-base md:text-lg text-gray-900 mb-2" itemprop="name">
                    ¿Cuánto tiempo demora la acreditación del dinero en las cuentas bancarias de la empresa?
                </h3>
                <div class="text-sm text-gray-700 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        Para transferencias inmediatas con cuentas en <strong>BCP, Interbank y BanBif</strong>, el dinero se acredita en aproximadamente <strong>10 a 15 minutos</strong> tras verificar el comprobante. Para transferencias interbancarias (BBVA, Scotiabank, Banco Pichincha u otros), los fondos se transfieren mediante la Cámara de Compensación Electrónica (CCE) y se acreditan el mismo día según los horarios oficiales de compensación.
                    </div>
                </div>
            </div>

            {{-- Preguntas dinámicas del sistema --}}
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
         12. TESTIMONIOS CORPORATIVOS (Testimonios)
       ==================================================================== --}}
    @if(!empty($testimoniosList) && count($testimoniosList) > 0)
    <section class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Experiencias de Clientes y Empresas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach(collect($testimoniosList)->take(3) as $t)
                <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
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
         13. ARTÍCULOS RECOMENDADOS DEL BLOG (Finanzas para Empresas)
       ==================================================================== --}}
    @if(!empty($postsList) && count($postsList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">Guías y Artículos de Finanzas Corporativas</h2>
            <a href="{{ url('/blog') }}" class="text-xs font-bold text-purple-700 hover:underline">Ver Blog →</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach(collect($postsList)->take(3) as $post)
                @php
                    $pTitle = $getVal($post, 'name') ?? $getVal($post, 'title');
                    $pSummary = $getVal($post, 'summary') ?? Str::limit(strip_tags($getVal($post, 'description', '')), 110);
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
                        Leer artículo →
                    </a>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    {{-- ====================================================================
         14. FOOTER CORPORATIVO Y CUMPLIMIENTO SBS
       ==================================================================== --}}
    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p class="mb-2">
            © {{ date('Y') }} Cambia FX Empresas. Marca operada legalmente por <strong>TU CAMBIO S.A.C.</strong> con RUC <strong>20603864957</strong>.
        </p>
        <p class="text-xs text-gray-500 mb-3">
            Inscrita en el Registro de Empresas y Personas que efectúan Operaciones Financieras y de Cambio de Moneda de la Superintendencia de Banca, Seguros y AFP (SBS) mediante <strong>Resolución SBS N° 04993-2018</strong>. Supervisada en prevención de lavado de activos por la UIF Perú.
        </p>
        <p class="flex flex-wrap gap-3 text-xs font-semibold text-gray-700">
            <a href="https://mi.cambiafx.pe/registro" class="underline">Crear Cuenta Empresa</a>
            <span>•</span>
            <a href="https://mi.cambiafx.pe/login" class="underline">Iniciar Sesión</a>
            <span>•</span>
            <a href="{{ url('/') }}" class="underline">CambiaFX Personas</a>
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
