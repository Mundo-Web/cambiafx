import React, { useState, useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import Base from "../Components/Tailwind/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Header from "../components/Tailwind/Header";
import Footer from "../components/Tailwind/Footer";
import { CarritoProvider } from "../context/CarritoContext";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import TextWithHighlight from "../Utils/TextWithHighlight";

const StepsSection = lazy(
    () => import("../components/Tailwind/CambiaFX/StepsSection"),
);

const SorteoCambiaFx = ({ landing = {} }) => {
    const [sectionsReady, setSectionsReady] = useState(false);
    const [copyText, setCopyText] = useState("Copiar");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Get UTMs from URL
    const getUtms = () => {
        if (typeof window === "undefined") return {};
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get("utm_source") || "",
            utm_medium: params.get("utm_medium") || "",
            utm_campaign: params.get("utm_campaign") || "",
        };
    };

    const couponName = landing.coupon?.name || "SORTEOFX";
    const couponMin = landing.coupon?.sale_amount ? `USD ${Math.round(landing.coupon.sale_amount)}` : "USD 500";

    // Helper to format dates
    const formatDateFriendly = (dateStr) => {
        if (!dateStr) return "";
        try {
            // Extraer solo la parte YYYY-MM-DD
            const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr.substring(0, 10);
            const parts = cleanDate.split("-");
            if (parts.length === 3) {
                const monthIndex = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
                return `${day} ${months[monthIndex]}`;
            }
            // Fallback con UTC
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
            return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
        } catch (e) {
            return dateStr;
        }
    };

    const couponDates = landing.coupon?.date_begin && landing.coupon?.date_end
        ? `${formatDateFriendly(landing.coupon.date_begin)} – ${formatDateFriendly(landing.coupon.date_end)}`
        : "Vigente";

    const handleCopy = () => {
        navigator.clipboard?.writeText(couponName).then(() => {
            setCopyText("¡Copiado!");
            setTimeout(() => setCopyText("Copiar"), 1600);
        }).catch(() => { });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor, completa tu nombre, correo y celular para participar.",
                icon: "warning",
                confirmButtonColor: "#7E5AFB"
            });
            return;
        }
        if (!consent) {
            Swal.fire({
                title: "Consentimiento requerido",
                text: "Debes aceptar las bases del sorteo para continuar.",
                icon: "warning",
                confirmButtonColor: "#7E5AFB"
            });
            return;
        }

        setSubmitting(true);
        try {
            const utms = getUtms();
            const response = await axios.post("/api/campaign-subscriptions", {
                name,
                email,
                phone,
                transactional_landing_id: landing.id,
                campaign_name: landing.campaign_name || landing.name,
                ...utms
            });

            if (response.data) {
                setSubmitted(true);
                const formElement = document.getElementById("registro");
                if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        } catch (error) {
            console.error("Error submitting subscription:", error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al registrar tu participación. Por favor, intenta de nuevo.",
                icon: "error",
                confirmButtonColor: "#7E5AFB"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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

    const inputFocus = {
        rest: {
            borderColor: "#cbd5e1",
            boxShadow: "none",
            scale: 1,
        },
        focus: {
            borderColor: "#7E5AFB",
            boxShadow: "0 0 0 3px rgba(126, 90, 251, 0.1)",
            scale: 1.01,
            transition: { duration: 0.2 },
        },
    };

    return (
        <div className="min-h-screen bg-[#FAF3E1] text-[#222222] font-sans antialiased selection:bg-[#BCFF52] selection:text-black overflow-x-hidden">
            {/* Header */}
            <Header showSlogan={false} transparent={false} />

            {/* HERO SECTION */}
            <motion.section
                className="relative bg-gradient-to-br from-[#222222] to-black text-white flex flex-col lg:flex-row min-h-[800px] overflow-hidden"
                initial="hidden"
                animate={sectionsReady ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {/* Soccer field subtle line background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)`,
                        backgroundSize: "64px 64px",
                        maskImage: "radial-gradient(circle at 50% 30%, black 30%, transparent 75%)"
                    }}
                />

                {/* Left Column Info */}
                <div className="w-full lg:w-6/12 px-[6%] py-16 md:py-24 relative flex flex-col justify-center z-10">
                    <motion.span
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 bg-[#7E5AFB]/20 border border-[#7E5AFB]/50 text-[#c9b8ff] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-full mb-6 max-w-max"
                    >
                        {landing.hero_eyebrow || "🏆 Gran Sorteo"}
                    </motion.span>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-8xl font-semibold text-white leading-[0.95] mb-10"
                    >
                        <TextWithHighlight
                            text={landing.hero_title || "Cambia este Mundial y gánate una *TV de 32\"*"}
                            color="bg-secondary"
                        />
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-white/85 max-w-2xl mb-12 leading-relaxed font-light"
                    >
                        {landing.hero_subtitle || "Realiza tus transacciones usando tu cupón especial y participa automáticamente."}
                    </motion.p>

                    {/* Coupon Box */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full sm:w-auto flex flex-col gap-3 bg-white/5 border-2 border-dashed border-[#BCFF52] rounded-2xl p-4 sm:p-5 mb-8 max-w-lg"
                    >
                        <div className="flex items-center justify-between w-full gap-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Tu cupón</span>
                                <code className="text-2xl sm:text-3xl font-mono font-bold text-[#BCFF52] tracking-wider leading-none mt-1">
                                    {couponName}
                                </code>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="bg-[#BCFF52] text-[#222222] border-0 rounded-full font-bold text-sm px-6 py-3 hover:bg-[#a6e83f] transition-all transform active:scale-95 whitespace-nowrap"
                            >
                                {copyText}
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/70 border-t border-white/10 pt-3">
                            <span>Monto mínimo: <b>{couponMin}</b></span>
                            <span className="opacity-40">•</span>
                            <span>Vence: <b>{couponDates}</b></span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                        <a
                            href="https://mi.cambiafx.pe/registro"
                            className="bg-[#BCFF52] text-[#222222] font-bold px-10 py-5 rounded-full shadow-lg shadow-[#BCFF52]/20 hover:bg-[#a6e83f] transition-all transform hover:-translate-y-0.5 inline-flex items-center uppercase tracking-wider text-sm"
                        >
                            Quiero participar →
                        </a>
                        <a
                            href="#como"
                            className="bg-white/10 text-white border border-white/20 font-bold px-10 py-5 rounded-full hover:bg-white/20 transition-all uppercase tracking-wider text-sm"
                        >
                            Cómo funciona
                        </a>
                    </motion.div>
                </div>

                {/* Right Column Visual */}
                <div className="w-full lg:w-6/12 px-[2%] py-8 flex flex-col items-center justify-center relative z-10 bg-transparent border-0">
                    <div className="w-full max-w-[750px] z-10 bg-transparent border-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={sectionsReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative w-full flex items-center justify-center min-h-auto md:min-h-[650px] bg-transparent border-0"
                        >
                            {landing.hero_image ? (
                                <img
                                    src={`/api/transactional_landings/media/${landing.hero_image}`}
                                    alt="Ilustración del Sorteo"
                                    className="max-h-[550px] md:max-h-[700px] lg:max-h-[800px] w-full object-contain bg-transparent border-0"
                                />
                            ) : (
                                <div className="text-center p-6 text-white/40 bg-transparent border-0">
                                    <span className="text-6xl block mb-3">🏆</span>
                                    <p className="text-sm">Gran Sorteo Cambia FX</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* STEPS SECTION */}
            {landing.steps && landing.steps.length > 0 && (
                <Suspense fallback={null}>
                    <motion.div
                        id="como"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <StepsSection
                            data={{
                                title: landing.steps_title || "Cambia en 3 pasos",
                                description: landing.steps_subtitle || "Es más fácil que el banco y 100% seguro.",
                            }}
                            pasos={landing.steps}
                        />
                    </motion.div>
                </Suspense>
            )}

            {/* PRIZE BANNER SECTION (Styled exactly like SolesADolares) */}
            {landing.cta_title && (
                <section className="w-full overflow-hidden bg-[#FAF3E1] py-12 md:py-32 flex justify-center items-center px-[3%] md:px-[5%] mx-auto">
                    <motion.div
                        className="relative w-full h-full px-4 md:px-16 rounded-[28px] md:rounded-[56px] bg-gradient-to-r from-[#222222] to-black text-white flex flex-col md:flex-row items-center py-10 md:py-10 md:min-h-[400px] border border-white/5 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Decorative Background */}
                        <div className="absolute h-full w-auto top-0 right-0 z-0 overflow-hidden rounded-[28px] md:rounded-[56px] hidden md:block opacity-30">
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
                                    fill="url(#paint0_linear_cta)"
                                    fillOpacity="0.6"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_cta"
                                        x1="605.608"
                                        y1="-36.9748"
                                        x2="90.2411"
                                        y2="458.384"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop offset="0.48" stopColor="#7E5AFB" />
                                        <stop offset="1" stopColor="#C7B7FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Layout */}
                        <div className="flex-1 z-10 flex flex-col md:flex-row w-full h-full items-center">
                            {/* Columna izquierda: texto */}
                            <div className="flex-1 z-10 flex flex-col justify-center items-center md:items-start gap-4 text-center md:text-left">
                                <motion.h2
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl lg:text-7xl font-semibold leading-tight text-white mb-2"
                                >
                                    <TextWithHighlight
                                        text={landing.cta_title}
                                        color="bg-secondary font-bold"
                                    />
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-white/80 text-lg md:text-2xl max-w-xl font-light"
                                >
                                    {landing.cta_subtitle}
                                </motion.p>
                            </div>

                            {/* Columna central: imagen — solo desktop */}
                            {landing.cta_image && (
                                <div className="z-10 flex-1 justify-center items-end min-h-[300px] md:min-h-[400px] relative hidden md:flex">
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                        src={`/api/transactional_landings/media/${landing.cta_image}`}
                                        alt="Prize Image"
                                        className="h-[450px] lg:h-[550px] absolute -bottom-10 lg:-bottom-10 w-auto object-contain select-none transition-all duration-500 drop-shadow-2xl"
                                        draggable="false"
                                    />
                                </div>
                            )}

                            {/* Columna derecha: botón + imagen mobile */}
                            <div className="z-10 flex flex-col items-center md:items-end justify-center md:justify-end min-w-[200px] md:ml-8 mt-8 md:mt-0">
                                <motion.a
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={landing.cta_button_link || "#registro"}
                                    className="text-neutral-dark bg-[#BCFF52] font-black px-12 py-5 rounded-full text-lg uppercase tracking-widest shadow-xl whitespace-nowrap hover:bg-[#a6e83f] transition-all"
                                >
                                    {landing.cta_button_text || "Participar ahora →"}
                                </motion.a>

                                {/* Imagen mobile — solo visible en mobile, debajo del botón */}
                                {landing.cta_image && (
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        src={`/api/transactional_landings/media/${landing.cta_image}`}
                                        alt="Prize Image"
                                        className="block md:hidden mt-4 -mb-10 h-[260px] w-auto object-contain select-none drop-shadow-2xl"
                                        draggable="false"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* REGISTRATION FORM SECTION */}
            <section className="py-16 bg-[#FAF3E1]" id="registro">
                <div className="max-w-[1080px] mx-auto px-6">
                    <div className="max-w-[560px] mx-auto bg-white border border-black/10 rounded-[2rem] p-8 md:p-12 shadow-xl">
                        {!submitted ? (
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-3xl font-bold text-center mb-2">Confirma tu participación</h2>
                                <p className="text-center text-neutral-500 text-sm mb-8">
                                    Déjanos tus datos para avisarte si eres el ganador y enviarte alertas sobre el sorteo.
                                </p>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Nombre completo</label>
                                    <motion.input
                                        type="text"
                                        required
                                        placeholder="Escribe tu nombre y apellido"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7E5AFB]/20 transition-all duration-200"
                                        variants={inputFocus}
                                        initial="rest"
                                        whileFocus="focus"
                                        whileHover={{ scale: 1.01 }}
                                        style={{ transition: 'transform 0.2s ease-in-out' }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Correo electrónico</label>
                                    <motion.input
                                        type="email"
                                        required
                                        placeholder="tucorreo@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7E5AFB]/20 transition-all duration-200"
                                        variants={inputFocus}
                                        initial="rest"
                                        whileFocus="focus"
                                        whileHover={{ scale: 1.01 }}
                                        style={{ transition: 'transform 0.2s ease-in-out' }}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Número celular</label>
                                    <motion.input
                                        type="tel"
                                        required
                                        placeholder="Ej: 999999999"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7E5AFB]/20 transition-all duration-200"
                                        variants={inputFocus}
                                        initial="rest"
                                        whileFocus="focus"
                                        whileHover={{ scale: 1.01 }}
                                        style={{ transition: 'transform 0.2s ease-in-out' }}
                                    />
                                </div>

                                <label className="flex gap-3 items-start text-xs text-neutral-600 mb-8 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-0.5 border-black/20 rounded accent-[#7E5AFB]"
                                    />
                                    <span>
                                        Acepto las bases del sorteo y autorizo a Cambia FX a contactarme para fines relacionados con esta promoción.
                                    </span>
                                </label>

                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[#BCFF52] text-[#222222] font-bold py-4 rounded-full hover:bg-[#a6e83f] transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center uppercase tracking-widest text-sm shadow-md"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {submitting ? "Procesando..." : "Confirmar participación"}
                                </motion.button>
                                <p className="text-center text-[11px] text-neutral-400 mt-4">
                                    Tus datos están protegidos según nuestra Política de Privacidad.
                                </p>
                            </form>
                        ) : (
                            <motion.div
                                className="text-center py-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-[#7E5AFB]/10 text-[#7E5AFB] flex items-center justify-center text-3xl mx-auto mb-6">
                                    ✓
                                </div>
                                <h3 className="text-2xl font-bold mb-2">¡Ya estás registrado!</h3>
                                <p className="text-neutral-600 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                                    Hemos registrado tus datos. Recuerda realizar tu operación aplicando el cupón <b className="text-black font-semibold">{couponName}</b> dentro de la vigencia del sorteo para asegurar tu participación.
                                </p>
                                <motion.a
                                    href="https://mi.cambiafx.pe/login"
                                    className="inline-flex bg-[#BCFF52] text-[#222222] font-bold px-8 py-3 rounded-full hover:bg-[#a6e83f] transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Operar en Cambia FX
                                </motion.a>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* TERMS AND CONDITIONS SECTION */}
            <section className="py-20 bg-white border-t border-black/10" id="bases">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Título estilo StepsSection */}
                    <h2 className="text-4xl md:text-5xl font-medium font-title text-neutral-dark mb-3">
                        <TextWithHighlight
                            text={landing.terms_title || "Bases del sorteo"}
                            color="bg-neutral-dark font-semibold"
                        />
                    </h2>
                    {/* Subtítulo estilo StepsSection */}
                    <p className="text-base text-neutral-light max-w-3xl leading-relaxed mb-10">
                        {landing.terms_subtitle || "Términos y condiciones legales aplicables a esta promoción."}
                    </p>

                    {landing.terms_content ? (
                        <div
                            className={[
                                "text-[#333333] text-sm leading-relaxed space-y-4",
                                /* Restaurar estilos de listas que Tailwind resetea */
                                "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
                                "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
                                "[&_li]:leading-relaxed",
                                "[&_li_b]:font-semibold [&_li_strong]:font-semibold",
                                "[&_ol_ol]:list-[lower-alpha] [&_ol_ol]:pl-4",
                                "[&_p]:mb-2",
                                "[&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-4",
                                "[&_h4]:font-semibold [&_h4]:mt-3",
                            ].join(" ")}
                            dangerouslySetInnerHTML={{ __html: landing.terms_content }}
                        />
                    ) : null}

                    {landing.terms_footer ? (
                        <p className="text-sm text-neutral-400 mt-10 leading-relaxed">
                            {landing.terms_footer}
                        </p>
                    ) : (
                        <p className="text-xs text-neutral-400 mt-10 leading-relaxed">
                            Esta promoción no está afiliada, auspiciada ni patrocinada por redes sociales ni proveedores de hardware externos. Los términos son de entera responsabilidad de Cambia FX.
                        </p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <SorteoCambiaFx {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
