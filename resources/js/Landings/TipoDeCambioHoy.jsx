import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import Base from "../Components/Tailwind/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import { CarritoProvider } from "../context/CarritoContext";
import { useTranslation } from "../hooks/useTranslation";
import CambiaFXService from "../services/CambiaFXService";
import TextWithHighlight from "../Utils/TextWithHighlight";
import ComparisonTable from "../components/Tailwind/CambiaFX/ComparisonTable";

const TipoDeCambioHoy = ({
    landing = {},
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
    const [amount, setAmount] = useState(1000);
    const [result, setResult] = useState(0);
    const [ownRates, setOwnRates] = useState({ compra: "3.715", venta: "3.725" });
    const [activeFaq, setActiveFaq] = useState(null);

    useEffect(() => {
        setSectionsReady(true);
        const fetchRates = async () => {
            const rates = CambiaFXService.getCurrentRates();
            if (rates && rates.compra !== "0.0000") {
                setOwnRates(rates);
            }
        };
        fetchRates();
    }, []);

    const sunatRate = (marketRates || []).find(r => r.entity === 'SUNAT') || { buy: '3.750', sell: '3.760' };
    const oconaRate = (marketRates || []).find(r => r.entity === 'Paralelo') || { buy: '3.720', sell: '3.730' };

    useEffect(() => {
        const calculate = () => {
            const res = amount / parseFloat(ownRates.venta);
            setResult(res.toFixed(2));
        };
        calculate();
    }, [amount, ownRates]);

    // SEO Dynamic Update
    useEffect(() => {
        const updateSEO = () => {
            document.title = landing.meta_title || "Tipo de Cambio Dolar Hoy Peru | Cambia FX";
            
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement("meta");
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = landing.meta_description || financialServiceData.description || "";

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
    }, [landing, financialServiceData]);

    const financialServiceSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        name: financialServiceData.name,
        description: financialServiceData.description,
        url: `https://cambiafx.pe/${landing.url}`,
        telephone: financialServiceData.phone,
        logo: "https://cambiafx.pe/assets/img/logo.png",
        image: landing.cta_image ? `/api/transactional_landings/media/${landing.cta_image}` : "https://cambiafx.pe/assets/img/logo.png",
        address: {
            "@type": "PostalAddress",
            addressLocality: financialServiceData.address?.locality,
            addressRegion: financialServiceData.address?.region,
            addressCountry: financialServiceData.address?.country,
        },
        sameAs: (socials || []).map((s) => s.link),
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
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-mindaro selection:text-neutral-dark">
            {/* 1. NAV - Estilo Periodístico */}
            <nav className="bg-[#0C0C0C] py-4 px-[5%] flex justify-between items-center sticky top-0 z-50 border-b border-white/5">
                <div className="flex items-center gap-8">
                    <img src="/assets/img/logo-white.png" alt="Cambia FX" className="h-8 md:h-10" />
                    <span className="hidden md:block text-white/40 text-xs uppercase tracking-[0.2em] font-medium border-l border-white/10 pl-8">
                        Tipo de cambio en vivo — {new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
                <button 
                    onClick={() => window.location.href = 'https://mi.cambiafx.pe/register'}
                    className="bg-[#BBFF52] text-neutral-dark px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                >
                    Cambiar dólares
                </button>
            </nav>

            {/* 2. HERO - Estilo Financiero */}
            <header className="bg-[#0C0C0C] pt-24 pb-40 px-[5%] relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-center md:text-left"
                    >
                        <motion.h1 
                            variants={itemVariants}
                            className="text-white/60 text-sm uppercase tracking-widest font-bold mb-6"
                        >
                            {landing.h1 || "Tipo de cambio hoy en Perú"}
                        </motion.h1>
                        
                        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
                            <motion.div variants={itemVariants} className="flex flex-col">
                                <span className="text-[#BBFF52] text-[80px] md:text-[120px] font-black leading-none tracking-tighter">
                                    S/ {ownRates.venta}
                                </span>
                                <span className="text-white/30 text-sm mt-2 font-medium">
                                    Precio de venta oficial Cambia FX — Actualizado hace 1 min
                                </span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex gap-3 pb-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                                    <span className="block text-white/30 text-[10px] uppercase font-bold mb-1">Cambia FX</span>
                                    <span className="text-[#BBFF52] font-bold text-lg">S/ {ownRates.compra}</span>
                                    <span className="text-[#BBFF52] ml-1 text-xs">↑</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                                    <span className="block text-white/30 text-[10px] uppercase font-bold mb-1">SUNAT</span>
                                    <span className="text-white/60 font-bold text-lg">S/ {sunatRate.sell}</span>
                                    <span className="text-white/60 ml-1 text-xs">→</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                                    <span className="block text-white/30 text-[10px] uppercase font-bold mb-1">Ocoña</span>
                                    <span className="text-amber-400 font-bold text-lg">S/ {oconaRate.sell}</span>
                                    <span className="text-amber-400 ml-1 text-xs">↑</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* 3. COTIZADOR INLINE */}
                        <motion.div 
                            variants={itemVariants}
                            className="w-full max-w-4xl bg-white/5 border border-white/10 p-2 rounded-[32px] backdrop-blur-md flex flex-col md:flex-row items-center gap-2"
                        >
                            <div className="flex-1 w-full relative">
                                <input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Soles que cambias"
                                    className="w-full bg-transparent border-none text-white text-xl font-bold py-4 px-8 focus:ring-0 placeholder:text-white/20"
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xs uppercase">PEN</span>
                            </div>
                            <div className="hidden md:block w-px h-8 bg-white/10"></div>
                            <div className="flex-1 w-full relative">
                                <div className="w-full py-4 px-8 text-[#BBFF52] text-xl font-bold">
                                    {result}
                                </div>
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xs uppercase">USD Recibes</span>
                            </div>
                            <button className="w-full md:w-auto bg-[#BBFF52] text-neutral-dark px-10 py-4 rounded-[24px] font-black hover:scale-[1.02] transition-transform">
                                Cambiar ahora
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-majorelle/30 blur-[120px] rounded-full"></div>
                </div>
            </header>

            {/* 4. AHORRO STRIP */}
            <section className="bg-[#0C0C0C] pb-24 px-[5%] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { bank: 'BCP', saving: 'S/ 135', color: 'text-mindaro' },
                            { bank: 'BBVA', saving: 'S/ 120', color: 'text-mindaro' },
                            { bank: 'Interbank', saving: 'S/ 115', color: 'text-mindaro' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:border-[#BBFF52]/30 transition-colors group">
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 block">Ahorras vs {item.bank}</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-white text-4xl font-bold">+{item.saving}</span>
                                    <span className="text-[#BBFF52] text-sm font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Ahorro real</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* 4.5 TABLA COMPARATIVA - Inyectando marketRates */}
            <section className="bg-[#0C0C0C] py-24 px-[5%] border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-white text-2xl md:text-4xl font-bold mb-12">
                        Compara el <span className="text-[#BBFF52]">precio del dólar</span> en tiempo real
                    </h2>
                    <ComparisonTable data={marketRates} />
                </div>
            </section>

            {/* 5. PASOS - Diseño Oscuro */}
            <section className="bg-neutral-dark py-24 px-[5%]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-white text-3xl md:text-5xl font-bold mb-16 text-center md:text-left">
                        Cambia en <span className="text-[#BBFF52]">4 simples pasos</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(pasos.length > 0 ? pasos : [
                            { name: 'Regístrate', description: 'Crea tu cuenta en segundos' },
                            { name: 'Cotiza', description: 'Elige cuánto quieres cambiar' },
                            { name: 'Transfiere', description: 'Envía los soles vía banca móvil' },
                            { name: 'Recibe', description: 'Dólares en tu cuenta en 15 min' }
                        ]).map((paso, i) => (
                            <div key={i} className="relative group">
                                <div className="text-[#BBFF52]/20 text-[100px] font-black absolute -top-10 -left-4 leading-none select-none group-hover:text-[#BBFF52]/30 transition-colors">
                                    {i + 1}
                                </div>
                                <div className="relative z-10 pt-10">
                                    <h3 className="text-white text-xl font-bold mb-3">{paso.name}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{paso.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ - Fondo Blanco (Según Brief) */}
            <section className="bg-white py-24 px-[5%]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-black text-neutral-dark mb-16 text-center">
                        Preguntas <span className="text-majorelle">frecuentes</span>
                    </h2>
                    <div className="space-y-4">
                        {(landing.schema_faq || []).map((faq, i) => (
                            <div key={i} className="border-b border-neutral-dark/10">
                                <button 
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full py-6 flex justify-between items-center text-left group"
                                >
                                    <span className="text-lg font-bold text-neutral-dark group-hover:text-majorelle transition-colors">
                                        {faq.question}
                                    </span>
                                    <span className={`text-2xl transition-transform ${activeFaq === i ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-neutral-dark/60 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FOOTER CTA */}
            <section className="bg-[#BBFF52] py-20 px-[5%] text-center">
                <h2 className="text-neutral-dark text-4xl md:text-6xl font-black mb-10">
                    ¡Qué bueno que cambiaste!
                </h2>
                <button 
                    onClick={() => window.location.href = 'https://mi.cambiafx.pe/register'}
                    className="bg-neutral-dark text-white px-12 py-5 rounded-full text-lg font-black hover:scale-105 transition-transform shadow-xl"
                >
                    Empezar ahora
                </button>
            </section>

            {/* Footer Simple con Badge SBS */}
            <footer className="bg-[#0C0C0C] py-12 px-[5%] border-t border-white/5 text-center">
                <img src="/assets/img/logo-white.png" alt="Logo" className="h-8 mx-auto mb-8 opacity-50" />
                <div className="flex justify-center items-center gap-6 mb-8">
                    <img src="/assets/cambiafx/sbs_logo.webp" alt="SBS" className="h-10 opacity-60 grayscale hover:grayscale-0 transition-all" />
                </div>
                <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
                    &copy; {new Date().getFullYear()} Cambia FX • Todos los derechos reservados
                </p>
            </footer>
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
