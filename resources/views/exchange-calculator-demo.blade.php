<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora de Tipo de Cambio - CambiaFX</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Numeral.js -->
    <script src="https://cdn.jsdelivr.net/npm/numeral@2.0.6/numeral.min.js"></script>
    
    <!-- Custom CSS -->
    <style>
        .exchange-calculator {
            max-width: 600px;
            margin: 50px auto;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-cf-compra, .btn-cf-venta {
            border-radius: 25px;
            padding: 10px 30px;
            margin: 5px;
            font-weight: bold;
        }
        
        .form-control {
            border-radius: 10px;
            padding: 15px;
            font-size: 1.1em;
        }
        
        .rate-display {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            text-align: center;
        }
        
        .btn-login {
            background: #28a745;
            border: none;
            border-radius: 25px;
            padding: 12px 40px;
            font-size: 1.1em;
            font-weight: bold;
            width: 100%;
            margin-top: 20px;
        }
        
        .promotional-code {
            background: rgba(255,255,255,0.9);
            color: #333;
            border: none;
            border-radius: 10px;
            padding: 10px 15px;
            margin: 10px 0;
        }
        
        .btn-change {
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="exchange-calculator">
            <h2 class="text-center mb-4">Calculadora de Tipo de Cambio</h2>
            
            <!-- Botones de operación -->
            <div class="text-center mb-4">
                <button class="btn btn-cf-compra btn-dark" aria-label="Seleccionar operación de compra">COMPRA</button>
                <button class="btn btn-cf-venta btn-secondary" aria-label="Seleccionar operación de venta">VENTA</button>
            </div>
            
            <!-- Mostrar tasas actuales -->
            <div class="rate-display">
                <div class="row">
                    <div class="col-6">
                        <strong>Compra:</strong> <span class="txt_compra">S/ 3.5330</span>
                    </div>
                    <div class="col-6">
                        <strong>Venta:</strong> <span class="txt_venta">S/ 3.5650</span>
                    </div>
                </div>
            </div>
            
            <!-- Campos de entrada -->
            <div class="mb-3">
                <label class="form-label">
                    <span class="currency_from">US$</span> Tu envías
                </label>
                <input type="text" class="form-control" name="tc_from" placeholder="Monto en Dólares">
            </div>
            
            <!-- Botón de intercambio -->
            <button class="btn btn-change" aria-label="Intercambiar monedas">
                <i class="fas fa-exchange-alt"></i> ⇄
            </button>
            
            <div class="mb-3">
                <label class="form-label">
                    <span class="currency_to">S/</span> Tu recibes
                </label>
                <input type="text" class="form-control" name="tc_to" placeholder="Monto en Soles">
            </div>
            
            <!-- Tipo de cambio actual -->
            <div class="text-center mb-3">
                <strong>Tipo de Cambio: <span id="tc">3.5330</span></strong>
            </div>
            
            <!-- Código promocional -->
            <div class="mb-3">
                <label class="form-label">Código Promocional (Opcional)</label>
                <input type="text" class="form-control promotional-code" placeholder="Ingresa tu código">
            </div>
            
            <!-- Botón de continuar -->
            <button class="btn btn-login btn-success" aria-label="Continuar con esta operación">
                Continuar con esta Operación
            </button>
            
            <!-- Información adicional -->
            <div class="mt-4 text-center">
                <small>
                    <strong>Horarios de Atención:</strong><br>
                    Lunes a Viernes: 9:00 AM - 6:00 PM<br>
                    Sábados: 9:00 AM - 2:00 PM
                </small>
            </div>
        </div>
    </div>
    
    <!-- Exchange Calculator Script -->
    <script src="{{ asset('js/exchange-calculator.js') }}"></script>
    
    <!-- Font Awesome para iconos -->
    <script src="https://kit.fontawesome.com/a076d05399.js"></script>
</body>
</html>
