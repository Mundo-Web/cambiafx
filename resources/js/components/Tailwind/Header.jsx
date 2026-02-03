import { motion, AnimatePresence } from "framer-motion";
import Tippy from "@tippyjs/react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import GeneralRest from "../../actions/GeneralRest";
import { TbBrush } from "react-icons/tb";
import { ArrowRight, Trash2 } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { LanguageContext } from "../../context/LanguageContext";
import LanguageDropdown from "./Header/LanguageDropdown";
import MegaMenuPopup from "./Header/MegaMenuPopup";
import WhatsAppButton, { WhatsAppButtonWithArrow } from "../Shared/WhatsAppButton";
import Global from "../../Utils/Global";

const generalRest = new GeneralRest();

// Variantes de animación
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
    hidden: { y: -20, opacity: 100 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
        },
    },
};

const cartItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        x: -50,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const Header = ({
    session,
    showSlogan = true,
    gradientStart,
    menuGradientEnd,
    backgroundType = "none",
    backgroundSrc = "",
    backgroundHeight = "h-full",
    backgroundPosition = "object-top",
    children,
}) => {
    const { t, loading, error } = useTranslation();
    /*  if (loading) {
        return <div className="text-center py-4">Cargando menú...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3">
                Error cargando traducciones: {error}
            </div>
        );
    }*/
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const btnToggleRef = useRef(null);
    const { incrementarCantidad, decrementarCantidad } =
        useContext(CarritoContext);

    const toggleMenu = (event) => {
        if (event.target.closest(".menu-toggle")) {
            setIsOpen(!isOpen);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                btnToggleRef.current == event.target ||
                btnToggleRef.current.contains(event.target)
            )
                return;
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { carrito, eliminarProducto } = useContext(CarritoContext);
    const [animar, setAnimar] = useState(false);
    const totalProductos = carrito.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc + item.variations.reduce((sum, v) => sum + v.quantity, 0)
            );
        }
        return acc + item.quantity;
    }, 0);

    useEffect(() => {
        if (totalProductos > 0) {
            setAnimar(true);
            setTimeout(() => setAnimar(false), 500);
        }
    }, [totalProductos]);

    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const totalPrecio = carrito.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc +
                item.variations.reduce(
                    (sum, v) => sum + item.final_price * v.quantity,
                    0
                )
            );
        }
        return acc + item.final_price * item.quantity;
    }, 0);

    const [socials, setSocials] = useState([]);
    const [languagesSystem, setLanguagesSystem] = useState([]);
    const [generals, setGenerals] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [modalData, setModalData] = useState([]);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                const dataGenerals = await generalRest.getGenerals();
                const dataServices = await generalRest.getServices();
                const dataModal = await generalRest.getModal();

                //const languages = await generalRest.getLanguages();
                setSocials(data);
                setGenerals(dataGenerals);

                setServicesData(dataServices);
                setModalData(dataModal);
                //  setLanguagesSystem(languages);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        fetchSocials();
    }, []);

    const TikTok = socials.find((social) => social.description === "TikTok");
    const WhatsApp = socials.find(
        (social) => social.description === "WhatsApp"
    );
    const Instagram = socials.find(
        (social) => social.description === "Instagram"
    );
    const Facebook = socials.find(
        (social) => social.description === "Facebook"
    );
    const LinkedIn = socials.find(
        (social) => social.description === "LinkedIn"
    );
    const YouTube = socials.find((social) => social.description === "YouTube");

    const [activeLink, setActiveLink] = useState("/");

    const ContactNumber = generals.find((general) => general.correlative === "phone_contact");
    const ContactEmail = generals.find((general) => general.correlative === "email_contact");

    const Cintillo = generals.find((general) => general.correlative === "cintillo");

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveLink(currentPath);
    }, []);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const isActive = (path) => {
        return activeLink === path;
    };

    const { currentLanguage, changeLanguage } = useContext(LanguageContext);
    const [selectLanguage, setSelectLanguage] = useState(
        currentLanguage || languagesSystem[0]
    );

    useEffect(() => {
        if (currentLanguage) {
            setSelectLanguage(currentLanguage);
        } else if (languagesSystem.length > 0) {
            setSelectLanguage(languagesSystem[0]);
        }
    }, [currentLanguage, languagesSystem]);
    const onUseLanguage = async (langData) => {
        try {
            // Obtén el token CSRF de las cookies automáticamente
            const response = await fetch("/set-current-lang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfTokenFromCookie(), // Función para obtenerlo
                },
                body: JSON.stringify({ lang_id: langData.id }),
                credentials: "include", // Permite enviar cookies
            });

            if (response.ok) {
                await changeLanguage(langData); // ✅ Agrega await aquí
                setSelectLanguage(langData);
                window.location.reload(); // ⚠️ Opcional temporal para forzar actualización
            } else {
              //
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    // Función para extraer el token de la cookie
    const getCsrfTokenFromCookie = () => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return cookie ? decodeURIComponent(cookie[1]) : null;
    };


    const [activeMegaMenu, setActiveMegaMenu] = useState(null);

    useEffect(() => {
        if (activeMegaMenu) {
            document.body.style.overflow = 'hidden';
            // Opcional: también podrías querer prevenir el scroll del touch en móviles
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
    }, [activeMegaMenu]);

    const toggleMegaMenu = (path) => {
        // Si ya está abierto, ciérralo
        if (activeMegaMenu === path) {
            setActiveMegaMenu(null);
        } else if (["#services"].includes(path)) {
            setActiveMegaMenu(path);
        } else {
            setActiveMegaMenu(null); // Cierra si es otra ruta
        }
    };

    const closeMegaMenu = () => setActiveMegaMenu(null);
    const renderHighlightedText = (textToRender) => {
        if (!textToRender) return null;
        const parts = textToRender.split(/(\*[^*]+\*)/g); // separa todo lo entre *...*
        return parts.map((part, index) =>
            part.startsWith("*") && part.endsWith("*") ? (
                <span key={index} className={`text-secondary`}>
                    {part.slice(1, -1)}
                </span>
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };
    return (
        <>
            <div className={`w-full max-w-full relative font-paragraph ${backgroundHeight} z-[9999]`}>
                {/* CINTILLO INICIO */}
                <div className="bg-accent relative  overflow-hidden text-white text-xs md:text-sm py-2 md:py-3">
                    <div className="absolute top-0 -left-4 flex justify-end w-full h-full   lg:z-[9999] pointer-events-none">
                        <img
                            src={`/assets/cambiafx/cintillo-overlay.png`}
                            alt="overlay Image"
                            className="h-full  object-cover rounded-xl "
                        />
                        
                    </div>
                    <div className="px-[5%] mx-auto  flex flex-row items-center justify-center ">
                        <div className="flex items-center gap-2 relative max-w-max">


                            <img src="/assets/cambiafx/cintillo.webp" alt="Cintillo Icon" className="w-10 z-[999]  absolute top-0 -left-10 transform scale-y-[-1] rotate-90" />
                            <div className="overflow-hidden whitespace-nowrap w-full relative"
                            
                            
                            >
                                {/*agregar overlay que este transparente y finalize en bg-accent */}

                                <div 
                                    className="absolute w-10 h-full z-[999] bg-gradient-to-l from-transparent to-accent"
                                  
                                ></div>
                                <div className="relative">
                                    <motion.h1
                                        animate={{ x: [0, "-100%"] }}
                                        transition={{
                                            x: {
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 10,
                                                ease: "linear",
                                            },
                                        }}
                                        className="font-bold text-sm absolute whitespace-nowrap"
                                    >
                                        {renderHighlightedText(Cintillo?.description)}
                                    </motion.h1>
                                    <motion.h1
                                        animate={{ x: ["100%", "0%"] }}
                                        transition={{
                                            x: {
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 10,
                                                ease: "linear",
                                            },
                                        }}
                                        className="font-bold ml-4 text-sm absolute whitespace-nowrap"
                                    >
                                        {renderHighlightedText(Cintillo?.description)}
                                    </motion.h1>
                                    <h1 className="font-bold ml-4 text-sm opacity-0 whitespace-nowrap">
                                        {renderHighlightedText(Cintillo?.description)}
                                    </h1>
                                </div>
                                 
                            </div>
                        </div>
                    </div>
                </div>
                {/* CINTILLO FIN */}
                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className={` static lg:w-full top-0 z-[9998] transition-colors duration-300 py-1 ${backgroundType === "none"
                        ? "bg-primary mt-0"
                        : isScrolled
                            ? "bg-primary pt-0 !mt-0"
                            : "bg-primary top-4 pt-8 md:pt-14 lg:pt-10"
                        } ${isScrolled &&
                        "bg-primary pt-0 !mt-0 transition-all duration-150"
                        }`}
                >
                    <div
                        className={`px-[5%] w-full py-4 lg:py-0 flex justify-between items-center text-[#3E2F4D] shadow-lg lg:shadow-none`}
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center"
                        >
                            <a href="/">
                                <motion.img
                                    whileHover={{ 
                                        scale: 1.08,
                                        y: -2,
                                        filter: "drop-shadow(0 0 10px rgba(187, 255, 82, 0.4))"
                                    }}
                                    whileTap={{ scale: 0.96 }}
                                    animate={{
                                        y: [0, -2, 0],
                                    }}
                                    transition={{
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        scale: { duration: 0.2 },
                                        filter: { duration: 0.3 }
                                    }}
                                    src="/assets/img/logo.svg"
                                    alt={Global.APP_NAME}
                                    fetchpriority="high"
                                    className="object-cover object-top h-12 max-h-12 w-auto sm:h-12 sm:max-h-12 transition-all duration-300"
                                />
                            </a>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="hidden xl:flex py-6 mx-auto justify-center items-center font-normal text-base"
                        >
                            <nav className="flex gap-2">
                                {[
                                    "/nosotros",
                                    "/servicios",
                                    "/contacto",
                                    "/blog",
                                ].map((path) => {
                                    const text = {
                                        "/nosotros": t("public.header.home", "Nosotros"),
                                        "/servicios": t(
                                            "public.header.services",
                                            "Servicios"
                                        ), "/contacto": t(
                                            "public.header.contact",
                                            "Contacto"
                                        ),

                                        "/blog": t(
                                            "public.header.options",
                                            "Blog"
                                        ),


                                    }[path];

                                    return (
                                        <div key={path} className="relative">
                                            <motion.a
                                                key={path}
                                                href={path}
                                                onClick={(e) => {
                                                    if (path.startsWith('#')) {
                                                        e.preventDefault();
                                                        toggleMegaMenu(path);
                                                        handleLinkClick(path);
                                                    } else {
                                                        // Para URLs normales, navega directamente
                                                        handleLinkClick(path);
                                                        window.location.href = path;
                                                    }
                                                }}
                                                variants={itemVariants}
                                                whileHover={{ 
                                                    scale: 1.06,
                                                    y: -2,
                                                    boxShadow: "0 10px 25px rgba(126, 90, 251, 0.25)"
                                                }}
                                                whileTap={{ 
                                                    scale: 0.95,
                                                    y: 0
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 17
                                                }}
                                                className={`relative uppercase py-2 rounded-full transition-all duration-300 ${isActive(path)
                                                    ? "bg-constrast pl-7 pr-3 text-white font-semibold shadow-lg"
                                                    : "bg-transparent px-5 text-neutral-dark hover:bg-gradient-to-r hover:from-primary/50 hover:to-neutral/30"
                                                    }`}
                                            >
                                                {text}
                                                {isActive(path) && (
                                                    <motion.span
                                                        layoutId="activeDot"
                                                        initial={{ scale: 0 }}
                                                        animate={{ 
                                                            scale: [1, 1.1, 1],
                                                            boxShadow: [
                                                                "0 0 0 0 rgba(187, 255, 82, 0.7)",
                                                                "0 0 0 8px rgba(187, 255, 82, 0.2)",
                                                                "0 0 0 0 rgba(187, 255, 82, 0)"
                                                            ]
                                                        }}
                                                        transition={{
                                                            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                                                            boxShadow: { 
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }
                                                        }}
                                                        className="absolute left-3 top-[40%] -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-secondary rounded-full"
                                                    />
                                                )}
                                            </motion.a>
                                            <AnimatePresence>
                                                {activeMegaMenu === path && (
                                                    <div className="">
                                                        <MegaMenuPopup
                                                            info={modalData}
                                                            isOpen={activeMegaMenu === path}
                                                            onClose={closeMegaMenu}
                                                            data={servicesData}
                                                        />
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </nav>
                        </motion.div>

                        {/*
                        <motion.div
                            variants={itemVariants}
                            className="flex h-full items-center gap-4 justify-end mr-4"
                        >
                            <LanguageDropdown 
                                languagesSystem={languagesSystem} 
                                selectLanguage={selectLanguage} 
                                onUseLanguage={onUseLanguage} 
                            />
                        </motion.div> */}

                        <motion.div
                            variants={itemVariants}
                            className="hidden xl:flex gap-4 justify-center items-center _Medium"
                        >
                            {/*  <WhatsAppButtonWithArrow
                                variant="primary"
                                size="medium"
                                className="text-base 2xl:text-lg"
                            >
                                Reserva una consulta
                            </WhatsAppButtonWithArrow> */}
                            <motion.a 
                            href="https://mi.cambiafx.pe/registro" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                whileHover={{ 
                                    scale: 1.06,
                                    y: -2,
                                    boxShadow: "0 10px 25px rgba(126, 90, 251, 0.3)"
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    y: 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className="py-3 px-4 bg-constrast uppercase text-sm font-medium text-white rounded-full relative overflow-hidden group"
                            >
                                <span className="relative z-10">
                                    ¿Eres nuevo? regístrate
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-constrast/90 to-accent/90 opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                            <motion.a 
                                href="https://mi.cambiafx.pe/login" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                whileHover={{ 
                                    scale: 1.06,
                                    y: -2,
                                    boxShadow: "0 10px 25px rgba(187, 255, 82, 0.3)"
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    y: 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className="py-3 px-4 bg-secondary uppercase text-sm font-medium text-neutral-dark rounded-full relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    iniciar operación
                                    <motion.svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        animate={{
                                            rotate: [0, 360]
                                        }}
                                        transition={{
                                            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                                        }}
                                    >
                                        <path 
                                            d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round"
                                        />
                                        <circle 
                                            cx="12" 
                                            cy="12" 
                                            r="3" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        />
                                        <path 
                                            d="M12 9C10.34 9 9 10.34 9 12S10.34 15 12 15" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        />
                                    </motion.svg>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/90 opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="xl:hidden text-base"
                        >
                            <div>
                                <motion.button
                                    ref={btnToggleRef}
                                    onClick={toggleMenu}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ 
                                        scale: 1.06,
                                        boxShadow: "0 8px 20px rgba(126, 90, 251, 0.3)"
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut"
                                    }}
                                    className="text-white menu-toggle rounded-xl h-[50px] w-[50px] flex items-center justify-center bg-constrast shadow-lg border border-white/20"
                                    aria-label="Toggle menu"
                                >
                                    <div className="text-white relative z-10">
                                        {isOpen ? (
                                            <svg 
                                                className="w-6 h-6" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <svg 
                                                className="w-6 h-6" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        )}
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>


                </motion.header>

                {/* Menú móvil */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Overlay con blur */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999999]"
                                style={{ zIndex: 99998 }}
                                onClick={() => setIsOpen(false)}
                            />

                            <motion.div
                                ref={menuRef}
                                initial={{ opacity: 0, y: -100, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -100, scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 200,
                                    duration: 0.4
                                }}
                                className={`fixed left-[5%] right-[5%] ${isScrolled
                                    ? "top-16"
                                    : "top-[100px]"
                                    } z-[99999999] bg-gradient-to-br from-white via-white to-blue-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto`}
                                style={{ zIndex: 99999999 }}
                            >
                                {/* Header del menú */}
                                <div className="bg-gradient-to-r from-accent to-constrast p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">Navegación</h3>
                                            <p className="text-sm opacity-90">Explora nuestros servicios</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsOpen(false)}
                                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Contenido del menú */}
                                <div className="p-6 min-h-[200px]">
                                    <motion.ul
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-3"
                                        style={{ opacity: 1, visibility: 'visible' }}
                                    >
                                        {[
                                            
                                
                                
                                            { path: "/nosotros", color: "bg-white" },
                                            { path: "/servicios", color: "bg-white" },
                                            { path: "/contacto", color: "bg-white" },
                                            { path: "/blog", color: "bg-white" },
                                          
                                        ].map((item, index) => {
                                            const text = {
                                                "/nosotros": t("public.header.home", "Nosotros"),
                                                "/servicios": t("public.header.services", "Servicios"),
                                                "/contacto": t("public.header.contact", "Contacto"),
                                                "/blog": t("public.header.options", "Blog"),
                                            }[item.path];

                                            return (
                                                <motion.li
                                                    key={item.path}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{ opacity: 1, visibility: 'visible' }}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (item.path.startsWith('#')) {
                                                                if (item.hasSubmenu) {
                                                                    toggleMegaMenu(item.path);
                                                                }
                                                                handleLinkClick(item.path);
                                                            } else {
                                                                handleLinkClick(item.path);
                                                                window.location.href = item.path;
                                                                setIsOpen(false);
                                                            }
                                                        }}
                                                        aria-label={`Navegar a ${item.label}`}
                                                        className={`w-full group relative overflow-hidden flex items-center p-4 rounded-xl transition-all duration-300 ${isActive(item.path) || activeMegaMenu === item.path
                                                            ? "bg-accent text-white border-2 border-accent shadow-lg"
                                                            : "bg-gray-50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 text-gray-700 hover:text-primary border-2 border-transparent"
                                                            }`}
                                                    >
                                                        {/* Texto */}
                                                        <div className="flex-1 text-left">
                                                            <span className={`font-medium text-base ${isActive(item.path) || activeMegaMenu === item.path ? "!text-white" : "!text-gray-700 group-hover:!text-primary"
                                                                }`} style={{ opacity: 1, visibility: 'visible' }}>
                                                                {text || item.path}
                                                            </span>
                                                            {item.path === "#services" && (
                                                                <p className={`text-xs mt-1 ${isActive(item.path) || activeMegaMenu === item.path ? "text-white/80" : "text-gray-500"
                                                                    }`} style={{ opacity: 1, visibility: 'visible' }}>
                                                                    Descubre nuestras soluciones
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Flecha o indicador de submenú */}
                                                        <motion.div
                                                            className={`transition-colors duration-300 ${isActive(item.path) || activeMegaMenu === item.path ? "text-white" : "text-gray-400 group-hover:text-primary"
                                                                }`}
                                                        >
                                                            {item.hasSubmenu ? (
                                                                <motion.div
                                                                    animate={{ rotate: activeMegaMenu === item.path ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </motion.div>
                                                            ) : (
                                                                <ArrowRight className="w-5 h-5" />
                                                            )}
                                                        </motion.div>
                                                    </button>

                                                    {/* Submenú de servicios para móvil */}
                                                    <AnimatePresence>
                                                        {item.hasSubmenu && activeMegaMenu === item.path && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="mt-3 overflow-hidden"
                                                            >
                                                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                                        Nuestros Servicios
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 gap-2">
                                                                        {servicesData && servicesData.slice(0, 6).map((service, serviceIndex) => (
                                                                            <motion.button
                                                                                key={serviceIndex}
                                                                                onClick={() => {
                                                                                    window.location.href = `/servicio/${service.slug || service.id}`;
                                                                                    setIsOpen(false);
                                                                                }}
                                                                                whileHover={{ scale: 1.02 }}
                                                                                whileTap={{ scale: 0.98 }}
                                                                                className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-100 hover:border-blue-200 text-left w-full"
                                                                            >
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-medium text-gray-800 text-sm truncate">
                                                                                        {service.name || service.title}
                                                                                    </p>
                                                                                    {service.description && (
                                                                                        <p className="text-xs text-gray-500 truncate">
                                                                                            {service.description.substring(0, 50)}...
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                </svg>
                                                                            </motion.button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.li>
                                            );
                                        })}
                                    </motion.ul>

                                    {/* CTA Button */}
                                        <motion.div
                            variants={itemVariants}
                            className=" flex flex-col gap-4 mt-8 w-full"
                        >
                           
                            <motion.a 
                            href="https://mi.cambiafx.pe/registro" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                whileHover={{ 
                                    scale: 1.06,
                                    y: -2,
                                    boxShadow: "0 10px 25px rgba(126, 90, 251, 0.3)"
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    y: 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className="py-3 px-4 flex items-center justify-center bg-constrast uppercase text-sm font-medium text-white rounded-full relative overflow-hidden group"
                            >
                                <span className="relative z-10">
                                    ¿Eres nuevo? regístrate
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-constrast/90 to-accent/90 opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                            <motion.a 
                                href="https://mi.cambiafx.pe/login" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                whileHover={{ 
                                    scale: 1.06,
                                    y: -2,
                                    boxShadow: "0 10px 25px rgba(187, 255, 82, 0.3)"
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    y: 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className="py-3 px-4 flex items-center justify-center bg-secondary uppercase text-sm font-medium text-neutral-dark rounded-full relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    iniciar operación
                                    <motion.svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        animate={{
                                            rotate: [0, 360]
                                        }}
                                        transition={{
                                            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                                        }}
                                    >
                                        <path 
                                            d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round"
                                        />
                                        <circle 
                                            cx="12" 
                                            cy="12" 
                                            r="3" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        />
                                        <path 
                                            d="M12 9C10.34 9 9 10.34 9 12S10.34 15 12 15" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        />
                                    </motion.svg>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/90 opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                        </motion.div>

                               
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Contenido dinámico */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center text-center text-white p-6"
                    >
                        {children}
                    </motion.div>
                )}

                {/* Modal Carrito */}
                <AnimatePresence>
                    {mostrarCarrito && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-start justify-end px-[5%] lg:px-0 pt-12 pb-12 overflow-y-auto z-50 scrollbar-hide"
                        >
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-[#EFE5FF] shadow-lg w-full sm:max-w-[380px] lg:max-w-[700px] 2xl:max-w-[800px] h-max p-8 lg:p-14 rounded-[30px] lg:rounded-[50px]"
                            >
                                {/* Encabezado */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-[24.67px] lg:text-[44.67px] font-bold">
                                        Tu Carrito
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMostrarCarrito(false)}
                                        className="text-lg font-bold text-[#5F48B7]"
                                    >
                                        ✖
                                    </motion.button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-[#9C79D4] py-2 text-[13.95px] md:text-[16.95px] lg:text-[26.95px] mt-4 mb-8 text-center rounded-[14px] lg:rounded-[20px] text-white"
                                >
                                    ¡Tienes envío gratis en lima!{" "}
                                    <motion.img
                                        animate={{ rotate: [0, 15, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                        }}
                                        src="/assets/img/emojis/motor-scooter.png"
                                        className="h-[16.88px] lg:h-[26.88px] inline-flex ml-2"
                                    />{" "}
                                </motion.div>

                                {/* Lista de productos con Scroll */}
                                <div className="flex-1 gap-4">
                                    {carrito.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full flex flex-col items-center justify-center gap-5 text-3xl h-max my-5"
                                        >
                                            <img
                                                src="/assets/img/logo.png"
                                                alt="Wefem"
                                                className="h-[58px] w-[330.55px] object-cover object-top"
                                                style={{
                                                    textShadow:
                                                        "0px 4px 7.5px 0px #00000040",
                                                }}
                                            />
                                            <p className="text-center text-gray-500">
                                                Tu carrito está vacío
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <AnimatePresence>
                                            {carrito.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={cartItemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                    className="flex items-center gap-4 mb-4 w-full"
                                                >
                                                    <motion.img
                                                        layout
                                                        src={`/api/items/media/${item.image}`}
                                                        alt={item.name}
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                        }
                                                        className="w-20 h-20 md:w-28 md:h-28 lg:w-52 lg:h-52 object-cover rounded-lg"
                                                    />
                                                    <div className="flex flex-col w-[calc(100%-5rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-10rem)]">
                                                        <div className="w-full flex">
                                                            <div className="w-5/6 lg:w-8/12">
                                                                <h3 className="text-[17.95px] md:text-[20.95px] lg:text-[24.95px] 2xl:text-[34.95px] font-normal leading-3 md:leading-[20.78px] lg:leading-[30.78px]">
                                                                    {item.name}
                                                                </h3>
                                                                {item.summary && (
                                                                    <p className="text-[10px] md:text-xs lg:text-[16.81px] 2xl:text-[25px] font-light inline-flex">
                                                                        (
                                                                        {
                                                                            item.summary
                                                                        }
                                                                        )
                                                                    </p>
                                                                )}

                                                                {item.discount && (
                                                                    <motion.p
                                                                        whileHover={{
                                                                            scale: 1.02,
                                                                        }}
                                                                        className="w-11/12 md:w-full h-[18.55px] md:h-[25.55px] lg:h-[35.55px] bg-[#212529] text-white rounded-[5.44px] mb-2 md:my-2 lg:my-4 flex items-center justify-center text-[8.65px] md:text-[9.65px] 2xl:text-[16.65px] font-semibold leading-[21.75px]"
                                                                    >
                                                                        <span className="font-medium md:font-bold text-[7.65px] md:text-[9.65px] 2xl:text-[16.65px] mr-2">
                                                                            ESTAS
                                                                            AHORRANDO
                                                                        </span>{" "}
                                                                        S/{" "}
                                                                        {Number(
                                                                            item.price -
                                                                            item.discount
                                                                        ).toFixed(
                                                                            0
                                                                        )}{" "}
                                                                        <img
                                                                            src="/assets/img/emojis/fire.png"
                                                                            className="h-[9.88px] 2xl:h-[16px] inline-flex ml-2"
                                                                        />
                                                                    </motion.p>
                                                                )}
                                                            </div>

                                                            {/* 🗑️ Botón para eliminar */}
                                                            <div className="w-1/6 lg:w-4/12 flex items-start justify-end">
                                                                <motion.button
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.9,
                                                                    }}
                                                                    className="group text-white px-2 py-1 rounded-md hover:fill-red-500 transition-all duration-300"
                                                                    onClick={() =>
                                                                        eliminarProducto(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="h-10 lg:h-12 scale-x-[-1]">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 448 512"
                                                                            className="h-full w-4 lg:w-5 relative"
                                                                            fill="current"
                                                                        >
                                                                            <path
                                                                                className="group-hover:-rotate-12 group-hover:absolute group-hover:inset-0"
                                                                                fill="current"
                                                                                d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3z"
                                                                            />
                                                                            <path
                                                                                fill="current"
                                                                                d="M32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex">
                                                            <div className="w-1/2 md:w-4/6 lg:w-1/2 h-full flex">
                                                                <p className="text-[18.42px] md:text-[24.42px] h-full items-center lg:text-[35.33px] 2xl:text-[45.33px] font-bold text-[#5F48B7]">
                                                                    S/{" "}
                                                                    {Number(
                                                                        item.final_price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="w-1/2 md:w-2/6 lg:w-1/2 h-full lg:h-14">
                                                                <div className="flex h-full text-[#000000] bg-transparent border border-black items-center justify-around rounded-[8px] md:rounded-[10px]">
                                                                    <motion.button
                                                                        whileTap={{
                                                                            scale: 0.8,
                                                                        }}
                                                                        className="h-full md:w-8 md:h-8 text-xs md:text-base 2xl:text-2xl"
                                                                        onClick={() =>
                                                                            decrementarCantidad(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        -
                                                                    </motion.button>
                                                                    <span className="h-full flex items-center text-xs md:text-base 2xl:text-2xl font-medium">
                                                                        {item.variations &&
                                                                            item
                                                                                .variations
                                                                                .length >
                                                                            0
                                                                            ? item.variations.reduce(
                                                                                (
                                                                                    sum,
                                                                                    v
                                                                                ) =>
                                                                                    sum +
                                                                                    v.quantity,
                                                                                0
                                                                            )
                                                                            : item.quantity}
                                                                    </span>
                                                                    <motion.button
                                                                        whileTap={{
                                                                            scale: 0.8,
                                                                        }}
                                                                        className="h-6 md:w-8 md:h-8 text-xs md:text-base 2xl:text-2xl"
                                                                        onClick={() =>
                                                                            incrementarCantidad(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Total y botón de Checkout */}
                                {totalPrecio > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full mt-8"
                                    >
                                        <div className="w-full flex items-center justify-between my-6">
                                            <p className="text-[25.42px] md:text-[50.42px] lg:text-[45.33px] 2xl:text-[51.33px] font-bold text-black">
                                                Subtotal
                                            </p>
                                            <p className="text-[25.42px] md:text-[50.42px] lg:text-[45.33px] 2xl:text-[51.33px] font-bold text-black">
                                                S/ {totalPrecio.toFixed(2)}
                                            </p>
                                        </div>

                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href="/checkout"
                                            className="block text-center text-[20.76px] md:text-[25.76px] lg:text-[34.76px] 2xl:text-[36.76px] w-full font-semibold rounded-[12.11px] lg:rounded-[15.11px] bg-[#FF9900] text-white py-3 2xl:py-4 hover:bg-opacity-90 transition-all duration-300"
                                        >
                                            IR A COMPRAR
                                        </motion.a>

                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="mt-6 relative w-full"
                                        >
                                            <img
                                                src="/assets/img/checkout/banner-pagos.png"
                                                className="w-full object-cover h-auto rounded-lg shadow-lg shadow-gray-500/20"
                                            />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Header;
