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
    hidden: { y: -20, opacity: 0 },
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
                console.log("Error de extracion:", await response.text());
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

    return (
        <>
            <div className={`w-full max-w-full relative font-paragraph ${backgroundHeight} z-[9999]`}>
                {/* CINTILLO INICIO */}
                <div className="bg-primary text-white text-xs md:text-sm py-2 md:py-3">
                    <div className="px-[5%] mx-auto flex flex-row items-center justify-center md:justify-between">
                        {/* Solo email y teléfono en mobile, todo en desktop */}
                        <div className="flex flex-1 items-center justify-center gap-2 md:justify-start md:gap-4">
                            <a href={`mailto:${ContactEmail?.description}`} className="flex items-center space-x-1">
                                <svg width="14" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 3L4.45651 4.96231C5.71935 5.67925 6.28065 5.67925 7.5435 4.96231L11 3" stroke="white" strokeWidth="0.75" strokeLinejoin="round" />
                                    <path d="M5.25 10.25C5.01685 10.247 4.78341 10.2425 4.54942 10.2366C2.97517 10.197 2.18804 10.1772 1.62248 9.6092C1.05692 9.04115 1.04057 8.27435 1.00789 6.7407C0.997375 6.24755 0.99737 5.75735 1.00788 5.26421C1.04057 3.73056 1.05691 2.96374 1.62248 2.39569C2.18804 1.82765 2.97516 1.80786 4.54941 1.76829C5.51965 1.7439 6.48035 1.74391 7.4506 1.7683C9.02485 1.80787 9.81195 1.82766 10.3775 2.3957C10.9431 2.96374 10.9594 3.73057 10.9921 5.26422C10.9969 5.49126 10.9996 5.59825 11 5.75" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.5 9C9.5 9.4142 9.1642 9.75 8.75 9.75C8.3358 9.75 8 9.4142 8 9C8 8.5858 8.3358 8.25 8.75 8.25C9.1642 8.25 9.5 8.5858 9.5 9ZM9.5 9V9.25C9.5 9.6642 9.8358 10 10.25 10C10.6642 10 11 9.6642 11 9.25V9C11 7.75735 9.99265 6.75 8.75 6.75C7.50735 6.75 6.5 7.75735 6.5 9C6.5 10.2427 7.50735 11.25 8.75 11.25" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-xs lg:text-base">{ContactEmail?.description}</span>
                            </a>
                            <span className="mx-1">|</span>
                            <a href={`tel:${ContactNumber?.description}`} className="flex items-center  space-x-1">
                                <svg width="14" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.52415 8.7461C10.127 8.17025 10.5 7.37475 10.5 6.4961C10.5 5.6174 10.127 4.82192 9.52415 4.24609M8.5 5.37109C8.80145 5.659 8.98795 6.05675 8.98795 6.4961C8.98795 6.93545 8.80145 7.3332 8.5 7.6211" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 4C8 2.82149 8 2.23223 7.6339 1.86611C7.26775 1.5 6.6785 1.5 5.5 1.5H4C2.82149 1.5 2.23223 1.5 1.86611 1.86611C1.5 2.23223 1.5 2.82149 1.5 4V9C1.5 10.1785 1.5 10.7677 1.86611 11.1339C2.23223 11.5 2.82149 11.5 4 11.5H5.5C6.6785 11.5 7.26775 11.5 7.6339 11.1339C8 10.7677 8 10.1785 8 9" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.75 1.5H3.75L4 2H5.5L5.75 1.5Z" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-xs lg:text-base">{ContactNumber?.description}</span>
                            </a>
                        </div>
                        {/* Íconos sociales solo en desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Instagram */}
                            {Instagram && (
                                <>
                                    <a href={Instagram.link} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 flex gap-2 items-center " aria-label="Instagram">
                                        <svg width="25" height="25" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 7.55C5.4375 7.55 4.95 7.1 4.95 6.5C4.95 5.9375 5.4 5.45 6 5.45C6.5625 5.45 7.05 5.9 7.05 6.5C7.05 7.0625 6.5625 7.55 6 7.55Z" fill="white" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.275 3.95H4.725C4.425 3.9875 4.275 4.025 4.1625 4.0625C4.0125 4.1 3.9 4.175 3.7875 4.2875C3.69848 4.37652 3.65642 4.46554 3.60558 4.57314C3.59218 4.6015 3.57814 4.63122 3.5625 4.6625C3.5567 4.6799 3.55 4.6982 3.54282 4.71782C3.50359 4.825 3.45 4.97141 3.45 5.225V7.775C3.4875 8.075 3.525 8.225 3.5625 8.3375C3.6 8.4875 3.675 8.6 3.7875 8.7125C3.87652 8.80152 3.96554 8.84358 4.07314 8.89442C4.10152 8.90783 4.13119 8.92185 4.1625 8.9375C4.1799 8.9433 4.1982 8.95 4.21782 8.95718C4.325 8.99641 4.47141 9.05 4.725 9.05H7.275C7.575 9.0125 7.725 8.975 7.8375 8.9375C7.9875 8.9 8.1 8.825 8.2125 8.7125C8.30152 8.62348 8.34358 8.53446 8.39442 8.42686C8.40782 8.39849 8.42185 8.3688 8.4375 8.3375C8.4433 8.3201 8.45 8.30179 8.45718 8.28218C8.49641 8.175 8.55 8.02859 8.55 7.775V5.225C8.5125 4.925 8.475 4.775 8.4375 4.6625C8.4 4.5125 8.325 4.4 8.2125 4.2875C8.12348 4.19848 8.03446 4.15642 7.92686 4.10558C7.89852 4.09219 7.86875 4.07813 7.8375 4.0625C7.8201 4.0567 7.8018 4.05 7.78218 4.04282C7.675 4.00359 7.52859 3.95 7.275 3.95ZM6 4.8875C5.1 4.8875 4.3875 5.6 4.3875 6.5C4.3875 7.4 5.1 8.1125 6 8.1125C6.9 8.1125 7.6125 7.4 7.6125 6.5C7.6125 5.6 6.9 4.8875 6 4.8875ZM8.025 4.85C8.025 5.05711 7.85711 5.225 7.65 5.225C7.44289 5.225 7.275 5.05711 7.275 4.85C7.275 4.64289 7.44289 4.475 7.65 4.475C7.85711 4.475 8.025 4.64289 8.025 4.85Z" fill="white" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.5C0 3.18629 2.68629 0.5 6 0.5C9.31371 0.5 12 3.18629 12 6.5C12 9.81371 9.31371 12.5 6 12.5C2.68629 12.5 0 9.81371 0 6.5ZM4.725 3.3875H7.275C7.6125 3.425 7.8375 3.4625 8.025 3.5375C8.25 3.65 8.4 3.725 8.5875 3.9125C8.775 4.1 8.8875 4.2875 8.9625 4.475C9.0375 4.6625 9.1125 4.8875 9.1125 5.225V7.775C9.075 8.1125 9.0375 8.3375 8.9625 8.525C8.85 8.75 8.775 8.9 8.5875 9.0875C8.4 9.275 8.2125 9.3875 8.025 9.4625C7.8375 9.5375 7.6125 9.6125 7.275 9.6125H4.725C4.3875 9.575 4.1625 9.5375 3.975 9.4625C3.75 9.35 3.6 9.275 3.4125 9.0875C3.225 8.9 3.1125 8.7125 3.0375 8.525C2.9625 8.3375 2.8875 8.1125 2.8875 7.775V5.225C2.925 4.8875 2.9625 4.6625 3.0375 4.475C3.15 4.25 3.225 4.1 3.4125 3.9125C3.6 3.725 3.7875 3.6125 3.975 3.5375C4.1625 3.4625 4.3875 3.3875 4.725 3.3875Z" fill="white" />
                                        </svg>
                                        Instagram
                                    </a>
                                    <span className="mx-1">|</span></>)}
                            {/* Facebook */}
                            {Facebook && (
                                <>
                                    <a href={Facebook.link} target="_blank" rel="noopener noreferrer"  className="hover:text-gray-300 flex gap-2 items-center " aria-label="Facebook">
                                        <svg width="25" height="25" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.5C0 3.18629 2.68629 0.5 6 0.5C9.31371 0.5 12 3.18629 12 6.5C12 9.81371 9.31371 12.5 6 12.5C2.68629 12.5 0 9.81371 0 6.5ZM6 3.5C7.65 3.5 9 4.85 9 6.5C9 8 7.9125 9.275 6.4125 9.5V7.3625H7.125L7.275 6.5H6.45V5.9375C6.45 5.7125 6.5625 5.4875 6.9375 5.4875H7.3125V4.7375C7.3125 4.7375 6.975 4.6625 6.6375 4.6625C5.9625 4.6625 5.5125 5.075 5.5125 5.825V6.5H4.7625V7.3625H5.5125V9.4625C4.0875 9.2375 3 8 3 6.5C3 4.85 4.35 3.5 6 3.5Z" fill="white" />
                                        </svg>
                                        Facebook
                                    </a>
                                    <span className="mx-1">|</span>
                                </>
                            )}
                            {/* LinkedIn */}
                            {LinkedIn && (<>
                                <a href={LinkedIn.link} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 flex gap-2 items-center " aria-label="LinkedIn">
                                    <svg width="25" height="25" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 6.5C0 3.18629 2.68629 0.5 6 0.5C9.31371 0.5 12 3.18629 12 6.5C12 9.81371 9.31371 12.5 6 12.5C2.68629 12.5 0 9.81371 0 6.5ZM3.075 5.4875V9.5H4.35V5.4875H3.075ZM3 4.2125C3 4.625 3.3 4.925 3.7125 4.925C4.125 4.925 4.425 4.625 4.425 4.2125C4.425 3.8 4.125 3.5 3.7125 3.5C3.3375 3.5 3 3.8 3 4.2125ZM7.725 9.5H8.925V7.025C8.925 5.7875 8.175 5.375 7.4625 5.375C6.825 5.375 6.375 5.7875 6.2625 6.05V5.4875H5.0625V9.5H6.3375V7.3625C6.3375 6.8 6.7125 6.5 7.0875 6.5C7.4625 6.5 7.725 6.6875 7.725 7.325V9.5Z" fill="white" />
                                    </svg>
                                    LinkedIn
                                </a>
                                <span className="mx-1">|</span>
                            </>)}
                            {/* YouTube */}
                            {YouTube && (
                                <>
                                    <a href={YouTube.link} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 flex gap-2 items-center " aria-label="YouTube">
                                        <svg width="25" height="25" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.975 6.5L5.4 5.6V7.4L6.975 6.5Z" fill="white" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.5C0 3.18629 2.68629 0.5 6 0.5C9.31371 0.5 12 3.18629 12 6.5C12 9.81371 9.31371 12.5 6 12.5C2.68629 12.5 0 9.81371 0 6.5ZM8.325 4.5125C8.58751 4.5875 8.775 4.775 8.85 5.0375C9 5.525 9 6.5 9 6.5C9 6.5 9 7.475 8.8875 7.9625C8.8125 8.225 8.625 8.4125 8.3625 8.4875C7.875 8.6 6 8.6 6 8.6C6 8.6 4.0875 8.6 3.6375 8.4875C3.375 8.4125 3.1875 8.225 3.1125 7.9625C3 7.475 3 6.5 3 6.5C3 6.5 3 5.525 3.075 5.0375C3.15 4.775 3.3375 4.5875 3.6 4.5125C4.0875 4.4 5.9625 4.4 5.9625 4.4C5.9625 4.4 7.875 4.4 8.325 4.5125Z" fill="white" />
                                        </svg>
                                        YouTube
                                    </a>
                                    <span className="mx-1">|</span>
                                </>
                            )}
                            {/* TikTok */}
                            {TikTok && (
                                <a href={TikTok.link} target="_blank" rel="noopener noreferrer"  className="hover:text-gray-300 flex gap-2 items-center " aria-label="TikTok">
                                    <svg width="25" height="25" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6 0.5C2.68629 0.5 0 3.18629 0 6.5C0 9.81371 2.68629 12.5 6 12.5C9.31371 12.5 12 9.81371 12 6.5C12 3.18629 9.31371 0.5 6 0.5ZM7.16933 3.5C7.16933 3.58916 7.17767 3.67696 7.193 3.76194C7.26679 4.15477 7.49927 4.49189 7.8222 4.70222C8.04769 4.84989 8.31493 4.93488 8.60305 4.93488L8.603 5.16472V5.96574C8.0685 5.96574 7.57299 5.7944 7.16931 5.50463V7.60122C7.16931 8.64743 6.31748 9.5 5.27217 9.5C4.86851 9.5 4.49268 9.37181 4.18506 9.15588C3.69513 8.81179 3.375 8.24342 3.375 7.60122C3.375 6.55362 4.22546 5.70247 5.27077 5.70384C5.35847 5.70384 5.44337 5.71081 5.52689 5.72197V5.96574L5.52383 5.9672L5.52688 5.96713V6.77512C5.44615 6.75004 5.35985 6.73473 5.27077 6.73473C4.79335 6.73473 4.405 7.1234 4.405 7.60122C4.405 7.93418 4.5943 8.22254 4.8699 8.36881C4.87247 8.37234 4.87508 8.37585 4.8777 8.37933L4.88232 8.38542C4.87915 8.3793 4.87549 8.37329 4.8713 8.36742C4.99239 8.4315 5.1288 8.46772 5.27356 8.46772C5.73983 8.46772 6.12124 8.09578 6.13792 7.63327L6.13932 3.5H7.16933Z" fill="white" />
                                    </svg>
                                    TikTok
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                {/* CINTILLO FIN */}
                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className={` static lg:w-full top-0 z-[9998] transition-colors duration-300 py-1 ${backgroundType === "none"
                        ? "bg-transparent mt-0"
                        : isScrolled
                            ? "bg-primary pt-0 !mt-0"
                            : "bg-transparent top-4 pt-8 md:pt-14 lg:pt-10"
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
                                    whileHover={{ scale: 1.05 }}
                                    src="/assets/img/logo.svg"
                                    alt="Sedna Logo"
                                    className="object-cover object-top h-12 max-h-12 w-auto  sm:h-16 sm:max-h-16 "
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
                                     "#services",
                                    "/casos-de-exito",
                                    "/blog",
                                    "/infoproductos",
                                    "/contacto",
                                ].map((path) => {
                                    const text = {
                                        "/nosotros": t("public.header.home", "Nosotros"),
                                        "#services": t(
                                            "public.header.services",
                                            "Servicios"
                                        ),
                                        "/casos-de-exito": t(
                                            "public.header.solutions",
                                            "Casos de éxito"
                                        ),
                                        "/blog": t(
                                            "public.header.options",
                                            "Blog"
                                        ),
                                        "/infoproductos": t(
                                            "public.header.infoproducts",
                                            "Infoproductos"
                                        ),
                                        "/contacto": t(
                                            "public.header.contact",
                                            "Contacto"
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
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`relative py-2 rounded-full transition-all duration-300 ${isActive(path)
                                                    ? "bg-neutral-light pl-7 pr-3 text-primary font-semibold"
                                                    : "bg-transparent px-5 text-primary"
                                                    }`}
                                            >
                                                {text}
                                                {isActive(path) && (
                                                    <motion.span
                                                        layoutId="activeDot"
                                                        className="absolute  left-3 top-[40%] -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-accent rounded-full"
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
                            className="hidden xl:flex flex-col justify-center items-center _Medium"
                        >
                            <WhatsAppButtonWithArrow
                                variant="primary"
                                size="medium"
                                className="text-base 2xl:text-lg"
                            >
                                Reserva una consulta
                            </WhatsAppButtonWithArrow>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="xl:hidden text-base"
                        >
                            <div>
                                <motion.button
                                    ref={btnToggleRef}
                                    onClick={toggleMenu}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="text-white menu-toggle rounded-xl h-[50px] w-[50px] flex items-center justify-center bg-gradient-to-br from-primary to-primary shadow-lg shadow-primary/30 border border-white/20"
                                    aria-label="Toggle menu"
                                >
                                    <motion.div 
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-white"
                                    >
                                        {isOpen ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        )}
                                    </motion.div>
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
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
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
                                } z-[99999] bg-gradient-to-br from-white via-white to-blue-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto`}
                                style={{ zIndex: 99999 }}
                            >
                                {/* Header del menú */}
                                <div className="bg-gradient-to-r from-primary to-constrast p-6 text-white">
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
                                            { path: "#services", color: "bg-white", hasSubmenu: true },
                                            { path: "/casos-de-exito", color: "bg-white" },
                                            { path: "/blog", color: "bg-white" },
                                            { path: "/infoproductos", color: "bg-white" },
                                            { path: "/contacto", color: "bg-white" },
                                        ].map((item, index) => {
                                            const text = {
                                                "/nosotros": t("public.header.home", "Nosotros"),
                                                "#services": t("public.header.services", "Servicios"),
                                                "/casos-de-exito": t("public.header.solutions", "Casos de éxito"),
                                                "/blog": t("public.header.options", "Blog"),
                                                "/infoproductos": t("public.header.infoproducts", "Infoproductos"),
                                                "/contacto": t("public.header.contact", "Contacto"),
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
                                                        className={`w-full group relative overflow-hidden flex items-center p-4 rounded-xl transition-all duration-300 ${
                                                            isActive(item.path) || activeMegaMenu === item.path
                                                                ? "bg-accent text-white border-2 border-accent shadow-lg"
                                                                : "bg-gray-50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 text-gray-700 hover:text-primary border-2 border-transparent"
                                                        }`}
                                                    >
                                                        {/* Texto */}
                                                        <div className="flex-1 text-left">
                                                            <span className={`font-medium text-base ${
                                                                isActive(item.path) || activeMegaMenu === item.path ? "!text-white" : "!text-gray-700 group-hover:!text-primary"
                                                            }`} style={{ opacity: 1, visibility: 'visible' }}>
                                                                {text || item.path}
                                                            </span>
                                                            {item.path === "#services" && (
                                                                <p className={`text-xs mt-1 ${
                                                                    isActive(item.path) || activeMegaMenu === item.path ? "text-white/80" : "text-gray-500"
                                                                }`} style={{ opacity: 1, visibility: 'visible' }}>
                                                                    Descubre nuestras soluciones
                                                                </p>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Flecha o indicador de submenú */}
                                                        <motion.div
                                                            className={`transition-colors duration-300 ${
                                                                isActive(item.path) || activeMegaMenu === item.path ? "text-white" : "text-gray-400 group-hover:text-primary"
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
                                        initial="hidden"
                                        animate="visible"
                                        className="mt-6 pt-6 border-t border-gray-200"
                                        style={{ opacity: 1, visibility: 'visible' }}
                                    >
                                        <WhatsAppButtonWithArrow
                                            variant="accent"
                                            size="large"
                                            className="w-full bg-accent"
                                        >
                                            Reserva una consulta
                                        </WhatsAppButtonWithArrow>
                                    </motion.div>

                                    {/* Info adicional */}
                                    <motion.div
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="mt-4 text-center"
                                        style={{ opacity: 1, visibility: 'visible' }}
                                    >
                                        <p className="text-sm text-gray-500">
                                            ¿Necesitas ayuda? Contáctanos
                                        </p>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            {ContactEmail && (
                                                <a href={`mailto:${ContactEmail.description}`} className="text-xs text-primary hover:underline">
                                                    {ContactEmail.description}
                                                </a>
                                            )}
                                            {ContactNumber && (
                                                <a href={`tel:${ContactNumber.description}`} className="text-xs text-primary hover:underline">
                                                    {ContactNumber.description}
                                                </a>
                                            )}
                                        </div>
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
