import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, ExternalLink, Globe, Mail, Link as LinkIcon } from "lucide-react";
import GeneralRest from "../../actions/GeneralRest";
import General from "../../Utils/General";

const WhatsAppButton = ({ 
    children = "Reserva una consulta",
    variant = "primary", // primary, secondary, minimal
    size = "medium", // small, medium, large
    showIcon = true,
    className = "",
    customMessage = null, // Mensaje personalizado para WhatsApp
    customPhone = null,   // Teléfono personalizado para WhatsApp
    customLink = null,    // Enlace personalizado (anula WhatsApp y abre este enlace)
    buttonData = null,    // Datos del banner que pueden contener link o mensaje
    customIcon = null,    // Ícono personalizado: 'whatsapp', 'external', 'mail', 'link', 'globe' o componente React
    ...props 
}) => {
    const [whatsappData, setWhatsappData] = useState({
        phone: General.get('whatsapp_phone'),
        message: General.get('whatsapp_message')
    });
    const [aboutuses, setAboutuses] = useState(null);

    // Función para detectar si es un enlace válido
    const isValidUrl = (string) => {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    // Función para determinar el tipo de acción y datos
    const getActionData = () => {
        // Prioridad 1: customLink explícito
        if (customLink) {
            return {
                type: 'link',
                value: customLink,
                isExternal: isValidUrl(customLink)
            };
        }

        // Prioridad 2: buttonData del banner
        if (buttonData) {
            if (isValidUrl(buttonData)) {
                return {
                    type: 'link',
                    value: buttonData,
                    isExternal: true
                };
            } else {
                return {
                    type: 'whatsapp',
                    value: buttonData
                };
            }
        }

        // Prioridad 3: customMessage para WhatsApp
        if (customMessage) {
            if (isValidUrl(customMessage)) {
                return {
                    type: 'link',
                    value: customMessage,
                    isExternal: true
                };
            } else {
                return {
                    type: 'whatsapp',
                    value: customMessage
                };
            }
        }

        // Default: WhatsApp con mensaje por defecto
        return {
            type: 'whatsapp',
            value: whatsappData.message
        };
    };

  

    console.log(General.get('whatsapp_phone'))
    const aboutusData = aboutuses?.aboutus || [];
    const generalsData = aboutuses?.generals || [];
    // useEffect(() => {
    //     const fetchWhatsAppData = async () => {
    //         try {
    //             const generalRest = new GeneralRest();
    //             generalRest.enableNotifications = false;
                
    //             const data = await generalRest.getAboutuses();
                   

    //             if (data) {
    //                 const phoneData = data?.generals?.find(item => 
    //                     item.correlative === 'whatsapp_phone'
    //                 );
    //                 const messageData =data?.generals?.find(item => 
    //                     item.correlative === 'whatsapp_message'
    //                 );

    //                 setWhatsappData({
    //                     phone: phoneData?.description || null,
    //                     message: messageData?.description || "Hola, me gustaría reservar una consulta."
    //                 });
    //             }
    //         } catch (error) {
    //             // Valores por defecto en caso de error
    //             setWhatsappData({
    //                 phone: null,
    //                 message: "Hola, me gustaría reservar una consulta."
    //             });
    //         }
    //     };

    //     fetchWhatsAppData();
    // }, [null]);

    // Función helper para determinar el ícono apropiado
    const getIcon = () => {
        if (!showIcon) return null;
        
        // Si hay un ícono personalizado, usarlo
        if (customIcon) {
            if (typeof customIcon === 'string') {
                switch (customIcon) {
                    case 'whatsapp':
                        return <MessageCircle className="w-4 h-4 mr-2" />;
                    case 'external':
                        return <ExternalLink className="w-4 h-4 mr-2" />;
                    case 'mail':
                        return <Mail className="w-4 h-4 mr-2" />;
                    case 'link':
                        return <LinkIcon className="w-4 h-4 mr-2" />;
                    case 'globe':
                        return <Globe className="w-4 h-4 mr-2" />;
                    default:
                        return <ExternalLink className="w-4 h-4 mr-2" />;
                }
            } else {
                // Si es un componente React
                return React.cloneElement(customIcon, { className: "w-4 h-4 mr-2" });
            }
        }
        
        // Lógica automática basada en el tipo de acción
        const actionData = getActionData();
        
        if (actionData.type === 'link') {
            // Detectar tipos específicos de enlaces
            const url = actionData.value.toLowerCase();
            if (url.includes('mailto:')) {
                return <Mail className="w-4 h-4 mr-2" />;
            } else if (url.includes('tel:')) {
                return <Phone className="w-4 h-4 mr-2" />;
            } else {
                return <ExternalLink className="w-4 h-4 mr-2" />;
            }
        }
        
        return <MessageCircle className="w-4 h-4 mr-2" />;
    };

    const handleClick = () => {
        const actionData = getActionData();
        
        // Detectar tipos especiales de enlaces
        if (actionData.type === 'link') {
            const url = actionData.value.toLowerCase();
            if (url.includes('mailto:')) {
                window.location.href = actionData.value;
            } else if (url.includes('tel:')) {
                window.location.href = actionData.value;
            } else if (actionData.isExternal) {
                window.open(actionData.value, '_blank');
            } else {
                // Para enlaces internos o relativos
                window.location.href = actionData.value;
            }
            return;
        }

        // Lógica para WhatsApp
        const phone = customPhone || whatsappData.phone;
        const message = actionData.value || whatsappData.message;

        if (!phone) {
            return;
        }

        // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        
        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Crear URL de WhatsApp
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        
        // Abrir en nueva ventana
        window.open(whatsappUrl, '_blank');
    };

    // Clases base según variante
    const getVariantClasses = () => {
        switch (variant) {
            case 'constrast':
                return "bg-constrast text-white ";
            case 'accent':
                return "bg-accent text-white ";
            case 'secondary':
                return "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white";
            case 'minimal':
                return "bg-transparent text-primary hover:bg-primary/10 border border-primary/30";
            default: // primary
                return "";
        }
    };

    // Clases de tamaño
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return "px-4 py-2 text-sm";
            case 'large':
                return "px-8 py-4 text-lg";
            default: // medium
                return "";
        }
    };

   

    return (
        <button
            onClick={handleClick}
       
            className={`
                
                ${getSizeClasses()} 
                ${getVariantClasses()} 
                ${className}
            `}
            {...props}
        >
     
            {children}
        </button>
    );
};

// Componente especializado para botón con flecha (para mantener compatibilidad)
export const WhatsAppButtonWithArrow = ({ children = "Reserva una consulta", ...props }) => {
    return (
        <WhatsAppButton {...props}>
          
                {children}
               
          
        </WhatsAppButton>
    );
};

export default WhatsAppButton;
