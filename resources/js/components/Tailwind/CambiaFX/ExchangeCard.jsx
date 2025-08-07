import React, { useState, useEffect, useMemo, useRef } from 'react';
import CambiaFXService from '../../../services/CambiaFXService';
import WhatsAppButton from '../../Shared/WhatsAppButton';
import { Search } from 'lucide-react';
import GeneralRest from '../../../actions/GeneralRest';
import Global from '../../../Utils/Global';

const generalRest = new GeneralRest();

const ExchangeCard = ({
    title = "Comienza tu cambio ahora",
    initialOperationType = 'venta',
    showCoupons = true,
    showCredits = true,
    className = "",
    onOperationStart = null
}) => {
    const [operationType, setOperationType] = useState(initialOperationType);
    const [amount1, setAmount1] = useState('1,000'); // Valor por defecto con formato
    const [amount2, setAmount2] = useState('');
    const [currentTc, setCurrentTc] = useState(0);
    const [promotionalCode, setPromotionalCode] = useState('');
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponTimeout, setCouponTimeout] = useState(null);
    const [currentRates, setCurrentRates] = useState({ compra: '0.0000', venta: '0.0000' });
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [couponInfo, setCouponInfo] = useState(null); // Info del cupón (rango, TC, etc.)
    const [showCouponModal, setShowCouponModal] = useState(false); // Modal informativo
    const [isConsultingCoupons, setIsConsultingCoupons] = useState(false); // Loading para consulta de cupones
    const [invalidCoupon, setInvalidCoupon] = useState(null); // Información del cupón inválido
    const [debouncedAmount1, setDebouncedAmount1] = useState('1,000'); // Estado debounced para actualizar botones
    const [baseRates, setBaseRates] = useState({ compra: '0.0000', venta: '0.0000' }); // Tasas base sin cupón
    const [apps, setApps] = useState([]); // 📱 ESTADO PARA LAS APPS MÓVILES

    // 🔢 FUNCIONES PARA FORMATEAR NÚMEROS CON COMAS
    const formatNumberWithCommas = (num) => {
        if (!num || isNaN(num)) return '';
        return parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    const parseNumberFromFormatted = (str) => {
        if (!str) return 0;
        // Remover comas y convertir a número
        return parseFloat(str.toString().replace(/,/g, '')) || 0;
    };

    const formatInputValue = (value) => {
        // Remover caracteres no numéricos excepto punto y coma
        let cleanValue = value.replace(/[^0-9.,]/g, '');
        
        // Si tiene punto, mantenerlo para decimales
        if (cleanValue.includes('.')) {
            const parts = cleanValue.split('.');
            const integerPart = parts[0].replace(/,/g, '');
            const decimalPart = parts[1] ? parts[1].substring(0, 2) : ''; // Máximo 2 decimales
            
            // Formatear la parte entera con comas
            const formattedInteger = formatNumberWithCommas(integerPart);
            
            // Preservar el punto decimal incluso si no hay decimales aún
            if (cleanValue.endsWith('.') && decimalPart === '') {
                return `${formattedInteger}.`;
            }
            
            return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
        } else {
            // Solo números enteros, formatear con comas
            const numericValue = cleanValue.replace(/,/g, '');
            return formatNumberWithCommas(numericValue);
        }
    };

    // 🔄 DEBOUNCE: Actualizar botones después de que el usuario termine de escribir
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedAmount1(amount1);
        }, 300); // 300ms de debounce
        
        return () => clearTimeout(timer);
    }, [amount1]);

    // Cargar tipos de cambio iniciales
    useEffect(() => {
        const init = async () => {
            await initializeExchangeRates();
            checkUrlCoupon();
            
            // 📱 CARGAR APPS MÓVILES
            await fetchApps();
            
            // Calcular automáticamente con el valor por defecto de 1000
            if (amount1) {
                setTimeout(() => {
                    calculateExchange('O', amount1);
                }, 500); // Pequeño delay para asegurar que todo esté inicializado
            }
        };
        init();
    }, []);

    // Actualizar TC cuando cambie el tipo de operación
    useEffect(() => {
        if (amount1) {
            calculateExchange('O');
        }
        updateCurrentRates();
    }, [operationType]);

    // Escuchar cambios en el cupón promocional para actualizar rates
    useEffect(() => {
        if (promotionalCode) {
            updateCurrentRates();
            if (amount1) {
                calculateExchange('O');
            }
        }
    }, [promotionalCode]);

    // 🔥 ACTUALIZAR: Solo actualizar tasas cuando cambie cupón, tipo de operación o monto (con debounce)
    useEffect(() => {
       // console.log(`🔄 useEffect: couponInfo, operationType o debouncedAmount1 cambiaron`);
        //console.log(`🔍 couponInfo:`, couponInfo);
        //console.log(`🔍 operationType:`, operationType);
        //console.log(`🔍 debouncedAmount1:`, debouncedAmount1);
        
        // Solo actualizar las tasas según el estado del cupón
        updateCurrentRates();
        
        // NO llamar calculateExchange aquí para evitar interferir con la entrada del usuario
    }, [couponInfo, operationType, debouncedAmount1]); // 🔥 USANDO debouncedAmount1 en lugar de amount1

    const initializeExchangeRates = async () => {
        try {
            const result = await CambiaFXService.getExchangeRates();
            updateCurrentRates();
            // Establecer TC inicial
            const serviceOperationType = operationType === 'compra' ? 'C' : 'V';
            const initialTc = CambiaFXService.getTCFromAmount(1, serviceOperationType);
            setCurrentTc(initialTc);
        } catch (error) {
            // Error silencioso en producción
        }
    };

    const updateCurrentRates = () => {
       // console.log(`🔄 updateCurrentRates: iniciando...`);
        //console.log(`🔍 CambiaFXService.tcBase:`, CambiaFXService.tcBase);
        //console.log(`🔍 CambiaFXService.tcData:`, CambiaFXService.tcData);
        
        // 🏦 ACTUALIZAR TASAS BASE (siempre disponibles para mostrar precios tachados)
        if (CambiaFXService.tcBase.length > 0) {
            const tcBase = CambiaFXService.tcBase[0];
            setBaseRates({
                compra: tcBase.tc_compra.toFixed(4),
                venta: tcBase.tc_venta.toFixed(4)
            });
          //  console.log(`🏦 baseRates actualizadas - compra=${tcBase.tc_compra.toFixed(4)}, venta=${tcBase.tc_venta.toFixed(4)}`);
        }
        
        // 🔥 NUEVA LÓGICA: Verificar si hay cupón activo y si aplica
        if (couponInfo && (amount1 || debouncedAmount1)) {
            // Usar debouncedAmount1 si amount1 está vacío (para asegurar actualización en botones)
            const amountToCheck = amount1 || debouncedAmount1;
            const couponApplies = checkCouponApplies(amountToCheck);
           // console.log(`🔄 updateCurrentRates: couponApplies =`, couponApplies);
            
            if (couponApplies.applies) {
                // Cupón aplica: usar tasas del cupón
                if (couponApplies.rangoActual) {
                    const rangoActual = couponApplies.rangoActual;
                    const buyRate = rangoActual.tcCompra ?? rangoActual.tc_compra;
                    const sellRate = rangoActual.tcVenta ?? rangoActual.tc_venta;
                    
                    setCurrentRates({
                        compra: buyRate.toFixed(4),
                        venta: sellRate.toFixed(4)
                    });
                  //  console.log(`� updateCurrentRates: usando tasas del RANGO - compra=${buyRate.toFixed(4)}, venta=${sellRate.toFixed(4)}`);
                    return;
                } else if (couponInfo.tcCompra && couponInfo.tcVenta) {
                    setCurrentRates({
                        compra: couponInfo.tcCompra.toFixed(4),
                        venta: couponInfo.tcVenta.toFixed(4)
                    });
                 //   console.log(`🔄 updateCurrentRates: usando tasas del CUPÓN - compra=${couponInfo.tcCompra.toFixed(4)}, venta=${couponInfo.tcVenta.toFixed(4)}`);
                    return;
                }
            }
        }
        
        // Cupón no aplica o no hay cupón: usar tasas BASE
        if (CambiaFXService.tcBase.length > 0) {
            const baseRates = CambiaFXService.tcBase[0];
            //console.log(`🔍 baseRates encontradas:`, baseRates);
            setCurrentRates({
                compra: baseRates.tc_compra.toFixed(4),
                venta: baseRates.tc_venta.toFixed(4)
            });
            //console.log(`🔄 updateCurrentRates: usando tasas BASE - compra=${baseRates.tc_compra.toFixed(4)}, venta=${baseRates.tc_venta.toFixed(4)}`);
        } else {
            // Fallback si no hay tasas base
           // console.log(`⚠️ No hay tcBase, usando fallback`);
            const rates = CambiaFXService.getCurrentRates();
            //console.log(`🔍 fallback rates:`, rates);
            setCurrentRates(rates);
            //console.log(`🔄 updateCurrentRates: fallback a getCurrentRates - compra=${rates.compra}, venta=${rates.venta}`);
        }
    };

    const checkUrlCoupon = () => {
        const couponCode = CambiaFXService.checkUrlCoupon();

        if (couponCode) {
            setPromotionalCode(couponCode);
            validateCoupon(couponCode, 'p');
        }
    };

    // 📱 CARGAR APPS DESDE LA BASE DE DATOS
    const fetchApps = async () => {
        try {
            const data = await generalRest.getApps();
            // console.log('📱 Apps cargadas:', data);
            setApps(data);
        } catch (error) {
          //  console.error("Error fetching apps:", error);
            setApps([]);
        }
    };

    // 🧠 IMPLEMENTACIÓN SEGÚN DOCUMENTACIÓN CAMBIAFX
    // Determina si el monto ingresado está en Soles (PEN)
    const isPenCurrency = (origin = '') => {
        // VENTA = Usuario vende dólares por soles (PEN → USD) - ingresa soles, obtiene dólares  
        // COMPRA = Usuario compra dólares con soles (USD → PEN) - ingresa dólares, obtiene soles
        const typeOperation = operationType === 'compra' ? 'compra' : 'venta';

        if (typeOperation === 'venta' && origin === 'O') return true;  // PEN (input soles para obtener USD)
        if (typeOperation === 'compra' && origin === 'D') return true;   // PEN (recibe soles al ingresar USD)

        return false; // USD
    };

    // Busca el tipo de cambio por rango para montos en Soles
    const getTcRangePEN = (dataRangesTc = [], amount = 0) => {
        const typeOperation = operationType === 'compra' ? 'compra' : 'venta';

        if (!amount) {
            return dataRangesTc[0] ?? null;
        }

        for (const data of dataRangesTc) {
            const tc = typeOperation === 'compra' ? data.tc_compra || data.buy : data.tc_venta || data.sell;
            const amountUsd = Number((amount / tc).toFixed(2));

            // Verificar si está en el rango (usando 'desde'/'hasta' o 'from'/'to')
            const from = data.desde || data.from || 0;
            const to = data.hasta || data.to || 0;
            
            if (amountUsd >= from && amountUsd < to) return data;
        }

        return dataRangesTc[dataRangesTc.length - 1] ?? null;
    };

    // Busca el tipo de cambio por rango para montos en Dólares
    const getTcRangeUSD = (dataRangesTc = [], amount = 0) => {
        let objTC = null;

        if (amount) {
            for (const obj of dataRangesTc) {
                const from = obj.desde || obj.from || 0;
                const to = obj.hasta || obj.to || 0;
                
                if (from <= amount && amount < to) {
                    objTC = obj;
                    break;
                }
            }
            objTC = objTC ?? (dataRangesTc[dataRangesTc.length - 1] ?? null);
        } else {
            objTC = dataRangesTc[0] ?? null;
        }

        return objTC;
    };

    // Obtiene el tipo de cambio correspondiente según el monto y origen
    const getTCFromAmount = (_monto, origin) => {
        const isPenCurrencyValue = isPenCurrency(origin);

        // Obtener los rangos de tipos de cambio
        let tcRanges = [];
        
        // Si hay cupón activo, usar sus rangos
        if (couponInfo && couponInfo.rangos && couponInfo.rangos.length > 0) {
            tcRanges = couponInfo.rangos;
        } else if (couponInfo) {
            // Cupón simple (sin rangos múltiples)
            tcRanges = [{
                desde: couponInfo.montoMinimo,
                hasta: couponInfo.montoMaximo,
                tc_compra: couponInfo.tcCompra,
                tc_venta: couponInfo.tcVenta
            }];
        } else {
            // Usar rangos del servicio base
            tcRanges = CambiaFXService.tcData || CambiaFXService.tcBase || [];
        }

        // Obtiene el rango de tipo de cambio según la moneda
        const objTC = isPenCurrencyValue
            ? getTcRangePEN(tcRanges, _monto)
            : getTcRangeUSD(tcRanges, _monto);

        if (!objTC) {
            // Fallback a tasas base
            const baseRates = CambiaFXService.tcBase[0] || { tc_compra: 0, tc_venta: 0 };
            return operationType === 'compra' ? baseRates.tc_compra : baseRates.tc_venta;
        }

        // Retorna el tipo de cambio (buy/compra o sell/venta)
        const isBuy = operationType === 'compra';
        const buyRate = objTC.tc_compra || objTC.buy || 0;
        const sellRate = objTC.tc_venta || objTC.sell || 0;
        
        return isBuy ? buyRate : sellRate;
    };

    // 🎯 FUNCIÓN ESPECIAL: Buscar TC correcto para VENTA con input en soles
    const findCorrectTcForVentaSoles = (amountSoles) => {
        // Obtener todos los rangos disponibles
        let tcRanges = [];
        
        if (couponInfo && couponInfo.rangos && couponInfo.rangos.length > 0) {
            tcRanges = couponInfo.rangos;
        } else if (couponInfo) {
            // Cupón simple (sin rangos múltiples)
            tcRanges = [{
                desde: couponInfo.montoMinimo,
                hasta: couponInfo.montoMaximo,
                tc_compra: couponInfo.tcCompra,
                tc_venta: couponInfo.tcVenta
            }];
        } else {
            // Usar rangos del servicio base
            tcRanges = CambiaFXService.tcData || CambiaFXService.tcBase || [];
        }

        let bestTc = null;
        let bestRange = null;

        // Probar cada rango, quedarnos con el último que coincida
        for (const range of tcRanges) {
            const tcVenta = range.tc_venta || range.sell || 0;
            if (tcVenta === 0) continue;

            // Calcular qué cantidad de dólares resultaría con este TC
            const calculatedUSD = amountSoles / tcVenta;

            // Verificar si este resultado cae dentro del rango de dólares
            const rangeMinUSD = range.desde || 0;
            const rangeMaxUSD = range.hasta || Infinity;

            if (calculatedUSD >= rangeMinUSD && calculatedUSD <= rangeMaxUSD) {
                // Este rango coincide, guardarlo (se quedará con el último)
                bestTc = tcVenta;
                bestRange = range;
               // console.log(`🎯 VENTA Soles: ${amountSoles} ÷ ${tcVenta} = $${calculatedUSD.toFixed(2)} (Rango: $${rangeMinUSD}-$${rangeMaxUSD}) ✅`);
            } else {
               // console.log(`🎯 VENTA Soles: ${amountSoles} ÷ ${tcVenta} = $${calculatedUSD.toFixed(2)} (Rango: $${rangeMinUSD}-$${rangeMaxUSD}) ❌`);
            }
        }

        // Si no encontramos ningún rango que coincida, usar la lógica normal
        if (bestTc === null) {
            // console.log(`🎯 VENTA Soles: No se encontró rango coincidente, usando lógica normal`);
            return getTCFromAmount(amountSoles, 'O');
        }

        // console.log(`🎯 VENTA Soles: Rango final seleccionado - TC: ${bestTc}`);
        return bestTc;
    };

    // 🔁 FUNCIÓN PRINCIPAL DE CÁLCULO (según documentación CambiaFX)
    const calculateExchange = (origin = 'O', inputValue = null) => {
        let total = 0;
        let amount = 0;

        // Paso 1: Obtener el monto ingresado según el origen
        if (inputValue !== null) {
            amount = parseNumberFromFormatted(inputValue);
        } else {
            amount = origin === 'O' 
                ? parseNumberFromFormatted(amount1) 
                : parseNumberFromFormatted(amount2);
        }

        if (amount === 0) {
            if (origin === 'O') {
                setAmount2('');
            } else {
                setAmount1('');
            }
            // Obtener TC base para mostrar
            const baseTc = getTCFromAmount(1, origin);
            setCurrentTc(baseTc);
            setTimeout(() => updateCurrentRates(), 0);
            return;
        }

        // Paso 2: Obtener el tipo de cambio correspondiente
        let _tc;
        const isVentaOperation = operationType === 'venta';
        
        // 🎯 LÓGICA ESPECIAL PARA VENTA CON INPUT EN SOLES
        if (isVentaOperation && origin === 'O') {
            // En VENTA cuando se ingresa soles, buscar el rango correcto
            // probando cada tc_venta hasta encontrar el que coincida
            _tc = findCorrectTcForVentaSoles(amount);
        } else {
            // Para todos los demás casos, usar la lógica normal
            _tc = getTCFromAmount(amount, origin);
        }

        // Paso 3: Calcular el monto convertido
        // VENTA = soles → dólares (dividir por TC)
        // COMPRA = dólares → soles (multiplicar por TC)
        
        if (origin === 'O') {
            // Origen O = input en primer campo
            total = isVentaOperation ? amount / _tc : amount * _tc;
        } else if (origin === 'D') {
            // Origen D = input en segundo campo  
            total = isVentaOperation ? amount * _tc : amount / _tc;
        }

        // Paso 4: Mostrar el resultado en el input contrario
        setCurrentTc(_tc);
        
        if (origin === 'O') {
            const formattedResult = formatNumberWithCommas(total);
            setAmount2(formattedResult);
        } else {
            const formattedResult = formatNumberWithCommas(total);
            setAmount1(formattedResult);
        }
        
        // Actualizar tasas de los botones después del cálculo
        setTimeout(() => updateCurrentRates(), 0);
    };

    const handleSwap = () => {
        // Cambiar el tipo de operación
        const newOperationType = operationType === 'compra' ? 'venta' : 'compra';
        
        // Usar la misma lógica que handleOperationTypeChange que funciona correctamente
        handleOperationTypeChange(newOperationType);
    };

    // 🎯 Función para cambiar tipo de operación y refrescar tasas del cupón
    const handleOperationTypeChange = (newType) => {
        if (newType === operationType) return; // No hacer nada si es el mismo tipo

        // console.log(`🔄 Cambiando operación de ${operationType} a ${newType}`);

        // Cambiar el tipo de operación
        setOperationType(newType);
        
        // Forzar actualización de tasas después del cambio para refrescar botones
        setTimeout(() => {
            updateCurrentRates();
        }, 100);
    };

    const handleAmountChange = (value, origin) => {
        // Formatear el valor con comas automáticamente
        const formattedValue = formatInputValue(value);

        if (origin === 'O') {
            setAmount1(formattedValue);
        } else {
            setAmount2(formattedValue);
        }

        // CALCULAR INMEDIATAMENTE con el valor formateado
        // Pasar el valor formateado directamente para evitar problemas de estado
        setTimeout(() => {
            calculateExchange(origin, formattedValue);
        }, 0);
    };

    const validateCoupon = async (couponCode, tipo = 'c') => {
        setIsValidatingCoupon(true);

        // 🏦 CAPTURAR TASAS BASE ANTES DE VALIDAR EL CUPÓN
        if (CambiaFXService.tcBase.length > 0) {
            const tcBase = CambiaFXService.tcBase[0];
            setBaseRates({
                compra: tcBase.tc_compra.toFixed(4),
                venta: tcBase.tc_venta.toFixed(4)
            });
           // console.log(`🏦 baseRates capturadas ANTES del cupón - compra=${tcBase.tc_compra.toFixed(4)}, venta=${tcBase.tc_venta.toFixed(4)}`);
        }

        try {
            const result = await CambiaFXService.validateCoupon(couponCode);

            if (!result.valid && tipo === 'c') {
                setPromotionalCode('');
                setCouponInfo(null);
                setInvalidCoupon({
                    codigo: couponCode,
                    message: result.message || 'El código de promoción no es válido.'
                });
                // Restaurar tipos de cambio base
                updateCurrentRates();
            } else if (result.valid) {
                // Limpiar cupón inválido si existía
                setInvalidCoupon(null);

                // Guardar información del cupón para mostrar al usuario
                // Con múltiples rangos, tomamos el rango más general para mostrar
                const rangos = result.data;
                const rangoMinimo = Math.min(...rangos.map(r => r.desde));
                const rangoMaximo = Math.max(...rangos.map(r => r.hasta));
                const primerRango = rangos[0];
                
                setCouponInfo({
                    codigo: couponCode,
                    montoMinimo: rangoMinimo,
                    montoMaximo: rangoMaximo,
                    tcCompra: primerRango.tc_compra,
                    tcVenta: primerRango.tc_venta,
                    rangos: rangos // Guardamos todos los rangos para referencia
                });

                // ⚡ ACTUALIZACIÓN INMEDIATA Y FORZADA
                // Actualizar rates inmediatamente
                updateCurrentRates();

                // 🔥 FORZAR ACTUALIZACIÓN INMEDIATA del debouncedAmount1 para que los botones se actualicen
                setDebouncedAmount1(amount1);

                // Forzar re-render del componente
                setCurrentRates(CambiaFXService.getCurrentRates());

                // Recalcular INMEDIATAMENTE sin delay
                if (amount1) {
                    const serviceOperationType = operationType === 'compra' ? 'C' : 'V';
                    const amount = parseNumberFromFormatted(amount1);
                    const tcActual = CambiaFXService.getTCFromAmount(amount, serviceOperationType);
                    
                    // Forzar recálculo inmediato
                    calculateExchange('O');
                }
            }

        } catch (error) {
            if (tipo === 'c') {
                setPromotionalCode('');
                setCouponInfo(null);
                setInvalidCoupon({
                    codigo: promotionalCode,
                    message: 'Error al validar el código de promoción.'
                });
                // Restaurar tipos de cambio base en caso de error
                updateCurrentRates();
            }
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleCouponChange = (value) => {
        setPromotionalCode(value);
        setIsValidatingCoupon(true)

        // Limpiar cupón inválido cuando el usuario empiece a escribir
        if (invalidCoupon) {
            setInvalidCoupon(null);
        }

        if (couponTimeout) {
            clearTimeout(couponTimeout);
        }

        const timeout = setTimeout(() => {
            validateCoupon(value, 'c');
        }, 2000);
        setIsValidatingCoupon(false)
        setCouponTimeout(timeout);
    };

    // 🚀 FUNCIÓN DE RESET COMPLETO PARA DEBUGGING
    const forceReset = () => {
        // Limpiar todo el estado
        setAmount1('1,000'); // Valor por defecto con formato
        setAmount2('');
        setCurrentTc(0);
        setPromotionalCode('');
        setCouponInfo(null);
        setInvalidCoupon(null);
        setCurrentRates({ compra: '0.0000', venta: '0.0000' });
        setBaseRates({ compra: '0.0000', venta: '0.0000' });

        // Reinicializar servicio
        CambiaFXService.tcData = [...CambiaFXService.tcBase];
    };

    // 🎯 VERIFICAR SI EL CUPÓN APLICA AL MONTO ACTUAL (según documentación CambiaFX)
    const checkCouponApplies = (amountToCheck = null, opType = null) => {
        if (!couponInfo) return { applies: false, reason: '' };

        // Usar el operationType pasado como parámetro o el actual
        const currentOpType = opType || operationType;

        // 🔧 DETERMINAR ORIGEN DEL MONTO Y CONVERTIR A USD SEGÚN DOCUMENTACIÓN
        let amount = 0;
        let origin = 'O'; // Por defecto, usar origin 'O' (campo superior)

        // Usar debouncedAmount1 para determinar el rango (más estable)
        const debouncedAmount1Value = parseNumberFromFormatted(debouncedAmount1);
        const amount1Value = parseNumberFromFormatted(amount1);

        if (debouncedAmount1Value > 0) {
            amount = debouncedAmount1Value;
            origin = 'O';
        } else if (amount1Value > 0) {
            amount = amount1Value;
            origin = 'O';
        } else {
            return { applies: false, reason: 'Sin monto válido' };
        }

        // 🔍 DETERMINAR SI EL MONTO ESTÁ EN SOLES (según documentación)
        // COMPRA = SOLES → USD (usuario quiere comprar dólares)
        // VENTA = USD → SOLES (usuario quiere vender dólares)
        const isPenCurrencyValue = isPenCurrency(origin);
        // console.log(`🔍 checkCouponApplies: monto=${amount}, origin=${origin}, isPen=${isPenCurrencyValue}, operacion=${currentOpType} (${currentOpType === 'compra' ? 'SOLES→USD' : 'USD→SOLES'})`);

        // 🔄 CONVERTIR A USD PARA COMPARAR CON RANGOS (siempre en USD)
        let amountForComparison = amount;
        
        if (isPenCurrencyValue) {
            // Monto en PEN, convertir a USD usando tasas base
            const tcBase = CambiaFXService.tcBase[0];
            if (tcBase) {
                // CORREGIDO: Para COMPRA (SOLES→USD) usar tc_venta para convertir PEN→USD
                // Para VENTA (USD→SOLES) usar tc_compra para convertir PEN→USD
                const tc = currentOpType === 'compra' ? tcBase.tc_venta : tcBase.tc_compra;
                amountForComparison = amount / tc;
            }
            // console.log(`🔄 Convirtiendo PEN a USD: ${amount} PEN → ${amountForComparison} USD (tc=${tcBase?.tc_venta || tcBase?.tc_compra})`);
        } else {
            // Monto ya está en USD
            // console.log(`✅ Monto ya en USD: ${amount}`);
        }

        if (amountForComparison <= 0) {
            return { applies: false, reason: 'Sin monto válido para conversión' };
        }

        // 📊 VERIFICAR RANGOS DEL CUPÓN
        if (couponInfo.rangos && couponInfo.rangos.length > 0) {
            // Cupón con múltiples rangos
            let rangoAplicable = null;
            
            const rangosValidos = couponInfo.rangos.filter(r => {
                const minAmount = r.desde ?? r.montoMinimo ?? r.from;
                const maxAmount = r.hasta ?? r.montoMaximo ?? r.to;
                return r && minAmount != null && maxAmount != null;
            });
            
            // console.log(`🎯 Evaluando ${rangosValidos.length} rangos para ${amountForComparison} USD`);
            
            // Buscar el rango correcto sin superposición
            for (let i = 0; i < rangosValidos.length; i++) {
                const rango = rangosValidos[i];
                const isLastRange = i === rangosValidos.length - 1;
                
                const minAmount = rango.desde ?? rango.montoMinimo ?? rango.from ?? 0;
                const maxAmount = rango.hasta ?? rango.montoMaximo ?? rango.to ?? 0;
                
                // Lógica de rangos sin superposición con tolerancia
                const tolerance = 0.1;
                const isInRange = isLastRange 
                    ? (minAmount - tolerance <= amountForComparison && amountForComparison <= maxAmount)  // Último rango incluye límite superior
                    : (minAmount - tolerance <= amountForComparison && amountForComparison < maxAmount);   // Otros rangos NO incluyen límite superior

                // console.log(`📋 Rango ${i + 1}: ${minAmount}-${maxAmount}, incluye ${amountForComparison}? ${isInRange} (${isLastRange ? 'último' : 'intermedio'})`);

                if (isInRange) {
                    rangoAplicable = rango;
                    // console.log(`✅ Rango aplicable encontrado:`, rango);
                    break;
                }
            }
            
            if (rangoAplicable) {
                return { applies: true, reason: '', rangoActual: rangoAplicable };
            } else {
                const rangosDisplay = rangosValidos.map(r => {
                    const min = r.desde ?? r.montoMinimo ?? r.from;
                    const max = r.hasta ?? r.montoMaximo ?? r.to;
                    return `$${min}-$${max} USD`;
                }).join(', ');
                // console.log(`❌ No se encontró rango aplicable para ${amountForComparison} USD`);
                return {
                    applies: false,
                    reason: `Rangos válidos: ${rangosDisplay}`
                };
            }
        }

        // Cupón simple (un solo rango)
       // console.log(`📊 Verificando cupón simple: ${amountForComparison} USD vs ${couponInfo.montoMinimo}-${couponInfo.montoMaximo} USD`);
        
        const tolerance = 0.1;
        
        if (amountForComparison < (couponInfo.montoMinimo - tolerance)) {
            return {
                applies: false,
                reason: `Monto mínimo requerido: $${couponInfo.montoMinimo} USD`
            };
        }

        if (amountForComparison > couponInfo.montoMaximo) {
            return {
                applies: false,
                reason: `Monto máximo permitido: $${couponInfo.montoMaximo} USD`
            };
        }

        // console.log(`✅ Cupón simple aplica`);
        return { applies: true, reason: '' };
    };

    // 🔍 SIMULAR CONSULTA DE CUPONES DISPONIBLES
    const handleConsultCoupons = async () => {
        setIsConsultingCoupons(true);

        try {
            // Simular delay de consulta (1.5-2.5 segundos para parecer real)
            const delay = 1500 + Math.random() * 1000; // Entre 1.5 y 2.5 segundos
            await new Promise(resolve => setTimeout(resolve, delay));

            // Mostrar resultado de la consulta (simulado)

        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsConsultingCoupons(false);
        }
    };

    // � FUNCIÓN UNIFICADA PARA OBTENER EL RANGO ACTUAL DEL CUPÓN
    const getCurrentCouponRange = useMemo(() => {
        if (!couponInfo) return null;
        
        const couponApplies = checkCouponApplies(debouncedAmount1);
        // console.log(`🎯 getCurrentCouponRange: couponApplies =`, couponApplies);
        
        if (couponApplies.applies && couponApplies.rangoActual) {
            return couponApplies.rangoActual;
        }
        
        return null;
    }, [couponInfo, debouncedAmount1, operationType]);

    // �🎨 OBTENER TASA PREFERENCIAL PARA MOSTRAR EN BOTONES (usando useMemo para reactividad)
    const rates = useMemo(() => {
        //console.log(`🎨 useMemo rates: recalculando...`);
        //console.log(`🔍 DEBUG - couponInfo:`, couponInfo);
        //console.log(`🔍 DEBUG - currentRates:`, currentRates);
        //console.log(`🔍 DEBUG - baseRates:`, baseRates);
        //console.log(`🔍 DEBUG - debouncedAmount1:`, debouncedAmount1);
        
        if (!couponInfo) {
            //console.log(`🎨 useMemo rates: sin cupón, usando currentRates`, currentRates);
            return {
                // Precio actual (sin cupón, igual a base)
                compra: currentRates.compra,
                venta: currentRates.venta,
                // Sin precio anterior
                previousCompra: null,
                previousVenta: null,
                showPreviousPrice: false,
                isActive: false
            };
        }

        const couponApplies = checkCouponApplies(debouncedAmount1);
        // console.log(`🎨 useMemo rates: couponApplies =`, couponApplies);
        // console.log(`🔍 DEBUG - couponApplies.applies:`, couponApplies.applies);
        // console.log(`🔍 DEBUG - currentRates:`, currentRates);
        // console.log(`🔍 DEBUG - baseRates:`, baseRates);

        // ✅ Mostrar precio anterior solo cuando el cupón REALMENTE APLICA
        if (couponApplies.applies) {
            // console.log(`🎨 useMemo rates: cupón APLICA, mostrando precio anterior`);
            // console.log(`💰 Precio base (tachado): compra=${baseRates.compra}, venta=${baseRates.venta}`);
            // console.log(`🎫 Precio cupón (actual): compra=${currentRates.compra}, venta=${currentRates.venta}`);
            return {
                // Precio actual con cupón
                compra: currentRates.compra,
                venta: currentRates.venta,
                // Precio anterior (base, tachado)
                previousCompra: baseRates.compra,
                previousVenta: baseRates.venta,
                showPreviousPrice: true, // ✅ SOLO cuando realmente aplica
                isActive: true
            };
        } else {
            //console.log(`🎨 useMemo rates: cupón NO APLICA, usando tasas base sin precio anterior`);
            return {
                // Precio actual (base, porque cupón no aplica)
                compra: currentRates.compra,
                venta: currentRates.venta,
                // Sin precio anterior
                previousCompra: null,
                previousVenta: null,
                showPreviousPrice: false, // ✅ NO mostrar precio anterior
                isActive: false
            };
        }
    }, [couponInfo, currentRates, baseRates, debouncedAmount1]); // 🔥 REMOVIDO operationType para evitar recálculos innecesarios

    // 🎯 SOLUCIÓN DEFINITIVA: Usar valores directos sin ningún memo para botones
    const [lastValidRates, setLastValidRates] = useState({
        compra: 0,
        venta: 0,
        previousCompra: 0,
        previousVenta: 0,
        showPreviousPrice: false,
        isActive: false
    });

    // Solo actualizar cuando las tasas cambien por razones legítimas 
    useEffect(() => {
        if (rates.compra && rates.venta) {
            setLastValidRates({
                compra: rates.compra,
                venta: rates.venta,
                previousCompra: rates.previousCompra,
                previousVenta: rates.previousVenta,
                showPreviousPrice: rates.showPreviousPrice,
                isActive: rates.isActive
            });
        }
    }, [rates.compra, rates.venta, rates.previousCompra, rates.previousVenta, rates.showPreviousPrice, rates.isActive]);

    // 🎯 PREVENIR PARPADEO: Detectar cambios de operationType y usar valores estables
    const [isChangingOperationType, setIsChangingOperationType] = useState(false);
    const prevOperationTypeRef = useRef(operationType);
    
    useEffect(() => {
        if (prevOperationTypeRef.current !== operationType) {
            setIsChangingOperationType(true);
            // Muy breve pausa para evitar parpadeo
            const timer = setTimeout(() => {
                setIsChangingOperationType(false);
            }, 50);
            prevOperationTypeRef.current = operationType;
            return () => clearTimeout(timer);
        }
    }, [operationType]);

    // Estado persistente para el rango y tasas del cupón activas
    const [activeCouponRange, setActiveCouponRange] = useState(null);
    const [activeCouponRates, setActiveCouponRates] = useState({
        compra: 0,
        venta: 0,
        previousCompra: 0,
        previousVenta: 0,
        showPreviousPrice: false,
        isActive: false
    });

    // Determinar el rango de cupón válido actual
    const couponStatus = useMemo(() => {
        const status = checkCouponApplies(debouncedAmount1, operationType);
        
        // Si hay cupón info, mantener siempre activo independientemente del estado temporal
        if (couponInfo) {
            // Si el cupón es válido y el monto está en rango, actualiza el estado persistente
            if (status.applies && status.rangoActual) {
                // console.log(`🎯 CUPÓN APLICA - rangoActual:`, status.rangoActual);
                // console.log(`🎯 Tasas del cupón: compra=${status.rangoActual.tcCompra ?? status.rangoActual.tc_compra}, venta=${status.rangoActual.tcVenta ?? status.rangoActual.tc_venta}`);
                // console.log(`🎯 Tasas base (anteriores): compra=${baseRates.compra}, venta=${baseRates.venta}`);

                setActiveCouponRange(status.rangoActual);
                setActiveCouponRates({
                    compra: status.rangoActual.tcCompra ?? status.rangoActual.tc_compra ?? 0,
                    venta: status.rangoActual.tcVenta ?? status.rangoActual.tc_venta ?? 0,
                    previousCompra: baseRates.compra,
                    previousVenta: baseRates.venta,
                    showPreviousPrice: true,
                    isActive: true
                });
            }
            // 🎯 MANTENER CUPÓN ACTIVO MIENTRAS EXISTA couponInfo - NO REINICIAR
        } else {
            // Solo limpiar si NO hay couponInfo
            setActiveCouponRange(null);
            setActiveCouponRates({
                compra: rates.compra,
                venta: rates.venta,
                previousCompra: 0,
                previousVenta: 0,
                showPreviousPrice: false,
                isActive: false
            });
        }
        return status;
    }, [couponInfo, debouncedAmount1, operationType]);

    // Usar siempre los últimos valores persistentes para los botones
    // 🎯 USAR SIEMPRE activeCouponRates SI HAY CUPÓN ACTIVO
    const stableButtonRates = couponInfo && activeCouponRates.isActive ? activeCouponRates : lastValidRates;

    // 📱 DETECTAR SI ES DISPOSITIVO MÓVIL
    const isMobileDevice = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Detectar iOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }
        
        // Detectar Android
        if (/android/i.test(userAgent)) {
            return 'android';
        }
        
        // Detectar otros móviles
        if (/Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(userAgent)) {
            return 'mobile';
        }
        
        return false;
    };

    // 📱 OBTENER LA APP CORRECTA SEGÚN EL DISPOSITIVO (usando campo platform)
    const getAppForDevice = () => {
        const deviceInfo = {
            isAndroid: /android/i.test(navigator.userAgent),
            isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            isHuawei: /huawei|honor/i.test(navigator.userAgent) || /harmony/i.test(navigator.userAgent)
        };


        
        if (!apps || apps.length === 0) {
            //console.log('❌ No hay apps disponibles');
            return null;
        }

        // 🎯 NUEVA LÓGICA: Buscar por campo 'platform' en lugar del nombre
        if (deviceInfo.isAndroid) {
            const androidApp = apps.find(app => app.platform === 'android');
            return androidApp;
        }
        
        if (deviceInfo.isIOS) {
            const iosApp = apps.find(app => app.platform === 'ios');
            return iosApp;
        }
        
        if (deviceInfo.isHuawei) {
            const huaweiApp = apps.find(app => app.platform === 'huawei');
            return huaweiApp;
        }

        // Fallback: devolver la primera app disponible
        // console.log('❓ No se encontró app específica por platform, usando la primera disponible:', apps[0]);
        return apps.length > 0 ? apps[0] : null;
    };

    // 🚀 INTENTAR ABRIR LA APLICACIÓN MÓVIL CON DEEP LINKING
    const tryOpenMobileApp = () => {
        const deviceType = isMobileDevice();
        
        if (!deviceType) {
            // No es dispositivo móvil, ejecutar acción normal
            //console.log('🖥️ Dispositivo de escritorio detectado');
            return false;
        }

        // 📱 OBTENER LA APP CORRECTA DINÁMICAMENTE
        const targetApp = getAppForDevice();
        
        if (!targetApp || !targetApp.app_scheme) {
            // console.log('❌ No se encontró app con URL scheme configurado para este dispositivo');
            // Si no hay app configurada o no tiene scheme, continuar con operación normal web
            return false;
        }

        // console.log('🎯 App seleccionada:', targetApp);

        try {
            // Variable para rastrear si la app se abrió
            let appOpened = false;
            let startTime = Date.now();
            
            // Detectar si la página se oculta (la app se abrió)
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    appOpened = true;
                    // console.log('✅ App instalada abierta exitosamente');
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                }
            };
            
            // Detectar si el foco sale de la ventana (iOS principalmente)
            const handleBlur = () => {
                // En iOS, el blur ocurre cuando la app se abre
                if (Date.now() - startTime < 1000) {
                    appOpened = true;
                    // console.log('✅ App instalada abierta exitosamente (iOS)');
                    window.removeEventListener('blur', handleBlur);
                }
            };

            // Agregar event listeners
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('blur', handleBlur);

            // console.log('🔗 Intentando abrir app instalada con scheme:', targetApp.app_scheme);

            // Intentar abrir la app con el URL scheme
            window.location.href = targetApp.app_scheme;

            // ⏰ TIMEOUT: Si después de 2 segundos no se abrió la app, 
            // continuar con la operación web normal (no ir a tienda)
            setTimeout(() => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('blur', handleBlur);
                
                if (!appOpened) {
                    // console.log('❌ App no instalada, continuando con operación web normal');
                    
                    // 🌐 CONTINUAR CON OPERACIÓN WEB NORMAL (como desktop)
                    // En lugar de ir a la tienda, ejecutar la operación normal
                    executeNormalOperation();
                }
            }, 2000);

            return true; // Se intentó abrir la app móvil
            
        } catch (error) {
            console.warn('❌ Error al intentar abrir app con scheme:', error);
            // Si falla el scheme, continuar con operación normal
            return false;
        }
    };

    // 🖥️ EJECUTAR OPERACIÓN NORMAL (ESCRITORIO O FALLBACK)
    const executeNormalOperation = () => {
        const amountValue = parseNumberFromFormatted(amount1);
        
        const operationData = {
            type: operationType === 'venta' ? 'V' : 'C',
            fromAmount: operationType === 'venta' ? amountValue : parseNumberFromFormatted(amount2),
            toAmount: operationType === 'venta' ? parseNumberFromFormatted(amount2) : amountValue,
            exchangeRate: currentTc,
            couponCode: promotionalCode
        };

        if (onOperationStart) {
            onOperationStart(operationData);
        } else {
            // Usar el servicio para inicializar la operación
            CambiaFXService.initializeOperation(operationData);
        }
    };

    const handleOperationStart = () => {
        const amountValue = parseNumberFromFormatted(amount1);

        if (amountValue === 0) {
            alert('Debe ingresar un monto');
            return;
        }

        // 📱 VERIFICAR SI ES MÓVIL Y INTENTAR ABRIR LA APP
        const isOnMobile = isMobileDevice();
        
        if (isOnMobile) {
            // Es dispositivo móvil: intentar abrir la app
            const appOpened = tryOpenMobileApp();
            
            if (!appOpened) {
                // Si no se pudo abrir la app, ejecutar operación normal
                executeNormalOperation();
            }
            // Si se abrió la app, no hacer nada más (la app manejará la operación)
        } else {
            // Es dispositivo de escritorio: ejecutar operación normal
            executeNormalOperation();
        }
    };

    return (
        <div className={`bg-secondary z-[99999] rounded-2xl  lg:rounded-3xl p-4  lg:p-8 shadow-xl flex flex-col gap-6 w-full max-w-[480px] ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className=" text-2xl lg:text-[28px] leading-[94%] font-base text-neutral-light">
                        {title.includes('cambio') ? (
                            <>
                                {title.split('cambio')[0]}
                                <span className="text-neutral-light font-semibold">cambio</span>
                                {title.split('cambio')[1]}
                            </>
                        ) : (
                            title
                        )}
                    </h2>
                </div>
                <div className="min-w-max  text-[10px] lg:text-sm font-medium text-neutral-light flex items-center gap-1">
                 
                                <img
                                   
                                    src="/assets/img/logo.svg"
                                    alt={Global.APP_NAME}
                                    className="object-cover object-top h-7 max-h-7 w-auto lg:h-10 lg:max-h-10 transition-all duration-300"
                                />
                           
                </div>
            </div>

            {/* Operation Type Buttons */}
            <div className="flex gap-2 mb-4 tracking-wider bg-white rounded-2xl p-2 !font-paragraph">
                <button
                    onClick={() => handleOperationTypeChange('compra')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 relative ${operationType === 'compra'
                            ? 'bg-constrast text-white shadow-lg shadow-constrast/25'
                            : 'bg-white text-neutral-dark hover:bg-neutral hover:shadow-md'
                        }`}
                >
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            {couponInfo && stableButtonRates.showPreviousPrice ? (
                                <div className="text-center">
                                    <div className="text-[10px] lg:text-xs opacity-75 font-medium">
                                        <span className="line-through">Antes S/ {stableButtonRates.previousCompra}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${operationType === 'compra'
                                        ? 'text-white'
                                        : 'text-neutral-dark'
                                    }`}>COMPRA <br className='lg:hidden'/> S/ {stableButtonRates.compra}</span>
                                </div>
                            ) : (
                                <span className="text-xs lg:text-sm font-semibold">COMPRA <br className='lg:hidden'/> S/ {stableButtonRates.compra}</span>
                            )}

                            {/* Icono de ayuda para COMPRA */}
                            <div className="relative group">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center cursor-help transition-all duration-200 ${operationType === 'compra'
                                        ? 'bg-secondary text-neutral-dark'
                                        : 'bg-neutral-dark text-white'
                                    }`}>
                                    <svg className='w-4 h-4' width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 6.5C6.5 5.39543 7.39543 4.5 8.5 4.5C9.60457 4.5 10.5 5.39543 10.5 6.5C10.5 7.60457 9.60457 8.5 8.5 8.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="8.5" cy="12" r="0.5" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Tooltip mejorado para COMPRA - Responsive */}
                                <div className="absolute bottom-full mb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 
                                               w-40 max-w-[calc(100vw-2rem)] right-0
                                               sm:w-auto sm:min-w-max sm:right-0">
                                    <div className="bg-neutral-dark backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                                        <div className="px-3 py-3 sm:px-5 sm:py-4">
                                            {/* Contenido principal */}
                                            <div className="space-y-2 mb-3">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs sm:text-sm leading-tight">Tienes: <span className="font-semibold text-secondary">Dólares</span></span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs sm:text-sm leading-tight">Quieres: <span className="font-semibold text-secondary">Soles</span></span>
                                                </div>
                                            </div>

                                            {/* Footer explicativo */}
                                            <div className="bg-white/5 rounded-lg px-2 py-2 sm:px-3">
                                                <p className="text-xs text-white/80 text-center leading-tight">
                                                    <span className="font-medium text-secondary">Nosotros</span> te compramos dólares
                                                </p>
                                            </div>
                                        </div>

                                        {/* Flecha del tooltip - Responsive */}
                                        <div className="absolute top-full right-6">
                                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-neutral-dark"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {couponInfo && stableButtonRates.showPreviousPrice && (
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            stableButtonRates.isActive ? 'bg-secondary' : 'bg-yellow-400'
                        }`}></div>
                    )}
                </button>
                <button
                    onClick={() => handleOperationTypeChange('venta')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 relative ${operationType === 'venta'
                            ? 'bg-constrast text-white shadow-lg shadow-constrast/25'
                            : 'bg-white text-neutral-dark hover:bg-neutral hover:shadow-md'
                        }`}
                >
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            {couponInfo && stableButtonRates.showPreviousPrice ? (
                                <div className="text-center">
                                    <div className="text-[10px] lg:text-xs opacity-75 font-medium">
                                        <span className="line-through">Antes S/ {stableButtonRates.previousVenta}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${operationType === 'venta'
                                        ? 'text-white'
                                        : 'text-neutral-dark'
                                    }`}>VENTA <br className='lg:hidden'/> S/ {stableButtonRates.venta}</span>
                                </div>
                            ) : (
                                <span className="text-xs lg:text-sm font-semibold">VENTA <br className='lg:hidden'/>S/ {stableButtonRates.venta}</span>
                            )}

                            {/* Icono de ayuda para VENTA */}
                            <div className="relative group">
                                <div className={`min-w-5 min-h-5  max-w-5 max-h-5 rounded-full flex items-center justify-center cursor-help transition-all duration-200 ${operationType === 'venta'
                                        ? 'bg-secondary text-neutral-dark'
                                        : 'bg-neutral-dark text-white'
                                    }`}>
                                    <svg className=' min-w-4 min-h-4' width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 6.5C6.5 5.39543 7.39543 4.5 8.5 4.5C9.60457 4.5 10.5 5.39543 10.5 6.5C10.5 7.60457 9.60457 8.5 8.5 8.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="8.5" cy="12" r="0.5" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Tooltip mejorado para VENTA - Responsive */}
                                <div className="absolute bottom-full mb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[999]
                                                w-40 max-w-[calc(100vw-2rem)] right-0 sm:w-auto sm:min-w-max sm:right-0">
                                    <div className="bg-neutral-dark backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                                        <div className="px-3 py-3 sm:px-5 sm:py-4">
                                            {/* Contenido principal */}
                                            <div className="space-y-2 mb-3">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs sm:text-sm leading-tight">Tienes: <span className="font-semibold text-secondary">Soles</span></span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs sm:text-sm leading-tight">Quieres: <span className="font-semibold text-secondary">Dólares</span></span>
                                                </div>
                                            </div>

                                            {/* Footer explicativo */}
                                            <div className="bg-white/5 rounded-lg px-2 py-2 sm:px-3">
                                                <p className="text-xs text-white/80 text-center leading-tight">
                                                    <span className="font-medium text-secondary">Nosotros</span> te vendemos dólares
                                                </p>
                                            </div>
                                        </div>

                                        {/* Flecha del tooltip - Responsive */}
                                        <div className="absolute top-full right-6">
                                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-neutral-dark"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {couponInfo && stableButtonRates.showPreviousPrice && (
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            stableButtonRates.isActive ? 'bg-secondary' : 'bg-yellow-400'
                        }`}></div>
                    )}
                </button>
            </div>

            {/* Exchange Inputs */}
            <div className="flex relative flex-col items-center space-y-4">
                {/* From Input */}
                <div className="flex items-center bg-white rounded-2xl shadow-lg p-2 w-full relative">
                    <div className="flex-1 h-full flex flex-col ml-2 justify-center">
                        <p className="text-neutral-light text-[8px] uppercase font-semibold">
                            {operationType === 'compra' ? "ENVÍO DÓLARES" : "ENVÍO SOLES"}
                        </p>
                        <input
                            type="text"
                            placeholder="0.00"
                            value={amount1}
                            onChange={(e) => {
                                handleAmountChange(e.target.value, 'O');
                            }}
                            className="text-lg text-neutral-light bg-transparent border-none outline-none w-full placeholder:text-neutral-light"
                        />
                    </div>
                    <div className="flex items-center bg-secondary bg-opacity-50 rounded-xl px-6 py-3 ml-4">
                        <img
                            src={operationType === 'compra' ? "https://flagcdn.com/w580/us.png" : "https://flagcdn.com/w580/pe.png"}
                            alt={operationType === 'compra' ? "USD Flag" : "PEN Flag"}
                            className="w-6 h-6 object-cover rounded-full mr-2"
                        />
                        <span className="text-base font-medium tracking-wide text-neutral-light">
                            {operationType === 'compra' ? 'USD' : 'PEN'}
                        </span>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="absolute right-4 top-8 z-10">
                    <button
                        onClick={handleSwap}
                        className="bg-constrast text-white p-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-neutral-dark"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9767 17.5C17.4017 15.8876 19 13.1305 19 10C19 5.02944 14.9706 1 10 1C9.3126 1 8.6432 1.07706 8 1.22302M14.9767 17.5V14M14.9767 17.5H18.5M5 2.51555C2.58803 4.13007 1 6.87958 1 10C1 14.9706 5.02944 19 10 19C10.6874 19 11.3568 18.9229 12 18.777M5 2.51555V6M5 2.51555H1.5" stroke="#FAF3E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* To Input */}
                <div className="flex items-center bg-white rounded-2xl shadow-lg p-2 w-full relative">
                    <div className="flex-1 h-full flex flex-col ml-2 justify-center">
                        <p className="text-neutral-light text-[8px] uppercase font-semibold">
                            {operationType === 'compra' ? "RECIBO SOLES" : "RECIBO DÓLARES"}
                        </p>
                        <input
                            type="text"
                            placeholder="0.00"
                            value={amount2}
                            onChange={(e) => {
                                handleAmountChange(e.target.value, 'D');
                            }}
                            className="text-lg text-neutral-light bg-transparent border-none outline-none w-full placeholder:text-neutral-light"
                        />
                    </div>
                    <div className="flex items-center bg-secondary bg-opacity-50 rounded-xl px-6 py-3 ml-4">
                        <img
                            src={operationType === 'compra' ? "https://flagcdn.com/w580/pe.png" : "https://flagcdn.com/w580/us.png"}
                            alt={operationType === 'compra' ? "PEN Flag" : "USD Flag"}
                            className="w-6 h-6 object-cover rounded-full mr-2"
                        />
                        <span className="text-base font-medium tracking-wide text-neutral-light">
                            {operationType === 'compra' ? 'PEN' : 'USD'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Coupon and Credits */}
            {(showCoupons || showCredits) && (
                <div className="flex justify-center gap-2 mt-1">
                    {showCoupons && (
                        <>
                            {!showCouponInput ? (
                                <div className="flex-1 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowCouponInput(true);
                                        }}
                                        className="flex-1 justify-center flex gap-3 items-center py-4 px-4 rounded-xl font-medium text-sm transition-all duration-200 border-2 group relative text-neutral-dark hover:bg-neutral hover:shadow-md border-transparent hover:border-secondary/30"
                                        title="Ingresa tu cupón promocional para obtener una tasa preferencial"
                                    >
                                        USAR CUPÓN
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.74985 14.3412L6.39628 13.5378C6.05276 13.3339 5.88099 13.2319 5.69036 13.2261C5.48436 13.2197 5.30956 13.3175 4.93835 13.5378C4.52261 13.7846 3.69594 14.4643 3.1612 14.1402C2.83398 13.9418 2.83398 13.4379 2.83398 12.4301V5.33301C2.83398 3.44739 2.83398 2.50458 3.41977 1.91879C4.00556 1.33301 4.94836 1.33301 6.83398 1.33301H10.1673C12.0529 1.33301 12.9957 1.33301 13.5815 1.91879C14.1673 2.50458 14.1673 3.44739 14.1673 5.33301V12.4301C14.1673 13.4379 14.1673 13.9418 13.8401 14.1402C13.3054 14.4643 12.4787 13.7846 12.0629 13.5378C11.7194 13.3339 11.5477 13.2319 11.3571 13.2261C11.1511 13.2197 10.9763 13.3175 10.6051 13.5378L9.25145 14.3412C8.88638 14.5579 8.70378 14.6663 8.50065 14.6663C8.29752 14.6663 8.11492 14.5579 7.74985 14.3412Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.5 5.33301L6.5 9.33301" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.5 9.33301H10.494M6.50598 5.33301H6.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        {/* Tooltip normal - Responsive */}
                                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 
                                                       w-56 max-w-[calc(100vw-2rem)] right-0 
                                                       sm:w-auto sm:whitespace-nowrap">
                                            <div className="bg-neutral-dark text-white text-xs rounded-lg px-2 py-2 sm:px-3 text-center">
                                                💡 Obtén tasas preferenciales con tu código promocional
                                                <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-dark"></div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Icono de información del cupón aplicado */}
                                    {couponInfo && (
                                        <div className="relative group">
                                            <button className="py-4 px-3 rounded-xl bg-constrast/10 border-2 border-constrast/30 hover:bg-constrast/20 transition-all duration-200">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M8 12V8M8 5.5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>

                                            {/* Tooltip detallado del cupón aplicado - Responsive */}
                                            <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50
                                                           w-72 max-w-[calc(100vw-2rem)] right-0 
                                                           sm:w-72 sm:right-0">
                                                <div className="bg-neutral-dark backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                                                    <div className="px-3 py-3 sm:px-5 sm:py-4">
                                                        {/* Header del tooltip */}
                                                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-constrast to-constrast/80 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-4 sm:h-4">
                                                                    <path d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13L3 16L4 10.5L0 6.75L5.5 6L8 1Z" fill="#F9F3E0" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-constrast text-xs sm:text-sm truncate">CUPÓN {couponInfo.codigo}</h4>
                                                                <p className="text-xs text-white/70">Actualmente aplicado</p>
                                                            </div>
                                                        </div>

                                                        {/* Detalles del cupón */}
                                                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                                            {/* Si tiene múltiples rangos, mostrar cada uno */}
                                                                            {couponInfo?.rangos && couponInfo.rangos.length > 1 ? (
                                                                                <>
                                                                                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                                        <h5 className="text-xs font-semibold text-constrast mb-2">RANGOS DISPONIBLES</h5>
                                                                                        <div className="space-y-2">
                                                                                            {couponInfo.rangos.filter(rango => rango && (rango.montoMinimo != null || rango.desde != null) && (rango.montoMaximo != null || rango.hasta != null)).map((rango, index) => {
                                                                                                // 🎯 EVALUAR SI EL MONTO ACTUAL ESTÁ EN ESTE RANGO ESPECÍFICO
                                                                                                const amount1Value = parseNumberFromFormatted(amount1);
                                                                                                const amount2Value = parseNumberFromFormatted(amount2);
                                                                                                
                                                                                                // Determinar el monto en USD para comparar
                                                                                                let amountForComparison = 0;
                                                                                                let inputCurrency = 'USD';
                                                                                                
                                                                                                if (operationType === 'venta') {
                                                                                                    // En VENTA: amount1=PEN, amount2=USD
                                                                                                    if (amount2Value > 0) {
                                                                                                        inputCurrency = 'USD';
                                                                                                        amountForComparison = amount2Value; // Ya está en USD
                                                                                                    } else if (amount1Value > 0) {
                                                                                                        inputCurrency = 'PEN';
                                                                                                        const tcBase = CambiaFXService.tcBase[0];
                                                                                                        if (tcBase) {
                                                                                                            amountForComparison = amount1Value / tcBase.tc_venta;
                                                                                                        }
                                                                                                    }
                                                                                                } else {
                                                                                                    // En COMPRA: amount1=USD, amount2=PEN
                                                                                                    if (amount1Value > 0) {
                                                                                                        inputCurrency = 'USD';
                                                                                                        amountForComparison = amount1Value; // Ya está en USD
                                                                                                    } else if (amount2Value > 0) {
                                                                                                        inputCurrency = 'PEN';
                                                                                                        const tcBase = CambiaFXService.tcBase[0];
                                                                                                        if (tcBase) {
                                                                                                            amountForComparison = amount2Value / tcBase.tc_compra;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                
                                                                                                // Evaluar si este rango específico contiene el monto actual
                                                                                                const minAmount = rango.montoMinimo ?? rango.desde ?? 0;
                                                                                                const maxAmount = rango.montoMaximo ?? rango.hasta ?? 0;
                                                                                                const buyRate = rango.tcCompra ?? rango.tc_compra ?? 'N/A';
                                                                                                const sellRate = rango.tcVenta ?? rango.tc_venta ?? 'N/A';
                                                                                                
                                                                                                // Lógica de rangos sin superposición
                                                                                                const rangosValidos = couponInfo.rangos.filter(r => r && (r.montoMinimo != null || r.desde != null) && (r.montoMaximo != null || r.hasta != null));
                                                                                                const isLastRange = index === rangosValidos.length - 1;
                                                                                                const tolerance = 0.1;
                                                                                                
                                                                                                // ✅ VERIFICAR SI EL MONTO ESTÁ EN ESTE RANGO ESPECÍFICO
                                                                                                const isCurrentRange = amountForComparison > 0 && (isLastRange 
                                                                                                    ? (minAmount - tolerance <= amountForComparison && amountForComparison <= maxAmount)  // Último: incluye límite superior
                                                                                                    : (minAmount - tolerance <= amountForComparison && amountForComparison < maxAmount));  // Otros: NO incluye límite superior
                                                                                                
                                                                                                // Mostrar rangos en la moneda correspondiente
                                                                                                let displayMinAmount = minAmount;
                                                                                                let displayMaxAmount = maxAmount;
                                                                                                
                                                                                                if (inputCurrency === 'PEN') {
                                                                                                    // Convertir rangos para mostrar en PEN
                                                                                                    const tcBase = CambiaFXService.tcBase[0];
                                                                                                    if (tcBase) {
                                                                                                        if (operationType === 'venta') {
                                                                                                            displayMinAmount = minAmount * tcBase.tc_venta;
                                                                                                            displayMaxAmount = maxAmount * tcBase.tc_venta;
                                                                                                        } else {
                                                                                                            displayMinAmount = minAmount * tcBase.tc_compra;
                                                                                                            displayMaxAmount = maxAmount * tcBase.tc_compra;
                                                                                                        }
                                                                                                    }
                                                                                                }

                                                                                                // console.log(`🔍 TOOLTIP CORREGIDO - Rango ${index + 1}: min=${minAmount}, max=${maxAmount}, amount=${amountForComparison}, isCurrentRange=${isCurrentRange}, isLast=${isLastRange}`);

                                                                                                return (
                                                                                    <div key={index} className={`flex justify-between items-center p-2 rounded-md text-xs ${
                                                                                        isCurrentRange 
                                                                                            ? 'bg-constrast/20 border border-constrast/40' 
                                                                                            : 'bg-white/5'
                                                                                    }`}>
                                                                                        <span className="font-medium">
                                                                                            {/* 🔧 MOSTRAR RANGOS SEGÚN QUÉ INPUT ESTÁ SIENDO USADO */}
                                                                                            {inputCurrency === 'USD' ? (
                                                                                                `$${(minAmount || 0).toLocaleString()} - $${(maxAmount || 0).toLocaleString()} `
                                                                                            ) : (
                                                                                                `S/${(displayMinAmount || 0).toLocaleString()} - S/${(displayMaxAmount || 0).toLocaleString()} `
                                                                                            )}
                                                                                            {isCurrentRange && <span className="ml-1 text-constrast">✓</span>}
                                                                                        </span>
                                                                                        <div className="flex gap-2 text-xs">
                                                                                            <span>C: {typeof buyRate === 'number' ? buyRate.toFixed(4) : buyRate}</span>
                                                                                            <span>V: {typeof sellRate === 'number' ? sellRate.toFixed(4) : sellRate}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>

                                                                    {/* Mostrar tasas del rango actual */}
                                                                    {getCurrentCouponRange && (
                                                                        <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                                                            <div className="bg-constrast/10 border border-constrast/30 rounded-lg p-2 sm:p-3">
                                                                                <h5 className="text-xs font-semibold text-constrast mb-1">COMPRA</h5>
                                                                                <p className="text-xs sm:text-sm font-bold">S/ {(getCurrentCouponRange.tcCompra ?? getCurrentCouponRange.tc_compra ?? 'N/A').toFixed ? (getCurrentCouponRange.tcCompra ?? getCurrentCouponRange.tc_compra).toFixed(4) : 'N/A'}</p>
                                                                            </div>
                                                                            <div className="bg-constrast/10 border border-constrast/30 rounded-lg p-2 sm:p-3">
                                                                                <h5 className="text-xs font-semibold text-constrast mb-1">VENTA</h5>
                                                                                <p className="text-xs sm:text-sm font-bold">S/ {(getCurrentCouponRange.tcVenta ?? getCurrentCouponRange.tc_venta ?? 'N/A').toFixed ? (getCurrentCouponRange.tcVenta ?? getCurrentCouponRange.tc_venta).toFixed(4) : 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                // Cupón con un solo rango (comportamiento original)
                                                                <>
                                                                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                        <h5 className="text-xs font-semibold text-constrast mb-1 sm:mb-2">RANGO VÁLIDO</h5>
                                                                        <p className="text-xs sm:text-sm font-medium">${couponInfo.montoMinimo} - ${couponInfo.montoMaximo} USD</p>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                                                        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                            <h5 className="text-xs font-semibold text-constrast mb-1">COMPRA</h5>
                                                                            <p className="text-xs sm:text-sm font-bold">S/ {couponInfo.tcCompra.toFixed(4)}</p>
                                                                        </div>
                                                                        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                            <h5 className="text-xs font-semibold text-constrast mb-1">VENTA</h5>
                                                                            <p className="text-xs sm:text-sm font-bold">S/ {couponInfo.tcVenta.toFixed(4)}</p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Estado del cupón */}
                                                        <div className={`rounded-lg px-2 py-2 sm:px-3 text-center ${couponStatus.applies
                                                                ? 'bg-green-500/20 border border-secondary/30'
                                                                : 'bg-yellow-500/20 border border-yellow-400/30'
                                                            }`}>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${couponStatus.applies ? 'bg-secondary' : 'bg-yellow-400'
                                                                    }`}></div>
                                                                <p className="text-xs font-medium">
                                                                    {couponStatus.applies ? '✅ Cupón activo' : '⏳ Cupón disponible'}
                                                                </p>
                                                            </div>
                                                            {!couponStatus.applies && (
                                                                <p className="text-xs text-white/70 mt-1">{couponStatus.reason}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Flecha del tooltip - Responsive */}
                                                    <div className="absolute top-full right-6">
                                                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-neutral-dark"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex gap-2 items-center">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu cupón promocional"
                                            value={promotionalCode}
                                            onChange={(e) => handleCouponChange(e.target.value)}
                                            className="w-full py-4 px-4 pr-12 rounded-xl border-2 border-constrast/30 bg-white text-sm text-neutral-dark placeholder:text-neutral-light/60 focus:outline-none focus:border-constrast focus:ring-4 focus:ring-constrast/20 transition-all duration-200 font-paragraph"
                                            disabled={isValidatingCoupon}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => {
                                                setShowCouponInput(false);
                                                setPromotionalCode('');
                                                // Limpiar cupón del servicio y restaurar TC base
                                                CambiaFXService.validateCoupon(''); // Esto restaura tcBase
                                                setCouponInfo(null);
                                                setInvalidCoupon(null);
                                                
                                                // 🔥 FORZAR ACTUALIZACIÓN INMEDIATA del debounce para refrescar botones
                                                setDebouncedAmount1(amount1);
                                                
                                                updateCurrentRates();
                                                if (amount1) {
                                                    calculateExchange('O');
                                                }
                                            }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-light/60 hover:text-neutral-dark transition-colors p-1 hover:bg-neutral/50 rounded-lg"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Ícono de ayuda dinámico */}
                                    <div className="relative group">
                                        {isConsultingCoupons ? (
                                            // Durante la consulta: Mostrar loading
                                            <button
                                                disabled
                                                className="py-4 px-4 rounded-xl bg-constrast text-white transition-all duration-200 cursor-wait"
                                                title="Consultando cupones disponibles..."
                                            >
                                                {/* Spinner de loading */}
                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>

                                                {/* Tooltip durante loading - Responsive */}
                                                <div className="absolute bottom-full mb-3 opacity-100 transition-all duration-300 pointer-events-none z-50
                                                               w-52 max-w-[calc(100vw-2rem)] right-0 
                                                               sm:w-auto sm:right-0">
                                                    <div className="bg-neutral-dark backdrop-blur-sm text-white rounded-lg shadow-2xl border border-white/10 px-2 py-2 sm:px-3 text-center">
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <p className="text-xs font-medium">🔍 Consultando cupones disponibles...</p>
                                                        </div>
                                                        <div className="absolute top-full right-3">
                                                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-dark"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : invalidCoupon ? (
                                            // Cupón inválido: Mostrar estado de error
                                            <button className="py-4 px-4 rounded-xl bg-red-600  text-white transition-all duration-200">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                {/* Tooltip de cupón inválido - Responsive */}
                                                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50
                                                               w-52 max-w-[calc(100vw-2rem)] right-0 
                                                               sm:w-auto sm:right-0">
                                                    <div className="bg-gradient-to-br from-red-500 to-red-600 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-red-400/20 px-2 py-2 sm:px-3 text-center sm:whitespace-nowrap">
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <p className="text-xs font-medium">{invalidCoupon.message}</p>
                                                        </div>
                                                        <div className="absolute top-full right-3">
                                                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : !couponInfo ? (
                                            // Antes de validar: Consultar cupones disponibles
                                            <button
                                                onClick={handleConsultCoupons}
                                                className="py-3 px-3 rounded-xl bg-constrast hover:bg-neutral-dark text-white transition-all duration-200 group"
                                                title="Consultar cupones disponibles"
                                            >
                                                <Search />

                                                {/* Tooltip para consultar - Responsive */}
                                                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50
                                                               w-48 max-w-[calc(100vw-2rem)] right-0 
                                                               sm:w-auto sm:right-0">
                                                    <div className="bg-neutral-dark backdrop-blur-sm text-white rounded-lg shadow-2xl border border-white/10 px-2 py-2 sm:px-3 text-center sm:whitespace-nowrap">
                                                        <p className="text-xs font-medium">💡 Click aqui para validar el cupón</p>
                                                        <div className="absolute top-full right-3">
                                                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-dark"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            // Después de validar: Muestra detalles del cupón en hover
                                            <button className="py-4 px-4 rounded-xl bg-green-600 text-white transition-all duration-200">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13L3 16L4 10.5L0 6.75L5.5 6L8 1Z" fill="currentColor" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Tooltip detallado del cupón validado - Responsive */}
                                        {couponInfo && (
                                            <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50
                                                           w-72 max-w-[calc(100vw-2rem)] right-0 
                                                           sm:w-72 sm:right-0">
                                                <div className="bg-neutral-dark backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                                                    <div className="px-3 py-3 sm:px-5 sm:py-4">
                                                        {/* Header del tooltip */}
                                                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-secondary to-green-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-4 sm:h-4">
                                                                    <path d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13L3 16L4 10.5L0 6.75L5.5 6L8 1Z" fill="white" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-secondary text-xs sm:text-sm truncate">CUPÓN {couponInfo.codigo}</h4>
                                                                <p className="text-xs text-white">✅ Validado y aplicado</p>
                                                            </div>
                                                        </div>

                                                        {/* Detalles del cupón */}
                                                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                                            {/* Si tiene múltiples rangos, mostrar cada uno */}
                                                            {couponInfo.rangos && couponInfo.rangos.length > 1 ? (
                                                                <>
                                                                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                        <h5 className="text-xs font-semibold text-secondary mb-2">RANGOS DISPONIBLES</h5>
                                                                        <div className="space-y-2">
                                                                            {couponInfo.rangos.filter(rango => rango && (rango.montoMinimo != null || rango.desde != null) && (rango.montoMaximo != null || rango.hasta != null)).map((rango, index) => {
                                                                                // 🎯 EVALUAR SI EL MONTO ACTUAL ESTÁ EN ESTE RANGO ESPECÍFICO (SEGUNDA INSTANCIA)
                                                                                const amount1Value = parseNumberFromFormatted(amount1);
                                                                                const amount2Value = parseNumberFromFormatted(amount2);
                                                                                
                                                                                // Determinar el monto en USD para comparar
                                                                                let amountForComparison = 0;
                                                                                
                                                                                if (operationType === 'venta') {
                                                                                    // En VENTA: amount1=PEN, amount2=USD
                                                                                    if (amount2Value > 0) {
                                                                                        amountForComparison = amount2Value; // Ya está en USD
                                                                                    } else if (amount1Value > 0) {
                                                                                        const tcBase = CambiaFXService.tcBase[0];
                                                                                        if (tcBase) {
                                                                                            amountForComparison = amount1Value / tcBase.tc_venta;
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    // En COMPRA: amount1=USD, amount2=PEN
                                                                                    if (amount1Value > 0) {
                                                                                        amountForComparison = amount1Value; // Ya está en USD
                                                                                    } else if (amount2Value > 0) {
                                                                                        const tcBase = CambiaFXService.tcBase[0];
                                                                                        if (tcBase) {
                                                                                            amountForComparison = amount2Value / tcBase.tc_compra;
                                                                                        }
                                                                                    }
                                                                                }
                                                                                
                                                                                // Evaluar si este rango específico contiene el monto actual
                                                                                const minAmountOriginal = rango.montoMinimo ?? rango.desde ?? 0;
                                                                                const maxAmountOriginal = rango.montoMaximo ?? rango.hasta ?? 0;
                                                                                const buyRate = rango.tcCompra ?? rango.tc_compra ?? 'N/A';
                                                                                const sellRate = rango.tcVenta ?? rango.tc_venta ?? 'N/A';
                                                                                
                                                                                // Lógica de rangos sin superposición
                                                                                const rangosValidos = couponInfo.rangos.filter(r => r && (r.montoMinimo != null || r.desde != null) && (r.montoMaximo != null || r.hasta != null));
                                                                                const isLastRange = index === rangosValidos.length - 1;
                                                                                const tolerance = 0.1;
                                                                                
                                                                                // ✅ VERIFICAR SI EL MONTO ESTÁ EN ESTE RANGO ESPECÍFICO
                                                                                const isCurrentRange = amountForComparison > 0 && (isLastRange 
                                                                                    ? (minAmountOriginal - tolerance <= amountForComparison && amountForComparison <= maxAmountOriginal)  // Último: incluye límite superior
                                                                                    : (minAmountOriginal - tolerance <= amountForComparison && amountForComparison < maxAmountOriginal));  // Otros: NO incluye límite superior

                                                                                // console.log(`🔍 SEGUNDO TOOLTIP CORREGIDO - Rango ${index + 1}: min=${minAmountOriginal}, max=${maxAmountOriginal}, amount=${amountForComparison}, isCurrentRange=${isCurrentRange}, isLast=${isLastRange}`);

                                                                                return (
                                                                                    <div key={index} className={`flex justify-between items-center p-2 rounded-md text-xs ${
                                                                                        isCurrentRange 
                                                                                            ? 'bg-secondary/20 border border-secondary/40' 
                                                                                            : 'bg-white/5'
                                                                                    }`}>
                                                                                        <span className="font-medium">
                                                                                            ${(minAmountOriginal || 0).toLocaleString()} - ${(maxAmountOriginal || 0).toLocaleString()} 
                                                                                            {isCurrentRange && <span className="ml-1 text-secondary">✓</span>}
                                                                                        </span>
                                                                                        <div className="flex gap-2 text-xs">
                                                                                            <span>C: {typeof buyRate === 'number' ? buyRate.toFixed(3) : buyRate}</span>
                                                                                            <span>V: {typeof sellRate === 'number' ? sellRate.toFixed(3) : sellRate}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>

                                                                    {/* Mostrar tasas del rango actual */}
                                                                    {getCurrentCouponRange && (
                                                                        <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                                                            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-2 sm:p-3">
                                                                                <h5 className="text-xs font-semibold text-secondary mb-1">COMPRA</h5>
                                                                                <p className="text-xs sm:text-sm font-bold">S/ {(getCurrentCouponRange.tcCompra ?? getCurrentCouponRange.tc_compra ?? 'N/A').toFixed ? (getCurrentCouponRange.tcCompra ?? getCurrentCouponRange.tc_compra).toFixed(3) : 'N/A'}</p>
                                                                            </div>
                                                                            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-2 sm:p-3">
                                                                                <h5 className="text-xs font-semibold text-secondary mb-1">VENTA </h5>
                                                                                <p className="text-xs sm:text-sm font-bold">S/ {(getCurrentCouponRange.tcVenta ?? getCurrentCouponRange.tc_venta ?? 'N/A').toFixed ? (getCurrentCouponRange.tcVenta ?? getCurrentCouponRange.tc_venta).toFixed(3) : 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                // Cupón con un solo rango (comportamiento original)
                                                                <>
                                                                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                        <h5 className="text-xs font-semibold text-secondary mb-1 sm:mb-2">RANGO VÁLIDO</h5>
                                                                        <p className="text-xs sm:text-sm font-medium">${couponInfo.montoMinimo} - ${couponInfo.montoMaximo} USD</p>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                                                        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                            <h5 className="text-xs font-semibold text-secondary mb-1">COMPRA</h5>
                                                                            <p className="text-xs sm:text-sm font-medium">S/ {couponInfo.tcCompra.toFixed(4)}</p>
                                                                        </div>
                                                                        <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                                                                            <h5 className="text-xs font-semibold text-secondary mb-1">VENTA</h5>
                                                                            <p className="text-xs sm:text-sm font-medium">S/ {couponInfo.tcVenta.toFixed(4)}</p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Estado del cupón */}
                                                        <div className="border rounded-lg px-2 py-2 sm:px-3 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <p className="text-xs font-medium">🎉 Cupón activo</p>
                                                            </div>
                                                            <p className="text-xs text-white/70 mt-1">Disfruta de tu tasa preferencial</p>
                                                        </div>
                                                    </div>

                                                    {/* Flecha del tooltip - Responsive */}
                                                    <div className="absolute top-full right-6">
                                                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-neutral-dark"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Info Message */}
            <div className="bg-white rounded-xl p-4 text-xs text-neutral-light mt-2">
                Operaciones mayores a USD 5,000.00. Consigue un tipo de cambio preferencial{' '}
                <WhatsAppButton><span className="text-constrast underline font-medium">AQUÍ</span> </WhatsAppButton>
            </div>

            {/* Exchange Rate Display */}
            {/*currentTc > 0 && (
                <div className="text-center text-neutral-light text-sm">
                    Tipo de cambio: <span className="font-semibold">S/ {currentTc.toFixed(4)}</span>
                </div>
            )*/}

            {/* Start Operation Button */}
            <button
                onClick={handleOperationStart}
                className="mt-3 py-4 rounded-full bg-neutral-dark text-white font-semibold tracking-wider text-sm w-full hover:bg-constrast transition-all duration-200"
            >
                INICIAR OPERACIÓN
            </button>

            {/* Modal Informativo del Cupón 
            
             {showCouponModal && couponInfo && (
                <div className="fixed inset-0 bg-neutral-dark/80 backdrop-blur-sm flex items-center justify-center z-[100000] p-4">
                    <div className="bg-primary rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-neutral/20">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-constrast to-constrast/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-constrast/30">
                                <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27 12L12 27L5 20" stroke="#F9F3E0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-dark mb-3 font-title">
                                ¡Cupón {couponInfo.codigo} Validado!
                            </h3>
                            <div className="bg-neutral/30 rounded-2xl p-5 mb-6 text-left">
                                <h4 className="font-bold text-neutral-dark mb-3 flex items-center gap-2 font-title">
                                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13L3 16L4 10.5L0 6.75L5.5 6L8 1Z" fill="#0C0C0C"/>
                                        </svg>
                                    </div>
                                    Detalles del cupón:
                                </h4>
                                <ul className="text-sm text-neutral-light space-y-2 font-paragraph">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-constrast rounded-full"></span>
                                        Rango válido: <span className="font-semibold text-constrast">${couponInfo.montoMinimo} - ${couponInfo.montoMaximo} USD</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-constrast rounded-full"></span>
                                        Tasa de compra: <span className="font-semibold text-constrast">S/ {couponInfo.tcCompra.toFixed(4)}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-constrast rounded-full"></span>
                                        Tasa de venta: <span className="font-semibold text-constrast">S/ {couponInfo.tcVenta.toFixed(4)}</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-sm text-neutral-light mb-6 font-paragraph leading-relaxed">
                                El cupón se aplicará automáticamente cuando el monto esté dentro del rango válido.
                            </p>
                            <button
                                onClick={() => setShowCouponModal(false)}
                                className="w-full py-4 bg-gradient-to-r from-constrast to-constrast/90 text-primary rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-constrast/30 transition-all duration-300 font-title tracking-wide"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            */}

        </div>
    );
};

export default ExchangeCard;
