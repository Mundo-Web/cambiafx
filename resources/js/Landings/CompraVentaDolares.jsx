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
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Clock, TrendingUp, Landmark, XCircle, Info } from "lucide-react";

const StepsSection = lazy(() => import("../components/Tailwind/CambiaFX/StepsSection"));
import FAQSection from "../components/Tailwind/CambiaFX/FAQSection";
import CambiaFXService from "../services/CambiaFXService";

const CompraVentaDolares = ({
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
    
    // Obtener tasas de marketRates si están disponibles
    const getInitialRate = (type) => {
        const rate = (marketRates || []).find(r => r.entity.toLowerCase().includes('paralelo') || r.entity.toLowerCase().includes('sunat'));
        if (type === 'compra') return rate ? parseFloat(rate.buy) : 3.715;
        return rate ? parseFloat(rate.sell) : 3.725;
    };

    const [compraRate, setCompraRate] = useState(getInitialRate('compra'));
    const [ventaRate, setVentaRate] = useState(getInitialRate('venta'));

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);

        // SEO y Metadatos Dinámicos
        const updateSEO = () => {
            const title = landing.meta_title || landing.hero_title || "Compra y venta de dólares online en Perú";
            const description = landing.meta_description || financialServiceData.description || "";
            const keywords = landing.meta_keywords || globalKeywords || "";
            
            document.title = title;

            const setMeta = (name, content, isProperty = false) => {
                let el = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`);
                if (!el) {
                    el = document.createElement('meta');
                    el.setAttribute(isProperty ? 'property' : 'name', name);
                    document.head.appendChild(el);
                }
                el.content = content;
            };

            setMeta("description", description);
            setMeta("keywords", keywords);
            setMeta("og:title", title, true);
            
            const injectSchema = (id, schema) => {
                let script = document.getElementById(id);
                if (!script) {
                    script = document.createElement("script");
                    script.id = id;
                    script.type = "application/ld+json";
                    document.head.appendChild(script);
                }
                script.textContent = JSON.stringify(schema);
            };

            injectSchema("financial-service-schema", financialServiceSchema);
            injectSchema("faq-schema", faqSchema);
        };

        updateSEO();
        return () => clearTimeout(timer);
    }, [landing]);

    const financialServiceSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        name: "Cambia FX",
        description: "Compra y venta de dólares online en Perú al mejor tipo de cambio."
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (landing.schema_faq || []).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <div className="min-h-screen bg-neutral-dark overflow-x-hidden font-title text-white">
            <Header showSlogan={false} transparent={true} />
            <CintilloSection />

            {/* HERO NEGRO CENTRADO */}
            <motion.section 
                className="relative py-20 px-[5%] text-center overflow-hidden"
                initial="hidden"
                animate={sectionsReady ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.span variants={itemVariants} className="text-mindaro font-bold text-xs uppercase tracking-[0.3em] mb-6 block">
                        Compra · Venta · Dólares · Soles · SBS
                    </motion.span>
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-medium leading-[1] mb-8">
                        <TextWithHighlight text={landing.hero_title || "Compra y venta de *dólares* en Perú"} color="bg-mindaro" />
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                        {landing.hero_subtitle || "Cambia tus divisas al instante con la mejor tasa del mercado. Sin comisiones y 100% seguro."}
                    </motion.p>

                    {/* Chips de TC en pill horizontal */}
                    <motion.div 
                        variants={itemVariants}
                        className="inline-flex flex-wrap justify-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl p-2 rounded-full mb-16"
                    >
                        <div className="flex items-center gap-3 px-6 py-2">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Compramos:</span>
                            <span className="text-mindaro text-2xl font-black tabular-nums">S/ {compraRate.toFixed(3)}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block self-center"></div>
                        <div className="flex items-center gap-3 px-6 py-2">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Vendemos:</span>
                            <span className="text-majorelle text-2xl font-black tabular-nums">S/ {ventaRate.toFixed(3)}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* DOS COLUMNAS PARALELAS */}
            <section className="pb-32 px-[3%] md:px-[5%] relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 rounded-[48px] overflow-hidden shadow-2xl border border-white/5">
                    {/* COLUMNA IZQUIERDA: COMPRA DÓLARES */}
                    <motion.div 
                        className="bg-[#111] p-8 md:p-16 flex flex-col justify-between group"
                        initial={{ opacity: 0, x: -50 }}
                        animate={sectionsReady ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-mindaro/10 rounded-2xl flex items-center justify-center text-mindaro">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Quiero comprar dólares</h3>
                                    <p className="text-white/40 text-sm">Tengo soles, quiero dólares</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Envías (Soles)</label>
                                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex justify-between items-center group-hover:border-mindaro/30 transition-colors">
                                        <span className="text-3xl font-bold text-white/80">3,715.00</span>
                                        <span className="text-white/20 font-bold">PEN</span>
                                    </div>
                                </div>

                                <div className="relative py-2 flex justify-center">
                                    <div className="w-10 h-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center relative z-10">
                                        <ArrowRight size={18} className="text-mindaro" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Recibes (Dólares)</label>
                                    <div className="bg-mindaro/10 border border-mindaro/20 rounded-3xl p-6 flex justify-between items-center group-hover:bg-mindaro/[0.15] transition-colors">
                                        <span className="text-3xl font-bold text-mindaro">1,000.00</span>
                                        <span className="text-mindaro/50 font-bold">USD</span>
                                    </div>
                                    <div className="flex justify-between mt-3 px-2">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">TC Venta: {ventaRate.toFixed(3)}</span>
                                        <span className="text-[10px] font-bold text-mindaro uppercase tracking-widest">Sin comisiones</span>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <a href="/soles-a-dolares" className="text-[10px] text-white/30 hover:text-mindaro transition-colors uppercase tracking-widest font-bold underline decoration-mindaro/20">
                                            Ir a cambiar soles a dólares
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.a 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://mi.cambiafx.pe/register"
                            className="w-full bg-mindaro text-neutral-dark font-black px-10 py-6 rounded-3xl text-xl flex items-center justify-center gap-4 shadow-xl hover:brightness-110 transition-all uppercase tracking-widest"
                        >
                            Comprar dólares
                            <ArrowRight size={24} />
                        </motion.a>
                    </motion.div>

                    {/* COLUMNA DERECHA: VENTA DÓLARES */}
                    <motion.div 
                        className="bg-[#1a1a1a] p-8 md:p-16 flex flex-col justify-between group"
                        initial={{ opacity: 0, x: 50 }}
                        animate={sectionsReady ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-majorelle/10 rounded-2xl flex items-center justify-center text-majorelle">
                                    <TrendingUp size={24} className="rotate-180" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Quiero vender dólares</h3>
                                    <p className="text-white/40 text-sm">Tengo dólares, quiero soles</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Envías (Dólares)</label>
                                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex justify-between items-center group-hover:border-majorelle/30 transition-colors">
                                        <span className="text-3xl font-bold text-white/80">1,000.00</span>
                                        <span className="text-white/20 font-bold">USD</span>
                                    </div>
                                </div>

                                <div className="relative py-2 flex justify-center">
                                    <div className="w-10 h-10 bg-[#1a1a1a] border border-white/10 rounded-full flex items-center justify-center relative z-10">
                                        <ArrowRight size={18} className="text-majorelle" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Recibes (Soles)</label>
                                    <div className="bg-majorelle/10 border border-majorelle/20 rounded-3xl p-6 flex justify-between items-center group-hover:bg-majorelle/[0.18] transition-colors">
                                        <span className="text-3xl font-bold text-majorelle">3,715.00</span>
                                        <span className="text-majorelle/50 font-bold">PEN</span>
                                    </div>
                                    <div className="flex justify-between mt-3 px-2">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">TC Compra: {compraRate.toFixed(3)}</span>
                                        <span className="text-[10px] font-bold text-majorelle uppercase tracking-widest">Sin comisiones</span>
                                    </div>
                                    <div className="mt-4 px-2 text-right">
                                        <a href="/vender-dolares-online" className="text-[10px] text-white/30 hover:text-majorelle transition-colors uppercase tracking-widest font-bold underline decoration-majorelle/20">
                                            Vender mis dólares online
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.a 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://mi.cambiafx.pe/register"
                            className="w-full bg-majorelle text-white font-black px-10 py-6 rounded-3xl text-xl flex items-center justify-center gap-4 shadow-xl hover:brightness-110 transition-all uppercase tracking-widest"
                        >
                            Vender dólares
                            <ArrowRight size={24} />
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* PILLS DE AHORRO */}
            <section className="py-24 bg-[#0C0C0C]">
                <div className="max-w-7xl mx-auto px-[5%]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
                        <h2 className="text-4xl font-medium text-center md:text-left">
                            Por cada US$ 1,000 <br />
                            <span className="text-mindaro">Cambia FX vs. bancos</span>
                        </h2>
                        <div className="hidden lg:flex items-center gap-4 text-white/30">
                            <Info size={20} />
                            <span className="text-xs uppercase tracking-widest font-bold">Estimado según promedio mercado</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { bank: "BCP", saving: "S/ 130", color: "border-mindaro/30" },
                            { bank: "BBVA", saving: "S/ 100", color: "border-majorelle/30" },
                            { bank: "Interbank", saving: "S/ 110", color: "border-white/10" }
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-white/5 border ${card.color} p-10 rounded-[40px] text-center hover:bg-white/10 transition-all`}
                            >
                                <span className="text-6xl font-black text-white block mb-4">{card.saving}</span>
                                <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">Más que en {card.bank}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PASOS (FONDO OSCURO) */}
            <Suspense fallback={null}>
                <div className="bg-[#111]">
                    <StepsSection 
                        data={{
                            title: "Compra o vende en 4 pasos",
                            description: "Nuestro proceso es transparente y el más rápido del mercado peruano."
                        }}
                        pasos={[
                            { title: "Regístrate", description: "Crea tu cuenta en 1 minuto con tu DNI o RUC.", icon: "1" },
                            { title: "Elige compra o vende", description: "Selecciona si tienes soles o dólares para cambiar.", icon: "2" },
                            { title: "Transfiere", description: "Envía el monto a nuestras cuentas bancarias seguras.", icon: "3" },
                            { title: "Recibe", description: "Recibe tu cambio en tu cuenta en menos de 15 minutos.", icon: "4" }
                        ]}
                    />
                </div>
            </Suspense>

            {/* STATS */}
            <section className="py-24 border-y border-white/5 bg-[#0C0C0C]">
                <div className="max-w-7xl mx-auto px-[5%] grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { val: "60k+", label: "Clientes activos" },
                        { val: "6 años", label: "En el mercado" },
                        { val: "SBS", label: "Registrados" },
                        { val: "0", label: "Comisiones" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group">
                            <span className="block text-5xl md:text-7xl font-black text-mindaro mb-2 group-hover:scale-110 transition-transform">{stat.val}</span>
                            <span className="text-white/40 font-bold uppercase tracking-widest text-xs md:text-sm">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ SECTION */}
            <div className="bg-neutral-dark">
                <FAQSection faqs={[
                    { question: "¿Puedo comprar y vender en el mismo día?", answer: "Sí, puedes realizar todas las operaciones que necesites sin límites diarios siempre que cuentes con los fondos." },
                    { question: "¿Cuál es la diferencia entre precio de compra y venta?", answer: "El precio de compra es lo que te pagamos por tus dólares, y el precio de venta es a cuánto te vendemos los dólares." },
                    { question: "¿Es seguro cambiar montos altos?", answer: "Totalmente. Estamos regulados por la SBS y operamos con los principales bancos del país." },
                    { question: "¿Cuánto demora el cambio?", answer: "El tiempo promedio es de 15 minutos una vez verificada tu transferencia." },
                    { question: "¿Atienden a empresas?", answer: "Contamos con un servicio especializado para empresas con tasas preferenciales para montos altos." }
                ]} />
            </div>

            {/* FOOTER CTA */}
            <section className="py-20 bg-mindaro text-neutral-dark text-center">
                <div className="max-w-4xl mx-auto px-[5%]">
                    <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9]">¡Qué bueno que cambiaste!</h2>
                    <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://mi.cambiafx.pe/login"
                        className="inline-flex items-center bg-neutral-dark gap-4 text-mindaro px-12 py-6 rounded-full font-black text-xl hover:brightness-110 transition-all shadow-2xl uppercase tracking-widest"
                    >
                        Comenzar ahora
                        <ArrowRight size={24} />
                    </motion.a>
                </div>
            </section>

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
