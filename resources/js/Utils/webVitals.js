/**
 * Web Vitals Monitoring
 * 
 * Sistema de monitoreo de Core Web Vitals para producción
 * Reporta métricas a Google Analytics y console (desarrollo)
 */

/**
 * Reportar Web Vitals a Analytics
 * 
 * @param {Object} metric - Objeto de métrica de web-vitals
 */
const sendToAnalytics = (metric) => {
    const { name, value, id, navigationType } = metric;

    // Redondear valor para reducir cardinalidad
    const roundedValue = Math.round(name === 'CLS' ? value * 1000 : value);

    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: id,
            value: roundedValue,
            metric_id: id,
            metric_value: roundedValue,
            metric_delta: metric.delta,
            navigation_type: navigationType,
            non_interaction: true,
        });
    }

    // Console en desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.group(`%c🚀 Web Vital: ${name}`, 'color: #4CAF50; font-weight: bold');
        console.log('Value:', roundedValue, getUnit(name));
        console.log('Rating:', getRating(name, value));
        console.log('Navigation Type:', navigationType);
        console.log('ID:', id);
        console.groupEnd();
    }

    // API personalizada (opcional)
    if (typeof window !== 'undefined' && window.VITALS_ENDPOINT) {
        sendToCustomEndpoint(metric);
    }
};

/**
 * Enviar a endpoint personalizado
 */
const sendToCustomEndpoint = (metric) => {
    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
    });

    // Usar sendBeacon para no bloquear la página
    if (navigator.sendBeacon) {
        navigator.sendBeacon(window.VITALS_ENDPOINT, body);
    } else {
        fetch(window.VITALS_ENDPOINT, {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
        }).catch(console.error);
    }
};

/**
 * Obtener unidad de medida
 */
const getUnit = (name) => {
    switch (name) {
        case 'CLS':
            return '(score)';
        case 'FID':
        case 'INP':
        case 'TTFB':
        case 'FCP':
        case 'LCP':
            return 'ms';
        default:
            return '';
    }
};

/**
 * Obtener rating de la métrica
 */
const getRating = (name, value) => {
    const thresholds = {
        LCP: { good: 2500, poor: 4000 },
        FID: { good: 100, poor: 300 },
        CLS: { good: 0.1, poor: 0.25 },
        INP: { good: 200, poor: 500 },
        FCP: { good: 1800, poor: 3000 },
        TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return '✅ good';
    if (value <= threshold.poor) return '⚠️ needs-improvement';
    return '❌ poor';
};

/**
 * Inicializar monitoreo de Web Vitals
 * 
 * @param {Function} onReport - Callback personalizado (opcional)
 * 
 * @example
 * // En tu componente principal (Home.jsx, App.jsx)
 * import { reportWebVitals } from './Utils/webVitals';
 * 
 * useEffect(() => {
 *   reportWebVitals();
 * }, []);
 */
export function reportWebVitals(onReport) {
    if (typeof window === 'undefined') return;

    // Cargar librería de web-vitals solo en cliente
    import('web-vitals')
        .then(({ onCLS, onFCP, onLCP, onINP, onTTFB, onFID }) => {
            const reporter = onReport || sendToAnalytics;

            // Core Web Vitals
            onCLS(reporter);    // Cumulative Layout Shift
            onFCP(reporter);    // First Contentful Paint
            onLCP(reporter);    // Largest Contentful Paint
            onINP(reporter);    // Interaction to Next Paint
            onTTFB(reporter);   // Time to First Byte

            // FID (legacy, pero aún útil)
            if (onFID) {
                onFID(reporter);
            }
        })
        .catch((error) => {
            console.error('Failed to load web-vitals:', error);
        });
}

/**
 * Obtener métricas de Performance API
 * Útil para debugging y análisis detallado
 */
export function getPerformanceMetrics() {
    if (typeof window === 'undefined' || !window.performance) {
        return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
        // Navigation Timing
        dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
        tcp: navigation?.connectEnd - navigation?.connectStart,
        request: navigation?.responseStart - navigation?.requestStart,
        response: navigation?.responseEnd - navigation?.responseStart,
        domLoading: navigation?.domInteractive - navigation?.domLoading,
        domInteractive: navigation?.domInteractive - navigation?.fetchStart,
        domComplete: navigation?.domComplete - navigation?.fetchStart,
        loadComplete: navigation?.loadEventEnd - navigation?.fetchStart,

        // Paint Timing
        fcp: paint?.find(p => p.name === 'first-contentful-paint')?.startTime,
        lcp: null, // Se obtiene con onLCP

        // Resource Timing
        resources: performance.getEntriesByType('resource').length,
        
        // Memory (si está disponible)
        memory: performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
        } : null,
    };
}

/**
 * Marcar evento personalizado para Performance Timeline
 */
export function markPerformance(name) {
    if (typeof window !== 'undefined' && window.performance?.mark) {
        performance.mark(name);
    }
}

/**
 * Medir tiempo entre dos marcas
 */
export function measurePerformance(name, startMark, endMark) {
    if (typeof window !== 'undefined' && window.performance?.measure) {
        try {
            performance.measure(name, startMark, endMark);
            const measure = performance.getEntriesByName(name)[0];
            
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Performance Measure] ${name}: ${measure.duration.toFixed(2)}ms`);
            }
            
            return measure.duration;
        } catch (e) {
            console.warn('Performance measure failed:', e);
            return null;
        }
    }
    return null;
}

/**
 * Observar Long Tasks (tareas >50ms que bloquean el main thread)
 */
export function observeLongTasks(callback) {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return null;
    }

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    callback({
                        name: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime,
                    });

                    if (process.env.NODE_ENV === 'development') {
                        console.warn(
                            `⚠️ Long Task detected: ${entry.duration.toFixed(2)}ms`,
                            entry
                        );
                    }
                }
            }
        });

        observer.observe({ entryTypes: ['longtask'] });
        return observer;
    } catch (e) {
        console.warn('Long Task Observer not supported:', e);
        return null;
    }
}

/**
 * Observar Layout Shifts
 */
export function observeLayoutShifts(callback) {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return null;
    }

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    callback({
                        value: entry.value,
                        sources: entry.sources,
                        startTime: entry.startTime,
                    });

                    if (process.env.NODE_ENV === 'development' && entry.value > 0.1) {
                        console.warn(
                            `⚠️ Layout Shift detected: ${entry.value.toFixed(4)}`,
                            entry.sources
                        );
                    }
                }
            }
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        return observer;
    } catch (e) {
        console.warn('Layout Shift Observer not supported:', e);
        return null;
    }
}

/**
 * Configurar endpoint personalizado para métricas
 */
export function setVitalsEndpoint(url) {
    if (typeof window !== 'undefined') {
        window.VITALS_ENDPOINT = url;
    }
}

export default {
    reportWebVitals,
    getPerformanceMetrics,
    markPerformance,
    measurePerformance,
    observeLongTasks,
    observeLayoutShifts,
    setVitalsEndpoint,
};
