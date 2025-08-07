
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import ExchangeCard from './ExchangeCard';

export default function HeroSecction({ data = [], apps = [], indicators = [] }) {
    const [operationType, setOperationType] = useState('venta'); // 'compra' o 'venta'
    const [amount1, setAmount1] = useState('');
    const [amount2, setAmount2] = useState('');
    const [loopKey, setLoopKey] = useState(0); // Para reiniciar las animaciones
    const [colorIndex, setColorIndex] = useState(0);

    // Colores que van a rotar para las palabras con asterisco
    const colors = ['text-neutral-dark', 'text-constrast'];





    // Componente para renderizar texto con colores cambiantes (sin typing)
    const TextWithColors = ({ text, className = '' }) => {
        if (!text) return null;

        // Dividir por coma para mantener la funcionalidad original
        const lines = text.split(',');

        return (
            <div className={`${className} flex flex-col`}>
                {lines.map((line, lineIndex) => {
                    const parts = line.trim().split(/(\*[^*]+\*)/g); // Separa las partes con asterisco

                    return (
                        <motion.span
                            key={lineIndex}
                            className="block"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: lineIndex * 0.2, duration: 0.5 }}
                        >
                            {parts.map((part, partIndex) => {
                                if (part.startsWith("*") && part.endsWith("*")) {
                                    return (
                                        <motion.span
                                            key={`${lineIndex}-${partIndex}-${colorIndex}`}
                                            className={`${colors[colorIndex]} font-bold relative`}
                                            initial={{ opacity: 0.7, scale: 0.98 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                transition: {
                                                    duration: 0.6,
                                                    ease: "easeInOut",
                                                    type: "spring",
                                                    stiffness: 150
                                                }
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                transition: { duration: 0.2 }
                                            }}
                                            style={{
                                                textShadow:
                                                    colorIndex === 1 ? "0 0 20px rgba(126, 90, 251, 0.4), 0 0 40px rgba(126, 90, 251, 0.2)" :
                                                        colorIndex === 2 ? "0 0 15px rgba(187, 255, 82, 0.4), 0 0 30px rgba(187, 255, 82, 0.2)" :
                                                            "0 2px 4px rgba(12, 12, 12, 0.1)",
                                                filter:
                                                    colorIndex === 1 ? "drop-shadow(0 0 15px rgba(126, 90, 251, 0.3))" :
                                                        colorIndex === 2 ? "drop-shadow(0 0 10px rgba(149, 255, 0,0.1))" :
                                                            "none"
                                            }}
                                        >
                                            {part.slice(1, -1)}
                                            {/* Efecto de partículas para colores especiales */}
                                            {(colorIndex === 1 || colorIndex === 2) && (
                                                <motion.span
                                                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                                                    style={{
                                                        backgroundColor: colorIndex === 1 ? '#7E5AFB' : '#BBFF52'
                                                    }}
                                                    animate={{
                                                        scale: [0, 1, 0],
                                                        opacity: [0, 1, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                            {/* Efecto de pulso adicional */}
                                            {colorIndex === 1 && (
                                                <motion.span
                                                    className="absolute inset-0 rounded-lg"
                                                    style={{
                                                        background: 'linear-gradient(45deg, rgba(126, 90, 251, 0.1), rgba(126, 90, 251, 0.05))'
                                                    }}
                                                    animate={{
                                                        opacity: [0, 0.3, 0],
                                                        scale: [0.95, 1.05, 0.95]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                        </motion.span>
                                    );
                                }
                                return <span key={partIndex}>{part}</span>;
                            })}
                        </motion.span>
                    );
                })}
            </div>
        );
    };

    // Variantes de animación más suaves y elegantes con loop
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] // easing más natural
            }
        }
    };

    // Variantes para el texto principal con loop
    const textLoopVariants = {
        hidden: {
            opacity: 0,
            x: -50,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: 50,
            scale: 0.95,
            transition: {
                duration: 0.8,
                ease: "easeIn"
            }
        }
    };

    // Variantes para apps con loop en desktop
    const appsLoopVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -30,
            scale: 0.8,
            transition: {
                duration: 0.5,
                ease: "easeIn"
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3
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
        <motion.section
            className="bg-primary z-0 py-10 md:py-20 font-title relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >

            {/* Overlay SVG en el fondo */}
            <motion.div
                className="absolute w-full h-full inset-0 -z-10"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            >
                <svg className='w-full h-full object-cover' width="1032" height="696" viewBox="0 0 1032 696" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M962.486 762.894C901.955 871.616 810.878 955.559 705.847 999.2C482.713 1086.8 265.287 1039.12 123.123 872.135C-16.4963 708.189 -39.4199 470.768 66.0483 281.333C103.611 213.865 155.93 153.528 221.813 101.827L223.621 100.484C265.297 70.3687 442.611 -32.9777 547.184 11.146C585.342 27.3298 609.663 60.7518 615.961 105.286L616.35 108.394C618.309 132.8 612.99 156.95 601.083 178.335C581.495 213.518 546.221 236.895 506.839 240.995C413.347 248.045 326.008 306.236 277.537 393.296C253.955 435.653 240.812 482.739 239.779 529.336L239.628 532.144C233.044 616.317 271.902 694.704 346.244 747.119C426.944 803.977 529.509 815.534 614.122 777.153C671.303 753.141 722.176 705.554 755.207 646.226C798.762 567.996 804.421 482.946 770.356 418.796C750.69 382.724 751.112 338.497 771.775 301.383C782.76 281.653 798.908 265.34 818.394 254.139C849.498 236.031 885.012 232.849 917.871 245.541C953.658 259.32 982.403 290.506 995.451 329.581C1053.88 458.806 1041.55 620.57 962.428 762.681L962.486 762.894Z" fill="url(#paint0_linear_92_2288)" fillOpacity="0.6" />
                    <defs>
                        <linearGradient id="paint0_linear_92_2288" x1="55.0487" y1="301.09" x2="945.994" y2="792.447" gradientUnits="userSpaceOnUse">
                            <stop offset="0.483986" stopColor="#FFFDF9" />
                            <stop offset="1" stopColor="#C7B7FF" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Contenido principal */}
            <div className="relative z-10 mx-auto px-[5%] flex flex-col lg:flex-row gap-10 items-center">
                {/* Izquierda: Texto principal con loop */}
                <motion.div
                    className='order-1 lg:order-0 lg:w-7/12'
                    variants={itemVariants}
                >
                    <motion.p
                        key={`subtitle-${loopKey}`}
                        className="text-sm font-medium tracking-widest text-constrast mb-2 uppercase"
                        variants={textLoopVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{
                            scale: 1.02,
                            color: '#7c3aed',
                            transition: { duration: 0.3 }
                        }}
                    >
                        CASA DE CAMBIO ONLINE
                    </motion.p>
                    <motion.h1
                        key={`title-${loopKey}`}
                        className="text-4xl md:text-7xl font-title font-medium text-neutral-dark leading-tight mb-4"
                        variants={textLoopVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: 0.2 }}
                    >
                        {/* Texto con colores cambiantes para palabras con asterisco */}
                        <TextWithColors
                            text={data?.title}
                        />
                    </motion.h1>
                    <motion.p
                        key={`description-${loopKey}`}
                        className="text-lg whitespace-pre-line text-neutral-light lg:mb-6 max-w-lg"
                        variants={textLoopVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: 0.4 }}
                    >
                        {data?.description || ""}
                    </motion.p>
                    <motion.div
                        className='flex flex-col lg:flex-row gap-12 h-[300px] lg:mt-20 relative'
                        variants={itemVariants}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.img
                            src={`/api/landing_home/media/${data?.image}`}
                            alt={data?.title}
                            className="hidden lg:block w-auto h-[400px] absolute top-4"
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            variants={imageVariants}
                            whileHover={{
                                scale: 1.02,
                                y: -5,
                                boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.15)",
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                        />
                        <div className='lg:w-4/12 relative'>
                            {/* ... */}
                        </div>
                        <motion.div
                            className="w-full lg:w-8/12 flex flex-col items-start gap-4 mb-8"
                            variants={itemVariants}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.div
                                variants={itemVariants}
                                transition={{ delay: 0.9 }}
                            >
                                <motion.span
                                    key={`app-title-${loopKey}`}
                                    className="text-lg font-medium"
                                    variants={textLoopVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ delay: 0.6 }}
                                >
                                    ¡Descarga nuestra app!
                                </motion.span>

                                {/* Desktop version - Con loop */}
                                <motion.div
                                    key={`apps-desktop-${loopKey}`}
                                    className="hidden lg:flex gap-4 mt-4"
                                    variants={appsLoopVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ delay: 0.8 }}
                                >
                                    {apps?.map((app, index) => (
                                        <motion.a
                                            href={app?.link}
                                            key={`${app?.name}-${index}-${loopKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.6, y: 30, rotate: -10 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                                rotate: 0,
                                                transition: {
                                                    delay: 1 + index * 0.15,
                                                    duration: 0.7,
                                                    type: "spring",
                                                    stiffness: 150,
                                                    damping: 12
                                                }
                                            }}
                                            whileHover={{
                                                scale: 1.12,
                                                y: -8,
                                                rotate: 5,
                                                boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                                                transition: { duration: 0.3 }
                                            }}
                                            whileTap={{ scale: 0.95, rotate: -2 }}
                                        >
                                            <motion.img
                                                src={`/api/app/media/${app?.image}`}
                                                alt={app?.name}
                                                className="h-12 w-auto filter drop-shadow-lg"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                whileHover={{
                                                    filter: "brightness(1.1) contrast(1.1)",
                                                    transition: { duration: 0.2 }
                                                }}
                                            />
                                        </motion.a>
                                    ))}
                                </motion.div>

                                {/* Mobile version - Swiper horizontal */}
                                <motion.div
                                    className="flex lg:hidden mt-4 w-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1, duration: 0.6 }}
                                >
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
                                                <motion.a
                                                    href={app?.link}
                                                    key={index}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-shrink-0"
                                                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    transition={{
                                                        delay: 1.2 + index * 0.1,
                                                        duration: 0.5,
                                                        type: "spring",
                                                        stiffness: 200
                                                    }}
                                                    whileHover={{
                                                        scale: 1.05,
                                                        y: -2,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    whileTap={{ scale: 0.96 }}
                                                >
                                                    <motion.div
                                                        className="  transition-shadow duration-300"
                                                        whileHover={{
                                                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                                            y: -2
                                                        }}
                                                    >
                                                        <motion.img
                                                            src={`/api/app/media/${app?.image}`}
                                                            alt={app?.name}
                                                            className="h-14 w-auto"
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </motion.div>
                                                </motion.a>
                                            ))}
                                        </div>


                                    </div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                key={`indicators-${loopKey}`}
                                className="flex gap-10 mt-6"
                                variants={textLoopVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: 1.2 }}
                            >
                                {
                                    indicators?.map((indicator, index) => (
                                        <motion.div
                                            key={`${indicator?.name}-${index}-${loopKey}`}
                                            className="flex flex-col items-start"
                                            initial={{ opacity: 0, y: 40, scale: 0.8, rotate: -5 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                rotate: 0,
                                                transition: {
                                                    delay: 1.4 + index * 0.2,
                                                    duration: 0.8,
                                                    type: "spring",
                                                    stiffness: 120,
                                                    damping: 15
                                                }
                                            }}
                                            whileHover={{
                                                scale: 1.08,
                                                y: -4,

                                                borderRadius: '16px',
                                                padding: '12px',

                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <motion.span
                                                className="text-[52px] leading-[3rem] font-semibold text-neutral-dark"
                                                whileHover={{
                                                    scale: 1.15,
                                                    color: '#7E5AFB',
                                                    textShadow: "0 0 20px rgba(126, 90, 251, 0.3)"
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <TextWithHighlight text={indicator?.name} color='bg-constrast' counter />
                                            </motion.span>
                                            <motion.span
                                                className="text-sm font-medium text-neutral-dark"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.6 + index * 0.15 }}
                                            >
                                                <TextWithHighlight text={indicator?.description} color='bg-constrast' />
                                            </motion.span>
                                        </motion.div>
                                    ))}
                            </motion.div>
                            <div className="min-w-max mt-6 mx-auto lg:mx-0 text-[12px] lg:text-sm font-medium text-neutral-light flex items-center gap-1">
                                Registrados en la SBS
                                <svg className='w-4 h-4 lg:w-6 lg:h-6 fill-secondary' width="24" height="24" viewBox="0 0 24 24" fill="#BBFF52"  xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.8825 15L17.5527 18.2099C17.9833 20.2723 18.1986 21.3035 17.7563 21.7923C17.3141 22.281 16.546 21.8606 15.0099 21.0198L12.7364 19.7753C12.3734 19.5766 12.1919 19.4773 12 19.4773C11.8081 19.4773 11.6266 19.5766 11.2636 19.7753L8.99008 21.0198C7.45397 21.8606 6.68592 22.281 6.24365 21.7923C5.80139 21.3035 6.01669 20.2723 6.44731 18.2099L7.11752 15" stroke="#212121" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M4.5 9.5C4.5 13.6421 7.85786 17 12 17C16.1421 17 19.5 13.6421 19.5 9.5C19.5 5.35786 16.1421 2 12 2C7.85786 2 4.5 5.35786 4.5 9.5Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 10.1667C9 10.1667 9.75 10.1667 10.5 11.5C10.5 11.5 12.8824 8.16667 15 7.5" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
                {/* Derecha: Card de cambio */}
                <motion.div
                    className='flex order-0  lg:order-1 justify-end lg:w-5/12'
                    variants={itemVariants}
                    transition={{ delay: 1.8 }}
                    whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.3 }
                    }}
                >
                    <ExchangeCard
                        title="Comienza tu cambio ahora"
                        initialOperationType="venta"
                        showCoupons={true}
                        showCredits={true}
                        onOperationStart={handleOperationStart}
                    />
                </motion.div>
            </div>
        </motion.section>
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

