import React, { useEffect, useState } from 'react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Estilos CSS personalizados para el Swiper de pilares
const swiperStyles = `
    .pilares-swiper .swiper-slide {
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pilares-swiper .swiper-wrapper {
        align-items: center;
    }
    .pilares-swiper .swiper-pagination {
        bottom: 10px !important;
        position: static !important;
        text-align: center !important;
        margin-top: 32px !important;
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }
    .pilares-swiper .swiper-pagination-bullet {
        width: 32px !important;
        height: 6px !important;
        background: #1a1a1a !important;
        border: none !important;
        opacity: 1 !important;
        margin: 0 6px !important;
        transition: all 0.4s ease !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        position: relative !important;
    }
    .pilares-swiper .swiper-pagination-bullet:hover {
        background: rgba(26, 26, 26, 0.8) !important;
        transform: scale(1.05) !important;
    }
    .pilares-swiper .swiper-pagination-bullet-active {
        background: #BBFF52 !important;
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(198, 255, 107, 0.2) !important;
    }
    /* Sobrescribir estilos por defecto de Swiper */
    .swiper-pagination-custom .swiper-pagination-bullet {
        width: 32px !important;
        height: 6px !important;
        background: #1a1a1a !important;
        border: none !important;
        opacity: 1 !important;
        margin: 0 6px !important;
        transition: all 0.4s ease !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        position: relative !important;
    }
    .swiper-pagination-custom .swiper-pagination-bullet:hover {
        background: rgba(26, 26, 26, 0.8) !important;
        transform: scale(1.05) !important;
    }
    .swiper-pagination-custom .swiper-pagination-bullet-active {
        background: #BBFF52 !important;
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(198, 255, 107, 0.2) !important;
    }
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .line-clamp-4 {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;

const PilaresSection = ({data,core_values=[]}) => {
    const [animationOffset, setAnimationOffset] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);
  
   
    useEffect(() => {
        if (!isAutoplay) return;
        
        const interval = setInterval(() => {
            setAnimationOffset((prev) => {
                const nextOffset = prev + 1;
                // Reinicia suavemente el loop
                if (nextOffset >= core_values.length) {
                    return 0;
                }
                return nextOffset;
            });
        }, 3000); // Cambia cada 3 segundos para más suavidad

        return () => clearInterval(interval);
    }, [core_values.length, isAutoplay]);

    // Función para renderizar el título con texto destacado
    const renderTitle = (title) => {
        if (!title) return '';
        const parts = title.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                const text = part.slice(1, -1); // Remover los asteriscos
                return (
                    <span key={index} className="font-semibold text-constrast">
                        {text}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    // Función para control manual
    const handleManualControl = (direction) => {
        setIsAutoplay(false);
        setAnimationOffset((prev) => {
            if (direction === 'up') {
                return prev > 0 ? prev - 1 : core_values.length - 1;
            } else {
                return prev < core_values.length - 1 ? prev + 1 : 0;
            }
        });
        
        // Reactivar autoplay después de 5 segundos de inactividad
        setTimeout(() => setIsAutoplay(true), 5000);
    };

    return (
        <>
            <style>{swiperStyles}</style>
            <section className="bg-neutral-dark px-2 md:px-0 w-full relative overflow-hidden font-title">
            {/* Banda decorativa diagonal */}
            <div
                className="absolute bottom-0 right-0 w-full h-full z-0 pointer-events-none"
                aria-hidden="true"
            >
                <div
                    className="h-full pt-16"
                    style={{
                        background: 'radial-gradient(ellipse at bottom right, rgba(124, 58, 237, 0.28), rgba(17, 24, 39, 0.35) 40%, transparent 75%)',
                        maskImage: 'linear-gradient(to left, transparent, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.95) 65%)',
                        WebkitMaskImage: 'linear-gradient(to left, transparent, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.95) 65%)'
                    }}
                />
            </div>

            {/* DESKTOP VERSION - Mantener exactamente igual */}
            <div className="hidden lg:block px-[5%] mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-end gap-12">
                    {/* Columna izquierda: textos */}
                    <motion.div
                        className="flex-1 relative h-[580px] flex flex-col justify-start items-start"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.div
                            className="uppercase text-white text-sm font-medium tracking-widest mb-4"
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >NUESTROS PILARES</motion.div>
                        <motion.h2
                            className="text-5xl md:text-[64px] tracking-[94%] font-medium text-white mb-6"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <TextWithHighlight text={data?.title} color='bg-secondary font-semibold' split_coma/>
                        </motion.h2>
                        <motion.p
                            className="text-xl text-white mb-4 max-w-md whitespace-pre-line"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <TextWithHighlight text={data?.description} color='bg-white font-semibold' />
                        </motion.p>
                        <motion.img
                            src={`/api/landing_home/media/${data?.image}`}
                            alt={data?.title}
                            className="absolute h-[450px] scale-x-[-1] top-56 right-0 object-cover z-10"
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        />
                    </motion.div>

                    {/* Columna derecha: tarjetas animadas en dos columnas */}
                    <div className='relative flex-1'>
                        {/* Controles de navegación */}
                        <div className="absolute -right-0 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4">
                            <button 
                                onClick={() => handleManualControl('up')}
                                aria-label='Up button'
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
                            >
                                <svg className="w-5 h-5 text-white group-hover:text-[#BBFF52] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => handleManualControl('down')}
                                aria-label='Down button'
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
                            >
                                <svg className="w-5 h-5 text-white group-hover:text-[#BBFF52] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex justify-center items-center relative h-[650px] overflow-x-auto scrollbar-hide overflow-y-hidden">
                            {/* Degradados superior e inferior */}
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-dark to-transparent z-20 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-neutral-dark to-transparent z-20 pointer-events-none"></div>

                            <div className="flex gap-6 w-full max-w-[600px] justify-center">
                                {/* Columna 1 - Sube */}
                                <div className="flex flex-col gap-4 w-[250px] relative">
                                    <div 
                                        className="flex flex-col gap-4 transition-transform duration-1000 ease-in-out"
                                        style={{
                                            transform: `translateY(${-130 * (animationOffset % core_values.length)}px)`
                                        }}
                                    >
                                        {/* Triplicamos las tarjetas para efecto infinito más suave */}
                                        {[...core_values, ...core_values, ...core_values].map((card, index) => (
                                            <motion.div
                                                key={`col1-${index}`}
                                                className="bg-white rounded-2xl shadow-xl p-6 w-full min-h-[120px] flex-shrink-0 hover:shadow-2xl transition-shadow duration-300"
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ duration: 0.6, delay: 0.1 + (index % core_values.length) * 0.08 }}
                                                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}
                                            >
                                                <div className="text-center">
                                                    <motion.h3
                                                        className="text-[32px] leading-[94%] font-medium text-neutral-dark mb-3"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.5, delay: 0.15 + (index % core_values.length) * 0.08 }}
                                                    >
                                                        {renderTitle(card.name)}
                                                    </motion.h3>
                                                    <motion.p
                                                        className="text-base text-neutral-light font-normal"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.5, delay: 0.18 + (index % core_values.length) * 0.08 }}
                                                    >
                                                        {card.description}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Columna 2 - Baja */}
                                <div className="flex flex-col gap-4 w-[250px] relative">
                                    <div 
                                        className="flex flex-col gap-4 transition-transform duration-1000 ease-in-out"
                                        style={{
                                            transform: `translateY(${130 * (animationOffset % core_values.length)}px)`
                                        }}
                                    >
                                        {/* Triplicamos las tarjetas con offset diferente */}
                                        {[...core_values.slice(3), ...core_values, ...core_values, ...core_values.slice(0, 3)].map((card, index) => (
                                            <motion.div
                                                key={`col2-${index}`}
                                                className="bg-white rounded-2xl shadow-xl p-6 w-full min-h-[120px] flex-shrink-0 hover:shadow-2xl transition-shadow duration-300"
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ duration: 0.6, delay: 0.1 + (index % core_values.length) * 0.08 }}
                                                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}
                                            >
                                                <div className="text-center">
                                                    <motion.h3
                                                        className="text-[32px] leading-[94%] font-medium text-neutral-dark mb-3"
                                                        initial={{ opacity: 0, x: 10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.5, delay: 0.15 + (index % core_values.length) * 0.08 }}
                                                    >
                                                        {renderTitle(card.name)}
                                                    </motion.h3>
                                                    <motion.p
                                                        className="text-base text-neutral-light font-normal"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.5, delay: 0.18 + (index % core_values.length) * 0.08 }}
                                                    >
                                                        {card.description}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE VERSION - Nueva versión optimizada */}
            <div className="block lg:hidden py-8 px-4 mx-auto relative z-10">
                {/* Contenido de texto centrado */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.div
                        className="uppercase text-white text-xs font-medium tracking-widest mb-3"
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >NUESTROS PILARES</motion.div>
                    
                    <motion.h2
                        className="text-3xl font-medium text-white mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <TextWithHighlight text={data?.title} color='bg-secondary font-semibold' split_coma/>
                    </motion.h2>
                    
                    <motion.p
                        className="text-sm text-white mb-6 leading-relaxed whitespace-pre-line"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <TextWithHighlight text={data?.description} color='bg-white font-semibold' />
                    </motion.p>
                </motion.div>

                {/* Imagen móvil */}
              

                {/* Tarjetas en slider Swiper para móvil */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    {/* Slider horizontal de tarjetas con Swiper */}
                    <motion.div
                        className="w-full py-2"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={16}
                            slidesPerView={1.5}
                            centeredSlides={false}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: false,
                                el: '.swiper-pagination-custom',
                                bulletClass: 'swiper-pagination-bullet',
                                bulletActiveClass: 'swiper-pagination-bullet-active',
                            }}
                            loop={true}
                            className="pilares-swiper"
                            watchOverflow={true}
                            speed={800}
                            effect="slide"
                            breakpoints={{
                                320: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 16,
                                },
                                480: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 16,
                                },
                                640: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 20,
                                }
                            }}
                        >
                            {core_values?.map((card, index) => (
                                <SwiperSlide key={index}>
                                    <motion.div
                                        className="bg-white rounded-xl shadow-xl p-6 w-full h-[180px] mx-auto transition-shadow duration-300 flex flex-col"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                                    >
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <motion.h3
                                                className="text-xl font-medium text-neutral-dark mb-3 leading-tight line-clamp-2"
                                                initial={{ opacity: 0, y: -10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ duration: 0.5, delay: 0.15 + index * 0.05 }}
                                            >
                                                {renderTitle(card.name)}
                                            </motion.h3>
                                            <motion.p
                                                className="text-sm text-neutral-light font-normal leading-relaxed line-clamp-4 flex-1 flex items-center"
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ duration: 0.5, delay: 0.18 + index * 0.05 }}
                                            >
                                                <span className="text-center w-full">
                                                    {card.description}
                                                </span>
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* Paginación personalizada */}
                        <div className="swiper-pagination-custom mt-8 flex justify-center"></div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
        </>
    );
}

export default PilaresSection;