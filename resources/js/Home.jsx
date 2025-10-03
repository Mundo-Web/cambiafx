import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";

import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import ItemsRest from "./actions/ItemRest";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import HealthSection from "./components/Home/HealthSection";
import TratamientoSection from "./components/Home/TratamientoSection";
import TestimonioSection from "./components/Home/TestimonioSection";
import AcercaDe from "./components/Home/AcercaDe";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import ModalAppointment from "./components/Appointment/ModalAppointment";
import PopupManager from "./components/PopupManager/PopupManager";

import { motion } from "framer-motion";
import { ScrollAnimation } from "./animations/ScrollAnimation";
import { scrollEffects } from "./animations/animationVariantsSccroll";
import { PersistentScrollAnimation } from "./animations/PersistentScrollAnimation";
import BlurText from "./Utils/BlurText";
import { useTranslation } from "./hooks/useTranslation";
import SliderInteractive from "./components/Tailwind/Sliders/SliderInteractive";
import AppStoreBanner from "./components/Apps/AppStoreBanner";
import AppStoreLinks from "./components/Apps/AppStoreLinks";
import AppDebugInfo from "./components/Apps/AppDebugInfo";
import CarruselBrands from "./components/Tailwind/Carrusel/CarruselBrands";
import HomeSeccionNosotros from "./components/Tailwind/CambioGerencia/HomeSeccionNosotros";
import HomeSeccionImpacto from "./components/Tailwind/CambioGerencia/HomeSeccionImpacto";
import HomeSeccionServicios from "./components/Tailwind/CambioGerencia/HomeSeccionServicios";
import HomeSeccionTestimonios from "./components/Tailwind/CambioGerencia/HomeSeccionTestimonios";
import HomeSeccionBlog from "./components/Tailwind/CambioGerencia/HomeSeccionBlog";
import HeroSecction from "./components/Tailwind/CambiaFX/HeroSecction";
import PrimeraOperacionSection from "./components/Tailwind/CambiaFX/PrimeraOperacionSection";
import FuncionSection from "./components/Tailwind/CambiaFX/FuncionSection";
import CuponesSection from "./components/Tailwind/CambiaFX/CuponesSection";
import PilaresSection from "./components/Tailwind/CambiaFX/PilaresSection";
import EmpresasSection from "./components/Tailwind/CambiaFX/EmpresasSection";
import BlogSection from "./components/Tailwind/CambiaFX/BlogSection";
import CintilloSection from "./components/Tailwind/CambiaFX/CintilloSection";




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
            {/* Debug Info <AppDebugInfo apps={apps} />*/}
            
            
            {/* App Store Banner - Enlaces a tiendas de aplicaciones */}
            <AppStoreBanner apps={apps} />
            
            <Header showSlogan={showSlogan} />

            <CintilloSection />

            {/* SECCIÓN CAMBIO FX */}
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

            {/* SLIDER  <SliderInteractive ... /> */}

            {/* SECCIÓN HAZ TU PRIMERA OPERACION - DISEÑO FIEL */}
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

            {/*
            <CarruselBrands items={brands} data={{ title: "15,000+ empresas, desde pequeñas startups hasta nombres conocidos..." }} />

            <HomeSeccionNosotros data={landingNosotros} strengths={strengths} />
            <HomeSeccionServicios data={landingServicios} allServices={allServices} />
            <HomeSeccionImpacto data={landingImpacto} indicators={indicators} />
            <HomeSeccionTestimonios data={landingTestimonios} testimonios={testimonios} />
            <HomeSeccionBlog data={landingBlog} posts={posts} /> */}

            <Footer />

            {/* Sistema de Popups Programables */}
            <PopupManager />


            {/* Modal */}
            <ModalAppointment
                linkWhatsApp={linkWhatsApp}
                randomImage={randomImage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
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
