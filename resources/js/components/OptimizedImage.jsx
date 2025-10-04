import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagen optimizada con lazy loading, 
 * placeholder, aspectRatio y soporte para WebP/AVIF
 * 
 * @component
 * @example
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero principal"
 *   width={1920}
 *   height={1080}
 *   priority={true}
 *   className="rounded-lg"
 * />
 */
export const OptimizedImage = ({
    src,
    alt = '',
    width,
    height,
    priority = false,
    className = '',
    objectFit = 'cover',
    placeholder = true,
    onLoad,
    onError,
    sizes,
    srcSet,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    // Calcular aspect ratio
    const aspectRatio = width && height ? `${width}/${height}` : undefined;

    // Generar srcset automáticamente si no se proporciona
    const generateSrcSet = () => {
        if (srcSet) return srcSet;
        
        // Si la imagen es de la API, generar diferentes tamaños
        if (src?.includes('/api/') || src?.includes('/storage/')) {
            const baseSrc = src.split('?')[0];
            const widths = [640, 768, 1024, 1280, 1536, 1920];
            
            return widths
                .filter(w => !width || w <= width * 2) // Solo tamaños relevantes
                .map(w => `${baseSrc}?w=${w} ${w}w`)
                .join(', ');
        }
        
        return undefined;
    };

    // Generar sizes automáticamente si no se proporciona
    const generateSizes = () => {
        if (sizes) return sizes;
        
        // Sizes por defecto basado en breakpoints de Tailwind
        return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    };

    // Convertir a WebP/AVIF si es posible
    useEffect(() => {
        if (!src) return;

        // Si es una imagen de API/storage, agregar parámetro para WebP
        if ((src.includes('/api/') || src.includes('/storage/')) && !src.includes('format=')) {
            const separator = src.includes('?') ? '&' : '?';
            
            // Detectar soporte de AVIF/WebP
            const supportsAvif = checkImageFormat('avif');
            const supportsWebp = checkImageFormat('webp');
            
            if (supportsAvif) {
                setImageSrc(`${src}${separator}format=avif`);
            } else if (supportsWebp) {
                setImageSrc(`${src}${separator}format=webp`);
            }
        }
    }, [src]);

    const handleLoad = (e) => {
        setIsLoaded(true);
        onLoad?.(e);
    };

    const handleError = (e) => {
        setHasError(true);
        console.error('Error loading image:', src);
        
        // Fallback a imagen original si la conversión falla
        if (imageSrc !== src) {
            setImageSrc(src);
            setHasError(false);
        }
        
        onError?.(e);
    };

    // Si hay error y no hay fallback, mostrar placeholder
    if (hasError && imageSrc === src) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ 
                    width: width ? `${width}px` : '100%', 
                    height: height ? `${height}px` : 'auto',
                    aspectRatio 
                }}
                role="img"
                aria-label={alt || 'Imagen no disponible'}
            >
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{ aspectRatio }}
        >
            {/* Placeholder mientras carga */}
            {placeholder && !isLoaded && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
                    aria-hidden="true"
                />
            )}

            {/* Imagen optimizada */}
            <img
                src={imageSrc}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : 'auto'}
                srcSet={generateSrcSet()}
                sizes={generateSizes()}
                onLoad={handleLoad}
                onError={handleError}
                className={`
                    w-full h-full transition-opacity duration-300
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                style={{ 
                    objectFit,
                    aspectRatio 
                }}
                {...props}
            />
        </div>
    );
};

/**
 * Verificar soporte de formato de imagen
 */
function checkImageFormat(format) {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        const testString = format === 'avif' 
            ? 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
            : 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        
        return canvas.toDataURL(format === 'avif' ? 'image/avif' : 'image/webp').indexOf(testString) === 0;
    }
    
    return false;
}

OptimizedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    priority: PropTypes.bool,
    className: PropTypes.string,
    objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
    placeholder: PropTypes.bool,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    sizes: PropTypes.string,
    srcSet: PropTypes.string,
};

export default OptimizedImage;
