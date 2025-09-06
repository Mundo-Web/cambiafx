import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";

import { motion } from "framer-motion";
import { useTranslation } from "./hooks/useTranslation";

const LegalPolicy = ({
    policyType,
    policyContent,
    landing,
}) => {
    const { t } = useTranslation();
    
    // Estado para controlar cuando las secciones están listas para animar
    const [sectionsReady, setSectionsReady] = useState(false);

    // Efecto para marcar las secciones como listas después del primer render
    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    // Función para obtener el título basado en el tipo de política
    const getPolicyTitle = () => {
        switch (policyType) {
            case 'privacy_policy':
                return t("public.footer.privacity", "Políticas de Privacidad");
            case 'terms_conditions':
                return t("public.form.terms", "Términos y Condiciones");
            default:
                return "Información Legal";
        }
    };

    // Función para limpiar el texto de asteriscos y formatear
    const cleanText = (text) => {
        if (!text) return "";
        
        return String(text)
            .replace(/\*\*(.*?)\*\*/g, "$1") // **texto**
            .replace(/\*(.*?)\*/g, "$1") // *texto*
            .replace(/[*]+/g, ""); // Cualquier asterisco suelto
    };

    // Función para formatear el contenido con saltos de línea
    const formatContent = (content) => {
        if (!content) return "";
        
        const cleanedContent = cleanText(content);
        
        // Dividir por dobles saltos de línea para crear párrafos
        const paragraphs = cleanedContent.split(/\n\s*\n/);
        
        return paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                {paragraph.trim()}
            </p>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showSlogan={true} />
            
            <motion.div
                className="animate-section"
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
            >
          

                {/* Content Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                {policyContent ? (
                                    <>
                                        {/* Título del contenido */}
                                        {policyContent.name && (
                                            <h2 className="text-3xl font-bold customtext-neutral-dark mb-8 border-b-4 border-constrast pb-4">
                                                {policyContent.name}
                                            </h2>
                                        )}
                                        
                                        {/* Contenido principal */}
                                        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: policyContent.description }}>
                                         
                                        </div>
                                        
                                       
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                            Contenido en preparación
                                        </h3>
                                        <p className="text-gray-500">
                                            El contenido de esta página está siendo actualizado. 
                                            Por favor, vuelve pronto.
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                         
                        </div>
                    </div>
                </section>
            </motion.div>

            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <LegalPolicy {...properties} />
            </Base>
        </CarritoProvider>
    );
});