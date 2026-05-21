import React from 'react';
import { useCounterAnimation } from '../../../hooks/useCounterAnimation';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const AnimatedIndicator = ({ indicator, index }) => {
    // Función mejorada para extraer números de diferentes formatos
    const extractNumber = (text) => {
        // Buscar patrones más específicos para formatos como *+*5000
        const patterns = [
            /\*\+\*(\d+(?:,\d+)*(?:\.\d+)?)[Kk]?/,   // Patrón específico para *+*número con K opcional
            /\*\+\*(\d+(?:,\d+)*(?:\.\d+)?)/,       // Patrón específico para *+*número
            /(\d+(?:,\d+)*(?:\.\d+)?)\s*[MmKk]?/,  // Números con M, K, etc.
            /(\d+(?:,\d+)*(?:\.\d+)?)\+?/,          // Números con o sin +
            /(\d+(?:\.\d+)?)/                        // Números simples
        ];
        
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                let number = parseFloat(match[1].replace(/,/g, ''));
                
                // Manejar sufijos como K, M (solo si NO está en formato *+*)
                if (!text.includes('*+*')) {
                    if (text.includes('K') || text.includes('k')) {
                        number *= 1000;
                    } else if (text.includes('M') || text.includes('m')) {
                        number *= 1000000;
                    }
                } else if (text.includes('*+*') && (text.includes('k') || text.includes('K'))) {
                    // Para formato *+*134k, multiplicar por 1000
                    number *= 1000;
                }
                
                return number;
            }
        }
        return 0;
    };

    // Función para determinar si tiene decimales
    const hasDecimals = (text) => {
        const match = text.match(/\d+\.(\d+)/);
        return match ? match[1].length : 0;
    };

    const targetNumber = extractNumber(indicator.name);
    const decimals = hasDecimals(indicator.name);
    
    const { currentValue, elementRef, isVisible } = useCounterAnimation(
        targetNumber, 
        2500, 
        true, 
        { 
            decimals,
            easingFunction: 'easeOutCubic',
            threshold: 0.2 
        }
    );

    // Formatear el número manteniendo el formato original
    const formatNumber = (num) => {
        const originalText = indicator.name;
        
        // Redondear el número para evitar decimales en la animación
        const roundedNum = Math.round(num);
        
        if (originalText.includes('*+*')) {
            if (originalText.includes('k') || originalText.includes('K')) {
                // Para formato *+*134k - mostrar siempre el formato durante la animación
                const kValue = Math.round(roundedNum / 1000);
                return '*+*' + kValue + 'k';
            } else {
                // Para formato *+*5900 - mostrar siempre el formato durante la animación
                return '*+*' + roundedNum.toLocaleString('en-US');
            }
        } else if (originalText.includes('M') || originalText.includes('m')) {
            return (roundedNum / 1000000).toFixed(decimals) + 'M';
        } else if (originalText.includes('K') || originalText.includes('k')) {
            // Para formato como +36k, dividir por 1000 y mostrar formato durante animación
            const kValue = Math.round(roundedNum / 1000);
            return (originalText.includes('+') ? '+' : '') + kValue + 'k';
        } else if (originalText.includes('+')) {
            return roundedNum.toLocaleString('en-US') + '+';
        } else {
            return decimals > 0 ? roundedNum.toFixed(decimals) : roundedNum.toLocaleString('en-US');
        }
    };

    // Reconstruir el texto con el número animado
    const getAnimatedText = () => {
        if (targetNumber === 0) {
            return indicator.name;
        }
        
        const formattedNumber = formatNumber(currentValue);
        
        // Simplemente devolver el número formateado ya que formatNumber maneja todos los casos
        return formattedNumber;
    };

    return (
        <div 
            ref={elementRef} 
            className={`flex flex-col items-center text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
                transitionDelay: `${index * 150}ms` // Stagger animation for multiple indicators
            }}
        >
            <div className={`w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
            }`}>
                <img 
                    src={`/api/indicator/media/${indicator.symbol}`} 
                    alt={indicator.name} 
                    className="w-12 h-12 transition-all duration-300" 
                />
            </div>
            <div className={`text-4xl md:text-[56px] font-semibold text-neutral-dark mb-2 transition-all duration-300 ${
                isVisible ? 'scale-100' : 'scale-95'
            }`}>
                <TextWithHighlight 
                    text={getAnimatedText()} 
                    color="bg-constrast" 
                />
            </div>
            <div className={`text-neutral-dark transition-all duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                <TextWithHighlight 
                    text={indicator.description} 
                    color="bg-neutral-light font-semibold" 
                />
            </div>
        </div>
    );
};

export default AnimatedIndicator;
