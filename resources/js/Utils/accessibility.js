/**
 * Accessibility Utilities
 * Utilidades para mejorar la accesibilidad
 */

/**
 * Generar ID único para aria-describedby y aria-labelledby
 */
export const generateId = (prefix = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Verificar contraste de colores
 * @param {string} foreground - Color de texto (hex)
 * @param {string} background - Color de fondo (hex)
 * @returns {Object} - Ratio y si cumple WCAG AA/AAA
 */
export const checkContrast = (foreground, background) => {
    const getLuminance = (hex) => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = ((rgb >> 16) & 0xff) / 255;
        const g = ((rgb >> 8) & 0xff) / 255;
        const b = ((rgb >> 0) & 0xff) / 255;

        const [rs, gs, bs] = [r, g, b].map(c =>
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return {
        ratio: ratio.toFixed(2),
        AA: ratio >= 4.5,
        AALarge: ratio >= 3,
        AAA: ratio >= 7,
        AAALarge: ratio >= 4.5,
    };
};

/**
 * Trap focus dentro de un elemento (útil para modales)
 */
export const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Retornar función de limpieza
    return () => element.removeEventListener('keydown', handleKeyDown);
};

/**
 * Anunciar mensaje a lectores de pantalla
 */
export const announce = (message, priority = 'polite') => {
    const announcer = document.getElementById('a11y-announcer') || createAnnouncer();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;

    // Limpiar después de 1 segundo
    setTimeout(() => {
        announcer.textContent = '';
    }, 1000);
};

const createAnnouncer = () => {
    const announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
    return announcer;
};

/**
 * CSS para screen reader only
 */
export const srOnlyStyles = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
};

export default {
    generateId,
    checkContrast,
    trapFocus,
    announce,
    srOnlyStyles,
};
