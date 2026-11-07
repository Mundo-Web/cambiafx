import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const CintilloSection = () => {
    const [activeLink, setActiveLink] = useState("/");

    useEffect(() => {
        // Detectar la ruta actual
        setActiveLink(window.location.pathname);
    }, []);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const isActive = (path) => {
        return activeLink === path;
    };
    const containerVariants = {
        hidden: { opacity: 1, y: 0 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 1, x: 0 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    return(
         <motion.div 
            initial={false}
            animate="visible"
            variants={containerVariants}
            className="bg-constrast overflow-hidden text-white text-xs md:text-sm py-2 md:py-3 relative"
        >
            {/* Gradiente animado de fondo (Acelerado por GPU en CSS nativo sin sobrecargar CPU de JavaScript) */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-constrast via-accent/20 to-constrast opacity-50 animate-cintillo-gradient pointer-events-none"
            />

            <div className="px-[5%] mx-auto flex flex-row items-center justify-start font-paragraph relative z-10">
                <motion.div 
                    variants={itemVariants}
                    className="flex items-start gap-2 relative"
                >
                    <motion.ul 
                        variants={containerVariants}
                        className="flex flex-row items-center gap-4 uppercase font-medium text-sm"
                    >
                        <motion.li variants={itemVariants}>
                           <motion.a 
                                href="/"
                                onClick={() => handleLinkClick("/")}
                                whileHover={{ 
                                    scale: 1.05,
                                    x: 2,
                                    textShadow: "0 0 8px rgba(187, 255, 82, 0.6)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className={`relative inline-block group transition-all duration-300 ${
                                    isActive("/") 
                                        ? 'text-secondary font-bold scale-105' 
                                        : 'text-white hover:text-secondary'
                                }`}
                            >
                                Personas
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-0.5 rounded-full ${
                                        isActive("/") ? 'bg-secondary' : 'bg-secondary'
                                    }`}
                                    initial={{ width: isActive("/") ? "100%" : 0 }}
                                    whileHover={{ width: "100%" }}
                                    animate={{ width: isActive("/") ? "100%" : 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                />
                                
                              
                            </motion.a>
                        </motion.li>
                        <motion.li variants={itemVariants}>
                            <motion.a 
                                href="/empresas"
                                onClick={() => handleLinkClick("/empresas")}
                                whileHover={{ 
                                    scale: 1.05,
                                    x: 2,
                                    textShadow: "0 0 8px rgba(187, 255, 82, 0.6)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className={`relative inline-block group transition-all duration-300 ${
                                    isActive("/empresas") 
                                        ? 'text-secondary font-bold scale-105' 
                                        : 'text-white hover:text-secondary'
                                }`}
                            >
                                Empresas
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-0.5 rounded-full ${
                                        isActive("/empresas") ? 'bg-secondary' : 'bg-secondary'
                                    }`}
                                    initial={{ width: isActive("/empresas") ? "100%" : 0 }}
                                    whileHover={{ width: "100%" }}
                                    animate={{ width: isActive("/empresas") ? "100%" : 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                />
                                
                              {/*  {/* Indicador adicional para el item activo 
                                {isActive("/empresas") && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-secondary rounded-full"
                                    />
                                )}*/}
                            </motion.a>
                        </motion.li>
                    </motion.ul>

                   
                </motion.div>
            </div>
        </motion.div>
    )
}
export default CintilloSection;