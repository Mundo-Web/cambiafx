import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";

import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import { motion } from "framer-motion";
import { useTranslation } from "./hooks/useTranslation";
import AppStoreBanner from "./components/Apps/AppStoreBanner";
import HeroSecction from "./components/Tailwind/CambiaFX/HeroSecction";
import CintilloSection from "./components/Tailwind/CambiaFX/CintilloSection";

const PrimeraOperacionSection = lazy(() =>
    import("./components/Tailwind/CambiaFX/PrimeraOperacionSection")
);
const FuncionSection = lazy(() =>
    import("./components/Tailwind/CambiaFX/FuncionSection")
);
const CuponesSection = lazy(() =>
    import("./components/Tailwind/CambiaFX/CuponesSection")
);
const PilaresSection = lazy(() =>
    import("./components/Tailwind/CambiaFX/PilaresSection")
);
const EmpresasSection = lazy(() =>
    import("./components/Tailwind/CambiaFX/EmpresasSection")
);
const BlogSection = lazy(() =>
    import("./components/Tailwind/CambiaFX/BlogSection")
);
const LazyModalAppointment = lazy(() =>
    import("./components/Appointment/ModalAppointment")
);
const LazyPopupManager = lazy(() =>
    import("./components/PopupManager/PopupManager")
);

const SectionFallback = ({ minHeight = "400px" }) => (
    <div 
        className="w-full rounded-3xl bg-neutral-100/40 animate-pulse" 
        style={{ minHeight }} 
        aria-hidden 
    />
);

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
    const { t } = useTranslation();

    // Estado para controlar cuando las secciones están listas para animar
    const [sectionsReady, setSectionsReady] = useState(false);
    const [shouldRenderPopupManager, setShouldRenderPopupManager] = useState(false);

    // Efecto para marcar las secciones como listas después del primer render
    useEffect(() => {
        // Pequeño delay para asegurar que el DOM esté completamente cargado
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const schedule = () => setShouldRenderPopupManager(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(schedule, { timeout: 4000 });
            return () => window.cancelIdleCallback && window.cancelIdleCallback(idleId);
        }

        const timeoutId = window.setTimeout(schedule, 3000);
        return () => window.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const handleOpenModal = () => setIsModalOpen(true);

        window.addEventListener("open-appointment-modal", handleOpenModal);
        window.openAppointmentModal = handleOpenModal;

        return () => {
            window.removeEventListener("open-appointment-modal", handleOpenModal);
            if (window.openAppointmentModal === handleOpenModal) {
                delete window.openAppointmentModal;
            }
        };
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

    const [isModalOpen, setIsModalOpen] = useState(false);



    return (
        <div>
            <h1 className="sr-only">Cambia dolares y soles online en Peru</h1>
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
                <Suspense fallback={<SectionFallback minHeight="500px" />}>
                    <PrimeraOperacionSection banner={banner_operacion} />
                </Suspense>
            </motion.div>
            <motion.div
                className="animate-section"
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <Suspense fallback={<SectionFallback minHeight="600px" />}>
                    <FuncionSection data={landingPasos} pasos={pasos} />
                </Suspense>
            </motion.div>
            <motion.div
                className="animate-section"
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.3 }}
            >
                <Suspense fallback={<SectionFallback minHeight="700px" />}>
                    <CuponesSection data={landingCupones} cupones={cupones} indicators={indicadoresCupones} />
                </Suspense>
            </motion.div>
            <motion.div
                className="animate-section"
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                <Suspense fallback={<SectionFallback minHeight="550px" />}>
                    <PilaresSection data={landingPilares} core_values={core_values} />
                </Suspense>
            </motion.div>
            <motion.div
                className="animate-section"
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.5 }}
            >
                <Suspense fallback={<SectionFallback minHeight="650px" />}>
                    <EmpresasSection banner_slider={banner_slider} />
                </Suspense>
            </motion.div>
            <motion.div
                className="animate-section"
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.6 }}
            >
                <Suspense fallback={<SectionFallback minHeight="500px" />}>
                    <BlogSection data={landingBlog} posts={posts} />
                </Suspense>
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
            {shouldRenderPopupManager && (
                <Suspense fallback={null}>
                    <LazyPopupManager />
                </Suspense>
            )}

            {/* Modal */}
            {isModalOpen && (
                <Suspense fallback={null}>
                    <LazyModalAppointment
                        linkWhatsApp={linkWhatsApp}
                        randomImage={randomImage}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </Suspense>
            )}
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
