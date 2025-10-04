import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppButton from "../../Shared/WhatsAppButton";

const EmpresasSection = ({ banner_slider }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Hook para detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-play functionality optimizada para móvil
    useEffect(() => {
        if (!banner_slider || banner_slider.length <= 1 || !isAutoPlaying) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % banner_slider.length);
        }, isMobile ? 5000 : 6000); // Más rápido en móvil

        return () => clearInterval(interval);
    }, [banner_slider, isAutoPlaying, isMobile]);

    // Funciones de navegación con callback para mejor rendimiento
    const goToSlide = useCallback((index) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Reactivar auto-play después de menos tiempo en móvil
        setTimeout(() => setIsAutoPlaying(true), isMobile ? 8000 : 10000);
    }, [currentSlide, isMobile]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % banner_slider.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), isMobile ? 8000 : 10000);
    }, [banner_slider.length, isMobile]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + banner_slider.length) % banner_slider.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), isMobile ? 8000 : 10000);
    }, [banner_slider.length, isMobile]);

    // Handlers para drag/swipe optimizados para móvil
    const handleMouseDown = useCallback((e) => {
        if (isMobile) return; // Solo para desktop
        setIsDragging(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
        setIsAutoPlaying(false);
    }, [isMobile]);

    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
        setIsAutoPlaying(false);
    }, []);

    const handleMouseUp = useCallback((e) => {
        if (!isDragging || isMobile) return;
        handleDragEnd(e.clientX, e.clientY);
    }, [isDragging, isMobile]);

    const handleTouchEnd = useCallback((e) => {
        if (!isDragging) return;
        handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }, [isDragging]);

    const handleDragEnd = useCallback((endX, endY) => {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Umbral más bajo para móvil
        const threshold = isMobile ? 30 : 50;
        
        // Solo considerar swipe horizontal si el movimiento horizontal es mayor que el vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        
        setIsDragging(false);
        setTimeout(() => setIsAutoPlaying(true), isMobile ? 8000 : 10000);
    }, [startX, startY, isMobile, prevSlide, nextSlide]);

    // Función para procesar texto con markdown simple (*texto* -> <strong>texto</strong>)
    const processText = (text) => {
        if (!text) return '';
        return text.replace(/\*(.*?)\*/g, '<strong class="text-secondary">$1</strong>');
    };

    if (!banner_slider || banner_slider.length === 0) {
        return null;
    }

    // Memoizar variantes de animación para mejor rendimiento
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isMobile ? 0.1 : 0.15,
                delayChildren: 0.1
            }
        }
    }), [isMobile]);

    const slideVariants = useMemo(() => ({
        enter: (direction) => ({
            x: direction > 0 ? (isMobile ? 200 : 300) : (isMobile ? -200 : -300),
            opacity: 0,
            scale: 0.95,
            rotateY: isMobile ? 0 : (direction > 0 ? 15 : -15)
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                type: "spring",
                stiffness: isMobile ? 250 : 200,
                damping: isMobile ? 35 : 30,
                mass: 1
            }
        },
        exit: (direction) => ({
            x: direction < 0 ? (isMobile ? 200 : 300) : (isMobile ? -200 : -300),
            opacity: 0,
            scale: 0.95,
            rotateY: isMobile ? 0 : (direction < 0 ? 15 : -15),
            transition: {
                duration: isMobile ? 0.3 : 0.4,
                ease: "easeInOut"
            }
        })
    }), [isMobile]);

    const textVariants = useMemo(() => ({
        hidden: { opacity: 0, y: isMobile ? 15 : 30, x: isMobile ? 0 : -20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            x: 0,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 25,
                delay: 0.1
            }
        }
    }), [isMobile]);

    const imageVariants = useMemo(() => ({
        hidden: { opacity: 0, scale: 0.9, y: isMobile ? 15 : 40 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: isMobile ? 0.05 : 0.2
            }
        }
    }), [isMobile]);

    const currentBanner = banner_slider[currentSlide];

    return (
      banner_slider && banner_slider.length > 0 && (

          <motion.section 
            className="w-full overflow-hidden bg-primary py-12 md:py-32 flex justify-center items-center font-title px-[3%] md:px-[5%] mx-auto "
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div 
                className="relative w-full h-full px-4 md:px-16 rounded-[28px] md:rounded-[56px] bg-constrast flex flex-col items-center py-10 md:py-10  md:min-h-[500px] cursor-grab active:cursor-grabbing select-none"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseLeave={() => setIsDragging(false)}
                whileHover={{ scale: !isMobile ? 1.01 : 1 }}
                style={{ perspective: "1000px" }}
            >
                {/* Fondo decorativo animado - Oculto en móvil para mejor rendimiento */}
                <motion.div 
                    className="absolute h-full w-auto top-0 right-0 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <svg className="z-0 h-full" width="726" height="406" viewBox="0 0 726 406" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M106.632 475.609C46.3026 412.336 8.96465 333.732 1.57527 254.167C-10.6896 86.2005 66.6131 -49.7434 208.283 -110.322C347.381 -169.827 511.454 -135.723 616.571 -25.4768C654.009 13.7878 683.587 61.4665 704.543 116.446L705.068 117.939C716.587 152.177 748.969 292.684 697.569 353.65C678.758 375.879 651.264 385.231 620.072 380.174L617.905 379.787C601.122 376.014 586.028 367.412 574.161 354.967C554.638 334.491 546.306 305.952 551.763 278.674C566.519 214.478 545.681 143.75 497.371 93.0833C473.867 68.4325 445.015 49.8011 413.966 39.3954L412.114 38.7093C357.011 16.7474 296.319 26.4814 245.657 65.4353C190.689 107.729 161.557 174.136 169.673 238.906C173.866 282.275 195.191 326.327 228.111 360.854C271.521 406.381 327.405 427.905 377.546 418.42C405.847 412.744 435.433 422.245 456.027 443.844C466.975 455.326 474.554 469.561 478.009 484.97C483.675 509.613 478.407 534.103 463.043 553.505C446.339 574.643 419.424 587.43 390.488 588.04C291.608 600.308 185.644 558.319 106.787 475.614L106.632 475.609Z" fill="url(#paint0_linear_16_2457)" fillOpacity="0.6" />
                        <defs>
                            <linearGradient id="paint0_linear_16_2457" x1="605.608" y1="-36.9748" x2="90.2411" y2="458.384" gradientUnits="userSpaceOnUse">
                                <stop offset="0.483986" stopColor="#7E5AFB" />
                                <stop offset="1" stopColor="#C7B7FF" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <svg className="absolute top-0 right-0 z-[999]" width="370" height="406" viewBox="0 0 370 406" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M62.0611 55.3248C99.5069 13.3718 147.971 -14.6335 198.601 -23.4874C305.657 -40.0404 396.815 2.48865 442.984 90.1853C488.331 176.288 474.954 283.246 409.708 356.345C386.471 382.379 357.433 403.809 323.267 420.089L322.337 420.503C300.981 429.659 212.572 457.69 170.825 427.889C155.6 416.978 148.182 399.835 149.81 379.575L149.946 378.166C151.497 367.21 156.231 357.088 163.597 348.836C175.714 335.259 193.581 328.441 211.352 330.528C253.275 336.668 297.543 319.648 327.528 286.054C342.117 269.71 352.569 250.247 357.635 229.802L357.979 228.579C369.209 192.114 359.828 153.706 332.232 123.24C302.272 90.1852 258.189 74.9433 217.082 83.4974C189.493 88.4295 162.353 104.38 141.92 127.274C114.976 157.461 104.067 194.403 112.742 226.06C117.846 243.911 113.285 263.372 100.502 277.693C93.7067 285.306 84.9724 290.902 75.2721 293.914C59.7655 298.821 43.7911 296.711 30.5573 287.865C16.1401 278.249 6.54982 261.654 4.66177 243.133C-8.31942 180.371 13.1198 110.261 62.0655 55.4244L62.0611 55.3248Z" fill="url(#paint0_linear_20_827)" fillOpacity="0.6" />
                        <defs>
                            <linearGradient id="paint0_linear_20_827" x1="416.513" y1="348.721" x2="72.2565" y2="43.9248" gradientUnits="userSpaceOnUse">
                                <stop offset="0.483986" stopColor="#7E5AFB" />
                                <stop offset="1" stopColor="#C7B7FF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                {/* Contenido del slide actual */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col md:flex-row items-center w-full h-full relative z-10"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* MOBILE LAYOUT - Reorganización para móvil */}
                       
    {/* Imagen arriba en móvil 
    
    <motion.div 
                            className="md:hidden relative  z-10 w-full flex justify-center items-center  "
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.img 
                                src={`/api/banners/media/${currentBanner.image}`} 
                                alt={currentBanner.name} 
                                className="h-[300px] absolute top-20 -right-12 w-auto object-contain select-none transition-all duration-500" 
                                draggable="false"
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                        </motion.div>
    */}
                        
                        {/* Título y descripción en móvil */}
                        <motion.div 
                            className="md:hidden z-10 w-full text-center mb-6 order-2 px-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.span 
                                className="uppercase text-white tracking-wider text-sm font-medium mb-2 block"
                                variants={textVariants}
                            >
                                {currentBanner.name}
                            </motion.span>
                            
                            <motion.h2 
                                className="text-2xl sm:text-3xl font-medium leading-tight text-white mb-4"
                                dangerouslySetInnerHTML={{ 
                                    __html: processText(currentBanner.description)?.replace(/\n/g, '<br />') 
                                }}
                                variants={textVariants}
                            />
                        </motion.div>

                        {/* Botón de WhatsApp centrado en móvil */}
                        <motion.div 
                            className="md:hidden z-10 flex flex-col items-center gap-4 order-3 mb-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className="text-white text-center text-lg"
                                variants={textVariants}
                            >
                                <span 
                                    dangerouslySetInnerHTML={{ 
                                        __html: processText(currentBanner.button_text) 
                                    }}
                                />
                            </motion.div>
                            
                            <motion.div 
                                className="relative"
                                variants={textVariants}
                            >
                                <WhatsAppButton buttonData={currentBanner.button_link}>   
                                    <motion.span 
                                        className="z-10 block"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg width="80" height="80" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="49.567" cy="49.567" r="49.567" transform="matrix(1 0 0 -1 0.933594 100.066)" fill="#D9D9D9" fillOpacity="0.4" />
                                            <path d="M87.7015 50.6493C87.7015 30.021 70.979 13.2985 50.3507 13.2985C29.7225 13.2985 13 30.021 13 50.6493C13 71.2775 29.7225 88 50.3507 88C70.979 88 87.7015 71.2775 87.7015 50.6493Z" fill="#BCFF52" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M63.8167 37.8734C60.6384 34.6951 56.4006 33 51.951 33C42.6279 33 35 40.6279 35 49.951C35 52.9174 35.8476 55.8838 37.3308 58.4265L35 66.902L43.8993 64.5712C46.4419 65.8425 49.1964 66.6901 51.951 66.6901C61.274 66.6901 68.902 59.0621 68.902 49.7391C68.902 45.2895 66.995 41.0517 63.8167 37.8734ZM51.951 63.9355C49.4083 63.9355 46.8657 63.2999 44.7468 62.0286L44.323 61.8167L39.0258 63.2999L40.5091 58.2146L40.0853 57.5789C38.6021 55.2482 37.9664 52.7055 37.9664 50.1629C37.9664 42.5349 44.323 36.1783 51.951 36.1783C55.765 36.1783 59.1552 37.6615 61.9097 40.2042C64.6642 42.9587 65.9356 46.3489 65.9356 50.1629C65.9356 57.5789 59.7908 63.9355 51.951 63.9355ZM59.5789 53.3412C59.1552 53.1293 57.0363 52.0699 56.6125 52.0699C56.1888 51.858 55.9768 51.858 55.7649 52.2817C55.553 52.7055 54.7055 53.5531 54.4937 53.9768C54.2818 54.1887 54.0698 54.1887 53.6461 54.1887C53.2223 53.9768 51.951 53.5531 50.2559 52.0699C48.9846 51.0104 48.137 49.5272 47.9251 49.1034C47.7132 48.6797 47.9251 48.4678 48.137 48.2559C48.3489 48.044 48.5608 47.8321 48.7727 47.6202C48.9846 47.4083 48.9846 47.1964 49.1965 46.9846C49.4084 46.7727 49.1965 46.5608 49.1965 46.3489C49.1965 46.137 48.3489 44.0181 47.9251 43.1706C47.7132 42.5349 47.2895 42.5349 47.0776 42.5349C46.8657 42.5349 46.6538 42.5349 46.23 42.5349C46.0181 42.5349 45.5943 42.5349 45.1706 42.9587C44.7468 43.3825 43.6874 44.4419 43.6874 46.5608C43.6874 48.6797 45.1706 50.5866 45.3825 51.0104C45.5944 51.2223 48.3489 55.6719 52.5866 57.367C56.1887 58.8502 56.8244 58.4265 57.672 58.4265C58.5195 58.4265 60.2146 57.367 60.4265 56.5195C60.8502 55.4601 60.8503 54.6125 60.6384 54.6125C60.4265 53.5531 60.0027 53.5531 59.5789 53.3412Z" fill="#222222" />
                                        </svg>
                                    </motion.span>
                                </WhatsAppButton>
                            </motion.div>
                        </motion.div>

                        {/* Indicadores del slider en móvil */}
                        {banner_slider.length > 1 && (
                            <motion.div 
                                className="md:hidden flex gap-2 order-4 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {banner_slider.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                                            index === currentSlide 
                                                ? 'bg-white scale-125' 
                                                : 'bg-transparent hover:bg-white/50'
                                        }`}
                                        aria-label={`Ir al slide ${index + 1}`}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                ))}
                            </motion.div>
                        )}
                     

                        {/* DESKTOP LAYOUT - Mantener diseño original para desktop */}
                        {/* Columna izquierda: texto */}
                        <motion.div 
                            className="hidden md:flex flex-1 z-10 flex-col justify-center items-start gap-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.span 
                                className="uppercase text-white tracking-widest text-2xl font-medium mb-2"
                                variants={textVariants}
                            >
                                {currentBanner.name}
                            </motion.span>
                            
                            <motion.h2 
                                className="text-4xl md:text-5xl lg:text-[64px] font-medium leading-tight text-white mb-2"
                                dangerouslySetInnerHTML={{ 
                                    __html: processText(currentBanner.description)?.replace(/\n/g, '<br className="hidden md:block" />') 
                                }}
                                variants={textVariants}
                            />
                            
                            {/* Indicadores del slider en desktop */}
                            {banner_slider.length > 1 && (
                                <motion.div 
                                    className="flex gap-2 mt-6 md:mt-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {banner_slider.map((_, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                                                index === currentSlide 
                                                    ? 'bg-white scale-125' 
                                                    : 'bg-transparent hover:bg-white/50'
                                            }`}
                                            aria-label={`Ir al slide ${index + 1}`}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Columna central: imagen en desktop */}
                        <motion.div 
                            className="hidden md:flex z-10 flex-1 justify-center items-end min-h-[400px] relative"
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.img 
                                src={`/api/banners/media/${currentBanner.image}`} 
                                alt={currentBanner.name} 
                                className="h-[650px] absolute -bottom-12 w-auto object-contain select-none transition-all duration-500" 
                                style={{
                                    objectPosition: 'bottom',
                                    marginBottom: '-10px'
                                }}
                                draggable="false"
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                        </motion.div>

                        {/* Columna derecha: mensaje y WhatsApp en desktop */}
                        <motion.div 
                            className="hidden md:flex z-10 flex-col gap-10 items-end pr-8 justify-end min-w-[180px] md:ml-8 mt-8 md:mt-0"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className="text-white relative text-2xl text-end mb-2"
                                variants={textVariants}
                            >
                                <span 
                                    dangerouslySetInnerHTML={{ 
                                        __html: processText(currentBanner.button_text) 
                                    }}
                                />
                                <motion.div 
                                    className="absolute -right-10"
                                    animate={{
                                        y: [0, -5, 0],
                                        rotate: [0, 2, -2, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                >
                                    <svg width="53" height="76" viewBox="0 0 53 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_16_2495)">
                                            <path d="M24.904 2.71705C44.9855 27.8746 39.9591 61.6151 23.9101 73.0194" stroke="#FAF3E1" strokeWidth="1.50408" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M25.18 65.8476L23.9083 73.0192L31.0918 71.9369" stroke="#FAF3E1" strokeWidth="1.50408" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_16_2495">
                                                <rect width="69.751" height="30.5232" fill="white" transform="translate(28.7188) rotate(70.1997)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </motion.div>
                            </motion.div>
                            
                            <motion.div 
                                className="relative"
                                variants={textVariants}
                            >
                                <WhatsAppButton buttonData={currentBanner.button_link}>   
                                    <motion.span 
                                        className="z-10 block"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg width="101" height="101" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="49.567" cy="49.567" r="49.567" transform="matrix(1 0 0 -1 0.933594 100.066)" fill="#D9D9D9" fillOpacity="0.4" />
                                            <path d="M87.7015 50.6493C87.7015 30.021 70.979 13.2985 50.3507 13.2985C29.7225 13.2985 13 30.021 13 50.6493C13 71.2775 29.7225 88 50.3507 88C70.979 88 87.7015 71.2775 87.7015 50.6493Z" fill="#BCFF52" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M63.8167 37.8734C60.6384 34.6951 56.4006 33 51.951 33C42.6279 33 35 40.6279 35 49.951C35 52.9174 35.8476 55.8838 37.3308 58.4265L35 66.902L43.8993 64.5712C46.4419 65.8425 49.1964 66.6901 51.951 66.6901C61.274 66.6901 68.902 59.0621 68.902 49.7391C68.902 45.2895 66.995 41.0517 63.8167 37.8734ZM51.951 63.9355C49.4083 63.9355 46.8657 63.2999 44.7468 62.0286L44.323 61.8167L39.0258 63.2999L40.5091 58.2146L40.0853 57.5789C38.6021 55.2482 37.9664 52.7055 37.9664 50.1629C37.9664 42.5349 44.323 36.1783 51.951 36.1783C55.765 36.1783 59.1552 37.6615 61.9097 40.2042C64.6642 42.9587 65.9356 46.3489 65.9356 50.1629C65.9356 57.5789 59.7908 63.9355 51.951 63.9355ZM59.5789 53.3412C59.1552 53.1293 57.0363 52.0699 56.6125 52.0699C56.1888 51.858 55.9768 51.858 55.7649 52.2817C55.553 52.7055 54.7055 53.5531 54.4937 53.9768C54.2818 54.1887 54.0698 54.1887 53.6461 54.1887C53.2223 53.9768 51.951 53.5531 50.2559 52.0699C48.9846 51.0104 48.137 49.5272 47.9251 49.1034C47.7132 48.6797 47.9251 48.4678 48.137 48.2559C48.3489 48.044 48.5608 47.8321 48.7727 47.6202C48.9846 47.4083 48.9846 47.1964 49.1965 46.9846C49.4084 46.7727 49.1965 46.5608 49.1965 46.3489C49.1965 46.137 48.3489 44.0181 47.9251 43.1706C47.7132 42.5349 47.2895 42.5349 47.0776 42.5349C46.8657 42.5349 46.6538 42.5349 46.23 42.5349C46.0181 42.5349 45.5943 42.5349 45.1706 42.9587C44.7468 43.3825 43.6874 44.4419 43.6874 46.5608C43.6874 48.6797 45.1706 50.5866 45.3825 51.0104C45.5944 51.2223 48.3489 55.6719 52.5866 57.367C56.1887 58.8502 56.8244 58.4265 57.672 58.4265C58.5195 58.4265 60.2146 57.367 60.4265 56.5195C60.8502 55.4601 60.8503 54.6125 60.6384 54.6125C60.4265 53.5531 60.0027 53.5531 59.5789 53.3412Z" fill="#222222" />
                                        </svg>
                                    </motion.span>
                                </WhatsAppButton>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.section>
      )
    );
};

export default EmpresasSection;
