/**
 * Utilidades de Performance y Optimización
 * 
 * Funciones para mejorar el rendimiento de la aplicación
 * incluyendo throttle, debounce, idle callbacks, y más.
 */

/**
 * Throttle - Limita la frecuencia de ejecución de una función
 * Útil para eventos que se disparan muchas veces (scroll, resize)
 * 
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Tiempo mínimo entre ejecuciones (ms)
 * @returns {Function} Función throttled
 * 
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scrolling...');
 * }, 200);
 * 
 * window.addEventListener('scroll', handleScroll);
 */
export const throttle = (func, delay) => {
    let lastCall = 0;
    let timeoutId = null;

    return function throttled(...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;

        const execute = () => {
            lastCall = now;
            func.apply(this, args);
        };

        if (timeSinceLastCall >= delay) {
            execute();
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(execute, delay - timeSinceLastCall);
        }
    };
};

/**
 * Debounce - Retrasa la ejecución hasta que pasen X ms sin nuevas llamadas
 * Útil para búsquedas, validaciones, auto-save
 * 
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Tiempo de espera (ms)
 * @returns {Function} Función debounced
 * 
 * @example
 * const searchProducts = debounce((query) => {
 *   fetchResults(query);
 * }, 300);
 * 
 * input.addEventListener('input', (e) => searchProducts(e.target.value));
 */
export const debounce = (func, delay) => {
    let timeoutId;

    return function debounced(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

/**
 * Request Idle Callback con fallback
 * Ejecuta código cuando el navegador está inactivo
 * 
 * @param {Function} callback - Función a ejecutar
 * @param {Object} options - Opciones (timeout)
 * @returns {number} ID del callback
 * 
 * @example
 * scheduleIdleTask(() => {
 *   // Cargar componentes no críticos
 *   loadAnalytics();
 * });
 */
export const scheduleIdleTask = (callback, options = {}) => {
    const { timeout = 2000 } = options;

    if (typeof window === 'undefined') {
        setTimeout(callback, 0);
        return -1;
    }

    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, { timeout });
    }

    // Fallback para navegadores sin soporte
    return setTimeout(callback, timeout);
};

/**
 * Cancelar idle callback
 * 
 * @param {number} id - ID del callback a cancelar
 */
export const cancelIdleTask = (id) => {
    if (typeof window === 'undefined' || id === -1) return;

    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
    } else {
        clearTimeout(id);
    }
};

/**
 * Lazy load de módulos/componentes con preload opcional
 * 
 * @param {Function} importFunc - Función de import dinámico
 * @param {Object} options - Opciones de carga
 * @returns {Promise} Módulo cargado
 * 
 * @example
 * const LazyComponent = lazy(() => 
 *   lazyLoad(() => import('./HeavyComponent'), { 
 *     preload: true 
 *   })
 * );
 */
export const lazyLoad = (importFunc, options = {}) => {
    const { preload = false, delay = 0 } = options;

    let modulePromise = null;

    // Preload si está habilitado
    if (preload && typeof window !== 'undefined') {
        scheduleIdleTask(() => {
            modulePromise = importFunc();
        });
    }

    return () => {
        if (delay > 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(modulePromise || importFunc());
                }, delay);
            });
        }

        return modulePromise || importFunc();
    };
};

/**
 * Observador de intersección optimizado
 * Útil para lazy loading de imágenes y componentes
 * 
 * @param {Function} callback - Función a ejecutar cuando el elemento es visible
 * @param {Object} options - Opciones del IntersectionObserver
 * @returns {IntersectionObserver} Observer
 * 
 * @example
 * const observer = createIntersectionObserver((entries) => {
 *   entries.forEach(entry => {
 *     if (entry.isIntersecting) {
 *       loadImage(entry.target);
 *     }
 *   });
 * }, { threshold: 0.1 });
 * 
 * observer.observe(imageElement);
 */
export const createIntersectionObserver = (callback, options = {}) => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        // Fallback: ejecutar inmediatamente
        return {
            observe: () => callback([{ isIntersecting: true }]),
            unobserve: () => {},
            disconnect: () => {},
        };
    }

    const defaultOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
    };

    return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Dividir tareas largas en chunks pequeños
 * Previene bloqueo del main thread (mejora INP)
 * 
 * @param {Array} items - Items a procesar
 * @param {Function} processItem - Función para procesar cada item
 * @param {Object} options - Opciones
 * @returns {Promise} Promesa que resuelve cuando termina
 * 
 * @example
 * await processInChunks(largeArray, (item) => {
 *   // Procesar item
 *   heavyComputation(item);
 * }, { chunkSize: 50 });
 */
export const processInChunks = async (items, processItem, options = {}) => {
    const { chunkSize = 100, yieldTime = 0 } = options;

    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);

        // Procesar chunk
        chunk.forEach(processItem);

        // Yield al navegador para no bloquear
        if (yieldTime > 0 && i + chunkSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, yieldTime));
        }
    }
};

/**
 * Medir performance de una función
 * 
 * @param {Function} func - Función a medir
 * @param {string} label - Etiqueta para identificar
 * @returns {Function} Función wrapper con medición
 * 
 * @example
 * const optimizedSearch = measurePerformance(
 *   searchFunction,
 *   'Product Search'
 * );
 */
export const measurePerformance = (func, label) => {
    return function measured(...args) {
        const start = performance.now();

        const result = func.apply(this, args);

        const duration = performance.now() - start;

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        }

        // Enviar a analytics si está disponible
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'timing_complete', {
                name: label,
                value: Math.round(duration),
                event_category: 'Performance',
            });
        }

        return result;
    };
};

/**
 * Preconnect a dominio externo
 * Mejora el tiempo de conexión a recursos de terceros
 * 
 * @param {string} url - URL del dominio
 * @param {boolean} crossorigin - Si requiere CORS
 * 
 * @example
 * preconnect('https://fonts.googleapis.com', true);
 */
export const preconnect = (url, crossorigin = false) => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    
    if (crossorigin) {
        link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
};

/**
 * Prefetch de recurso para navegación futura
 * 
 * @param {string} url - URL del recurso
 * @param {string} as - Tipo de recurso (script, style, image, etc)
 * 
 * @example
 * prefetchResource('/products/popular', 'fetch');
 */
export const prefetchResource = (url, as = 'fetch') => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = as;

    document.head.appendChild(link);
};

/**
 * Preload de recurso crítico
 * 
 * @param {string} url - URL del recurso
 * @param {string} as - Tipo de recurso
 * @param {Object} options - Opciones adicionales
 * 
 * @example
 * preloadResource('/fonts/custom.woff2', 'font', { 
 *   crossorigin: true,
 *   type: 'font/woff2'
 * });
 */
export const preloadResource = (url, as, options = {}) => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;

    if (options.crossorigin) {
        link.crossOrigin = 'anonymous';
    }

    if (options.type) {
        link.type = options.type;
    }

    document.head.appendChild(link);
};

/**
 * Hook personalizado para performance observer
 * Útil en React para medir renders
 */
export const createPerformanceObserver = (callback, entryTypes = ['measure', 'mark']) => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return null;
    }

    try {
        const observer = new PerformanceObserver((list) => {
            callback(list.getEntries());
        });

        observer.observe({ entryTypes });

        return observer;
    } catch (e) {
        console.warn('PerformanceObserver not supported:', e);
        return null;
    }
};

export default {
    throttle,
    debounce,
    scheduleIdleTask,
    cancelIdleTask,
    lazyLoad,
    createIntersectionObserver,
    processInChunks,
    measurePerformance,
    preconnect,
    prefetchResource,
    preloadResource,
    createPerformanceObserver,
};
