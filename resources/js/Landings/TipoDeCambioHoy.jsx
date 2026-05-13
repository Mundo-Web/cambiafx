import React, { useState, useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import Base from "../Components/Tailwind/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Header from "../components/Tailwind/Header";
import Footer from "../components/Tailwind/Footer";
import { CarritoProvider } from "../context/CarritoContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import CintilloSection from "../components/Tailwind/CambiaFX/CintilloSection";
import ExchangeCard from "../components/Tailwind/CambiaFX/ExchangeCard";
import TextWithHighlight from "../Utils/TextWithHighlight";
import OptimizedImage from "../components/Common/OptimizedImage";

const StepsSection = lazy(
    () => import("../components/Tailwind/CambiaFX/StepsSection"),
);
const CuponesSection = lazy(
    () => import("../components/Tailwind/CambiaFX/CuponesSection"),
);
import FAQSection from "../components/Tailwind/CambiaFX/FAQSection";
const BlogSection = lazy(
    () => import("../components/Tailwind/CambiaFX/BlogSection"),
);
import ComparisonTable from "../components/Tailwind/CambiaFX/ComparisonTable";
import CambiaFXService from "../services/CambiaFXService";
import { ArrowRight } from "lucide-react";

const TipoDeCambioHoy = ({
    landing = {},
    apps = [],
    indicators = [],
    pasos = [],
    faqs = [],
    posts = [],
    socials = [],
    marketRates = [],
    liveRates = {},
    financialServiceData = {},
    globalKeywords = "",
}) => {
    const { t } = useTranslation();
    const [sectionsReady, setSectionsReady] = useState(false);
    const [comparisonData, setComparisonData] = useState(
        landing.comparison_data || [
            {
                entity: "CambiaFX",
                buy: "3.715",
                sell: "3.725",
                is_highlight: true,
                category: "Nosotros",
            },
            {
                entity: "BCP",
                buy: "3.650",
                sell: "3.780",
                category: "Banco",
            },
            {
                entity: "SUNAT",
                buy: "3.710",
                sell: "3.718",
                category: "Oficial",
            },
            {
                entity: "Paralelo",
                buy: "3.712",
                sell: "3.728",
                category: "Paralelo",
            },
        ],
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);

        // Cargar datos de competencia en tiempo real
        const fetchCompetition = async () => {
            try {
                const rates = await CambiaFXService.getCompetitionRates(
                    landing.url,
                );
                if (rates && rates.length > 0) {
                    setComparisonData(rates);
                } else if (
                    landing.comparison_data &&
                    landing.comparison_data.length > 0
                ) {
                    setComparisonData(landing.comparison_data);
                }
            } catch (error) {
                console.error("Error fetching competition rates:", error);
                if (landing.comparison_data) {
                    setComparisonData(landing.comparison_data);
                }
            }
        };

        fetchCompetition();

        return () => clearTimeout(timer);
    }, [landing, financialServiceData, globalKeywords]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };


    return (
        <div className="min-h-screen bg-latte overflow-x-hidden font-title">
            <Header showSlogan={true} />
            <CintilloSection />

            {/* PREMIUM HERO SECTION */}
            <motion.section
                className="relative min-h-[800px] bg-neutral-dark flex flex-col lg:flex-row "
                initial="hidden"
                animate={sectionsReady ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {/* Lado Izquierdo: Info, Stats & Comparison */}
                <div className="w-full lg:w-8/12 order-1  px-[6%] py-16 relative flex flex-col justify-center">
                    {/* SVG Decorativo fondo claro */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none -z-10">
                        <svg
                            className="w-full h-full object-cover"
                            width="1032"
                            height="696"
                            viewBox="0 0 1032 696"
                            fill="none"
                        >
                            <path
                                d="M962.486 762.894C901.955 871.616 810.878 955.559 705.847 999.2C482.713 1086.8 265.287 1039.12 123.123 872.135C-16.4963 708.189 -39.4199 470.768 66.0483 281.333C103.611 213.865 155.93 153.528 221.813 101.827L223.621 100.484C265.297 70.3687 442.611 -32.9777 547.184 11.146C585.342 27.3298 609.663 60.7518 615.961 105.286L616.35 108.394C618.309 132.8 612.99 156.95 601.083 178.335"
                                fill="url(#paint0_linear)"
                                fillOpacity="0.3"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear"
                                    x1="55.0487"
                                    y1="301.09"
                                    x2="945.994"
                                    y2="792.447"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0.48" stopColor="#FFFDF9" />
                                    <stop
                                        offset="1"
                                        stopColor="#C7B7FF"
                                        stopOpacity="0.2"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <motion.span
                        variants={itemVariants}
                        className="text-sm text-secondary font-medium tracking-widest  mb-2 uppercase"
                    >
                        {landing.hero_eyebrow ||
                            "Cambia ahora - Sin comisiones"}
                    </motion.span>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-8xl font-medium text-white leading-[0.95] mb-10"
                    >
                        <TextWithHighlight
                            text={
                                landing.hero_title ||
                                "Cambia *soles a dólares* online en Perú al mejor tipo de cambio"
                            }
                            color="bg-secondary"
                        />
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-white/70 max-w-2xl mb-16 leading-relaxed"
                    >
                        {landing.hero_subtitle ||
                            "Nuestra tecnología se conecta con los principales indicadores para ofrecerte el mejor precio."}
                    </motion.p>

                    {/* Market Rates Section */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-x-8 gap-y-10"
                    >
                        {["SUNAT", "Paralelo"].map((entityName) => {
                            const rate = (marketRates || []).find((r) =>
                                r.entity
                                    .toLowerCase()
                                    .includes(entityName.toLowerCase()),
                            );
                            if (!rate) return null;
                            return (
                                <div
                                    key={entityName}
                                    className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-sm min-w-[260px] hover:border-secondary/30 transition-colors group"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                        <span className="text-sm text-secondary font-medium   opacity-80">
                                            Dólar{" "}
                                            {entityName === "Paralelo"
                                                ? "Ocoña"
                                                : entityName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-none">
                                                {rate.buy}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest">
                                                Compra
                                            </span>
                                        </div>
                                        <div className="w-px h-10 bg-white/10"></div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-none">
                                                {rate.sell}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest">
                                                Venta
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Live Updates Section (Vertical Timeline) */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 w-full"
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                            </span>
                            <h3 className="text-sm font-black text-white ">
                                Línea de Tiempo del Mercado
                            </h3>
                        </div>

                        <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-1 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-secondary before:via-white/10 before:to-transparent">
                            {(liveRates?.momentos || []).length > 0 ? (
                                [...liveRates.momentos]
                                    .sort((a, b) =>
                                        b.hora.localeCompare(a.hora),
                                    )
                                    .map((moment, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="relative group"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute left-[-35px] top-1.5 w-3 h-3 rounded-full bg-neutral-dark border-2 border-secondary group-hover:scale-125 transition-transform"></div>

                                            <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] backdrop-blur-md hover:border-secondary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                                                            {moment.fuente}
                                                        </span>
                                                        <span className="text-[10px] text-white/40 font-medium bg-white/5 px-2 py-1 rounded-full">
                                                            {moment.hora}
                                                        </span>
                                                    </div>
                                                    <p className="text-white font-medium text-sm mt-1 opacity-80">
                                                        {moment.titulo ||
                                                            `Actualización de precio ${moment.fuente}`}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-8 md:border-l md:border-white/10 md:pl-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-white/30 uppercase font-bold mb-1 tracking-widest">
                                                            Compra
                                                        </span>
                                                        <span className="text-2xl font-bold text-white tabular-nums">
                                                            S/{" "}
                                                            {moment.compra?.toFixed(
                                                                3,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-white/30 uppercase font-bold mb-1 tracking-widest">
                                                            Venta
                                                        </span>
                                                        <span className="text-2xl font-bold text-white tabular-nums">
                                                            S/{" "}
                                                            {moment.venta?.toFixed(
                                                                3,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {moment.spread && (
                                                        <div className="hidden sm:flex flex-col text-right">
                                                            <span className="text-[9px] text-white/30 uppercase font-bold mb-1 tracking-widest">
                                                                Spread
                                                            </span>
                                                            <span className="text-xs font-bold text-secondary">
                                                                S/{" "}
                                                                {moment.spread.toFixed(
                                                                    3,
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                            ) : (
                                <div className="text-white/20 text-sm font-medium italic py-8 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                    Monitorizando pulsos del mercado...
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Lado Derecho: Calculadora */}
                <div className="w-full lg:w-4/12 px-[4%] py-16 flex flex-col items-start justify-start relative overflow-hidden">
                    {/* Brillo decorativo sutil */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96  blur-[100px] rounded-full"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={
                            sectionsReady
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 0.9 }
                        }
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full max-w-[460px] z-10"
                    >
                        <div className="relative">
                            <div className="relative">
                                <ExchangeCard
                                    title="COTIZA TU CAMBIO"
                                    initialOperationType="venta"
                                    showCoupons={true}
                                />
                            </div>
                        </div>
                    </motion.div>
                    {/* SELLO DE CONFIANZA SBS */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 flex items-center justify-center gap-6"
                    >
                        <div className="flex gap-4 items-center justify-center">
                            <span className="text-xs font-black text-white  mb-2">
                                Registrados en:
                            </span>
                            <img
                                src="/assets/cambiafx/sbs_logo.webp"
                                alt="SBS Logo"
                                className="h-12 object-contain grayscale invert"
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* SECCIÓN COMPARATIVA DE MERCADO (Fondo Oscuro) */}
            <section className="bg-neutral-dark hidden py-24 px-[5%] relative overflow-hidden">
                {/* Decoración de fondo */}
                {/* Fondo decorativo animado - Oculto en móvil para mejor rendimiento */}
                <motion.div
                    className="absolute h-full w-auto top-0 right-0 opacity-50 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <svg
                        className="z-0 h-full opacity-40"
                        width="1080"
                        height="1080"
                        viewBox="0 0 726 406"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M106.632 475.609C46.3026 412.336 8.96465 333.732 1.57527 254.167C-10.6896 86.2005 66.6131 -49.7434 208.283 -110.322C347.381 -169.827 511.454 -135.723 616.571 -25.4768C654.009 13.7878 683.587 61.4665 704.543 116.446L705.068 117.939C716.587 152.177 748.969 292.684 697.569 353.65C678.758 375.879 651.264 385.231 620.072 380.174L617.905 379.787C601.122 376.014 586.028 367.412 574.161 354.967C554.638 334.491 546.306 305.952 551.763 278.674C566.519 214.478 545.681 143.75 497.371 93.0833C473.867 68.4325 445.015 49.8011 413.966 39.3954L412.114 38.7093C357.011 16.7474 296.319 26.4814 245.657 65.4353C190.689 107.729 161.557 174.136 169.673 238.906C173.866 282.275 195.191 326.327 228.111 360.854C271.521 406.381 327.405 427.905 377.546 418.42C405.847 412.744 435.433 422.245 456.027 443.844C466.975 455.326 474.554 469.561 478.009 484.97C483.675 509.613 478.407 534.103 463.043 553.505C446.339 574.643 419.424 587.43 390.488 588.04C291.608 600.308 185.644 558.319 106.787 475.614L106.632 475.609Z"
                            fill="url(#paint_linear_comparison)"
                            fillOpacity="0.6"
                        />
                        <defs>
                            <linearGradient
                                id="paint_linear_comparison"
                                x1="605.608"
                                y1="-36.9748"
                                x2="90.2411"
                                y2="458.384"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0.483986" stopColor="#7E5AFB" />
                                <stop offset="1" stopColor="#C7B7FF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-7xl font-medium text-white mb-8"
                        >
                            <TextWithHighlight
                                text={
                                    landing.comparison_title ||
                                    "Ahorra más en cada *operación*"
                                }
                                color="bg-constrast"
                            />
                        </motion.h2>
                        <p className="text-white/60 text-xl mb-12 leading-relaxed max-w-xl">
                            {landing.comparison_subtitle ||
                                "Nuestra tecnología se conecta con los principales indicadores para ofrecerte el mejor precio."}
                        </p>

                        <div className="flex items-center gap-6 mb-16">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-12 h-12 rounded-full border-2 border-neutral-dark bg-white/10 overflow-hidden"
                                    >
                                        <img
                                            src={`https://i.pravatar.cc/100?u=${i + 10}`}
                                            alt="User"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-white/60 text-sm font-medium">
                                <strong className="text-white text-lg block">
                                    <TextWithHighlight
                                        text={
                                            landing.stats?.find(
                                                (s) =>
                                                    s.label.includes(
                                                        "clientes",
                                                    ) ||
                                                    s.label.includes(
                                                        "personas",
                                                    ),
                                            )?.value +
                                                " " +
                                                "personas" || "60k+ personas"
                                        }
                                        color="bg-constrast"
                                    />
                                </strong>
                                ya confían en nuestra tasa
                            </div>
                        </div>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://mi.cambiafx.pe/register"
                            className="inline-flex items-center bg-secondary gap-3 text-neutral-dark px-10 py-5 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-xl uppercase tracking-wider"
                        >
                            {landing.comparison_cta || "Comenzar ahora"}
                            <ArrowRight size={20} />
                        </motion.a>
                    </div>

                    <div className="relative">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[48px] p-2 md:p-8 border border-white/10 shadow-2xl relative">
                            <ComparisonTable
                                data={[
                                    ...(marketRates || []),
                                    ...(landing.comparison_data || []),
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN FUNCIONAMIENTO */}
            {landing.steps && (
                <Suspense fallback={null}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <StepsSection
                            data={{
                                title:
                                    landing.steps_title || "Cambia en 3 pasos",
                                description:
                                    landing.steps_subtitle ||
                                    "Es más fácil que el banco y 100% seguro.",
                            }}
                            pasos={landing.steps}
                        />
                    </motion.div>
                </Suspense>
            )}
            {/* CTA SECTION PREMIUM (Inspirado en EmpresasSection) */}
            <section className="w-full overflow-hidden relative bg-primary py-12 md:py-32 flex justify-center items-center px-[3%] md:px-[5%] mx-auto">
                <motion.div
                    className="relative w-full h-full px-4 md:px-16 rounded-[28px] md:rounded-[56px] bg-constrast flex flex-col md:flex-row items-center py-10 md:py-10 md:min-h-[400px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Fondo decorativo SVG (Copiado de EmpresasSection) */}
                    <div className="absolute h-full w-auto top-0 right-0 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block opacity-40">
                        <svg
                            className="z-0 h-full"
                            width="726"
                            height="406"
                            viewBox="0 0 726 406"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M106.632 475.609C46.3026 412.336 8.96465 333.732 1.57527 254.167C-10.6896 86.2005 66.6131 -49.7434 208.283 -110.322C347.381 -169.827 511.454 -135.723 616.571 -25.4768C654.009 13.7878 683.587 61.4665 704.543 116.446L705.068 117.939C716.587 152.177 748.969 292.684 697.569 353.65C678.758 375.879 651.264 385.231 620.072 380.174L617.905 379.787C601.122 376.014 586.028 367.412 574.161 354.967C554.638 334.491 546.306 305.952 551.763 278.674C566.519 214.478 545.681 143.75 497.371 93.0833C473.867 68.4325 445.015 49.8011 413.966 39.3954L412.114 38.7093C357.011 16.7474 296.319 26.4814 245.657 65.4353C190.689 107.729 161.557 174.136 169.673 238.906C173.866 282.275 195.191 326.327 228.111 360.854C271.521 406.381 327.405 427.905 377.546 418.42C405.847 412.744 435.433 422.245 456.027 443.844C466.975 455.326 474.554 469.561 478.009 484.97C483.675 509.613 478.407 534.103 463.043 553.505C446.339 574.643 419.424 587.43 390.488 588.04C291.608 600.308 185.644 558.319 106.787 475.614L106.632 475.609Z"
                                fill="url(#paint_linear_cta)"
                                fillOpacity="0.6"
                            />
                            <defs>
                                <linearGradient
                                    id="paint_linear_cta"
                                    x1="605.608"
                                    y1="-36.9748"
                                    x2="90.2411"
                                    y2="458.384"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop
                                        offset="0.483986"
                                        stopColor="#7E5AFB"
                                    />
                                    <stop offset="1" stopColor="#C7B7FF" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* DESKTOP LAYOUT - Exact match to EmpresasSection */}
                    <div className="flex-1 z-10 flex flex-col md:flex-row w-full h-full items-center">
                        {/* Columna izquierda: texto */}
                        <div className="flex-1 z-10 flex flex-col justify-center items-start gap-4">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-7xl font-medium leading-tight text-white mb-2"
                            >
                                <TextWithHighlight
                                    text={
                                        landing.cta_title ||
                                        "Empieza a ahorrar ahora"
                                    }
                                    color="bg-secondary font-bold"
                                />
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-white text-lg md:text-2xl max-w-xl font-light"
                            >
                                {landing.cta_subtitle ||
                                    "Únete a los más de 60,000 peruanos que ya ahorran con la casa de cambio digital líder en Perú."}
                            </motion.p>
                        </div>

                        {/* Columna central: imagen */}
                        {landing.cta_image && (
                            <div className="z-10 flex-1 justify-center items-end min-h-[300px] md:min-h-[400px] relative hidden md:flex">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    src={`/api/transactional_landings/media/${landing.cta_image}`}
                                    alt="CTA Banner"
                                    className="h-[500px] lg:h-[600px] absolute -bottom-10 lg:-bottom-10 w-auto object-contain select-none transition-all duration-500 drop-shadow-2xl"
                                    draggable="false"
                                />
                            </div>
                        )}

                        {/* Columna derecha: botón y decoración */}
                        <div className="z-10 flex flex-col gap-10 items-center md:items-end justify-center md:justify-end min-w-[200px] md:ml-8 mt-12 md:mt-0">
                            <motion.div
                                className="hidden md:flex text-white relative text-2xl text-end mb-2"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                            >
                                <span>Haz clic aquí</span>
                                <div className="absolute -right-10 top-0">
                                    <svg
                                        width="53"
                                        height="76"
                                        viewBox="0 0 53 76"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_cta)">
                                            <path
                                                d="M24.904 2.71705C44.9855 27.8746 39.9591 61.6151 23.9101 73.0194"
                                                stroke="#FAF3E1"
                                                strokeWidth="1.50408"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M25.18 65.8476L23.9083 73.0192L31.0918 71.9369"
                                                stroke="#FAF3E1"
                                                strokeWidth="1.50408"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_cta">
                                                <rect
                                                    width="69.751"
                                                    height="30.5232"
                                                    fill="white"
                                                    transform="translate(28.7188) rotate(70.1997)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </motion.div>

                            <motion.a
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={
                                    landing.cta_button_link ||
                                    "https://mi.cambiafx.pe/login"
                                }
                                className=" text-neutral-dark bg-secondary font-black px-12 py-5 rounded-full text-lg uppercase tracking-widest shadow-xl whitespace-nowrap"
                            >
                                {landing.cta_button_text || "Cambiar ahora"}
                            </motion.a>
                        </div>
                    </div>

                    {/* Imagen visible solo en móvil (debajo del contenido) */}
                    {landing.cta_image && (
                        <div className="md:hidden w-full flex justify-center mt-8">
                            <img
                                src={`/api/transactional_landings/media/${landing.cta_image}`}
                                className="max-w-[80%] h-auto object-contain"
                            />
                        </div>
                    )}
                </motion.div>
            </section>

            {/* FAQ SECTION */}
            <FAQSection faqs={landing.schema_faq} />

            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <TipoDeCambioHoy {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
