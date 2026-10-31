
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import OptimizedImage from '../../Common/OptimizedImage';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import ExchangeCard from './ExchangeCard';

const motionCreate = typeof motion.create === 'function' ? motion.create : motion;
const MotionOptimizedImage = motionCreate(OptimizedImage);

export default function HeroSecction({ data = [], apps = [], indicators = [] }) {
    const [operationType, setOperationType] = useState('venta'); // 'compra' o 'venta'
    const [amount1, setAmount1] = useState('');
    const [amount2, setAmount2] = useState('');
    const [loopKey, setLoopKey] = useState(0); // Para reiniciar las animaciones
    const [colorIndex, setColorIndex] = useState(0);

    // Colores que van a rotar para las palabras con asterisco
    const colors = ['text-neutral-dark', 'text-constrast'];
    const heroImageId = typeof data?.image === 'string' ? data.image.trim() : data?.image;
    const heroImageSrc = heroImageId ? `/api/landing_home/media/${heroImageId}` : '/api/cover/thumbnail/null';
    const appCardImageWidths = [160, 240, 320, 420];

    // Variantes optimizadas para renderizado instantáneo (FCP / LCP instantáneo)
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 1, y: 0, scale: 1 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2
            }
        }
    };

    // Variantes para el texto principal sin ocultar en opacidad 0
    const textLoopVariants = {
        hidden: {
            opacity: 1,
            x: 0,
            scale: 1
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    // Variantes para apps
    const appsLoopVariants = {
        hidden: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 1, x: 0 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 1, scale: 1, y: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    // Función para intercambiar los valores
    const handleSwap = () => {
        const temp = amount1;
        setAmount1(amount2);
        setAmount2(temp);
        // También cambiar el tipo de operación
        setOperationType(operationType === 'compra' ? 'venta' : 'compra');
    };

    const handleOperationStart = (operationData) => {

        // Aquí puedes manejar los datos de la operación como necesites
        // Por defecto redirigirá a mi.cambiafx.pe/login
        window.location.href = 'https://mi.cambiafx.pe/login';
    };
    return (
        <section
            className="bg-primary z-0 py-10 md:py-20 font-title relative overflow-hidden"
        >

            {/* Overlay SVG en el fondo */}
            <div className="absolute w-full h-full inset-0 -z-10">
                <svg className='w-full h-full object-cover' width="1032" height="696" viewBox="0 0 1032 696" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M962.486 762.894C901.955 871.616 810.878 955.559 705.847 999.2C482.713 1086.8 265.287 1039.12 123.123 872.135C-16.4963 708.189 -39.4199 470.768 66.0483 281.333C103.611 213.865 155.93 153.528 221.813 101.827L223.621 100.484C265.297 70.3687 442.611 -32.9777 547.184 11.146C585.342 27.3298 609.663 60.7518 615.961 105.286L616.35 108.394C618.309 132.8 612.99 156.95 601.083 178.335C581.495 213.518 546.221 236.895 506.839 240.995C413.347 248.045 326.008 306.236 277.537 393.296C253.955 435.653 240.812 482.739 239.779 529.336L239.628 532.144C233.044 616.317 271.902 694.704 346.244 747.119C426.944 803.977 529.509 815.534 614.122 777.153C671.303 753.141 722.176 705.554 755.207 646.226C798.762 567.996 804.421 482.946 770.356 418.796C750.69 382.724 751.112 338.497 771.775 301.383C782.76 281.653 798.908 265.34 818.394 254.139C849.498 236.031 885.012 232.849 917.871 245.541C953.658 259.32 982.403 290.506 995.451 329.581C1053.88 458.806 1041.55 620.57 962.428 762.681L962.486 762.894Z" fill="url(#paint0_linear_92_2288)" fillOpacity="0.6" />
                    <defs>
                        <linearGradient id="paint0_linear_92_2288" x1="55.0487" y1="301.09" x2="945.994" y2="792.447" gradientUnits="userSpaceOnUse">
                            <stop offset="0.483986" stopColor="#FFFDF9" />
                            <stop offset="1" stopColor="#C7B7FF" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 mx-auto px-[5%] flex flex-col lg:flex-row gap-10 items-center">
                {/* Izquierda: Texto principal con loop */}
                <div className='order-1 lg:order-0 lg:w-7/12'>
                    <p className="text-sm font-medium tracking-widest text-constrast mb-2 uppercase">
                        CASA DE CAMBIO ONLINE
                    </p>
                    <h1 className="text-4xl md:text-7xl font-title font-semibold text-neutral-dark leading-tight mb-4">
                        {/* Texto con colores cambiantes para palabras con asterisco */}
                        <TextWithHighlight
                            text={data?.title}
                            color="bg-constrast"
                        />
                    </h1>
                    <p className="text-lg whitespace-pre-line text-neutral-light lg:mb-6 max-w-lg">
                        {data?.description || ""}
                    </p>
                    <div className='flex flex-col lg:flex-row gap-12 h-[300px] lg:mt-20 relative'>
                        <OptimizedImage
                            src={heroImageSrc}
                            alt={data?.title || 'Hero CambiaFX'}
                            widths={[360, 480, 640, 768, 960, 1200, 1440]}
                            sizes="(max-width: 1024px) 70vw, 520px"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            width={600}
                            height={400}
                            className="hidden lg:block w-auto h-[400px] absolute top-4"
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                        <div className='lg:w-4/12 relative'>
                            {/* ... */}
                        </div>
                        <div className="w-full lg:w-8/12 flex flex-col items-start gap-4 mb-8">
                            <div>
                                <span className="text-lg font-medium">
                                    ¡Descarga nuestra app!
                                </span>

                                {/* Desktop version */}
                                <div
                                    key={`apps-desktop-${loopKey}`}
                                    className="hidden lg:flex gap-4 mt-4"
                                >
                                    {apps?.map((app, index) => (
                                        <a
                                            href={app?.link}
                                            key={`${app?.name}-${index}-${loopKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-transform duration-200 hover:scale-105 active:scale-95"
                                        >
                                            <OptimizedImage
                                                src={app?.image ? `/api/app/media/${app.image}` : '/api/cover/thumbnail/null'}
                                                alt={app?.name || 'Descargar app CambiaFX'}
                                                widths={appCardImageWidths}
                                                sizes="(max-width: 1280px) 40vw, 220px"
                                                width={135}
                                                height={48}
                                                loading="eager"
                                                className="h-12 w-auto filter drop-shadow-lg"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </a>
                                    ))}
                                </div>

                                {/* Mobile version - Swiper horizontal */}
                                <div className="flex lg:hidden mt-4 w-full">
                                    <div className="relative w-full">
                                        <div
                                            className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide"
                                            style={{
                                                scrollbarWidth: 'none',
                                                msOverflowStyle: 'none',
                                                WebkitOverflowScrolling: 'touch'
                                            }}
                                        >
                                            {apps?.map((app, index) => (
                                                <a
                                                    href={app?.link}
                                                    key={index}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
                                                >
                                                    <div className="transition-shadow duration-300">
                                                        <OptimizedImage
                                                            src={app?.image ? `/api/app/media/${app.image}` : '/api/cover/thumbnail/null'}
                                                            alt={app?.name || 'Descargar app CambiaFX'}
                                                            widths={appCardImageWidths}
                                                            sizes="(max-width: 768px) 70vw, 280px"
                                                            width={157}
                                                            height={56}
                                                            className="h-14 w-auto"
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                key={`indicators-${loopKey}`}
                                className="flex gap-10 mt-6"
                            >
                                {
                                    indicators?.map((indicator, index) => (
                                        <div
                                            key={`${indicator?.name}-${index}-${loopKey}`}
                                            className="flex flex-col items-start transition-transform duration-200 hover:scale-105"
                                        >
                                            <span
                                                className="text-[52px] leading-[3rem] font-semibold text-neutral-dark"
                                            >
                                                <TextWithHighlight text={indicator?.name} color='bg-constrast' counter />
                                            </span>
                                            <span
                                                className="text-sm font-medium text-neutral-dark"
                                            >
                                                <TextWithHighlight text={indicator?.description} color='bg-constrast' />
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            <div className="min-w-max mt-6 mx-auto lg:mx-0 text-[12px] lg:text-sm font-medium text-neutral-light flex items-center gap-1">
                                Registrados en la SBS
                                <svg className='w-4 h-4 lg:w-6 lg:h-6 fill-secondary' width="24" height="24" viewBox="0 0 24 24" fill="#BBFF52" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.8825 15L17.5527 18.2099C17.9833 20.2723 18.1986 21.3035 17.7563 21.7923C17.3141 22.281 16.546 21.8606 15.0099 21.0198L12.7364 19.7753C12.3734 19.5766 12.1919 19.4773 12 19.4773C11.8081 19.4773 11.6266 19.5766 11.2636 19.7753L8.99008 21.0198C7.45397 21.8606 6.68592 22.281 6.24365 21.7923C5.80139 21.3035 6.01669 20.2723 6.44731 18.2099L7.11752 15" stroke="#212121" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M4.5 9.5C4.5 13.6421 7.85786 17 12 17C16.1421 17 19.5 13.6421 19.5 9.5C19.5 5.35786 16.1421 2 12 2C7.85786 2 4.5 5.35786 4.5 9.5Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 10.1667C9 10.1667 9.75 10.1667 10.5 11.5C10.5 11.5 12.8824 8.16667 15 7.5" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
                {/* Derecha: Card de cambio - Visible inmediatamente sin delay */}
                <div
                    className='flex order-0 lg:order-1 justify-end lg:w-5/12 transition-transform duration-200 hover:scale-[1.01]'
                >
                    <ExchangeCard
                        title="Comienza tu cambio ahora"
                        initialOperationType="venta"
                        showCoupons={true}
                        showCredits={true}
                        onOperationStart={handleOperationStart}
                    />
                </div>
            </div>
        </section>
    )
}

// Agregar estilos CSS para el swiper móvil
const styles = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

