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

    $strengthsList = $strengths ?? [];
    $pasosList = $pasos ?? [];
    $faqsList = $faqs ?? [];
    $testimoniosList = $testimonios ?? [];
@endphp

<article class="bot-semantic-empresa max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/FinancialService">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">CambiaFX Empresas</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Soluciones Corporativas en Divisas | SBS Res. 04993-2018
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            Cambia FX Empresas: Tipo de Cambio Preferencial y Gestión Corporativa
        </h1>
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            Plataforma digital especializada en compra y venta de dólares para micro, pequeñas, medianas y grandes empresas en el Perú con facturación electrónica y atención preferencial.
        </p>
    </header>

    {{-- GEO Quick Answer para Empresas --}}
    <section class="quick-answer my-6 p-6 bg-[#FAF3E1] border-l-4 border-amber-500 rounded-r-2xl border border-amber-200">
        <h2 class="text-lg font-bold text-gray-900 mb-2">
            ⚡ Resumen del Servicio Cambia FX para Empresas
        </h2>
        <div class="text-sm md:text-base text-gray-800 space-y-2">
            <p>
                <strong>Cambia FX Empresas</strong> ofrece a personas jurídicas en Perú tipos de cambio preferenciales por volumen, cuentas multidivisa, facturas con valor tributario ante SUNAT y un ejecutivo de cuenta asignado para agilizar pagos a proveedores, importaciones y tesorería.
            </p>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700">
                <li><strong>Cotizaciones por Volumen:</strong> Tasas de cambio más competitivas para montos corporativos.</li>
                <li><strong>Comprobante Fiscal:</strong> Emisión automática de boleta o factura electrónica SUNAT.</li>
                <li><strong>Seguridad SBS y PLAFT:</strong> Cumplimiento riguroso de normativas anti-lavado de activos.</li>
                <li><strong>Múltiples Bancos:</strong> BCP, Interbank, BBVA, Scotiabank, BanBif y Banco Pichincha.</li>
            </ul>
        </div>
    </section>

    {{-- Beneficios Corporativos --}}
    @if(!empty($strengthsList) && count($strengthsList) > 0)
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Beneficios Corporativos Exclusivos</h2>
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

    {{-- Pasos para Operar como Empresa --}}
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Cómo registrar tu empresa y empezar a cambiar?</h2>
        <ol class="list-decimal pl-6 space-y-3 text-gray-700 text-sm md:text-base">
            <li><strong>Crea la cuenta de tu empresa:</strong> Regístrate con el RUC 20 de tu empresa y los datos del representante legal o apoderado.</li>
            <li><strong>Validación de datos:</strong> Nuestro equipo de cumplimiento valida la ficha RUC y vigencia de poder en minutos.</li>
            <li><strong>Cotiza montos corporativos:</strong> Accede a la mesa de cambio con cotizaciones preferenciales en tiempo real.</li>
            <li><strong>Transfiere y recibe con factura:</strong> Transfiere desde las cuentas bancarias de la empresa y recibe los fondos con tu comprobante electrónico.</li>
        </ol>
    </section>

    {{-- Footer Corporativo --}}
    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>© {{ date('Y') }} Cambia FX. Marca operada por TU CAMBIO S.A.C. (RUC 20603864957). Regulada por la SBS (Res. 04993-2018).</p>
        <p class="mt-2"><a href="https://mi.cambiafx.pe/registro" class="underline font-semibold text-purple-700">Registrar Empresa en Cambia FX</a></p>
    </footer>
</article>
