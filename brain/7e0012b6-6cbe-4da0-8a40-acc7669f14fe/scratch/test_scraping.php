<?php
function obtenerTipoCambioPHP() {
    $url = "https://cuantoestaeldolar.pe/";
    $opciones = [
        "http" => [
            "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\n"
        ]
    ];
    $contexto = stream_context_create($opciones);
    $html = file_get_contents($url, false, $contexto);

    if ($html === FALSE) {
        return ["error" => "No se pudo acceder a la página."];
    }

    $doc = new DOMDocument();
    libxml_use_internal_errors(true); // Ignora errores de HTML mal formado
    $doc->loadHTML($html);
    libxml_clear_errors();

    $xpath = new DOMXPath($doc);

    $datos = [];

    // 1. Extraer SUNAT
    $nodosSunat = $xpath->query("//div[contains(@class, 'QuotacionValue_title') and contains(translate(., 'SUNAT', 'sunat'), 'sunat')]/following-sibling::div//p[contains(@class, 'ValueCurrency_item_cost')]");
    if ($nodosSunat->length >= 2) {
        $datos['sunat'] = [
            'compra' => trim($nodosSunat->item(0)->nodeValue),
            'venta' => trim($nodosSunat->item(1)->nodeValue)
        ];
    }

    // 2. Extraer Dólar Paralelo (similar lógica)
    $nodosParalelo = $xpath->query("//div[contains(@class, 'QuotacionValue_title') and contains(., 'paralelo')]/following-sibling::div//p[contains(@class, 'ValueCurrency_item_cost')]");
    if ($nodosParalelo->length >= 2) {
        $datos['paralelo'] = [
            'compra' => trim($nodosParalelo->item(0)->nodeValue),
            'venta' => trim($nodosParalelo->item(1)->nodeValue)
        ];
    }

    return $datos;
}

$resultado = obtenerTipoCambioPHP();
if (isset($resultado['error'])) {
    echo "Error: " . $resultado['error'];
} else {
    echo "SUNAT - Compra: " . $resultado['sunat']['compra'] . " | Venta: " . $resultado['sunat']['venta'] . PHP_EOL;
    echo "Paralelo - Compra: " . $resultado['paralelo']['compra'] . " | Venta: " . $resultado['paralelo']['venta'] . PHP_EOL;
}
?>