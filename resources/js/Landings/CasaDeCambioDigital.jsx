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
import {
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Clock,
    XCircle,
    CirclePercent,
    Zap,
    Users,
    Heart,
    Star,
    Wallet,
    Globe,
    Smartphone,
    MousePointer2,
    Lock,
    Sparkles,
} from "lucide-react";

const StepsSection = lazy(
    () => import("../components/Tailwind/CambiaFX/StepsSection"),
);
import FAQSection from "../components/Tailwind/CambiaFX/FAQSection";
import ComparisonTable from "../components/Tailwind/CambiaFX/ComparisonTable";
import CambiaFXService from "../services/CambiaFXService";

const CasaDeCambioDigital = ({
    landing = {},
    apps = [],
    indicators = [],
    pasos = [],
    faqs = [],
    socials = [],
    marketRates = [],
    financialServiceData = {},
    globalKeywords = "",
}) => {
    const { t } = useTranslation();
    const [sectionsReady, setSectionsReady] = useState(false);
    const [amount, setAmount] = useState(10000);
    const [comparisonData, setComparisonData] = useState([]);
    const [cambiaRates, setCambiaRates] = useState({
        compra: 3.715,
        venta: 3.725,
    });
    const [operationType, setOperationType] = useState("compra"); // 'compra' o 'venta'

    const milestones = [
        { value: 1000, label: "1k" },
        { value: 5000, label: "5k" },
        { value: 10000, label: "10k" },
        { value: 50000, label: "50k" },
        { value: 100000, label: "100k" },
    ];

    const logoMapping = {
        "cambia fx": "/assets/img/logo.png",
        cambiafx: "/assets/img/logo.png",
        bcp: "/assets/img/bcp_logo.png",
        interbank: "/assets/img/interbank_logo.png",
        scotiabank: "/assets/img/scotiabank_logo.png",
        bbva: "/assets/img/bbva_logo.png",
        sunat: "/assets/img/sunat_logo.avif",
        otros: "/assets/img/otros_logo.png",
        pichincha: "/assets/img/pichincha_logo.png",
        banbif: "/assets/img/banbif_logo.png",
        paralelo: "/assets/img/ocona_logo.png",
        "dólar ocoña": "/assets/img/ocona_logo.png",
        "dolar ocoña": "/assets/img/ocona_logo.png",
        "dolar ocona": "/assets/img/ocona_logo.png",
        ocona: "/assets/img/ocona_logo.png",
        gnb: "/assets/img/gnb_logo.png",
        comercio: "/assets/img/comercio_logo.png",
    };

    // Lógica de cálculo de ahorro real (Sincronizada con ExchangeCard)
    const getSavingsInfo = () => {
        const isVenta = operationType === "venta";
        const cambiaRate = isVenta ? cambiaRates.venta : cambiaRates.compra;

        // Tasa del banco (Venta)
        let defaultBankRate = isVenta ? cambiaRate + 0.12 : cambiaRate - 0.12;

        // Unificar datos de competencia incluyendo Dólar Ocoña de marketRates
        const baseComparison = [...(comparisonData || [])];
        const oconaFromMarket = (marketRates || []).find(
            (mr) =>
                mr.entity.toLowerCase().includes("paralelo") ||
                mr.entity.toLowerCase().includes("ocoña") ||
                mr.entity.toLowerCase().includes("ocona"),
        );

        if (
            oconaFromMarket &&
            !baseComparison.some(
                (bc) =>
                    bc.entity.toLowerCase().includes("paralelo") ||
                    bc.entity.toLowerCase().includes("ocoña") ||
                    bc.entity.toLowerCase().includes("ocona"),
            )
        ) {
            baseComparison.push({
                entity: "Dólar Ocoña",
                buy: oconaFromMarket.buy,
                sell: oconaFromMarket.sell,
                category: "Paralelo",
            });
        }

        // Mapear competencia (incluyendo Ocoña inyectado y bancos reales del backend)
        const banks = baseComparison
            .filter((ent) => !ent.entity.toLowerCase().includes("cambia"))
            .map((bank) => {
                const bankRate = isVenta
                    ? parseFloat(bank.sell || 0)
                    : parseFloat(bank.buy || 0);

                // Si es VENTA (PEN -> USD): amount es PEN, recibes USD
                // Si es COMPRA (USD -> PEN): amount es USD, recibes PEN
                const receive = isVenta
                    ? bankRate > 0
                        ? amount / bankRate
                        : 0
                    : amount * bankRate;

                const cambiaReceive = isVenta
                    ? cambiaRate > 0
                        ? amount / cambiaRate
                        : 0
                    : amount * cambiaRate;

                return {
                    ...bank,
                    logo:
                        logoMapping[bank.entity.toLowerCase()] ||
                        logoMapping[
                            Object.keys(logoMapping).find((k) =>
                                bank.entity.toLowerCase().includes(k),
                            )
                        ] ||
                        logoMapping["otros"],
                    receive,
                    // Ahorro en PEN si es Venta, Ganancia en PEN si es Compra
                    savingsAmount: isVenta
                        ? (cambiaReceive - receive) * cambiaRate
                        : receive - cambiaReceive,
                };
            });

        const mainBank =
            banks.length > 0
                ? banks.reduce((prev, curr) => {
                      const prevRate = isVenta
                          ? parseFloat(prev.sell || 0)
                          : parseFloat(prev.buy || 0);
                      const currRate = isVenta
                          ? parseFloat(curr.sell || 0)
                          : parseFloat(curr.buy || 0);

                      if (isVenta) {
                          return prevRate > currRate ? prev : curr; // El banco con tasa más alta (peor para el usuario)
                      } else {
                          return prevRate < currRate ? prev : curr; // El banco con tasa más baja (peor para el usuario)
                      }
                  })
                : null;

        const bankRate = mainBank
            ? isVenta
                ? parseFloat(mainBank.sell || 0)
                : parseFloat(mainBank.buy || 0)
            : defaultBankRate;
        const bankName = mainBank ? mainBank.entity : "Bancos";

        const currentReceive = isVenta
            ? cambiaRate > 0
                ? amount / cambiaRate
                : 0
            : amount * cambiaRate;
        const bankReceive = isVenta
            ? bankRate > 0
                ? amount / bankRate
                : 0
            : amount * bankRate;

        // El ahorro total siempre se expresa en la moneda que recibes (o convertido a soles para impacto)
        const totalSavings = isVenta
            ? (currentReceive - bankReceive) * cambiaRate
            : currentReceive - bankReceive;

        return {
            cambiaRate,
            bankRate,
            bankName,
            totalSavings,
            receive: currentReceive,
            banks,
            logoMapping,
        };
    };

    const {
        cambiaRate: currentCambiaRate,
        bankRate: currentBankRate,
        bankName: currentBankName,
        totalSavings,
        receive: currentReceive,
        banks: calculatedBanks,
    } = getSavingsInfo();

    // Helper para calcular la posición porcentual del thumb basado en hitos no lineales
    const getSliderPercentage = (val) => {
        const min = milestones[0].value;
        const max = milestones[milestones.length - 1].value;
        if (val <= min) return 0;
        if (val >= max) return 100;

        for (let i = 0; i < milestones.length - 1; i++) {
            const current = milestones[i].value;
            const next = milestones[i + 1].value;
            if (val >= current && val <= next) {
                const segmentWidth = 100 / (milestones.length - 1);
                const progressInSegment = (val - current) / (next - current);
                return i * segmentWidth + progressInSegment * segmentWidth;
            }
        }
        return 0;
    };

    // Helper para convertir porcentaje visual de vuelta a monto real (Inversa de getSliderPercentage)
    const getAmountFromPercentage = (pct) => {
        const segments = milestones.length - 1;
        const segmentWidth = 100 / segments;
        const segmentIndex = Math.min(
            segments - 1,
            Math.floor(pct / segmentWidth),
        );
        const relPct = (pct - segmentIndex * segmentWidth) / segmentWidth;

        const start = milestones[segmentIndex].value;
        const end = milestones[segmentIndex + 1].value;
        return Math.round(start + (end - start) * relPct);
    };

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);

        // Cargar tipos de cambio reales de Cambia FX
        const initRates = async () => {
            try {
                const rates = await CambiaFXService.getExchangeRates();
                if (rates && rates.length > 0) {
                    setCambiaRates({
                        compra: rates[0].tc_compra,
                        venta: rates[0].tc_venta,
                    });
                }
            } catch (error) {
                console.error("Error initializing exchange rates:", error);
            }
        };

        // Cargar datos de competencia en tiempo real
        const fetchCompetition = async () => {
            try {
                const rates = await CambiaFXService.getCompetitionRates(
                    landing.url,
                );
                if (rates && rates.length > 0) {
                    setComparisonData(rates);
                } else {
                    setComparisonData([]);
                }
            } catch (error) {
                console.error("Error fetching competition rates:", error);
                setComparisonData([]);
            }
        };

        initRates();
        fetchCompetition();

        return () => clearTimeout(timer);
    }, [landing]);

    return (
        <div className="min-h-screen bg-latte overflow-x-hidden font-title">
            <Header showSlogan={true} />
            <CintilloSection />

            {/* PREMIUM HERO SECTION - FOLLOWING SolesADolares PATTERN */}
            <motion.section
                className="relative min-h-[800px] bg-primary flex flex-col lg:flex-row "
                initial="hidden"
                animate={sectionsReady ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="absolute w-full h-full inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                >
                    <svg
                        className="w-full h-full object-cover"
                        width="1032"
                        height="696"
                        viewBox="0 0 1032 696"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M962.486 762.894C901.955 871.616 810.878 955.559 705.847 999.2C482.713 1086.8 265.287 1039.12 123.123 872.135C-16.4963 708.189 -39.4199 470.768 66.0483 281.333C103.611 213.865 155.93 153.528 221.813 101.827L223.621 100.484C265.297 70.3687 442.611 -32.9777 547.184 11.146C585.342 27.3298 609.663 60.7518 615.961 105.286L616.35 108.394C618.309 132.8 612.99 156.95 601.083 178.335C581.495 213.518 546.221 236.895 506.839 240.995C413.347 248.045 326.008 306.236 277.537 393.296C253.955 435.653 240.812 482.739 239.779 529.336L239.628 532.144C233.044 616.317 271.902 694.704 346.244 747.119C426.944 803.977 529.509 815.534 614.122 777.153C671.303 753.141 722.176 705.554 755.207 646.226C798.762 567.996 804.421 482.946 770.356 418.796C750.69 382.724 751.112 338.497 771.775 301.383C782.76 281.653 798.908 265.34 818.394 254.139C849.498 236.031 885.012 232.849 917.871 245.541C953.658 259.32 982.403 290.506 995.451 329.581C1053.88 458.806 1041.55 620.57 962.428 762.681L962.486 762.894Z"
                            fill="url(#paint0_linear_92_2288)"
                            fillOpacity="0.6"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_92_2288"
                                x1="55.0487"
                                y1="301.09"
                                x2="945.994"
                                y2="792.447"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0.483986" stopColor="#FFFDF9" />
                                <stop
                                    offset="1"
                                    stopColor="#C7B7FF"
                                    stopOpacity="0.2"
                                />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                {/* Lado Izquierdo: Info, Stats & Tags */}
                <div className="w-full lg:w-7/12  px-[6%] py-16 relative flex flex-col justify-start">
                    <motion.span
                        variants={itemVariants}
                        className="text-sm font-medium tracking-widest text-constrast mb-2 uppercase"
                    >
                        {landing.hero_eyebrow ||
                            "Cambia ahora - Sin comisiones"}
                    </motion.span>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-8xl font-medium text-neutral-dark leading-[0.95] mb-10"
                    >
                        <TextWithHighlight
                            text={
                                landing.hero_title ||
                                "¿Por qué usar una *casa de cambio digital* y no el banco?"
                            }
                            color="bg-constrast"
                        />
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-neutral-light/70 max-w-2xl mb-16 leading-relaxed"
                    >
                        {landing.hero_subtitle ||
                            "Obtén mejores tasas, seguridad garantizada por la SBS y opera en minutos sin salir de casa o tu oficina."}
                    </motion.p>

                    {/* Tipos de Empresa / Pills (Dynamic) */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-3 mb-4"
                    >
                        {(
                            landing.company_types || [
                                "Importadoras",
                                "Exportadoras",
                                "Agencias de viaje",
                                "Startups",
                                "Comercio exterior",
                            ]
                        ).map((tag, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-neutral-light/10 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-dark/60"
                            >
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* CTA INTEGRADO (Side Panel) */}
                    <motion.div variants={itemVariants} className="my-8">
                        <motion.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://mi.cambiafx.pe/register"
                            className="group relative inline-flex items-center justify-center gap-4 bg-secondary text-neutral-dark font-black px-12 py-6 rounded-full shadow-[0_20px_40px_-10px_rgba(180,255,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(180,255,0,0.5)] transition-all duration-500 overflow-hidden"
                        >
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            <span className="relative uppercase text-sm tracking-[0.2em]">
                                Cambiar ahora
                            </span>
                            <ArrowRight
                                className="relative group-hover:translate-x-1.5 transition-transform duration-300"
                                size={22}
                            />
                        </motion.a>
                    </motion.div>
                    {/* SELLO DE CONFIANZA SBS */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-4 flex items-center gap-6"
                    >
                        <div className="flex gap-4 items-center justify-center">
                            <span className="text-xs font-black text-accent mb-2">
                                Registrados en:
                            </span>
                            <img
                                src="/assets/cambiafx/sbs_logo.webp"
                                alt="SBS Logo"
                                className="h-12 object-contain"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Lado Derecho: Calculadora de Ahorro Premium */}
                <div className="w-full lg:w-5/12 px-[4%] py-16 flex flex-col items-center justify-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={sectionsReady ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full max-w-[480px] relative z-10"
                    >
                        {/* THE PREMIUM CALCULATOR CARD */}
                        <div className="bg-neutral-dark text-white rounded-[32px] p-8 md:p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden group">
                            {/* Ambient Light Effects */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-constrast/20 blur-[100px] rounded-full transition-all duration-1000"></div>

                            {/* Operation Toggle Switch (Moved up and refined) */}
                            <div className="flex bg-white/5 p-1 rounded-3xl border border-white/10 mb-10 relative z-10">
                                <button
                                    onClick={() => setOperationType("compra")}
                                    className={`flex-1 flex flex-col items-center py-4 px-6 rounded-[22px] transition-all duration-500 ${operationType === "compra" ? "bg-white text-neutral-dark shadow-2xl scale-[1.02] z-20" : "text-white/40 hover:text-white/60"}`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Dólar a Soles
                                    </span>
                                </button>
                                <button
                                    onClick={() => setOperationType("venta")}
                                    className={`flex-1 flex flex-col items-center py-4 px-6 rounded-[22px] transition-all duration-500 ${operationType === "venta" ? "bg-white text-neutral-dark shadow-2xl scale-[1.02] z-20" : "text-white/40 hover:text-white/60"}`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest ">
                                        Soles a Dólar
                                    </span>
                                </button>
                            </div>

                            {/* Input Section */}
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-md font-semibold text-white/40 tracking-widest uppercase">
                                            {operationType === "venta"
                                                ? "Monto en Soles"
                                                : "Monto en Dólares"}
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-4 focus-within:border-constrast/50 transition-all mb-0">
                                        <span className="text-xl font-bold text-white/30">
                                            {operationType === "venta"
                                                ? "S/"
                                                : "$"}
                                        </span>
                                        <input
                                            type="text"
                                            value={amount.toLocaleString()}
                                            onChange={(e) => {
                                                const val =
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    );
                                                setAmount(
                                                    val ? parseInt(val) : 0,
                                                );
                                            }}
                                            className="bg-transparent border-none outline-none text-3xl font-black text-white w-full tabular-nums"
                                        />
                                    </div>

                                    {/* MINIMALIST CLEAN SLIDER */}
                                    <div className="relative pt-10 pb-12 group/slider">
                                        {/* Main Track (Base) */}
                                        <div className="absolute top-[42px] left-0 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                                            {/* Active Track with Faded White Gradient */}
                                            <motion.div
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/30 to-white/60"
                                                style={{
                                                    width: `${getSliderPercentage(amount)}%`,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}
                                            />
                                        </div>

                                        {/* Milestone Markers & Labels */}
                                        <div className="absolute top-[43px] left-0 w-full flex justify-between px-2 pointer-events-none -translate-y-1/2 z-10">
                                            {milestones.map((m, i) => {
                                                const isReached =
                                                    amount >= m.value;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex flex-col items-center relative"
                                                    >
                                                        {/* Minimalist Dot */}
                                                        <div
                                                            className={`w-1 h-1 rounded-full transition-colors duration-500 ${isReached ? "bg-white" : "bg-white/10"}`}
                                                        />

                                                        {/* Larger Milestone Labels */}
                                                        <span
                                                            className={`absolute top-6 text-md font-bold uppercase tracking-widest transition-colors duration-500 ${isReached ? "text-white" : "text-white/20"}`}
                                                        >
                                                            {m.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Small Minimalist Thumb */}
                                        <motion.div
                                            className="absolute top-[42px] -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] z-20 pointer-events-none"
                                            style={{
                                                left: `calc(${getSliderPercentage(amount)}% - 10px)`,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 40,
                                            }}
                                        />

                                        {/* Invisible Range Controller */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={getSliderPercentage(amount)}
                                            onChange={(e) =>
                                                setAmount(
                                                    getAmountFromPercentage(
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    ),
                                                )
                                            }
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-30"
                                        />
                                    </div>
                                </div>

                                {/* Comparison Table Section (ComparisonTable.jsx Style) */}
                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    {/* Header */}
                                    <div className="grid grid-cols-12 items-center mb-2 px-5">
                                        <div className="col-span-6">
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                Entidad
                                            </span>
                                        </div>
                                        <div className="col-span-6 text-right">
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                {operationType === "venta"
                                                    ? "Recibes (USD)"
                                                    : "Recibes (Soles)"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Comparison List with Custom Scrollbar & Overflow Fix */}
                                    <div className="relative -mx-2 px-2">
                                        <style
                                            dangerouslySetInnerHTML={{
                                                __html: `
                                            .custom-scrollbar::-webkit-scrollbar {
                                                width: 3px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-track {
                                                background: transparent;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                                background: rgba(255, 255, 255, 0.1);
                                                border-radius: 10px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                                background: rgba(255, 255, 255, 0.2);
                                            }
                                        `,
                                            }}
                                        />

                                        <div className="space-y-3 min-h-0 max-h-[380px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 py-4">
                                            {/* Row Master: Cambia FX (Always first and highlighted) */}
                                            <motion.div className="grid grid-cols-12 items-center px-5 py-4 rounded-[28px] transition-all duration-500 bg-white border-2 border-constrast  scale-[1.02] z-10 relative mb-4 mx-1">
                                                <div className="col-span-6 flex items-center gap-4">
                                                    <div className="w-24 h-8 flex items-center justify-center overflow-hidden ">
                                                        <img
                                                            src={
                                                                logoMapping[
                                                                    "cambia fx"
                                                                ]
                                                            }
                                                            alt="Cambia FX"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-6 text-right text-xl font-black text-neutral-dark tabular-nums">
                                                    {operationType === "venta"
                                                        ? "$ "
                                                        : "S/ "}
                                                    {currentReceive.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        },
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Competitors Rows */}
                                            <div className="space-y-2 mx-1">
                                                {(calculatedBanks || []).map(
                                                    (bank, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            className="grid grid-cols-12 items-center px-5 py-4 rounded-[28px] transition-all duration-500 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 group"
                                                        >
                                                            <div className="col-span-6 flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden  border-white/10">
                                                                    {bank.logo ? (
                                                                        <img
                                                                            src={
                                                                                bank.logo
                                                                            }
                                                                            alt={
                                                                                bank.entity
                                                                            }
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-[10px] font-black text-white/40">
                                                                            {bank.entity
                                                                                .substring(
                                                                                    0,
                                                                                    2,
                                                                                )
                                                                                .toUpperCase()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-bold text-white group-hover:text-constrast transition-colors">
                                                                        {
                                                                            bank.entity
                                                                        }
                                                                    </span>
                                                                    <span className="text-[9px] text-white/30 uppercase tracking-widest font-medium">
                                                                        Tasa:{" "}
                                                                        {operationType ===
                                                                        "venta"
                                                                            ? bank.sell
                                                                            : bank.buy}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-6 text-right text-sm font-bold text-white/40 tabular-nums">
                                                                {operationType ===
                                                                "venta"
                                                                    ? "$ "
                                                                    : "S/ "}
                                                                {bank.receive.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    },
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* THE SAVINGS HERO BLOCK (Refined Premium UX) */}
                                <motion.div
                                    className="bg-white/5 hidden border border-white/10 p-6 rounded-[32px] relative overflow-hidden backdrop-blur-xl group/savings mt-8"
                                    whileHover={{
                                        y: -5,
                                        backgroundColor:
                                            "rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {/* Ambient Flare */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-constrast/10 blur-3xl group-hover/savings:bg-constrast/20 transition-all duration-700" />

                                    <div className="relative  z-10 flex items-center justify-between gap-6">
                                        {/* Left Side: Brand Message */}
                                        <div className="flex-1">
                                            <span className="text-[10px] font-black text-constrast uppercase tracking-[0.2em] mb-1.5 block">
                                                ¡Cambia al mejor precio!
                                            </span>
                                            <h4 className="text-white text-xl md:text-2xl font-black leading-tight tracking-tighter">
                                                {operationType === "venta"
                                                    ? "Ahorra"
                                                    : "Gana"}{" "}
                                                más con{" "}
                                                <span className="text-constrast block">
                                                    Cambia FX
                                                </span>
                                            </h4>
                                        </div>

                                        {/* Subtle Vertical Divider */}
                                        <div className="w-[1px] h-12 bg-white/10" />

                                        {/* Right Side: Savings Impact */}
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">
                                                {operationType === "venta"
                                                    ? "Ahorras aprox."
                                                    : "Ganas aprox."}
                                            </span>
                                            <div className="text-white text-3xl md:text-4xl font-black tabular-nums tracking-tighter">
                                                <span className="text-constrast text-xl mr-1">
                                                    S/
                                                </span>
                                                {totalSavings.toLocaleString(
                                                    undefined,
                                                    {
                                                        maximumFractionDigits: 0,
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* WHY NOT THE BANK SECTION (Using neutral-dark bg like comparison in SolesADolares) */}
            <section className="bg-neutral-dark py-24 px-[5%] relative overflow-hidden">
                <motion.div
                    className="absolute h-full w-auto top-0 right-0 opacity-50 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <svg
                        className="z-0 h-full opacity-20"
                        width="1080"
                        height="1080"
                        viewBox="0 0 726 406"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M106.632 475.609C46.3026 412.336 8.96465 333.732 1.57527 254.167C-10.6896 86.2005 66.6131 -49.7434 208.283 -110.322C347.381 -169.827 511.454 -135.723 616.571 -25.4768C654.009 13.7878 683.587 61.4665 704.543 116.446L705.068 117.939C716.587 152.177 748.969 292.684 697.569 353.65C678.758 375.879 651.264 385.231 620.072 380.174L617.905 379.787C601.122 376.014 586.028 367.412 574.161 354.967C554.638 334.491 546.306 305.952 551.763 278.674C566.519 214.478 545.681 143.75 497.371 93.0833C473.867 68.4325 445.015 49.8011 413.966 39.3954L412.114 38.7093C357.011 16.7474 296.319 26.4814 245.657 65.4353C190.689 107.729 161.557 174.136 169.673 238.906C173.866 282.275 195.191 326.327 228.111 360.854C271.521 406.381 327.405 427.905 377.546 418.42C405.847 412.744 435.433 422.245 456.027 443.844C466.975 455.326 474.554 469.561 478.009 484.97C483.675 509.613 478.407 534.103 463.043 553.505C446.339 574.643 419.424 587.43 390.488 588.04C291.608 600.308 185.644 558.319 106.787 475.614L106.632 475.609Z"
                            fill="url(#paint0_linear_16_2457)"
                            fillOpacity="0.6"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_16_2457"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-7xl font-medium text-white mb-8"
                        >
                            <TextWithHighlight
                                text={
                                    landing.comparison_title ||
                                    "¿Por qué dejar de cambiar en el *banco*?"
                                }
                                color="bg-constrast"
                            />
                        </motion.h2>
                        <p className="text-white/60 text-xl mb-12 leading-relaxed max-w-xl">
                            {landing.comparison_subtitle ||
                                "Tradicionalmente los bancos ofrecen las tasas más bajas para el usuario. Es hora de democratizar el cambio de divisas con tecnología peruana."}
                        </p>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://mi.cambiafx.pe/register"
                            className="inline-flex items-center bg-secondary gap-3 text-neutral-dark px-10 py-5 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-xl uppercase tracking-wider"
                        >
                            Comenzar ahora
                            <ArrowRight size={20} />
                        </motion.a>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {(
                                landing.benefit_cards || [
                                    {
                                        icon: "TrendingUp",
                                        title: "Mejor precio",
                                        desc: "Garantizamos tasas competitivas con actualización en tiempo real del mercado.",
                                    },
                                    {
                                        icon: "Clock",
                                        title: "Sin filas",
                                        desc: "Olvídate de las agencias. Opera desde tu celular o laptop en menos de 15 minutos.",
                                    },
                                    {
                                        icon: "CirclePercent",
                                        title: "Sin comisiones",
                                        desc: "Transferencias directas y transparentes. Lo que ves es exactamente lo que recibes.",
                                    },
                                    {
                                        icon: "ShieldCheck",
                                        title: "Seguro y legal",
                                        desc: "Empresa registrada en la SBS con Resolución N° 02998-2020 para tu tranquilidad.",
                                    },
                                ]
                            ).map((card, i) => {
                                const IconComponent =
                                    {
                                        TrendingUp,
                                        Clock,
                                        CirclePercent,
                                        ShieldCheck,
                                        Zap,
                                        Users,
                                        Heart,
                                        Star,
                                        Wallet,
                                        Globe,
                                        Smartphone,
                                        MousePointer2,
                                        Lock,
                                        Sparkles,
                                    }[card.icon] || Sparkles;

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.1,
                                            duration: 0.5,
                                        }}
                                        className={`bg-white p-8 rounded-[32px] flex flex-col justify-between min-h-[220px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all duration-300 group`}
                                    >
                                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center group-hover:bg-neutral-dark/10 transition-colors">
                                            <IconComponent
                                                className="text-neutral-dark"
                                                size={28}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-neutral-dark font-black text-2xl tracking-tighter mb-2">
                                                {card.title}
                                            </h4>
                                            <p className="text-neutral-dark/60 text-sm font-medium leading-relaxed">
                                                {card.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN FUNCIONAMIENTO */}
            <Suspense fallback={null}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <StepsSection
                        data={{
                            title: landing.steps_title || "Cambia en 3 pasos",
                            description:
                                landing.steps_subtitle ||
                                "Es más fácil que el banco y 100% seguro.",
                        }}
                        pasos={
                            landing.steps && landing.steps.length > 0
                                ? landing.steps
                                : pasos
                        }
                    />
                </motion.div>
            </Suspense>

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
            <FAQSection
                faqs={
                    landing.schema_faq && landing.schema_faq.length > 0
                        ? landing.schema_faq
                        : faqs
                }
            />

            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <CasaDeCambioDigital {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
