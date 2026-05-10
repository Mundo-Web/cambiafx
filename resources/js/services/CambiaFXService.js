import axios from 'axios';

class CambiaFXService {
    constructor() {
        this.baseURL = 'https://apiluna.cambiafx.pe/api/BackendPizarra';
        this.tcData = [];
        this.tcBase = [];
        this.tcBaseOriginal = null;
        this.idParCurrency = 1;
    }

    async getExchangeRates() {
        try {
            const response = await axios.get(`${this.baseURL}/getTcCustomerNoAuth`, {
                params: {
                    idParCurrency: this.idParCurrency
                },
                timeout: 8000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            let realTimeData = [];
            
            if (Array.isArray(response.data)) {
                realTimeData = response.data;
            } else {
                throw new Error('Formato de respuesta inesperado: ' + JSON.stringify(response.data));
            }
            
            if (realTimeData.length === 0) {
                throw new Error('No se obtuvieron datos de tipos de cambio');
            }
            
            const processedData = realTimeData.map(item => ({
                id: item.idRange || 0,
                desde: parseFloat(item.tcFrom || 0),
                hasta: parseFloat(item.tcTo || 999999),
                tc_compra: parseFloat(item.tcBuy || 0),
                tc_venta: parseFloat(item.tcSale || 0),
                coupon: item.coupon,
                amountMinOperation: parseFloat(item.amountMinOperation || 0),
                amountMaxOperation: parseFloat(item.amountMaxOperation || 0)
            }));
            
            this.tcBase = processedData;
            this.tcData = [...processedData];
            
            if (processedData.length > 0) {
                this.tcBaseOriginal = {
                    tc_compra: processedData[0].tc_compra,
                    tc_venta: processedData[0].tc_venta
                };
            }
            
            return processedData;
            
        } catch (error) {
            const fallbackData = [
                { id: 1, desde: 0, hasta: 1000, tc_compra: 3.5330, tc_venta: 3.5650 },
                { id: 2, desde: 1001, hasta: 5000, tc_compra: 3.5340, tc_venta: 3.5660 },
                { id: 3, desde: 5001, hasta: 10000, tc_compra: 3.5350, tc_venta: 3.5670 },
                { id: 4, desde: 10001, hasta: 999999, tc_compra: 3.5360, tc_venta: 3.5680 }
            ];
            
            this.tcBase = fallbackData;
            this.tcData = [...fallbackData];
            
            if (fallbackData.length > 0) {
                this.tcBaseOriginal = {
                    tc_compra: fallbackData[0].tc_compra,
                    tc_venta: fallbackData[0].tc_venta
                };
            }
            
            return fallbackData;
        }
    }

    async validateCoupon(couponCode) {
        try {
            if (!couponCode || !couponCode.trim()) {
                this.tcData = [...this.tcBase];
                return { valid: false, data: this.tcData };
            }

            const response = await axios.get(`${this.baseURL}/getTcCustomerNoAuth`, {
                params: {
                    idParCurrency: this.idParCurrency,
                    codePromo: couponCode
                },
                timeout: 8000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            let tcData = null;
            
            if (Array.isArray(response.data) && response.data.length > 0) {
                tcData = response.data;
            } else {
                throw new Error('Cupón no válido o sin datos');
            }
            
            if (tcData && tcData.length > 0) {
                const processedData = tcData.map(item => ({
                    id: item.idRange,
                    desde: parseFloat(item.tcFrom || 0),
                    hasta: parseFloat(item.tcTo || 999999),
                    tc_compra: parseFloat(item.tcBuy),
                    tc_venta: parseFloat(item.tcSale),
                    coupon: item.coupon,
                    amountMinOperation: parseFloat(item.amountMinOperation || 0),
                    amountMaxOperation: parseFloat(item.amountMaxOperation || 0)
                }));
                
                // ✅ ACTUALIZAMOS los datos con el cupón para que se use en los cálculos
                this.tcData = processedData;
              //  console.log(`🎫 Cupón aplicado: ${couponCode}`, processedData);
                
                return { valid: true, data: processedData };
            }
            
            this.tcData = [...this.tcBase];
            return { valid: false, data: this.tcData, message: 'El código de promoción no es válido.' };
            
        } catch (error) {
            this.tcData = [...this.tcBase];
            return { valid: false, data: this.tcData, message: 'Error al validar el código de promoción.' };
        }
    }

    // El método getTCFromAmount() se ha reemplazado por la versión actualizada más abajo

    getTCFromBase(amount, operationType = 'venta') {
        for (let obj of this.tcBase) {
            if (obj.desde <= amount && amount <= obj.hasta) {
                const tc = operationType === 'V' ? obj.tc_venta : obj.tc_compra;
                return tc;
            }
        }
        
        if (this.tcBase.length > 0) {
            const lastObj = this.tcBase[this.tcBase.length - 1];
            const tc = operationType === 'V' ? lastObj.tc_venta : lastObj.tc_compra;
            return tc;
        }
        
        return 0;
    }

    // � MÉTODO CALCULATEEXCHANGE SEGÚN DOCUMENTACIÓN CAMBIAFX
    calculateExchange(amount, operationType = 'V', origin = 'from') {
        let total = 0;
        
        // Mapear parámetros al formato de la documentación
        const mappedOrigin = origin === 'from' ? 'O' : 'D';
        
        // Paso 1: Obtener el tipo de cambio correspondiente
        const _tc = this.getTCFromAmount(amount, operationType, mappedOrigin);

        // Paso 2: Calcular el monto convertido según documentación CambiaFX
        // VENTA = soles → dólares (dividir por TC)
        // COMPRA = dólares → soles (multiplicar por TC)  
        const isVenta = operationType === 'V' || operationType === 'venta';
        
        if (mappedOrigin === 'O') {
            total = isVenta ? amount / _tc : amount * _tc;
        } else if (mappedOrigin === 'D') {
            total = isVenta ? amount * _tc : amount / _tc;
        }

        // Redondear a 2 decimales para montos
        total = Math.round(total * 100) / 100;

     //   console.log(`🔁 calculateExchange: ${amount} (${mappedOrigin}) → ${total} (TC: ${_tc}, isVenta: ${isVenta})`);

        return {
            result: parseFloat(total.toFixed(2)),
            exchangeRate: _tc,
            operation: operationType
        };
    }

    // 🧠 IMPLEMENTACIÓN SEGÚN DOCUMENTACIÓN CAMBIAFX - MÉTODO PRINCIPAL
    getTCFromAmount(amount, operationType = 'V', origin = 'O') {
        if (!amount || amount <= 0) {
            if (this.tcData.length > 0) {
                const obj = this.tcData[0];
                const tc = operationType === 'C' ? obj.tc_compra : obj.tc_venta;
                return tc;
            }
            return 0;
        }

        // Mapear formato de operationType a boolean isBuy
        const isBuy = operationType === 'C' || operationType === 'compra';
        
        // Determinar si el monto está en PEN según la documentación
        const isPenCurrency = this.isPenCurrency(origin, isBuy);

        // Obtener el rango de tipo de cambio según la moneda
        const objTC = isPenCurrency
            ? this.getTcRangePEN(this.tcData, amount, isBuy)
            : this.getTcRangeUSD(this.tcData, amount);

        if (!objTC) {
            // Fallback a tasas base
            const baseRates = this.tcBase[0] || { tc_compra: 0, tc_venta: 0 };
            return isBuy ? baseRates.tc_compra : baseRates.tc_venta;
        }

        // Retorna el tipo de cambio (buy o sell)
        return isBuy ? objTC.tc_compra : objTC.tc_venta;
    }

    // 💰 ¿El monto ingresado está en Soles? (según documentación CambiaFX)
    isPenCurrency(origin = 'O', isBuy = false) {
        // IMPORTANTE: Corrección de lógica final
        // VENTA = Usuario vende dólares por soles (PEN → USD) - ingresa soles, obtiene dólares
        // COMPRA = Usuario compra dólares con soles (USD → PEN) - ingresa dólares, obtiene soles
        const typeOperation = isBuy ? 'compra' : 'venta';

        if (typeOperation === 'venta' && origin === 'O') return true;  // PEN (input soles para obtener USD)
        if (typeOperation === 'compra' && origin === 'D') return true;   // PEN (recibe soles al ingresar USD)

        return false; // USD
    }

    // 🔸 Para montos en Soles: getTcRangePEN (según documentación CambiaFX)
    getTcRangePEN(dataRangesTc = [], amount = 0, isBuy = false) {
        const typeOperation = isBuy ? 'compra' : 'venta';

        if (!amount) {
            return dataRangesTc[0] ?? null;
        }

        for (const data of dataRangesTc) {
            const tc = typeOperation === 'compra' ? data.tc_compra : data.tc_venta;
            const amountUsd = Number((amount / tc).toFixed(2));

            // Usar desde/hasta para evaluar rangos
            const from = data.desde || data.from || 0;
            const to = data.hasta || data.to || 0;

            if (amountUsd >= from && amountUsd < to) return data;
        }

        return dataRangesTc[dataRangesTc.length - 1] ?? null;
    }

    // 🔹 Para montos en Dólares: getTcRangeUSD (según documentación CambiaFX)
    getTcRangeUSD(dataRangesTc = [], amount = 0) {
        let objTC = null;

        if (amount) {
            for (const obj of dataRangesTc) {
                const from = obj.desde || obj.from || 0;
                const to = obj.hasta || obj.to || 0;
                
                if (from <= amount && amount < to) {
                    objTC = obj;
                    break; // Salir del loop
                }
            }
            objTC = objTC ?? (dataRangesTc[dataRangesTc.length - 1] ?? null);
        } else {
            objTC = dataRangesTc[0] ?? null;
        }

        return objTC;
    }

    getCurrentRates() {
        if (this.tcData.length === 0) {
            return { compra: '3.5330', venta: '3.5650' };
        }
        
        const rates = this.tcData[0];
        
        const result = {
            compra: rates.tc_compra.toFixed(4),
            venta: rates.tc_venta.toFixed(4)
        };
        
        return result;
    }

    formatNumberToString(num) {
        if (!num || isNaN(num)) {
            return '';
        }
        const result = num.toFixed(2);
        return result;
    }

    formatStringToNumber(str) {
        if (!str) {
            return 0;
        }
        const result = parseFloat(str.toString().replace(/,/g, '')) || 0;
        return result;
    }

    async initializeOperation(operationData) {
        try {
            const url = 'https://mi.cambiafx.pe/login';
            window.location.href = url;
            
            return { success: true, redirectUrl: url };
        } catch (error) {
            throw error;
        }
    }

    async getCompetitionRates(landingUrl = null) {
        try {
            const response = await axios.get('/api/competition-rates', {
                params: { url: landingUrl }
            });
            
            if (response.data && response.data.status === 200) {
                return response.data.data;
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching competition rates:', error);
            return [];
        }
    }

    checkUrlCoupon() {
        const urlParams = new URLSearchParams(window.location.search);
        const couponCode = urlParams.get('utm_campaign');
        
        return couponCode;
    }
}

const cambiaFXServiceInstance = new CambiaFXService();

export default cambiaFXServiceInstance;
