import React, { useState, useEffect } from 'react';

/**
 * Componente de imagen optimizado con:
 * - Lazy loading nativo
 * - Soporte para diferentes tamaños (srcset)
 * - Dimensiones explícitas para evitar CLS
 * - Fallback en caso de error
 * - Atributos de accesibilidad mejorados
 */
const OptimizedImage = ({ 
    src, 
    alt, 
    width, 
    height, 
    className = '', 
    priority = false,
    sizes = null,
    srcSet = null,
    onLoad,
    onError,
    objectFit = 'cover',
    ...props 
}) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const handleError = (e) => {
        setError(true);
        if (onError) onError(e);
        // Fallback a una imagen por defecto
        e.target.src = '/api/cover/thumbnail/null';
    };

    const handleLoad = (e) => {
        setLoaded(true);
        if (onLoad) onLoad(e);
    };

    // Estilo para el contenedor que mantiene el aspect ratio
    const aspectRatioStyle = width && height ? {
        aspectRatio: `${width} / ${height}`,
    } : {};

    return (
        <div 
            className={`relative overflow-hidden ${className}`}
            style={aspectRatioStyle}
        >
            <img
                src={src}
                alt={alt || ''}
                width={width}
                height={height}
                srcSet={srcSet}
                sizes={sizes}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : 'auto'}
                onError={handleError}
                onLoad={handleLoad}
                className={`w-full h-full transition-opacity duration-300 ${
                    loaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectFit }}
                {...props}
            />
            {!loaded && !error && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
};

export default OptimizedImage;
