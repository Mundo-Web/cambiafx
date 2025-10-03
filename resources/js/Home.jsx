import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";

import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import ReactModal from "react-modal";
import { motion } from "framer-motion";
import { useTranslation } from "./hooks/useTranslation";

// Lazy loading de componentes para mejorar performance
const AppStoreBanner = lazy(() => import("./components/Apps/AppStoreBanner"));
const HeroSecction = lazy(() => import("./components/Tailwind/CambiaFX/HeroSecction"));
const PrimeraOperacionSection = lazy(() => import("./components/Tailwind/CambiaFX/PrimeraOperacionSection"));
const FuncionSection = lazy(() => import("./components/Tailwind/CambiaFX/FuncionSection"));
const CuponesSection = lazy(() => import("./components/Tailwind/CambiaFX/CuponesSection"));
const PilaresSection = lazy(() => import("./components/Tailwind/CambiaFX/PilaresSection"));
const EmpresasSection = lazy(() => import("./components/Tailwind/CambiaFX/EmpresasSection"));
const BlogSection = lazy(() => import("./components/Tailwind/CambiaFX/BlogSection"));
const CintilloSection = lazy(() => import("./components/Tailwind/CambiaFX/CintilloSection"));
const PopupManager = lazy(() => import("./components/PopupManager/PopupManager"));
const ModalAppointment = lazy(() => import("./components/Appointment/ModalAppointment"));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);




ReactModal.setAppElement("#app");

const Home = ({
    linkWhatsApp,
    randomImage,
    showSlogan = true,

    landing,

    apps,
    pasos=[],
    cupones=[],
    core_values = [],

    sliders,
    brands,
    posts = [],

    strengths = [],
    testimonios = [],
    indicators = [],
    allServices = [],
    banner_operacion = {},
    banner_slider = [],
}) => {
    const { t, loading, error } = useTranslation();

    // Estado para controlar cuando las secciones están listas para animar
    const [sectionsReady, setSectionsReady] = useState(false);

    // Efecto para marcar las secciones como listas después del primer render
    useEffect(() => {
        // Pequeño delay para asegurar que el DOM esté completamente cargado
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

 

    const landingInicio = landing?.find(
        (item) => item.correlative === "page_home_inicio"
    );

    const landingPasos = landing?.find(
        (item) => item.correlative === "page_home_pasos"
    );

    const landingCupones = landing?.find(
        (item) => item.correlative === "page_home_cupones"
    );  
    const landingPilares = landing?.find(
        (item) => item.correlative === "page_home_pilares"
    );  

    // Filtrar indicadores para cupones
    const indicadoresCupones = indicators?.filter(
        (indicator) => indicator.correlative === "inicio_cupones"
    ) || [];
      const indicadoresInicio = indicators?.filter(
        (indicator) => indicator.correlative === "inicio_hero"
    ) || [];


    const landingBlog = landing?.find(
        (item) => item.correlative === "page_home_blog"
    );

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    const handleEnded = () => {
        setIsPlaying(false); // Mostrar el botón otra vez
    };

    const [isModalOpen, setIsModalOpen] = useState(false);


    const [allowSync, setAllowSync] = useState(false);
    const [slidesPerView, setSlidesPerView] = useState(4);
    const topSwiperRef = useRef(null);
    const bottomSwiperRef = useRef(null);

    // Función para determinar el número de slides por vista según el ancho de la pantalla
    const getCurrentSlidesPerView = () => {
        const width = window.innerWidth;
        if (width >= 1450) return 5;
        if (width >= 1150) return 4;
        if (width >= 950) return 3;
        if (width >= 650) return 2;
        return 1;
    };

    useEffect(() => {
        const handleResize = () => {
            const newSlidesPerView = getCurrentSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                setSlidesPerView(newSlidesPerView);
            }
        };

        // Establecer el valor inicial
        setSlidesPerView(getCurrentSlidesPerView());

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [slidesPerView]);

    // Función para sincronizar los carruseles
    const syncSwipers = (sourceSwiper, targetSwiper) => {
        if (!allowSync || !sourceSwiper || !targetSwiper) return;

        const totalSlides = sourceSwiper.slides.length;
        const activeIndex = sourceSwiper.activeIndex;
        const currentSlidesPerView = sourceSwiper.params.slidesPerView;

        // Calculamos la posición correspondiente en el otro carrusel
        let targetIndex = totalSlides - activeIndex - currentSlidesPerView;

        // Aseguramos que el índice esté dentro de los límites
        targetIndex = Math.max(0, Math.min(targetIndex, totalSlides - currentSlidesPerView));

        // Movemos el carrusel objetivo sin disparar eventos
        setAllowSync(false);
        targetSwiper.slideTo(targetIndex, sourceSwiper.params.speed, false);
        setTimeout(() => {
            setAllowSync(true);
        }, sourceSwiper.params.speed + 50);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/api/cover/thumbnail/null";
    };

    const swiperRef = useRef(null);



    return (
        <div>
            {/* App Store Banner - Enlaces a tiendas de aplicaciones */}
            <Suspense fallback={null}>
                <AppStoreBanner apps={apps} />
            </Suspense>
            
            <Header showSlogan={showSlogan} />

            <Suspense fallback={null}>
                <CintilloSection />
            </Suspense>

            {/* SECCIÓN CAMBIO FX */}
            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                >
                    <HeroSecction data={landingInicio} apps={apps} indicators={indicadoresInicio} />
                </motion.div>
            </Suspense>

            {/* SECCIÓN HAZ TU PRIMERA OPERACION - DISEÑO FIEL */}
            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <PrimeraOperacionSection banner={banner_operacion} />
                </motion.div>
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <FuncionSection data={landingPasos} pasos={pasos} />
                </motion.div>
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <CuponesSection data={landingCupones} cupones={cupones} indicators={indicadoresCupones} />
                </motion.div>
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <PilaresSection data={landingPilares} core_values={core_values} />
                </motion.div>
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    <EmpresasSection banner_slider={banner_slider} />
                </motion.div>
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
                <motion.div
                    className="animate-section"
                    initial={{ opacity: 0, y: 40 }}
                    animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                >
                    <BlogSection data={landingBlog} posts={posts} />
                </motion.div>
            </Suspense>

            <Footer />

            {/* Sistema de Popups Programables */}
            <Suspense fallback={null}>
                <PopupManager />
            </Suspense>

            {/* Modal */}
            <Suspense fallback={null}>
                <ModalAppointment
                    linkWhatsApp={linkWhatsApp}
                    randomImage={randomImage}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </Suspense>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Home {...properties} />
            </Base>
        </CarritoProvider>
    );
});
