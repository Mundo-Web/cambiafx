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
    TrendingUp,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Clock,
    Landmark,
    XCircle,
    Info,
} from "lucide-react";

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

const CompraVentaDolares = ({
    landing = {},
    apps = [],
    indicators = [],
    pasos = [],
    faqs = [],
    socials = [],
    marketRates = [],
    liveRates = {},
    financialServiceData = {},
    globalKeywords = "",
}) => {
    const { t } = useTranslation();
    const [sectionsReady, setSectionsReady] = useState(false);

    // Tasas base
    const [compraRate, setCompraRate] = useState(3.715);
    const [ventaRate, setVentaRate] = useState(3.725);

    // Estados para calculadora interactiva (Dos columnas)
    // CALCULADORA 1: COMPRA DOLARES (Usuario tiene Soles, quiere Dólares) -> Operación de VENTA para CambiaFX
    const [buyAmount, setBuyAmount] = useState("1,000"); // Envías (Soles)
    const [buyResult, setBuyResult] = useState(""); // Recibes (Dólares)
    const [buyOrigin, setBuyOrigin] = useState("O"); // 'O' = PEN input, 'D' = USD input

    // CALCULADORA 2: VENTA DOLARES (Usuario tiene Dólares, quiere Soles) -> Operación de COMPRA para CambiaFX
    const [sellAmount, setSellAmount] = useState("1,000"); // Envías (Dólares)
    const [sellResult, setSellResult] = useState(""); // Recibes (Soles)
    const [sellOrigin, setSellOrigin] = useState("O"); // 'O' = USD input, 'D' = PEN input

    const [comparisonData, setComparisonData] = useState([
        ...(marketRates || []),
        ...(landing.comparison_data || []),
    ]);

    // FUNCIONES DE FORMATEO
    const formatNumberWithCommas = (num) => {
        if (num === null || num === undefined || isNaN(num)) return "";
        return parseFloat(num).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    const parseNumberFromFormatted = (str) => {
        if (!str) return 0;
        return parseFloat(str.toString().replace(/,/g, "")) || 0;
    };

    const formatInputValue = (value) => {
        // Remover caracteres no numéricos excepto punto y coma
        let cleanValue = value.replace(/[^0-9.,]/g, "");

        // Si tiene punto, mantenerlo para decimales
        if (cleanValue.includes(".")) {
            const parts = cleanValue.split(".");
            const integerPart = parts[0].replace(/,/g, "");
            const decimalPart = parts[1] ? parts[1].substring(0, 2) : ""; // Máximo 2 decimales

            // Formatear la parte entera con comas
            const formattedInteger = formatNumberWithCommas(integerPart);

            // Preservar el punto decimal incluso si no hay decimales aún
            if (cleanValue.endsWith(".") && decimalPart === "") {
                return `${formattedInteger}.`;
            }

            return decimalPart
                ? `${formattedInteger}.${decimalPart}`
                : formattedInteger;
        } else {
            // Solo números enteros, formatear con comas
            const numericValue = cleanValue.replace(/,/g, "");
            return formatNumberWithCommas(numericValue);
        }
    };

    // 🔁 CÁLCULOS DE COMPRA (Tengo Soles, Quiero Dólares)
    const handleBuyChange = (value, origin) => {
        const formattedValue = formatInputValue(value);
        const amount = parseNumberFromFormatted(formattedValue);

        if (origin === "O") {
            setBuyAmount(formattedValue);
            setBuyOrigin("O");
            if (CambiaFXService.tcBase.length > 0) {
                const res = CambiaFXService.calculateExchange(
                    amount,
                    "V",
                    "from",
                );
                setBuyResult(formatInputValue(res.result.toString()));
            }
        } else {
            setBuyResult(formattedValue);
            setBuyOrigin("D");
            if (CambiaFXService.tcBase.length > 0) {
                const res = CambiaFXService.calculateExchange(
                    amount,
                    "V",
                    "to",
                );
                setBuyAmount(formatInputValue(res.result.toString()));
            }
        }
    };

    const handleSellChange = (value, origin) => {
        const formattedValue = formatInputValue(value);
        const amount = parseNumberFromFormatted(formattedValue);

        if (origin === "O") {
            setSellAmount(formattedValue);
            setSellOrigin("O");
            if (CambiaFXService.tcBase.length > 0) {
                const res = CambiaFXService.calculateExchange(
                    amount,
                    "C",
                    "from",
                );
                setSellResult(formatInputValue(res.result.toString()));
            }
        } else {
            setSellResult(formattedValue);
            setSellOrigin("D");
            if (CambiaFXService.tcBase.length > 0) {
                const res = CambiaFXService.calculateExchange(
                    amount,
                    "C",
                    "to",
                );
                setSellAmount(formatInputValue(res.result.toString()));
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
        },
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);

        // Cargar tipos de cambio reales dinámicamente
        const initRates = async () => {
            try {
                const rates = await CambiaFXService.getExchangeRates();
                if (rates && rates.length > 0) {
                    const base = CambiaFXService.tcBaseOriginal || {
                        tc_compra: rates[0].tc_compra,
                        tc_venta: rates[0].tc_venta,
                    };
                    setCompraRate(base.tc_compra);
                    setVentaRate(base.tc_venta);
                }
            } catch (err) {
                console.error("Error loading rates:", err);
            }
        };


        const fetchCompetition = async () => {
            try {
                const rates = await CambiaFXService.getCompetitionRates(
                    landing.url,
                );
                if (rates && rates.length > 0) {
                    setComparisonData(rates);
                }
            } catch (error) {
                console.error("Error fetching competition rates:", error);
            }
        };

        initRates();
        fetchCompetition();
        return () => clearTimeout(timer);
    }, [landing, financialServiceData, globalKeywords]);

    // Efecto inicial para calcular con valores por defecto
    useEffect(() => {
        if (sectionsReady && CambiaFXService.tcBase.length > 0) {
            handleBuyChange(buyAmount, "O");
            handleSellChange(sellAmount, "O");
        }
    }, [sectionsReady, compraRate, ventaRate]);

    // LÓGICA DE AHORRO DINÁMICO (Por cada $1,000)
    const getSavingForBankValue = (bankRate) => {
        const cambiaVenta = ventaRate;
        const bankVenta = parseFloat(bankRate);
        const diff = bankVenta - cambiaVenta;
        return Math.round(diff * 1000);
    };

    const banksForPills = (comparisonData || [])
        .filter(
            (r) =>
                r.entity &&
                !r.entity.toLowerCase().includes("cambia") &&
                r.category !== "Nosotros" &&
                r.category !== "Oficial",
        )
        .slice(0, 3);

    const displayBanks =
        banksForPills.length > 0
            ? banksForPills
            : [
                  { entity: "BCP", sell: ventaRate + 0.13 },
                  { entity: "BBVA", sell: ventaRate + 0.1 },
                  { entity: "Interbank", sell: ventaRate + 0.11 },
              ];


    return (
        <div className="min-h-screen bg-neutral-dark overflow-x-hidden font-title text-white">
            {/* 1. NAV — Fondo negro (#0C0C0C) */}
            <Header showSlogan={false} transparent={false} />
            <CintilloSection />

            {/* 2. HERO NEGRO CENTRADO */}
            <motion.section
                className="relative py-20 px-[5%] text-center overflow-hidden bg-[#0C0C0C]"
                initial="hidden"
                animate={sectionsReady ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="absolute h-full w-auto   top-0 left-0 opacity-50 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <svg
                        className="z-0 h-full opacity-20 scale-x-[-1]"
                        width="1080"
                        height="1080"
                        viewBox="0 0 600 406"
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
                    {/* Bottom Fade Gradient to blend with next section */}
                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-neutral-dark to-transparent pointer-events-none z-20" />
                </motion.div>
                <div className="max-w-4xl mx-auto  z-10">
                    <motion.span
                        variants={itemVariants}
                        className="text-secondary font-medium text-sm   mb-6 block"
                    >
                        {landing.hero_eyebrow ||
                            "Compra · Venta · Dolares · Soles · SBS"}
                    </motion.span>
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-[80px] font-medium leading-[1] mb-8 text-white"
                    >
                        <TextWithHighlight
                            text={
                                landing.hero_title ||
                                "Compra y venta de *dolares* en Peru."
                            }
                            color="bg-secondary"
                        />
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        {landing.hero_subtitle ||
                            "Obten el mejor tipo de cambio online. Sin comisiones y 100% seguro."}
                    </motion.p>

                    {/* Chips de TC en pill horizontal — Estilo Minimalista y Elegante */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-12 bg-white/5 border border-white/10 px-12 py-5 rounded-full mb-16"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-secondary  mb-1">
                                Compramos
                            </span>
                            <span className="text-white text-3xl font-bold tabular-nums leading-none">
                                S/ {compraRate.toFixed(3)}
                            </span>
                        </div>

                        <div className="w-px h-10 bg-white/10"></div>

                        <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-constrast   mb-1">
                                Vendemos
                            </span>
                            <span className="text-white text-3xl font-bold tabular-nums leading-none">
                                S/ {ventaRate.toFixed(3)}
                            </span>
                        </div>
                    </motion.div>
                </div>

                <section className="py-0 px-[5%]  z-10 bg-transparent ">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* CARD IZQUIERDA: COMPRA */}
                        <motion.div
                            className="bg-[#111] p-10 md:p-14 rounded-[40px] flex flex-col justify-between group relative border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-secondary/20 transition-all duration-700"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative z-10">
                                <div className="mb-10">
                                    <span className="text-secondary text-base font-medium  mb-3 block">
                                        Operación de Compra
                                    </span>
                                    <h3 className="text-white text-4xl font-semibold tracking-tight">
                                        Quiero comprar dólares
                                    </h3>
                                    <p className="text-white text-lg mt-2">
                                        Tengo soles, quiero dólares
                                    </p>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <div>
                                        <label className="text-sm font-normal text-white mb-3 block ml-1">
                                            Envías soles
                                        </label>
                                        <div className="bg-[#080808] border border-white/5 rounded-full px-7 py-4 flex justify-between items-center focus-within:border-secondary/30 transition-all shadow-inner">
                                            <input
                                                type="text"
                                                value={buyAmount}
                                                onFocus={() =>
                                                    setBuyOrigin("O")
                                                }
                                                onChange={(e) =>
                                                    handleBuyChange(
                                                        e.target.value,
                                                        "O",
                                                    )
                                                }
                                                className="bg-transparent border-none outline-none focus:outline-none text-3xl font-semibold text-white w-full tabular-nums"
                                                placeholder="0,00"
                                            />
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                                                <span className="text-white/40 font-medium text-sm">
                                                    PEN
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-normal text-white mb-3 block ml-1">
                                            Recibes dólares
                                        </label>
                                        <div className="bg-secondary/[0.03] border border-secondary/10 rounded-full px-7 py-4 flex justify-between items-center group-hover:bg-secondary/[0.06] transition-all">
                                            <input
                                                type="text"
                                                value={buyResult}
                                                onFocus={() =>
                                                    setBuyOrigin("D")
                                                }
                                                onChange={(e) =>
                                                    handleBuyChange(
                                                        e.target.value,
                                                        "D",
                                                    )
                                                }
                                                className="bg-transparent border-none outline-none focus:outline-none  text-3xl font-semibold text-secondary w-full tabular-nums"
                                            />
                                            <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
                                                <span className="text-secondary/60 font-medium text-sm">
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <motion.a
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                href="https://mi.cambiafx.pe/register"
                                className="w-full bg-secondary text-neutral-dark font-semibold px-10 py-5 rounded-full text-lg flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl hover:shadow-secondary/20 transition-all"
                            >
                                Comprar ahora <ArrowRight size={20} />
                            </motion.a>
                        </motion.div>

                        {/* CARD DERECHA: VENTA */}
                        <motion.div
                            className="bg-[#181818] p-10 md:p-14 rounded-[40px] flex flex-col justify-between group relative border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-constrast/20 transition-all duration-700"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="relative z-10">
                                <div className="mb-10">
                                    <span className="text-constrast text-base font-medium mb-3 block">
                                        Operación de Venta
                                    </span>
                                    <h3 className="text-white text-4xl font-semibold tracking-tight">
                                        Quiero vender dólares
                                    </h3>
                                    <p className="text-white text-lg mt-2">
                                        Tengo dólares, quiero soles
                                    </p>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <div>
                                        <label className="text-sm font-normal text-white mb-3 block ml-1">
                                            Envías dólares
                                        </label>
                                        <div className="bg-[#080808] border border-white/5 rounded-full px-7 py-4 flex justify-between items-center focus-within:border-secondary/30 transition-all shadow-inner">
                                            <input
                                                type="text"
                                                value={sellAmount}
                                                onFocus={() =>
                                                    setSellOrigin("O")
                                                }
                                                onChange={(e) =>
                                                    handleSellChange(
                                                        e.target.value,
                                                        "O",
                                                    )
                                                }
                                                className="bg-transparent border-none outline-none text-3xl focus:outline-none  font-semibold text-white w-full tabular-nums"
                                                placeholder="0,00"
                                            />
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                                                <span className="text-white/40 font-medium text-sm">
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-normal text-white mb-3 block ml-1">
                                            Recibes soles
                                        </label>
                                        <div className="bg-constrast/[0.03] border border-constrast/10 rounded-full px-7 py-4 flex justify-between items-center group-hover:bg-constrast/[0.06] transition-all">
                                            <input
                                                type="text"
                                                value={sellResult}
                                                onFocus={() =>
                                                    setSellOrigin("D")
                                                }
                                                onChange={(e) =>
                                                    handleSellChange(
                                                        e.target.value,
                                                        "D",
                                                    )
                                                }
                                                className="bg-transparent border-none outline-none text-3xl focus:outline-none  font-semibold text-constrast w-full tabular-nums"
                                            />
                                            <div className="flex items-center gap-2 bg-constrast/10 px-4 py-2 rounded-full">
                                                <span className="text-constrast/60 font-medium text-sm">
                                                    PEN
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <motion.a
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                href="https://mi.cambiafx.pe/register"
                                className="w-full bg-constrast text-white font-semibold px-10 py-5 rounded-full text-lg flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl hover:shadow-constrast/20 transition-all"
                            >
                                Vender ahora <ArrowRight size={20} />
                            </motion.a>
                        </motion.div>
                    </div>
                </section>
            </motion.section>
            {/* 4. PILLS DE AHORRO — Estilo Premium y Dinámico */}
            <section className="py-24 bg-neutral-dark relative z-10">
                <motion.div
                    className="absolute h-full w-auto top-0 right-0 opacity-50 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    {/* Bottom Fade Gradient to blend with next section */}
                    <div className="absolute right-0 w-full h-64 bg-gradient-to-t from-transparent to-neutral-dark pointer-events-none z-20" />
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
                <div className=" mx-auto px-[5%]">
                    <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl md:text-7xl font-medium text-white mb-8 leading-[0.95]">
                                <TextWithHighlight
                                    text={
                                        landing.comparison_title ||
                                        "Por cada *US$1,000* · Cambia FX vs. bancos"
                                    }
                                    color="bg-secondary"
                                />
                            </h2>
                            <p className="text-white/40 text-xl max-w-xl leading-relaxed">
                                {landing.comparison_subtitle ||
                                    "Ahorra significativamente en cada operación gracias a nuestro tipo de cambio preferencial."}
                            </p>
                        </div>
                        <motion.a
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://mi.cambiafx.pe/register"
                            className="bg-secondary text-neutral-dark px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-secondary/20 transition-all"
                        >
                            {landing.comparison_cta || "Comenzar a ahorrar"}
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayBanks.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group relative"
                            >
                                {/* Subtle Ambient Glow */}
                                <div className="absolute inset-0 bg-secondary/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative bg-[#111] border border-white/10 p-10 md:p-12 rounded-[48px] hover:border-secondary/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between">
                                    {/* Glass Highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                                    {/* Styled Icon Background */}
                                    <div className="absolute top-4 right-4 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-105 transition-all duration-700">
                                        <TrendingUp
                                            size={120}
                                            className="text-secondary"
                                        />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-10">
                                            <span className="text-white text-base font-medium  ">
                                                Ahorro vs {item.entity}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-6 mb-2">
                                            <span className="text-secondary text-6xl font-semibold">
                                                +S/
                                            </span>
                                            <span className="text-white text-5xl md:text-8xl font-semibold tracking-tighter tabular-nums">
                                                {getSavingForBankValue(
                                                    item.sell,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-12 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-white/80 text-lg font-semibold uppercase tracking-widest">
                                                Ahorro Estimado
                                            </span>
                                            <span className="text-white/20 text-lg font-medium uppercase tracking-[0.2em] mt-1">
                                                Por cada US$1,000
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. PASOS — 4 columnas sobre fondo #111 */}
            {landing.steps && (
                <Suspense fallback={null}>
                    <div className="bg-[#111]">
                        <StepsSection
                            data={{
                                title:
                                    landing.steps_title || "Cambia en 4 pasos",
                                description:
                                    landing.steps_subtitle ||
                                    "Nuestro proceso es transparente y el mas rapido del mercado peruano.",
                            }}
                            pasos={landing.steps}
                        />
                    </div>
                </Suspense>
            )}

            {/* 6. STATS — Estilo Minimalista y Potente */}
            <section className="py-32 bg-[#0C0C0C] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-[5%]">
                    <div className="flex flex-wrap justify-center lg:justify-between items-start gap-x-12 gap-y-16">
                        {(
                            landing.stats || [
                                { value: "60k", label: "Clientes activos" },
                                { value: "6", label: "Años de experiencia" },
                                { value: "SBS", label: "Registrados ante SBS" },
                                { value: "0", label: "Comisiones ocultas" },
                            ]
                        ).map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="flex flex-col min-w-[200px]"
                            >
                                {/* Decorative line */}
                                <div className="w-8 h-[2px] bg-secondary mb-8" />

                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
                                            <TextWithHighlight
                                                text={stat.value}
                                                counter
                                            />
                                        </span>
                                    </div>
                                    <span className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[150px]">
                                        {stat.label}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FAQ — Acordeon sobre fondo negro */}
            <FAQSection faqs={landing.schema_faq || []} />

            {/* CTA SECTION PREMIUM (Inspirado en EmpresasSection) */}
            <section className="w-full overflow-hidden relative bg-white py-12 md:py-32 flex justify-center items-center px-[3%] md:px-[5%] mx-auto">
                <motion.div
                    className="relative w-full h-full px-4 md:px-16 rounded-[28px] md:rounded-[56px] bg-secondary flex flex-col md:flex-row items-center py-10 md:py-10 md:min-h-[400px]"
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
                                        stopColor="#D3FF8F"
                                    />
                                    <stop offset="1" stopColor="#E7FFC2" />
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
                                className="text-4xl md:text-5xl lg:text-7xl font-medium leading-tight text-neutral-dark mb-2"
                            >
                                <TextWithHighlight
                                    text={
                                        landing.cta_title ||
                                        "Empieza a ahorrar ahora"
                                    }
                                    color="bg-constrast font-bold"
                                />
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-neutral-dark text-lg md:text-2xl max-w-xl font-light"
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
                                className="hidden md:flex text-neutral-dark relative text-2xl text-end mb-2"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                            >
                                <span>Haz clic aquí</span>
                                <div className="absolute -right-10 top-3">
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
                                                stroke="#000000"
                                                strokeWidth="1.50408"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M25.18 65.8476L23.9083 73.0192L31.0918 71.9369"
                                                stroke="#000000"
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
                                className=" text-white bg-constrast font-black px-12 py-5 rounded-full text-lg uppercase tracking-widest shadow-xl whitespace-nowrap"
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

            {/* 9. FOOTER — Fondo negro */}
            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <CompraVentaDolares {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
