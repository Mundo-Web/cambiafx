import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarClockIcon,
    Facebook,
    Link,
    Linkedin,
    MessageCircle,
    Twitter,
} from "lucide-react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import HtmlContent from "./Utils/HtmlContent";
import HtmlContentWithInsert from "./Utils/HtmlContentWithInsert";
import General from "./Utils/General";

import Tippy from "@tippyjs/react";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import PostCard from "./Components/Blog/PostCard";
import TextWithHighlight from "./Utils/TextWithHighlight";

import { Check } from "lucide-react";
import moment from "moment";
import "moment/locale/es"; // Para fechas en español
import ExchangeCard from "./components/Tailwind/CambiaFX/ExchangeCard";
import PrimeraOperacionSection from "./components/Tailwind/CambiaFX/PrimeraOperacionSection";
import CintilloSection from "./components/Tailwind/CambiaFX/CintilloSection";
import WhatsAppButton from "./components/Shared/WhatsAppButton";

// Configurar moment en español
moment.locale("es");

// Animaciones reutilizables mejoradas
const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const staggerFast = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const Toast = ({ show, message }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 500 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-none z-50"
                >
                    <motion.div
                        className="bg-azul text-neutral-dark px-6 py-3 rounded-lg shadow-xl flex items-center gap-2"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ type: "spring" }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring" }}
                        >
                            <Check className="h-5 w-5" />
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {message}
                        </motion.span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const BannerArticle = ({ banner }) => {
    return (
        <motion.div
            className="bg-[#C6FF6B] px-8 py-10 h-full lg:px-16 rounded-2xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden lg:overflow-visible min-h-[180px]"
            style={{
                backgroundImage: "url(/assets/cambiafx/operation-overlay.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "multiply",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Texto y promo */}
            <motion.div
                className="flex-1 flex flex-col justify-center z-[999]"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <motion.h2
                    className=" text-3xl lg:text-[36px] max-w-md font-semibold leading-[1.1] text-text-neutral-light mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <TextWithHighlight
                        text={banner?.name}
                        color="bg-constrast"
                    />
                </motion.h2>
                <motion.p
                    className="text-base text-text-neutral-light font-paragraph"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    {banner?.description}
                </motion.p>
            </motion.div>

            {/* Teléfono */}
            <motion.div className="absolute -bottom-10 flex-1 left-1/3 translate-x-1/2 z-50">
                <motion.img
                    src={`/api/banners/media/${banner?.image}`}
                    alt="Teléfono móvil"
                    className="w-[200px] md:w-[200px] lg:w-[250px] h-full z-10 relative"
                    onError={(e) =>
                        (e.target.src = "/api/cover/thumbnail/null")
                    }
                />
            </motion.div>

            {/* Botón promo */}
            <motion.div
                className="lg:flex-1 z-[999] flex mt-4  lg:mt-0  lg:justify-end items-center md:py-12 w-full md:w-auto"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <WhatsAppButton buttonData={banner?.button_link}>
                    <motion.span
                        className="bg-constrast uppercase text-white px-6 py-4 rounded-full font-medium text-sm flex items-center gap-3 transition-all duration-300 shadow-lg"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            boxShadow: [
                                "0 4px 15px rgba(0,0,0,0.1)",
                                "0 6px 20px rgba(0,0,0,0.15)",
                                "0 4px 15px rgba(0,0,0,0.1)",
                            ],
                        }}
                        transition={{
                            boxShadow: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        {banner?.button_text || "¡Quiero cambiar!"}
                        <motion.svg
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <g clipPath="url(#clip0_141_6110)">
                                <path
                                    d="M0 24.5002C0.12869 24.0263 0.248084 23.5822 0.369923 23.1391C0.789268 21.6102 1.21302 20.0827 1.62355 18.5513C1.65487 18.4347 1.63432 18.2761 1.57805 18.1677C-0.391453 14.3705 -0.483445 10.5376 1.54037 6.76187C3.32344 3.43558 6.1419 1.33566 9.88077 0.709535C14.8752 -0.12692 18.9918 1.54257 21.8725 5.68873C26.7823 12.7547 22.7601 22.4403 14.246 24.0985C11.5635 24.6207 8.98826 24.2162 6.55195 22.9746C6.38607 22.8902 6.24221 22.8785 6.06557 22.9254C4.12787 23.4373 2.18822 23.9429 0.248573 24.4489C0.180068 24.467 0.110096 24.4777 0 24.5002ZM2.87327 21.678C4.04273 21.372 5.15593 21.0895 6.26276 20.7854C6.52014 20.7147 6.71587 20.7498 6.94438 20.884C9.13603 22.1714 11.4921 22.5984 13.9842 22.0962C21.021 20.6781 24.2955 12.5478 20.1246 6.71307C17.7309 3.36481 14.3575 2.00326 10.2923 2.67574C5.62323 3.44875 2.24645 7.44509 2.1207 12.1705C2.06638 14.2109 2.61882 16.0917 3.73006 17.8061C3.82988 17.9603 3.86071 18.095 3.80688 18.28C3.55978 19.1311 3.33029 19.9865 3.09591 20.8411C3.02349 21.1041 2.95547 21.3686 2.87327 21.678Z"
                                    fill="white"
                                />
                                <path
                                    d="M15.2814 18.494C14.3845 18.4799 13.6417 18.1671 12.8847 17.8825C10.3271 16.9216 8.51662 15.1121 7.07656 12.8672C6.6626 12.2221 6.25695 11.574 6.02844 10.8361C5.57191 9.36183 5.79406 8.03834 6.93857 6.93738C7.4 6.49378 7.95684 6.42106 8.55136 6.60797C8.83027 6.69581 9.01768 6.89053 9.12043 7.17065C9.40619 7.94903 9.71153 8.72058 9.97821 9.50482C10.0335 9.66684 10.0066 9.90206 9.92487 10.0543C9.79667 10.2934 9.59116 10.4911 9.41598 10.7044C9.34356 10.7922 9.26234 10.8732 9.19139 10.962C8.90367 11.3232 8.8978 11.4569 9.12631 11.8619C9.99093 13.3943 11.2147 14.5509 12.7854 15.3444C12.894 15.3995 13.0056 15.4503 13.1206 15.4913C13.3897 15.5869 13.627 15.5581 13.8247 15.3224C14.1178 14.9735 14.4285 14.6402 14.7212 14.2908C14.9751 13.9867 15.1067 13.9326 15.4806 14.118C16.1876 14.4694 16.8849 14.8412 17.5827 15.2107C18.2212 15.5484 18.2408 15.5957 18.1077 16.3009C17.8905 17.4521 16.9334 18.292 15.6484 18.4584C15.5031 18.4769 15.3568 18.4867 15.2814 18.494Z"
                                    fill="white"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_141_6110">
                                    <rect
                                        width="24"
                                        height="24"
                                        fill="white"
                                        transform="translate(0 0.5)"
                                    />
                                </clipPath>
                            </defs>
                        </motion.svg>
                    </motion.span>
                </WhatsAppButton>
            </motion.div>
        </motion.div>
    );
};
const BlogArticle = ({ article, posts, landing, banner, generals }) => {
    // Definición de animaciones que faltaban
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const staggerFast = {
        animate: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const staggerSlow = {
        animate: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(article.name);
    const shareText = encodeURIComponent(
        `${article.name} - ${article.description.substring(0, 100)}...`,
    );
    const [showToast, setShowToast] = useState(false);
    const [hoveredShare, setHoveredShare] = useState(null);
    const [sectionsReady, setSectionsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const socialShareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareText}`,
        whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
        email: `mailto:?subject=${shareTitle}&body=${shareText}%0A%0ALeer más: ${shareUrl}`,
        copy: shareUrl,
    };

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            })
            .catch((err) => {
                console.error("Error al copiar: ", err);
            });
    };

    const ArrowLeftIcon = ({ width = 24, height = 24, color = "#3E2F4D" }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
        >
            <mask
                id="mask0_202_13054"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={width}
                height={height}
            >
                <rect
                    x={width}
                    width={width}
                    height={height}
                    transform={`rotate(90 ${width} 0)`}
                    fill="#D9D9D9"
                />
            </mask>
            <g mask="url(#mask0_202_13054)">
                <path
                    d="M8.62539 12L14.6254 6L16.0254 7.4L11.4504 12L16.0254 16.6L14.6254 18L8.62539 12Z"
                    fill={color}
                />
            </g>
        </svg>
    );
    const handleOperationStart = (operationData) => {
        console.log("Operation data:", operationData);
        // Aquí puedes manejar los datos de la operación como necesites
        // Por defecto redirigirá a mi.cambiafx.pe/login
        window.location.href = "https://mi.cambiafx.pe/login";
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageTransition}
        >
            <Header />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: sectionsReady ? 1 : 0,
                    y: sectionsReady ? 0 : -20,
                }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <CintilloSection />
            </motion.div>

            <motion.section
                initial="hidden"
                whileInView="visible"
                variants={staggerContainer}
                viewport={{ once: true, margin: "-100px" }}
                className="px-[5%] bg-white pt-10 lg:pt-16 pb-8 font-title"
            >
                <div className="mx-auto ">
                    <motion.div
                        variants={fadeInUp}
                        className="mb-8 w-auto flex flex-col gap-4"
                    >
                        {/* Breadcrumbs */}
                        <motion.nav
                            className="flex flex-wrap items-center gap-2 text-sm md:text-base font-medium text-neutral-dark/60 mb-2"
                            variants={fadeInLeft}
                        >
                            <motion.a
                                href="/"
                                className="hover:text-accent transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                Inicio
                            </motion.a>
                            <span className="text-neutral-dark/30">/</span>
                            <motion.a
                                href="/blog"
                                className="hover:text-accent transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                Blog
                            </motion.a>
                            <span className="text-neutral-dark/30">/</span>
                            <motion.a
                                href={`/blog?category=${article.category.slug || article.category.id}#blog-list`}
                                className="hover:text-accent transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                {article.category.name}
                            </motion.a>
                            <span className="text-neutral-dark/30">
                                /
                            </span>
                            <span className="text-neutral-dark font-semibold truncate max-w-[120px] sm:max-w-[250px] inline-block align-bottom">
                                {article.name}
                            </span>
                        </motion.nav>

                        <motion.a
                            href="/blog"
                            className="flex hidden w-auto items-center gap-2 text-neutral-dark hover:text-accent transition-colors duration-200 mt-2"
                            variants={fadeInLeft}
                            whileHover={{ x: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ x: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ArrowLeftIcon />
                            </motion.div>
                            <span className=" text-base 2xl:text-lg font-medium">
                                Volver a blog
                            </span>
                        </motion.a>

                        <motion.div className="w-auto mb-2" variants={fadeInUp}>
                            <motion.span
                                className="inline-block rounded-lg text-sm text-neutral font-semibold px-4 py-2 bg-constrast border border-primary/20"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                {article.category.name}
                            </motion.span>
                        </motion.div>

                        <motion.h1
                            className="text-neutral-dark text-3xl sm:text-4xl lg:text-[48px] xl:text-[52px] !leading-tight mb-4"
                            variants={fadeInUp}
                        >
                            <TextWithHighlight text={article.name} />
                        </motion.h1>

                        <motion.div
                            className="flex items-center mt-2 text-base text-neutral-dark gap-3 font-medium"
                            variants={staggerFast}
                        >
                            <motion.div
                                className="flex items-center gap-2 text-accent"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                    }}
                                >
                                    <CalendarClockIcon className="h-5 w-5" />
                                </motion.div>
                                <span>
                                    {new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(article.post_date))}
                                </span>
                            </motion.div>

                            <motion.div
                                className="h-1 w-1 bg-neutral-dark rounded-full"
                                variants={fadeInUp}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            <motion.span
                                className="text-neutral-dark"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                Tiempo de lectura: ~
                                {Math.max(
                                    1,
                                    Math.ceil(
                                        article.description.split(" ").length /
                                            200,
                                    ),
                                )}{" "}
                                min
                            </motion.span>
                        </motion.div>

                        {article.tags && article.tags.length > 0 && (
                            <motion.div
                                className="flex flex-wrap gap-2 mt-4 hidden"
                                variants={fadeInUp}
                            >
                                {article.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        className="flex flex-col lg:flex-row gap-8 mb-12"
                        variants={staggerContainer}
                    >
                        <motion.div
                            variants={fadeInLeft}
                            className="lg:w-2/3 lg:flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl bg-white"
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        >
                            <motion.div
                                className="relative w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <motion.img
                                    src={`/api/posts/media/${article.image}`}
                                    alt={article.name}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                    initial={{ opacity: 0, scale: 1.2 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 1.2,
                                        ease: "easeOut",
                                    }}
                                    viewport={{ once: true }}
                                />

                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    viewport={{ once: true }}
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="lg:w-1/3 lg:flex-shrink-0"
                            variants={fadeInRight}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <ExchangeCard
                                    title="Comienza tu cambio ahora"
                                    initialOperationType="venta"
                                    showCoupons={true}
                                    showCredits={true}
                                    onOperationStart={handleOperationStart}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="blog-content max-w-none"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Bloque de autor — E-E-A-T */}
                        <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                                <img
                                    src="/assets/img/icon.png"
                                    alt="Cambia FX Logo"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-accent font-semibold uppercase tracking-wider">
                                    {article?.category?.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-neutral-dark">
                                        {article.author || 'Equipo Cambia FX'}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <time
                                        className="text-gray-500 text-sm"
                                        dateTime={article?.post_date}
                                    >
                                        Publicado el{" "}
                                        {new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(article?.post_date))}
                                    </time>
                                </div>
                            </div>
                        </div>

                        <HtmlContentWithInsert
                            className="blog-article-content text-neutral-dark leading-relaxed"
                            html={article?.description}
                            insertComponent={
                                banner ? (
                                    <BannerArticle banner={banner} />
                                ) : null
                            }
                        />

                        <style>{`
                            .blog-article-content,
                            .blog-article-content-part {
                                line-height: 1.8;
                                font-size: 1.125rem;
                            }
                            
                            .blog-article-content h1,
                            .blog-article-content-part h1 {
                                font-size: 2.5rem;
                                font-weight: 700;
                                color: #003049;
                                margin-top: 3rem;
                                margin-bottom: 1.5rem;
                                line-height: 1.2;
                            }
                            
                            .blog-article-content h2,
                            .blog-article-content-part h2 {
                                font-size: 2rem;
                                font-weight: 600;
                                color: #003049;
                                margin-top: 2.5rem;
                                margin-bottom: 1.25rem;
                                line-height: 1.3;
                            }
                            
                            .blog-article-content h3,
                            .blog-article-content-part h3 {
                                font-size: 1.75rem;
                                font-weight: 600;
                                color: #003049;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                line-height: 1.4;
                            }
                            
                            .blog-article-content h4,
                            .blog-article-content-part h4 {
                                font-size: 1.5rem;
                                font-weight: 500;
                                color: #003049;
                                margin-top: 1.75rem;
                                margin-bottom: 0.875rem;
                                line-height: 1.4;
                            }
                            
                            .blog-article-content h5,
                            .blog-article-content-part h5 {
                                font-size: 1.25rem;
                                font-weight: 500;
                                color: #003049;
                                margin-top: 1.5rem;
                                margin-bottom: 0.75rem;
                                line-height: 1.5;
                            }
                            
                            .blog-article-content h6,
                            .blog-article-content-part h6 {
                                font-size: 1.125rem;
                                font-weight: 500;
                                color: #003049;
                                margin-top: 1.25rem;
                                margin-bottom: 0.625rem;
                                line-height: 1.5;
                            }
                            
                            .blog-article-content p,
                            .blog-article-content-part p {
                                margin-bottom: 1.5rem;
                                color: #001520;
                                line-height: 1.8;
                                font-size: 1.125rem;
                            }
                            
                            .blog-article-content ul, 
                            .blog-article-content ol,
                            .blog-article-content-part ul, 
                            .blog-article-content-part ol {
                                margin-bottom: 1.5rem;
                                padding-left: 2rem;
                                color: #001520;
                            }
                            
                            .blog-article-content li,
                            .blog-article-content-part li {
                                margin-bottom: 0.75rem;
                                line-height: 1.7;
                            }
                            
                            .blog-article-content ul li,
                            .blog-article-content-part ul li {
                                list-style-type: disc !important;
                            }
                            
                            .blog-article-content ol li,
                            .blog-article-content-part ol li {
                                list-style-type: decimal !important;
                            }
                            
                            .blog-article-content blockquote,
                            .blog-article-content-part blockquote {
                                border-left: 4px solid #D62828;
                                background-color: #F2F2F2;
                                padding: 1.5rem 2rem;
                                margin: 2rem 0;
                                font-style: italic;
                                color: #003049;
                                border-radius: 0 8px 8px 0;
                            }
                            
                            .blog-article-content blockquote p,
                            .blog-article-content-part blockquote p {
                                margin-bottom: 0;
                                font-size: 1.25rem;
                                font-weight: 500;
                            }
                            
                            .blog-article-content a,
                            .blog-article-content-part a {
                                color: #D62828;
                                text-decoration: underline;
                                font-weight: 500;
                                transition: color 0.2s ease;
                            }
                            
                            .blog-article-content a:hover,
                            .blog-article-content-part a:hover {
                                color: #F77F00;
                                text-decoration: none;
                            }
                            
                            .blog-article-content img,
                            .blog-article-content-part img {
                             
                                height: auto !important;
                                margin-left: auto !important;
                                margin-right: auto !important;
                                margin-top: 2rem !important;
                                margin-bottom: 2rem !important;
                                border-radius: 18px !important;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
                                object-fit: cover !important;
                                position: relative !important;
                                display: block !important;
                                overflow: hidden !important;
                            }
                            
                            /* Para pantallas grandes, centrar la imagen cuando excede el contenedor */
                            @media (min-width: 1280px) {
                                .blog-article-content img,
                                .blog-article-content-part img {
                                   
                                   
                                    margin-left: calc(-40rem + 50%) !important;
                                    margin-right: calc(-40rem + 50%) !important;
                                }
                            }
                            
                            .blog-article-content strong, 
                            .blog-article-content b,
                            .blog-article-content-part strong, 
                            .blog-article-content-part b {
                                font-weight: 700;
                                color: #003049;
                            }
                            
                            .blog-article-content em, 
                            .blog-article-content i,
                            .blog-article-content-part em, 
                            .blog-article-content-part i {
                                font-style: italic;
                            }
                            
                            .blog-article-content code,
                            .blog-article-content-part code {
                                background-color: #F2F2F2;
                                color: #D62828;
                                padding: 0.25rem 0.5rem;
                                border-radius: 4px;
                                font-size: 0.875rem;
                                font-family: 'Courier New', monospace;
                            }
                            
                            .blog-article-content pre,
                            .blog-article-content-part pre {
                                background-color: #001520;
                                color: #F2F2F2;
                                padding: 1.5rem;
                                border-radius: 8px;
                                overflow-x: auto;
                                margin: 2rem 0;
                                line-height: 1.6;
                            }
                            
                            .blog-article-content pre code,
                            .blog-article-content-part pre code {
                                background-color: transparent;
                                color: inherit;
                                padding: 0;
                                border-radius: 0;
                                font-size: 0.875rem;
                            }
                            
                            .blog-article-content table,
                            .blog-article-content-part table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 2rem 0;
                                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                                border-radius: 8px;
                                overflow: hidden;
                            }
                            
                            .blog-article-content th,
                            .blog-article-content td,
                            .blog-article-content-part th,
                            .blog-article-content-part td {
                                padding: 1rem;
                                text-align: left;
                                border-bottom: 1px solid #F2F2F2;
                            }
                            
                            .blog-article-content th,
                            .blog-article-content-part th {
                                background-color: #003049;
                                color: white;
                                font-weight: 600;
                            }
                            
                            .blog-article-content tr:nth-child(even),
                            .blog-article-content-part tr:nth-child(even) {
                                background-color: #F2F2F2;
                            }
                            
                            .blog-article-content hr,
                            .blog-article-content-part hr {
                                border: none;
                                border-top: 2px solid #F2F2F2;
                                margin: 3rem 0;
                            }
                            
                            /* Estilos responsivos */
                            @media (max-width: 768px) {
                                .blog-article-content,
                                .blog-article-content-part {
                                    font-size: 1rem;
                                }
                                
                                .blog-article-content h1,
                                .blog-article-content-part h1 {
                                    font-size: 2rem;
                                }
                                
                                .blog-article-content h2,
                                .blog-article-content-part h2 {
                                    font-size: 1.75rem;
                                }
                                
                                .blog-article-content h3,
                                .blog-article-content-part h3 {
                                    font-size: 1.5rem;
                                }
                                
                                .blog-article-content h4,
                                .blog-article-content-part h4 {
                                    font-size: 1.25rem;
                                }
                                
                                .blog-article-content p,
                                .blog-article-content-part p {
                                    font-size: 1rem;
                                }
                                
                                .blog-article-content blockquote,
                                .blog-article-content-part blockquote {
                                    padding: 1rem 1.5rem;
                                    margin: 1.5rem 0;
                                }
                                
                                .blog-article-content blockquote p,
                                .blog-article-content-part blockquote p {
                                    font-size: 1.125rem;
                                }
                                
                                .blog-article-content ul, 
                                .blog-article-content ol,
                                .blog-article-content-part ul, 
                                .blog-article-content-part ol {
                                    padding-left: 1.5rem;
                                }
                                
                                .blog-article-content img,
                                .blog-article-content-part img {
                                    margin-top: 1.5rem;
                                    margin-bottom: 1.5rem;
                                }
                            }
                        `}</style>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="mt-16 pt-8 border-t-2 border-neutral-light"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div
                            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                            variants={staggerContainer}
                        >
                            <Toast
                                show={showToast}
                                message="Enlace copiado al portapapeles"
                            />

                            <motion.div
                                className="flex flex-col gap-4"
                                variants={fadeInLeft}
                            >
                                <motion.h3
                                    className="text-xl font-semibold text-neutral-dark"
                                    whileHover={{ x: 5, scale: 1.02 }}
                                >
                                    ¿Te gustó este artículo? ¡Compártelo!
                                </motion.h3>

                                <motion.div
                                    className="flex flex-wrap gap-3"
                                    variants={staggerFast}
                                >
                                    {[
                                        {
                                            type: "copy",
                                            label: "Copiar enlace",
                                            icon: Link,
                                            color: "bg-gray-100 hover:bg-gray-200 text-neutral-dark",
                                        },
                                        {
                                            type: "linkedin",
                                            label: "LinkedIn",
                                            icon: Linkedin,
                                            color: "bg-blue-600 hover:bg-blue-700 text-white",
                                        },
                                        {
                                            type: "twitter",
                                            label: "Twitter",
                                            icon: Twitter,
                                            color: "bg-blue-400 hover:bg-blue-500 text-white",
                                        },
                                        {
                                            type: "facebook",
                                            label: "Facebook",
                                            icon: Facebook,
                                            color: "bg-blue-800 hover:bg-blue-900 text-white",
                                        },
                                    ].map(
                                        (
                                            { type, label, icon: Icon, color },
                                            index,
                                        ) => (
                                            <motion.div
                                                key={type}
                                                variants={fadeInUp}
                                                whileHover={{
                                                    y: -5,
                                                    scale: 1.08,
                                                    boxShadow:
                                                        "0 10px 25px rgba(0,0,0,0.15)",
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                onHoverStart={() =>
                                                    setHoveredShare(type)
                                                }
                                                onHoverEnd={() =>
                                                    setHoveredShare(null)
                                                }
                                            >
                                                <Tippy content={label}>
                                                    <motion.a
                                                        href={
                                                            type !== "copy"
                                                                ? socialShareLinks[
                                                                      type
                                                                  ]
                                                                : undefined
                                                        }
                                                        onClick={
                                                            type === "copy"
                                                                ? copyToClipboard
                                                                : undefined
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`${color} px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg`}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        animate={{
                                                            rotate:
                                                                hoveredShare ===
                                                                type
                                                                    ? [
                                                                          0, -2,
                                                                          2, 0,
                                                                      ]
                                                                    : 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <motion.div
                                                            animate={{
                                                                scale:
                                                                    hoveredShare ===
                                                                    type
                                                                        ? [
                                                                              1,
                                                                              1.2,
                                                                              1,
                                                                          ]
                                                                        : 1,
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                            }}
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                        </motion.div>
                                                        <span className="hidden sm:inline">
                                                            {label}
                                                        </span>
                                                    </motion.a>
                                                </Tippy>
                                            </motion.div>
                                        ),
                                    )}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                variants={staggerContainer}
                viewport={{ once: true, margin: "-100px" }}
                className="mt-8 pt-6 bg-constrast text-sm font-title font-medium px-[5%] py-8 md:py-12 text-neutral-dark"
            >
                <motion.h2
                    className="text-white text-3xl sm:text-4xl lg:text-[44px] !leading-tight"
                    variants={fadeInUp}
                >
                    <TextWithHighlight
                        text={landing?.title || "Ver más *noticias*"}
                        color="bg-neutral font-semibold"
                    />
                </motion.h2>

                <motion.p
                    className="flex mt-3 text-center lg:text-left text-base 2xl:text-lg text-white"
                    variants={fadeInUp}
                >
                    {landing?.description ||
                        "Descubre más artículos interesantes y mantente al día con nuestras últimas noticias y actualizaciones."}
                </motion.p>

                <motion.section
                    className="py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8"
                    variants={staggerContainer}
                >
                    {posts.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                transition: { duration: 0.3 },
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.1,
                                    ease: "easeOut",
                                }}
                                viewport={{ once: true }}
                            >
                                <PostCard
                                    {...item}
                                    firstImage
                                    classTitle="text-white"
                                    classDescription="text-white"
                                    classBtn="bg-neutral-dark"
                                    classCategory="text-neutral-dark"
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.section>

                <motion.div
                    className="flex justify-center lg:justify-start mt-8"
                    variants={fadeInUp}
                >
                    <motion.a
                        href={`/blog?category=${article.category.slug || article.category.id}#blog-list`}
                        className="bg-white text-neutral-dark font-semibold px-8 py-4 rounded-full hover:bg-primary transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-black/5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>
                            Ver más artículos de {article.category.name}
                        </span>
                        <motion.i
                            className="fas fa-arrow-right text-xs"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                        />
                    </motion.a>
                </motion.div>
            </motion.section>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: sectionsReady ? 1 : 0,
                    y: sectionsReady ? 0 : 30,
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <Footer />
            </motion.div>
        </motion.div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <BlogArticle {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
