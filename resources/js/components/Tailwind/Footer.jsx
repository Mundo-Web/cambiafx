import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../Utils/HtmlContent";
import GeneralRest from "../../actions/GeneralRest";
import { Send } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../Actions/SubscriptionsRest";
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

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                setSocials(data);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        const fetchGenerals = async () => {
            try {
                const data = await generalRest.getGenerals();
                setGenerals(data);
            } catch (error) {
                console.error("Error fetching generals:", error);
            }
        };

        const fetchApps = async () => {
            try {
                const data = await generalRest.getApps();
                setApps(data);
            } catch (error) {
                console.error("Error fetching apps:", error);
            }
        };

        fetchSocials();
        fetchGenerals();
        fetchApps();
    }, []); // Asegúrate de que este array de dependencias está vacío si solo se ejecuta una vez

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
                    <div className="w-full lg:w-6/12 flex flex-col gap-6">
                        <a href="/">
                            <img
                                className="h-12 lg:h-14"
                                src="/assets/img/logo-white.png"
                                alt="CambiaFX Logo"
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
                                    <motion.img 
                                        src={`/api/app/media/${app?.image}`} 
                                        alt={app?.name} 
                                        className="h-8 lg:h-10 rounded-lg shadow-md"
                                        onError={(e) =>
                                            (e.target.src = "/api/cover/thumbnail/null")
                                        }
                                        animate={{
                                            boxShadow: [
                                                "0 4px 8px rgba(0,0,0,0.1)",
                                                "0 6px 12px rgba(0,0,0,0.15)",
                                                "0 4px 8px rgba(0,0,0,0.1)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
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

                    {/* Columna 2 - Horario de Atención */}
                    <div className="w-full lg:w-6/12 flex flex-col lg:flex-row lg:flex-wrap lg:justify-end gap-6 lg:gap-0">
                        <div className="w-full lg:w-6/12 flex flex-col gap-2 text-sm pb-4 lg:pb-8">
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

                        {/* Columna 3 - Legal */}
                        <div className="w-full lg:w-5/12 flex flex-col gap-2 text-sm">
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

                             {/* Columna 4 - Contacto */}
                        <div className="w-full  flex flex-col gap-4 text-sm mt-4">
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
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="Llamar"
                                >
                                    <i className="fa-solid fa-phone"></i>
                                </a>
                            )}
                            {Facebook?.link && (
                                <a 
                                    href={Facebook.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="Facebook"
                                >
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                            )}
                            {Instagram?.link && (
                                <a 
                                    href={Instagram.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="Instagram"
                                >
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            )}
                            {Twitter?.link && (
                                <a 
                                    href={Twitter.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="Twitter"
                                >
                                    <i className="fa-brands fa-twitter"></i>
                                </a>
                            )}
                            {LinkedIn?.link && (
                                <a 
                                    href={LinkedIn.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="LinkedIn"
                                >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                            )}
                            {Youtube?.link && (
                                <a 
                                    href={Youtube.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="YouTube"
                                >
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            )}
                            {Tiktok?.link && (
                                <a 
                                    href={Tiktok.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="TikTok"
                                >
                                    <i className="fa-brands fa-tiktok"></i>
                                </a>
                            )}
                            {(Whatsapp?.link || whatsappPhone) && (
                                <a 
                                    href={Whatsapp?.link || `https://wa.me/${whatsappPhone?.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-secondary text-neutral-dark w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-[#b7f556] transition-colors text-sm"
                                    title="WhatsApp"
                                >
                                    <i className="fa-brands fa-whatsapp"></i>
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
