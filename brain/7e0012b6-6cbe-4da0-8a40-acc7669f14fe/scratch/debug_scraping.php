<?php
$url = "https://cuantoestaeldolar.pe/";
$html = file_get_contents($url);

if (!$html) {
    echo "Error al leer la URL";
    exit;
}

// Limpiar el HTML un poco para facilitar el regex (quitar espacios extra y saltos de línea)
$cleanHtml = preg_replace('/\s+/', ' ', $html);

$rates = [];

// 1. Buscar SUNAT: Buscamos la palabra SUNAT y luego los dos siguientes números X.XXX
if (preg_match('/SUNAT.*?(\d\.\d{3}).*?(\d\.\d{3})/i', $cleanHtml, $matches)) {
    $rates['SUNAT'] = [
        'buy' => $matches[1],
        'sell' => $matches[2]
    ];
}

// 2. Buscar Paralelo: Buscamos la palabra Paralelo y luego los dos siguientes números X.XXX
if (preg_match('/Paralelo.*?(\d\.\d{3}).*?(\d\.\d{3})/i', $cleanHtml, $matches)) {
    $rates['Paralelo'] = [
        'buy' => $matches[1],
        'sell' => $matches[2]
    ];
}

echo "RESULTADOS DEL SCRAPING PRECISO:\n";
print_r($rates);
