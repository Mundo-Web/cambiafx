@php
    $tcBuy = '3.450';
    $tcSale = '3.475';
    if (!empty($initialRates) && is_array($initialRates) && isset($initialRates[0])) {
        $first = $initialRates[0];
        if (isset($first['tcBuy'])) {
            $tcBuy = number_format((float)$first['tcBuy'], 3);
        }
        if (isset($first['tcSale'])) {
            $tcSale = number_format((float)$first['tcSale'], 3);
        }
    }
@endphp

<article class="bot-semantic-home max-w-5xl mx-auto px-4 py-8 text-gray-900" itemscope itemtype="https://schema.org/FinancialService">
    <header class="mb-8">
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-4" itemprop="name">
            CambiaFX - Casa de Cambio Online en Perú
        </h1>
        <p class="text-xl text-gray-700 max-w-2xl" itemprop="description">
            Cambia dólares y soles online al mejor tipo de cambio en el Perú con transferencias inmediatas e interbancarias en minutos.
        </p>
    </header>

    <!-- Pizarra de Tipos de Cambio en Vivo -->
    <section class="my-8 p-6 bg-[#FAF3E1] rounded-2xl border border-gray-200" aria-label="Tipo de cambio hoy en Perú">
        <h2 class="text-2xl font-bold mb-4">Tipo de cambio hoy en Perú</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 bg-white rounded-xl shadow-sm">
                <p class="text-sm font-semibold text-gray-500 uppercase">Compra de Dólares</p>
                <p class="text-3xl font-extrabold text-gray-900">S/ {{ $tcBuy }}</p>
                <p class="text-xs text-gray-500 mt-1">Tú vendes dólares y recibes soles</p>
            </div>
            <div class="p-4 bg-white rounded-xl shadow-sm">
                <p class="text-sm font-semibold text-gray-500 uppercase">Venta de Dólares</p>
                <p class="text-3xl font-extrabold text-gray-900">S/ {{ $tcSale }}</p>
                <p class="text-xs text-gray-500 mt-1">Tú compras dólares pagando soles</p>
            </div>
        </div>
        <p class="mt-4 text-sm text-gray-600">
            Actualizado en tiempo real. Sin comisiones ocultas.
        </p>
    </section>

    <!-- Información Legal y Regulatoria SBS -->
    <section class="my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <h2 class="text-xl font-bold mb-2">Entidad Registrada y Regulada en la SBS</h2>
        <p class="text-gray-700 leading-relaxed">
            Cambia FX es una marca operada por <strong>TU CAMBIO S.A.C.</strong>, empresa legalmente constituida en el Perú y registrada en la Superintendencia de Banca, Seguros y AFP (SBS) bajo la <strong>Resolución SBS N° 04993-2018</strong>. Cumplimos con todas las normativas de la Unidad de Inteligencia Financiera (UIF).
        </p>
    </section>

    <!-- Pasos para cambiar -->
    <section class="my-8">
        <h2 class="text-2xl font-bold mb-4">¿Cómo cambiar dólares online en Cambia FX?</h2>
        <ol class="list-decimal pl-6 space-y-2 text-gray-700">
            <li><strong>Cotiza tu operación:</strong> Ingresa el monto a cambiar y obtén el tipo de cambio preferencial garantizado por 15 minutos.</li>
            <li><strong>Transfiere el dinero:</strong> Realiza la transferencia desde la app o banca por internet de tu banco (BCP, Interbank, BBVA, etc.) a las cuentas indicadas.</li>
            <li><strong>Recibe tus fondos:</strong> En menos de 10 a 15 minutos recibirás el cambio en tu cuenta de destino.</li>
        </ol>
    </section>

    <!-- Preguntas Frecuentes -->
    @if(!empty($faqs) && count($faqs) > 0)
    <section class="my-8">
        <h2 class="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
        <div class="space-y-4">
            @foreach($faqs as $faq)
            <div class="p-4 bg-gray-50 rounded-xl">
                <h3 class="font-bold text-lg text-gray-900">{{ $faq->name ?? $faq['name'] }}</h3>
                <p class="text-gray-700 mt-2">{{ $faq->description ?? $faq['description'] }}</p>
            </div>
            @endforeach
        </div>
    </section>
    @endif

    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>© {{ date('Y') }} Cambia FX. Todos los derechos reservados. RUC: 20603886566.</p>
        <p><a href="https://mi.cambiafx.pe/registro" class="underline font-semibold">Crear una cuenta</a> | <a href="https://mi.cambiafx.pe/login" class="underline font-semibold">Iniciar Sesión</a></p>
    </footer>
</article>
