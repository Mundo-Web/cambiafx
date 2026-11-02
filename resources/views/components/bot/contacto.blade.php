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

    $sedesList = $sedes ?? [];
    $faqsList = $faqs ?? [];
@endphp

<article class="bot-semantic-contacto max-w-5xl mx-auto px-4 py-8 text-gray-900 font-sans" itemscope itemtype="https://schema.org/ContactPage">
    <header class="mb-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-500">
            <ol class="flex items-center gap-2">
                <li><a href="{{ url('/') }}" class="hover:underline">Inicio</a></li>
                <li>/</li>
                <li><span class="text-gray-800 font-semibold">Contacto</span></li>
            </ol>
        </nav>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Atención al Cliente y Soporte Oficial
        </p>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" itemprop="name">
            Contacto Cambia FX: Canales de Atención, Horarios y Ubicación
        </h1>
        <p class="text-lg text-gray-700 max-w-3xl leading-relaxed" itemprop="description">
            Estamos a tu disposición para ayudarte con tus operaciones de cambio de dólares, soporte de transferencias, consultas empresariales o dudas sobre el servicio.
        </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Canales Digitales</h2>
            <ul class="space-y-3 text-sm text-gray-700">
                <li><strong>WhatsApp Oficial:</strong> +51 922 985 423</li>
                <li><strong>Correo de Soporte:</strong> hola@cambiafx.pe</li>
                <li><strong>Plataforma Web:</strong> <a href="https://cambiafx.pe" class="text-purple-700 underline">https://cambiafx.pe</a></li>
            </ul>
        </div>

        <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Horarios y Ubicación</h2>
            <ul class="space-y-3 text-sm text-gray-700">
                <li><strong>Lunes a Viernes:</strong> 8:30 AM a 6:30 PM</li>
                <li><strong>Sábados:</strong> 9:00 AM a 2:00 PM</li>
                <li><strong>Domingos y Feriados:</strong> Cerrado para transferencias en vivo</li>
                <li><strong>Dirección:</strong> Av. Javier Prado Este N° 560, Oficina 2302, San Isidro, Lima, Perú</li>
            </ul>
        </div>
    </div>

    @if(!empty($faqsList) && count($faqsList) > 0)
    <section class="my-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Preguntas Frecuentes de Contacto</h2>
        <div class="space-y-4">
            @foreach(collect($faqsList)->take(5) as $faq)
                <div class="p-4 bg-gray-50 rounded-xl">
                    <h3 class="font-bold text-sm text-gray-900 mb-1">{{ $getVal($faq, 'name') }}</h3>
                    <p class="text-xs text-gray-600 leading-relaxed">{{ $clean($getVal($faq, 'description')) }}</p>
                </div>
            @endforeach
        </div>
    </section>
    @endif

    <footer class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>© {{ date('Y') }} Cambia FX. TU CAMBIO S.A.C. (RUC 20603864957). Res. SBS N° 04993-2018.</p>
    </footer>
</article>
