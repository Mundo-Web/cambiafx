import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../Utils/HtmlContent";
import GeneralRest from "../../actions/GeneralRest";
import { Send } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import SubscriptionsRest from "../../actions/SubscriptionsRest";
import Global from "../../Utils/Global";



const Footer = ({ terms, footerLinks = [] }) => {
    const { t } = useTranslation();

    const generalRest = new GeneralRest();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

    // Configurar notificaciones para GeneralRest (principalmente para consistencia)
    // Las consultas GET normalmente solo muestran errores, no éxitos
    generalRest.enableNotifications = false;
    const links = {};
    /* footerLinks.forEach((fl) => {
        links[fl.correlative] = fl.description;
    });*/

    const [socials, setSocials] = useState([]);
    const [generals, setGenerals] = useState([]);
    const [apps, setApps] = useState([]);
    const [landings, setLandings] = useState([]);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const [socialsData, generalsData, appsData, landingsData] = await Promise.all([
                    generalRest.getSocials(),
                    generalRest.getGenerals(),
                    generalRest.getApps(),
                    generalRest.getTransactionalLandings()
                ]);

                setSocials(socialsData || []);
                setGenerals(generalsData || []);
                setApps(appsData || []);
                setLandings(landingsData || []);
            } catch (error) {
                console.error("Error fetching footer data:", error);
            }
        };

        fetchFooterData();
    }, []);

    // Redes sociales
    const Facebook = socials.find(
        (social) => social.description === "Facebook"
    );
    const Twitter = socials.find((social) => social.description === "Twitter");
    const Instagram = socials.find(
        (social) => social.description === "Instagram"
    );
    const Youtube = socials.find((social) => social.description === "YouTube");
    const Tiktok = socials.find((social) => social.description === "TikTok");
    const Whatsapp = socials.find((social) => social.description === "WhatsApp");
    const LinkedIn = socials.find((social) => social.description === "LinkedIn");

    // Datos de contacto desde generals
    const getGeneralValue = (correlative) => {
        const item = generals.find(g => g.correlative === correlative);
        return item?.description || '';
    };

    const phoneContact = getGeneralValue('phone_contact');
    const emailContact = getGeneralValue('email_contact');
    const address = getGeneralValue('address');
    const openingHours = getGeneralValue('opening_hours');
    const supportPhone = getGeneralValue('support_phone');
    const whatsappPhone = getGeneralValue('whatsapp_phone');
    const supportEmail = getGeneralValue('support_email');
    const companyName = getGeneralValue('company_name') || 'Tu Cambio S.A.C.';
    const companyRuc = getGeneralValue('company_ruc') || '20603864957';
    const copyrightText = getGeneralValue('copyright') || `Cambia FX © 2019 - Marca registrada de ${companyName} - RUC: ${companyRuc}`;

    const [aboutuses, setAboutuses] = useState(null); // o useState({});

    useEffect(() => {
        const fetchAboutuses = async () => {
            try {
                const data = await generalRest.getAboutuses();
                setAboutuses(data);
            } catch (error) {
                console.error("Error fetching about:", error);
            }
        };

        fetchAboutuses();
    }, []);

    const aboutusData = aboutuses?.aboutus || [];
    const generalsData = aboutuses?.generals || [];
    const sedesData = aboutuses?.sedes || [];
    


    const cleanText = (text) => {
        if (text === null || text === undefined) return "";

        // Convertir a string y eliminar varios patrones de asteriscos
        return String(text)
            .replace(/\*\*(.*?)\*\*/g, "$1") // **texto**
            .replace(/\*(.*?)\*/g, "$1") // *texto*
            .replace(/[*]+/g, ""); // Cualquier asterisco suelto
    };
    const subscriptionsRest = new SubscriptionsRest();

    // Deshabilitar notificaciones automáticas para usar SweetAlert personalizado
    // Esto permite mostrar mensajes más amigables y consistentes con el diseño
    subscriptionsRest.enableNotifications = false;

    const emailRef = useRef();
    const emailRefMobile = useRef(); // Referencia separada para mobile
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [saving, setSaving] = useState(false);

    // Función para limpiar el formulario de suscripción
    const clearEmailForm = () => {
        // Limpiar ambos inputs
        if (emailRef.current) {
            emailRef.current.value = "";
            // Pequeña animación de limpieza
            emailRef.current.style.transform = 'scale(0.98)';
            setTimeout(() => {
                if (emailRef.current) {
                    emailRef.current.style.transform = 'scale(1)';
                }
            }, 100);
        }
        if (emailRefMobile.current) {
            emailRefMobile.current.value = "";
            // Pequeña animación de limpieza
            emailRefMobile.current.style.transform = 'scale(0.98)';
            setTimeout(() => {
                if (emailRefMobile.current) {
                    emailRefMobile.current.style.transform = 'scale(1)';
                }
            }, 100);
        }
        // También resetear el checkbox
        const checkbox = document.getElementById('terms-checkbox');
        if (checkbox) {
            checkbox.checked = false;
        }
        // Resetear el estado
        setTermsAccepted(false);
    };

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        if (saving) return; // Prevenir múltiples envíos
        
        const Swal = (await import("sweetalert2")).default;
        
        // Validar que se hayan aceptado los términos
        if (!termsAccepted) {
            Swal.fire({
                title: "Términos requeridos",
                text: "Debes aceptar la Política de Privacidad y los Términos y Condiciones para suscribirte.",
                icon: "warning",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#f59e0b"
            });
            return;
        }

        // Obtener el email del input correspondiente (desktop o mobile)
        const emailValue = emailRef.current?.value || emailRefMobile.current?.value;

        if (!emailValue || !emailValue.trim()) {
            Swal.fire({
                title: "Email requerido",
                text: "Por favor, ingresa tu email para suscribirte.",
                icon: "warning",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#f59e0b"
            });
            return;
        }

        setSaving(true);

        const request = {
            email: emailValue.trim(),
            status: 1,
        };

        try {
            const result = await subscriptionsRest.save(request);
            setSaving(false);

            if (!result) {
                // Mostrar error personalizado
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al procesar tu suscripción. Por favor, inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#d33"
                });
                return;
            }

            // Mostrar éxito personalizado
            Swal.fire({
                title: "¡Éxito!",
                text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
                icon: "success",
                confirmButtonText: "Ok",
                confirmButtonColor: "#10b981",
                timer: 4000,
                timerProgressBar: true
            });

            // Limpiar el campo del email y resetear términos
            clearEmailForm();
            
        } catch (error) {
            setSaving(false);
            console.error("Error al suscribirse:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al procesar tu suscripción. Por favor, inténtalo de nuevo.",
                icon: "error",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#d33"
            });
        }
    };


    return (
        <>
            <footer className="bg-neutral-dark text-white font-title">

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full px-[5%] py-8 lg:py-16">
                    {/* Columna 1 - Logo, App Badges y Suscripción */}
                    <div className="w-full lg:w-4/12 flex flex-col gap-6">
                        <a href="/">
                            <img
                                className="h-12 lg:h-14 w-auto"
                                src="/assets/img/logo-white.png"
                                alt="CambiaFX Logo"
                                width="144"
                                height="48"
                                loading="lazy"
                                decoding="async"
                            />
                        </a>
                        <motion.div 
                            className="flex flex-wrap gap-2"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1,
                                        delayChildren: 0.3
                                    }
                                }
                            }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {apps?.map((app, index) => (
                                <motion.a 
                                    href={app?.link} 
                                    key={index} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    variants={{
                                        hidden: { 
                                            scale: 0, 
                                            opacity: 0,
                                            rotate: -180
                                        },
                                        show: {
                                            scale: 1,
                                            opacity: 1,
                                            rotate: 0,
                                            transition: {
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20,
                                                duration: 0.6
                                            }
                                        }
                                    }}
                                    whileHover={{ 
                                        scale: 1.15, 
                                        y: -5,
                                        rotate: 5,
                                        transition: { 
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10
                                        }
                                    }}
                                    whileTap={{ 
                                        scale: 0.9,
                                        rotate: -5
                                    }}
                                >
                                    <img 
                                        src={`/api/app/media/${app?.image}`} 
                                        alt={app?.name} 
                                        width="120"
                                        height="40"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-8 lg:h-10 w-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                        onError={(e) =>
                                            (e.target.src = "/api/cover/thumbnail/null")
                                        }
                                    />
                                </motion.a>
                            ))}
                        </motion.div>
                        <motion.div 
                            className="mt-4 max-w-full lg:max-w-md"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <motion.h3 
                                className="text-lg lg:text-xl font-medium mb-2"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                Suscríbete
                            </motion.h3>
                            
                            <motion.p 
                                className="text-sm lg:text-base text-neutral mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                Recibe actualizaciones, tips de finanzas y cupones de mejor tipo de cambio.
                            </motion.p>
                            
                            <motion.form 
                                onSubmit={onEmailSubmit}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                {/* Versión Desktop - Original */}
                                <motion.div 
                                    className="hidden overflow-hidden lg:flex items-center bg-white rounded-full p-1"
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                                    }}
                                    whileFocus={{ 
                                        scale: 1.02,
                                        boxShadow: "0 0 0 3px rgba(187, 255, 82, 0.3)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.input
                                        ref={emailRef}
                                        disabled={saving}
                                        type="email"
                                        name="email"
                                        placeholder="Correo"
                                        className="flex-grow px-4 py-2 placeholder:text-neutral-light bg-transparent text-neutral-dark focus:outline-none"
                                        whileFocus={{ 
                                            scale: 1.01,
                                            transition: { duration: 0.2 }
                                        }}
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={saving || !termsAccepted}
                                        className={`font-bold text-sm px-6 py-3 rounded-full transition-colors ${
                                            !termsAccepted 
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                                : 'bg-secondary text-neutral-light hover:bg-[#b7f556]'
                                        }`}
                                        whileHover={termsAccepted ? { 
                                            scale: 1.05,
                                            backgroundColor: "#b7f556"
                                        } : {}}
                                        whileTap={termsAccepted ? { scale: 0.95 } : {}}
                                        animate={saving ? {
                                            scale: [1, 1.05, 1],
                                            transition: {
                                                duration: 0.5,
                                                repeat: Infinity
                                            }
                                        } : {}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {saving ? 'Enviando...' : 'SUSCRIBIRME'}
                                    </motion.button>
                                </motion.div>

                                {/* Versión Mobile - Separada */}
                                <div className="block lg:hidden space-y-3">
                                    <motion.input
                                        ref={emailRefMobile}
                                        disabled={saving}
                                        type="email"
                                        name="email-mobile"
                                        placeholder="Correo electrónico"
                                        className="w-full px-4 py-3 placeholder:text-neutral-light bg-white text-neutral-dark focus:outline-none rounded-full border-2 border-transparent focus:border-secondary transition-colors"
                                        whileFocus={{ 
                                            scale: 1.02,
                                            transition: { duration: 0.2 }
                                        }}
                                        whileHover={{
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                        }}
                                    />
                                    
                                    <motion.button
                                        type="submit"
                                        disabled={saving || !termsAccepted}
                                        className={`w-full font-bold text-sm px-6 py-3 rounded-full transition-all duration-300 ${
                                            !termsAccepted 
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                                : 'bg-secondary text-neutral-dark hover:bg-[#b7f556] shadow-lg hover:shadow-xl'
                                        }`}
                                        whileHover={termsAccepted ? { 
                                            scale: 1.02,
                                            y: -2
                                        } : {}}
                                        whileTap={termsAccepted ? { scale: 0.98 } : {}}
                                        animate={saving ? {
                                            scale: [1, 1.02, 1],
                                            transition: {
                                                duration: 0.8,
                                                repeat: Infinity
                                            }
                                        } : {}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {saving ? 'Enviando...' : 'SUSCRIBIRME'}
                                    </motion.button>
                                </div>
                            </motion.form>
                            
                            <motion.div 
                                className="flex items-center mt-4 space-x-3"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                            >
                                {/* Checkbox customizado */}
                                <motion.div
                                    className="relative flex-shrink-0"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <input
                                        type="checkbox"
                                        id="terms-checkbox"
                                        name="terms-accepted"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <motion.div
                                        className={`w-5 h-5 rounded-md border-2 cursor-pointer transition-all duration-300 ${
                                            termsAccepted
                                                ? 'bg-secondary border-secondary shadow-lg shadow-secondary/25'
                                                : 'bg-white border-neutral-light hover:border-secondary hover:shadow-sm'
                                        }`}
                                        onClick={() => setTermsAccepted(!termsAccepted)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        animate={{
                                            backgroundColor: termsAccepted ? '#BBFF52' : '#ffffff',
                                            borderColor: termsAccepted ? '#BBFF52' : '#9CA3AF'
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <AnimatePresence>
                                            {termsAccepted && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.3 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.3 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                >
                                                    <svg
                                                        className="w-3 h-3 text-neutral-dark"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                                
                                <motion.label 
                                    htmlFor="terms-checkbox" 
                                    className="text-xs text-neutral cursor-pointer leading-tight"
                                    whileHover={{ 
                                        color: "#BBFF52",
                                        x: 2
                                    }}
                            transition={{ duration: 0.2 }}
                                >
                                    He leído y acepto la Política de Privacidad y los Términos y Condiciones
                                </motion.label>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Contenedor de las Columnas de la derecha */}
                    <div className="w-full lg:w-8/12 flex flex-col sm:flex-row lg:flex-row lg:flex-wrap lg:justify-between gap-6 lg:gap-0">
                            {/* Columna 2 - Horario de Atención */}
                            <div className="w-full sm:w-1/3 lg:w-[28%] flex flex-col gap-2 text-sm pb-4 lg:pb-8">
                                <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">
                                    Horario de Atención
                                </h3>
                                {openingHours ? (
                                    <div className="whitespace-pre-line">
                                        {openingHours.split('\n').map(line => line.replace(/:/, ':\n')).join('\n')}
                                    </div>
                                ) : (
                                    <>
                                        <p><strong className="font-medium">Lunes a viernes:</strong><br />9:00 a.m. - 7:00 p.m.</p>
                                        <p className="mt-2"><strong className="font-medium">Sábados:</strong><br />10:00 a.m. - 1:00 p.m.</p>
                                        <p className="mt-2"><strong className="font-medium">Otros Horarios:</strong><br />Abonamos el día siguiente hábil</p>
                                        <p className="mt-2"><strong className="font-medium">No atendemos:</strong><br />Domingos y feriados</p>
                                    </>
                                )}
                            </div>

                            {/* Columna 3 - Tipo de Cambio (Páginas Transaccionales) */}
                            {landings && landings.filter(l => l.visible !== false && l.visible !== 0).length > 0 && (
                                <div className="w-full sm:w-1/3 lg:w-[35%] flex flex-col gap-2 text-sm pb-4 lg:pb-8">
                                    <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">
                                        Cambia Dólares Online
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {landings.filter(l => l.visible !== false && l.visible !== 0).map((landing, index) => (
                                            <a
                                                key={index}
                                                href={`/${landing.url}`}
                                                className="cursor-pointer hover:text-secondary transition-colors text-xs lg:text-sm font-light"
                                            >
                                                {landing.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Columna 4 - Legal */}
                            <div className="w-full sm:w-1/3 lg:w-[32%] flex flex-col gap-2 text-sm">
                                <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">
                                    Legal
                                </h3>
                                <a href="/legal/politicas-de-privacidad" className="cursor-pointer hover:text-secondary transition-colors">Política de Privacidad</a>
                                <a href="/legal/terminos-y-condiciones" className="cursor-pointer hover:text-secondary transition-colors">Términos y Condiciones</a>
                                <a href="/libro-de-reclamaciones" className="cursor-pointer hover:text-secondary transition-colors">Libro de Reclamaciones</a>
                                <div className="mt-4">
                                    <p className="font-medium">Registrada en la SBS</p>
                                    <p>Resolución 04993-2018</p>
                                </div>

                                 {/* Columna 5 - Contacto */}
                                <div className="w-full flex flex-col gap-4 text-sm mt-4">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.3481 17.8052C10.9867 18.1435 10.5037 18.3327 10.0009 18.3327C9.49817 18.3327 9.01517 18.1435 8.65375 17.8052C5.34418 14.6877 0.908967 11.2051 3.07189 6.14907C4.24136 3.41532 7.04862 1.66602 10.0009 1.66602C12.9532 1.66602 15.7605 3.41532 16.93 6.14907C19.0902 11.1988 14.6658 14.6984 11.3481 17.8052Z" fill="white" stroke="#0C0C0C" strokeWidth="1.25" />
                                            <path d="M12.9173 9.16667C12.9173 10.7775 11.6115 12.0833 10.0007 12.0833C8.38982 12.0833 7.08398 10.7775 7.08398 9.16667C7.08398 7.55583 8.38982 6.25 10.0007 6.25C11.6115 6.25 12.9173 7.55583 12.9173 9.16667Z" fill="#1A1A1A" />
                                        </svg>

                                        <div className="whitespace-pre-line text-xs lg:text-sm">
                                            {address || "Av. Javier Prado Este N.560,\nOficina 2302 San Isidro - Lima - Perú"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.67916 11.229C1.73363 13.7837 1.76087 15.0609 2.70348 16.0072C3.64608 16.9534 4.95796 16.9863 7.58171 17.0522C9.19877 17.0928 10.7999 17.0928 12.417 17.0522C15.0408 16.9863 16.3526 16.9534 17.2953 16.0072C18.2378 15.0609 18.2651 13.7837 18.3195 11.229C18.3371 10.4076 18.3371 9.5911 18.3195 8.76968C18.2651 6.21507 18.2378 4.93776 17.2953 3.99157C16.3526 3.04537 15.0408 3.01242 12.417 2.94649C10.7999 2.90586 9.19876 2.90586 7.5817 2.94648C4.95796 3.0124 3.64608 3.04536 2.70347 3.99156C1.76087 4.93775 1.73363 6.21506 1.67915 8.76968C1.66163 9.5911 1.66164 10.4076 1.67916 11.229Z" fill="white" stroke="#1A1A1A" strokeWidth="1.25" strokeLinejoin="round" />
                                            <path d="M1.66797 5L7.42882 8.26414C9.55264 9.4675 10.45 9.4675 12.5738 8.26414L18.3346 5" stroke="#1A1A1A" strokeWidth="1.25" strokeLinejoin="round" />
                                        </svg>

                                        <a href={`mailto:${emailContact || 'hola@cambiafx.pe'}`} className="hover:text-secondary transition-colors text-xs lg:text-sm">{emailContact || 'hola@cambiafx.pe'}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <div className="">
                    <div className="w-full px-[5%] mx-auto">
                        <div className="h-0.5 bg-neutral"></div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between items-center w-full px-[5%] py-4 text-center lg:text-left gap-4 lg:gap-0">
                        <p className="text-sm lg:text-base text-neutral mb-0">
                            {copyrightText}
                        </p>
                        <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-center">
                            {(phoneContact || supportPhone) && (
                                <a 
                                    href={`tel:${phoneContact || supportPhone}`} 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="Llamar"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                                </a>
                            )}
                            {Facebook?.link && (
                                <a 
                                    href={Facebook.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="Facebook"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                            )}
                            {Instagram?.link && (
                                <a 
                                    href={Instagram.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="Instagram"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                            )}
                            {Twitter?.link && (
                                <a 
                                    href={Twitter.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="Twitter"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            )}
                            {LinkedIn?.link && (
                                <a 
                                    href={LinkedIn.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="LinkedIn"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                            )}
                            {Youtube?.link && (
                                <a 
                                    href={Youtube.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="YouTube"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                            )}
                            {Tiktok?.link && (
                                <a 
                                    href={Tiktok.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="TikTok"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                                </a>
                            )}
                            {(Whatsapp?.link || whatsappPhone) && (
                                <a 
                                    href={Whatsapp?.link || `https://wa.me/${whatsappPhone?.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors"
                                    title="WhatsApp"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
