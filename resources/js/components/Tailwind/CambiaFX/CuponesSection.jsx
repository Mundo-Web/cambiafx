import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Estilos CSS personalizados para el slider
const swiperStyles = `
    .cupones-swiper .swiper-slide {
        height: auto;
        display: flex;
    }
    .cupones-swiper .swiper-wrapper {
        align-items: stretch;
    }
`;

const CuponesSection = ({ data, cupones, indicators = [] }) => {
    // Función para formatear fecha de YYYY-MM-DD a DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Extraer la parte de fecha sin procesar zona horaria
        let dateOnly = dateString;
        if (dateString.includes('T')) {
            dateOnly = dateString.split('T')[0];
        } else {
            dateOnly = dateString.substring(0, 10);
        }
        
        // Dividir la fecha YYYY-MM-DD
        const [year, month, day] = dateOnly.split('-');
        return `${day}/${month}/${year}`;
    };
    return (
        <>
            <style>{swiperStyles}</style>
            <section className="relative bg-secondary overflow-hidden font-title px-2 md:px-0 w-full">
                {/* Fondo decorativo */}
                <div className="hidden lg:block absolute top-0 -right-10 translate-x-[10%] w-full h-full z-0 pointer-events-none">
                    <img src="/assets/cambiafx/cupon-overlay.png" alt="Fondo" width="1200" height="800" className=" h-full object-cover pb-16" />
                </div>
                
                {/* DESKTOP VERSION - Mantener exactamente igual */}
                <div className="hidden lg:flex px-[5%] mx-auto relative z-10 flex-col lg:flex-row items-center gap-8">
                    {/* Columna izquierda: textos y cupones */}
                    <motion.div
                        className="flex-1 min-w-max flex flex-col justify-center items-start gap-6"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="uppercase text-neutral-light text-sm font-medium tracking-widest mb-2"
                        >Cupones</motion.div>
                        <motion.h2
                            className="text-5xl md:text-[64px] font-medium text-neutral-dark leading-[94%] mb-2"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <TextWithHighlight text={data?.title} color='bg-neutral-dark font-semibold' split_coma />
                        </motion.h2>
                        <motion.p
                            className="text-lg text-neutral-light mb-4 max-w-lg whitespace-pre-line"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            {data?.description || ""}
                        </motion.p>
                        <motion.div
                            className="text-2xl font-medium text-neutral-dark mb-4"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            {data?.subtitle || ""}
                        </motion.div>
                        {/* Cupones Slider */}
                        <div className="w-full max-w-[680px] mt-2 overflow-hidden">
                            <Swiper
                                modules={[Autoplay]}
                                spaceBetween={24}
                                slidesPerView={2}
                                autoplay={{
                                    delay: 4000,
                                    disableOnInteraction: false,
                                }}
                                loop={cupones?.length > 2}
                                className="cupones-swiper"
                                watchOverflow={true}
                            >
                                {cupones?.map((cupon, index) => (
                                    <SwiperSlide key={cupon.id || index}>
                                        <motion.div
                                            className={`${index % 2 === 0 ? 'bg-constrast' : 'bg-white'} rounded-2xl w-full max-h-max flex flex-col justify-between relative shadow-lg`}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                                            whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}
                                        >
                                            <div className="flex p-6 justify-between items-center gap-2 border-b-4 border-dashed">
                                                <img 
                                                    src="/assets/cambiafx/cupon-fx.png" 
                                                    alt="FX" 
                                                    className={`w-auto min-h-6 max-h-6 object-cover ${index % 2 !== 0 ? 'invert' : ''}`} 
                                                />
                                                <span className={`uppercase ${index % 2 === 0 ? 'text-white' : 'text-neutral-dark'} text-xs tracking-widest font-semibold`}>
                                                    Cuponera
                                                </span>
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col justify-center items-center">
                                                <motion.div
                                                    className={`uppercase ${index % 2 === 0 ? 'text-white' : 'text-neutral-dark'} text-xs font-medium tracking-widest mb-1`}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                                                >Cupón</motion.div>
                                                <motion.div
                                                    className={`text-2xl md:text-3xl font-bold ${index % 2 === 0 ? 'text-white' : 'text-constrast'}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                                >
                                                    {cupon.name}
                                                </motion.div>
                                                <motion.div
                                                    className={`text-xs ${index % 2 === 0 ? 'text-white' : 'text-neutral-light'} mt-1`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
                                                >
                                                    Válido hasta el {formatDate(cupon.date_end)}
                                                </motion.div>
                                            </div>
                                            <div className="absolute -left-3 bottom-1/4 -translate-y-1/4 w-6 h-6 bg-secondary rounded-full"></div>
                                            <div className="absolute -right-3 bottom-1/4 -translate-y-1/4 w-6 h-6 bg-secondary rounded-full"></div>
                                        </motion.div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <motion.div
                            className="mt-0 text-neutral-light text-lg relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            Cupones del <span className="text-constrast font-semibold ">mes</span> <span className="inline-block ml-2 align-middle absolute -top-2"><svg width="52" height="29" viewBox="0 0 52 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6_1362)">
                                    <path d="M3.62723 25.3076C25.8698 29.5474 45.2141 15.3486 47.0437 1.62064" stroke="#222222" strokeWidth="1.77739" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M42.999 4.76542L47.0439 1.62088L48.7276 6.44567" stroke="#222222" strokeWidth="1.77739" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_1362">
                                        <rect width="49.065" height="21.4709" fill="white" transform="matrix(0.990255 -0.139269 -0.139269 -0.990255 3.18945 28.5732)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            </span>
                        </motion.div>
                    </motion.div>
                    {/* Columna derecha: imagen e indicadores */}
                    <motion.div
                        className="flex-1 flex pt-20 justify-center items-center relative"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative">
                            <motion.img 
                                src={`/api/landing_home/media/${data?.image}`} 
                                alt={data?.title} 
                                className="h-[700px] w-auto object-cover z-10" 
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            />
                            
                            {/* Indicadores dinámicos */}
                            {indicators && indicators.length > 0 && (
                                <>
                                    {indicators.map((indicator, index) => (
                                        <motion.div
                                            key={indicator.id || index}
                                            className={`absolute bg-white rounded-2xl p-4 shadow-lg border border-gray-100 ${
                                                index === 0 
                                                    ? "top-2/3 -right-8 transform  -translate-y-4" 
                                                    : "bottom-1/2  -right-32  transform  -translate-y-4"
                                            }`}
                                            initial={{ opacity: 0, scale: 0.8, y: index === 0 ? -20 : 20 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            animate={{
                                                y: [0, -8, 0],
                                                rotate: [0, 1, -1, 0],
                                                scale: [1, 1.02, 1]
                                            }}
                                            transition={{
                                                duration: 0.6, 
                                                delay: 0.5 + index * 0.2,
                                                type: "spring",
                                                stiffness: 200,
                                                y: {
                                                    duration: 3 + index * 0.5,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    ease: "easeInOut"
                                                },
                                                rotate: {
                                                    duration: 4 + index * 0.3,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    ease: "easeInOut"
                                                },
                                                scale: {
                                                    duration: 2.5 + index * 0.4,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    ease: "easeInOut"
                                                }
                                            }}
                                            whileHover={{ 
                                                scale: 1.05, 
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            <motion.div 
                                                className="text-2xl md:text-[40px] font-semibold  mb-1"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ delay: 0.7 + index * 0.2 }}
                                            >
                                                <TextWithHighlight text={indicator?.name} color='bg-constrast' counter />
                                            </motion.div>
                                            <motion.div 
                                                className="text-lg text-neutral-dark font-medium"
                                                initial={{ opacity: 0, y: 5 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ delay: 0.8 + index * 0.2 }}
                                            >
                                                <TextWithHighlight text={indicator?.description} color='bg-constrast' />
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* MOBILE VERSION - Nueva versión optimizada */}
                <div className="block lg:hidden pt-8 px-4 mx-auto relative z-10">
                  

                    {/* Contenido de texto y cupones */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="uppercase text-neutral-light text-xs font-medium tracking-widest mb-3"
                        >Cupones</motion.div>
                        
                        <motion.h2
                            className="text-3xl font-medium text-neutral-dark leading-tight mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <TextWithHighlight text={data?.title} color='bg-neutral-dark font-semibold' split_coma />
                        </motion.h2>
                        
                        <motion.p
                            className="text-sm whitespace-pre-line text-neutral-light mb-4 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                        >
                            {data?.description || ""}
                        </motion.p>
                        
                        <motion.div
                            className="text-lg font-medium text-neutral-dark mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                        >
                            {data?.subtitle || ""}
                        </motion.div>

                        {/* Cupones Slider Mobile */}
                        <motion.div
                            className="w-full mt-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.8 }}
                        >
                            <Swiper
                                modules={[Autoplay]}
                                spaceBetween={16}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 4000,
                                    disableOnInteraction: false,
                                }}
                                loop={cupones?.length > 1}
                                className="cupones-swiper"
                                watchOverflow={true}
                                centeredSlides={true}
                            >
                                {cupones?.map((cupon, index) => (
                                    <SwiperSlide key={cupon.id || index}>
                                        <motion.div
                                            className={`${index % 2 === 0 ? 'bg-constrast' : 'bg-white'} rounded-xl w-full max-w-[280px] mx-auto flex flex-col justify-between relative shadow-lg`}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                                        >
                                            <div className="flex p-4 justify-between items-center gap-2 border-b-2 border-dashed">
                                                <img 
                                                    src="/assets/cambiafx/cupon-fx.png" 
                                                    alt="FX" 
                                                    className={`w-auto min-h-4 max-h-4 object-cover ${index % 2 !== 0 ? 'invert' : ''}`} 
                                                />
                                                <span className={`uppercase ${index % 2 === 0 ? 'text-white' : 'text-neutral-dark'} text-xs tracking-widest font-semibold`}>
                                                    Cuponera
                                                </span>
                                            </div>
                                            <div className="flex-1 p-4 flex flex-col justify-center items-center">
                                                <motion.div
                                                    className={`uppercase ${index % 2 === 0 ? 'text-white' : 'text-neutral-dark'} text-xs font-medium tracking-widest mb-1`}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                                                >Cupón</motion.div>
                                                <motion.div
                                                    className={`text-xl font-bold ${index % 2 === 0 ? 'text-white' : 'text-constrast'} text-center`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                                >
                                                    {cupon.name}
                                                </motion.div>
                                                <motion.div
                                                    className={`text-xs ${index % 2 === 0 ? 'text-white' : 'text-neutral-light'} mt-1 text-center`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
                                                >
                                                    Válido hasta el {formatDate(cupon.date_end)}
                                                </motion.div>
                                            </div>
                                            <div className="absolute -left-2 bottom-1/4 -translate-y-1/4 w-4 h-4 bg-secondary rounded-full"></div>
                                            <div className="absolute -right-2 bottom-1/4 -translate-y-1/4 w-4 h-4 bg-secondary rounded-full"></div>
                                        </motion.div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>

                      
                    </motion.div>

                      {/* Imagen principal arriba en móvil */}
                    <motion.div
                        className="flex justify-center items-center "
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative">
                            <motion.img 
                                src={`/api/landing_home/media/${data?.image}`} 
                                alt={data?.title} 
                                className="h-[500px] w-auto object-cover z-10" 
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            />
                            
                            {/* Indicadores para móvil */}
                            {indicators && indicators.length > 0 && (
                                <>
                                    {indicators.map((indicator, index) => (
                                        <motion.div
                                            key={indicator.id || index}
                                            className={`absolute bg-white rounded-xl p-3 shadow-lg border border-gray-100 ${
                                                index === 0 
                                                    ? "top-3/4 -right-0 transform -translate-y-2" 
                                                    : "bottom-1/3 -left-0 transform -translate-y-2"
                                            }`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            animate={{
                                                y: [0, -4, 0],
                                            }}
                                            transition={{
                                                // Animación de entrada
                                                duration: 0.6, 
                                                delay: 0.5 + index * 0.2,
                                                // Animación de flotación
                                                y: {
                                                    duration: 2 + index * 0.3,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    ease: "easeInOut"
                                                }
                                            }}
                                        >
                                            <motion.div 
                                                className="text-lg font-semibold mb-1"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ delay: 0.7 + index * 0.2 }}
                                            >
                                                <TextWithHighlight text={indicator?.name} color='bg-constrast' counter />
                                            </motion.div>
                                            <motion.div 
                                                className="text-sm text-neutral-dark font-medium"
                                                initial={{ opacity: 0, y: 5 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ delay: 0.8 + index * 0.2 }}
                                            >
                                                <TextWithHighlight text={indicator?.description} color='bg-constrast' />
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
export default CuponesSection;