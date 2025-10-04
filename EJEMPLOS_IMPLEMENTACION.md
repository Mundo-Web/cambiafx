# Ejemplos Prácticos de Implementación

Este documento contiene ejemplos de código listos para usar en el proyecto CambiaFX.

## 📸 Ejemplo 1: Optimizar Imagen Hero en HeroSection

### Antes:
```jsx
// resources/js/components/Tailwind/CambiaFX/HeroSecction.jsx
const HeroSecction = ({ data, apps, indicators }) => {
    return (
        <section className="hero-section">
            <img 
                src={data?.image} 
                alt={data?.title}
                className="w-full h-auto"
            />
            {/* resto del contenido */}
        </section>
    );
};
```

### Después:
```jsx
import OptimizedImage from '../../OptimizedImage';

const HeroSecction = ({ data, apps, indicators }) => {
    return (
        <section 
            className="hero-section"
            role="region"
            aria-labelledby="hero-title"
        >
            <OptimizedImage
                src={data?.image}
                alt={data?.title || 'Cambio de divisas en línea'}
                width={1920}
                height={1080}
                priority={true}  // Crítico para LCP
                className="w-full h-auto object-cover"
                objectFit="cover"
            />
            
            <h1 id="hero-title" className="...">
                {data?.title}
            </h1>
            
            {/* resto del contenido */}
        </section>
    );
};

export default HeroSecction;
```

---

## 🎨 Ejemplo 2: Formulario Accesible en Contacto

### Antes:
```jsx
const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    
    return (
        <form>
            <input 
                type="text" 
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
            <input 
                type="email" 
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <textarea 
                placeholder="Mensaje"
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
            />
            <button type="submit">Enviar</button>
        </form>
    );
};
```

### Después:
```jsx
import { useState } from 'react';
import { generateId, announce } from '../Utils/accessibility';

const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // IDs únicos para accesibilidad
    const nombreId = generateId('nombre');
    const emailId = generateId('email');
    const mensajeId = generateId('mensaje');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Validación
            const newErrors = {};
            if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
            if (!formData.email) newErrors.email = 'El email es obligatorio';
            if (!formData.mensaje) newErrors.mensaje = 'El mensaje es obligatorio';
            
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                announce('Por favor corrija los errores en el formulario', 'assertive');
                return;
            }
            
            // Enviar
            await submitForm(formData);
            announce('Formulario enviado correctamente', 'polite');
            
            // Limpiar
            setFormData({ nombre: '', email: '', mensaje: '' });
        } catch (error) {
            announce('Error al enviar el formulario', 'assertive');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form 
            onSubmit={handleSubmit}
            aria-labelledby="contact-form-title"
            noValidate
        >
            <h2 id="contact-form-title" className="text-2xl font-bold mb-6">
                Formulario de Contacto
            </h2>
            
            {/* Campo Nombre */}
            <div className="mb-4">
                <label 
                    htmlFor={nombreId}
                    className="block mb-2 font-semibold text-gray-700"
                >
                    Nombre completo
                    <span className="text-red-500 ml-1" aria-label="obligatorio">*</span>
                </label>
                <input
                    id={nombreId}
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => {
                        setFormData({...formData, nombre: e.target.value});
                        if (errors.nombre) {
                            setErrors({...errors, nombre: ''});
                        }
                    }}
                    required
                    aria-required="true"
                    aria-invalid={errors.nombre ? 'true' : 'false'}
                    aria-describedby={errors.nombre ? `${nombreId}-error` : undefined}
                    className={`
                        w-full px-4 py-2 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${errors.nombre ? 'border-red-500' : 'border-gray-300'}
                    `}
                />
                {errors.nombre && (
                    <span 
                        id={`${nombreId}-error`}
                        role="alert"
                        className="text-red-500 text-sm mt-1 block"
                    >
                        {errors.nombre}
                    </span>
                )}
            </div>
            
            {/* Campo Email */}
            <div className="mb-4">
                <label 
                    htmlFor={emailId}
                    className="block mb-2 font-semibold text-gray-700"
                >
                    Correo electrónico
                    <span className="text-red-500 ml-1" aria-label="obligatorio">*</span>
                </label>
                <input
                    id={emailId}
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                        setFormData({...formData, email: e.target.value});
                        if (errors.email) {
                            setErrors({...errors, email: ''});
                        }
                    }}
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? `${emailId}-error` : undefined}
                    className={`
                        w-full px-4 py-2 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                    `}
                />
                {errors.email && (
                    <span 
                        id={`${emailId}-error`}
                        role="alert"
                        className="text-red-500 text-sm mt-1 block"
                    >
                        {errors.email}
                    </span>
                )}
            </div>
            
            {/* Campo Mensaje */}
            <div className="mb-6">
                <label 
                    htmlFor={mensajeId}
                    className="block mb-2 font-semibold text-gray-700"
                >
                    Mensaje
                    <span className="text-red-500 ml-1" aria-label="obligatorio">*</span>
                </label>
                <textarea
                    id={mensajeId}
                    value={formData.mensaje}
                    onChange={(e) => {
                        setFormData({...formData, mensaje: e.target.value});
                        if (errors.mensaje) {
                            setErrors({...errors, mensaje: ''});
                        }
                    }}
                    rows={5}
                    required
                    aria-required="true"
                    aria-invalid={errors.mensaje ? 'true' : 'false'}
                    aria-describedby={errors.mensaje ? `${mensajeId}-error` : undefined}
                    className={`
                        w-full px-4 py-2 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${errors.mensaje ? 'border-red-500' : 'border-gray-300'}
                    `}
                />
                {errors.mensaje && (
                    <span 
                        id={`${mensajeId}-error`}
                        role="alert"
                        className="text-red-500 text-sm mt-1 block"
                    >
                        {errors.mensaje}
                    </span>
                )}
            </div>
            
            <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="
                    w-full py-3 px-6 
                    bg-blue-600 hover:bg-blue-700 
                    text-white font-semibold rounded-lg
                    transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
            >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
        </form>
    );
};

export default Contacto;
```

---

## 🎭 Ejemplo 3: Modal Accesible

### Implementación completa:
```jsx
import { useEffect, useRef } from 'react';
import { trapFocus, announce } from '../Utils/accessibility';

const ModalAppointment = ({ isOpen, onClose, children }) => {
    const modalRef = useRef(null);
    const previouslyFocusedElement = useRef(null);
    
    useEffect(() => {
        if (!isOpen) return;
        
        // Guardar elemento con foco actual
        previouslyFocusedElement.current = document.activeElement;
        
        // Trapear foco dentro del modal
        const cleanup = trapFocus(modalRef.current);
        
        // Anunciar apertura
        announce('Modal abierto', 'polite');
        
        // Enfocar primer elemento interactivo
        const firstInput = modalRef.current.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
        setTimeout(() => firstInput?.focus(), 100);
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Cleanup
        return () => {
            cleanup();
            document.body.style.overflow = '';
            
            // Restaurar foco
            if (previouslyFocusedElement.current) {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [isOpen]);
    
    // Cerrar con ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
                announce('Modal cerrado', 'polite');
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 
                        id="modal-title"
                        className="text-2xl font-bold text-gray-900"
                    >
                        Agendar Cita
                    </h2>
                    
                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="
                            p-2 rounded-lg
                            hover:bg-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                        "
                    >
                        <span aria-hidden="true" className="text-2xl">×</span>
                    </button>
                </div>
                
                {/* Content */}
                <div id="modal-description">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalAppointment;
```

---

## 🚀 Ejemplo 4: Lazy Loading con Intersection Observer

```jsx
import { useState, useEffect, useRef } from 'react';
import { createIntersectionObserver } from '../Utils/performance';

const LazySection = ({ children, fallback = null, threshold = 0.1 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    
    useEffect(() => {
        const observer = createIntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold }
        );
        
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [threshold]);
    
    return (
        <div ref={sectionRef}>
            {isVisible ? children : fallback}
        </div>
    );
};

// Uso en Home.jsx
const Home = () => {
    return (
        <div>
            {/* Sección siempre visible */}
            <HeroSecction />
            
            {/* Secciones con lazy loading */}
            <LazySection fallback={<SectionFallback />}>
                <PrimeraOperacionSection />
            </LazySection>
            
            <LazySection fallback={<SectionFallback />}>
                <FuncionSection />
            </LazySection>
        </div>
    );
};
```

---

## ⚡ Ejemplo 5: Throttle en Scroll Event

```jsx
import { useEffect } from 'react';
import { throttle } from '../Utils/performance';

const ScrollIndicator = () => {
    useEffect(() => {
        const handleScroll = throttle(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            // Actualizar indicador
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
                indicator.style.width = `${scrollPercent}%`;
            }
        }, 100); // Throttle a 100ms
        
        // Usar passive para mejor performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div
                id="scroll-indicator"
                className="h-full bg-blue-600 transition-all duration-150"
                style={{ width: '0%' }}
                role="progressbar"
                aria-label="Progreso de lectura"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
};

export default ScrollIndicator;
```

---

## 🎨 Ejemplo 6: Botón con Estados Accesibles

```jsx
const AccessibleButton = ({ 
    children, 
    onClick, 
    isLoading = false, 
    disabled = false,
    variant = 'primary',
    ...props 
}) => {
    const baseClasses = `
        px-6 py-3 rounded-lg font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
    `;
    
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            className={`${baseClasses} ${variants[variant]}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="sr-only">Cargando...</span>
                    <span aria-hidden="true" className="inline-block animate-spin mr-2">
                        ⟳
                    </span>
                    <span aria-hidden="true">Procesando...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

// Uso
<AccessibleButton
    onClick={handleSubmit}
    isLoading={isSubmitting}
    variant="primary"
>
    Enviar Formulario
</AccessibleButton>
```

---

## 📊 Ejemplo 7: Uso de Web Vitals en Home.jsx

```jsx
import { useEffect } from 'react';
import { reportWebVitals, markPerformance, measurePerformance } from './Utils/webVitals';

const Home = (props) => {
    // Marcar inicio de render
    useEffect(() => {
        markPerformance('home-render-start');
    }, []);
    
    // Marcar fin de render y medir
    useEffect(() => {
        markPerformance('home-render-end');
        measurePerformance('home-render-time', 'home-render-start', 'home-render-end');
    });
    
    // Reportar Web Vitals
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            reportWebVitals();
        }
    }, []);
    
    return (
        <div>
            {/* Contenido */}
        </div>
    );
};
```

---

## 🌐 Ejemplo 8: Controller con Cache (Laravel)

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use App\Models\Landing;
use App\Models\Post;

class HomeController extends Controller
{
    public function index()
    {
        // Cache de 1 hora para landing pages
        $landing = Cache::remember('landing_home_v1', 3600, function () {
            return Landing::where('status', true)
                ->select('id', 'title', 'description', 'image', 'correlative')
                ->get()
                ->keyBy('correlative');
        });
        
        // Cache de 30 minutos para posts recientes
        $posts = Cache::remember('posts_recent_v1', 1800, function () {
            return Post::with(['category:id,name', 'author:id,name'])
                ->where('status', true)
                ->orderBy('created_at', 'desc')
                ->take(6)
                ->get(['id', 'title', 'slug', 'excerpt', 'image', 'created_at', 'category_id', 'author_id']);
        });
        
        // Cache de 1 hora para indicators
        $indicators = Cache::remember('indicators_v1', 3600, function () {
            return \App\Models\Indicator::where('status', true)
                ->select('id', 'title', 'value', 'icon', 'correlative')
                ->get()
                ->groupBy('correlative');
        });
        
        return inertia('Home', [
            'landing' => $landing->values(),
            'posts' => $posts,
            'indicators' => $indicators,
            // ... otros datos
        ]);
    }
    
    // Limpiar cache cuando se actualiza contenido
    public function clearCache()
    {
        Cache::forget('landing_home_v1');
        Cache::forget('posts_recent_v1');
        Cache::forget('indicators_v1');
        
        return redirect()->back()->with('success', 'Cache limpiado');
    }
}
```

---

## 🎯 Checklist de Implementación Rápida

### Para cada componente:

✅ **Imágenes**
- [ ] Usar `OptimizedImage` component
- [ ] Agregar `width` y `height`
- [ ] Hero image con `priority={true}`
- [ ] Resto con `loading="lazy"`

✅ **Formularios**
- [ ] Labels con `htmlFor`
- [ ] Mensajes de error con `role="alert"`
- [ ] ARIA attributes (`aria-required`, `aria-invalid`)
- [ ] IDs únicos generados

✅ **Modales**
- [ ] `role="dialog"` y `aria-modal="true"`
- [ ] Trap focus implementado
- [ ] Cerrar con ESC
- [ ] Restaurar foco al cerrar

✅ **Botones**
- [ ] `aria-label` si no hay texto
- [ ] `aria-busy` durante loading
- [ ] Estados hover/focus visibles
- [ ] Deshabilitado correctamente

---

¿Necesitas más ejemplos de algún caso específico?
