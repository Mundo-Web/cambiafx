import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import bgHeader from "./images/header.png";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../Actions/SubscriptionsRest";
import Global from "../../Utils/Global";
import HtmlContent from "../../Utils/HtmlContent";
import TextWithHighlight from "../../Utils/TextWithHighlight";

const subscriptionsRest = new SubscriptionsRest();

const BlogHeader = ({ categories, postRecent, landing }) => {
    const emailRef = useRef();
    const [saving, setSaving] = useState(false);

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const request = {
            email: emailRef.current.value,
        };
        const result = await subscriptionsRest.save(request);
        setSaving(false);

        if (!result) return;

        Swal.fire({
            title: "¡Éxito!",
            text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: "success",
            confirmButtonText: "Ok",
        });

        emailRef.current.value = null;
    };

    

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const imageHoverVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    const cardHoverVariants = {
        hover: {
            y: -5,
            transition: {
                type: "spring",
                stiffness: 400,
            },
        },
    };

    return (
        <div>



            {/* Sección Noticias Destacadas */}
            <motion.section
                className="px-[5%] py-10 lg:py-10 !font-title bg-neutral-dark"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className=" mx-auto">
                      <p className="text-sm font-medium tracking-widest text-secondary mb-2 uppercase">LO ÚLTIMO</p>
                    {/* Header */}
                    <motion.div className="mb-12" variants={itemVariants}>
                          <h1 className="text-4xl md:text-[60px] font-title font-medium text-white leading-tight mb-4">
                            <TextWithHighlight text={landing?.title} highlight="destacas" color="bg-white font-semibold" />
                        
                        </h1>
                        <p className=" text-lg text-white max-w-2xl">
                            {landing?.description}
                           
                        </p>
                    </motion.div>

                    {/* Grid de artículos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Artículo principal (izquierda) */}
                        <motion.a
                         href={`/blog/${postRecent[0]?.slug}`}
                            className="group cursor-pointer"
                            variants={itemVariants}
                            whileHover="hover"
                        >
                            <motion.div
                                className="relative overflow-hidden rounded-2xl mb-6"
                                variants={imageHoverVariants}
                            >
                                <img
                                    src={`/api/posts/media/${postRecent[0]?.image}`}
                                    alt="Cultura organizacional"
                                    className="w-full  aspect-[16/10] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                            </motion.div>

                            <div className="space-y-4">
                                <span className="inline-block  py-1 text-secondary tracking-[8%] uppercase  text-sm  font-medium rounded-ful">
                                    {postRecent[0]?.category.name}
                                </span>
                                <h3 className="font-title text-2xl lg:text-[28px] font-medium text-neutral group-hover:text-constrast transition-colors duration-300">
                                    {postRecent[0]?.name}
                                </h3>
                                <p className="font-title text-white text-base leading-relaxed line-clamp-3" >
{postRecent[0]?.summary}
                                </p>
                                <button aria-label="leer más" className="inline-flex items-center gap-2 bg-constrast p-3 rounded-full text-white text-sm font-medium tracking-[8%] uppercase  hover:gap-3 transition-all duration-300">
                                   LEER MÁS
                                </button>
                            </div>
                        </motion.a>

                        {/* Artículos secundarios (derecha) */}
                        <div className="space-y-8 h-full grid grid-cols-1 ">
                            {/* Artículo 1 */}
                            {postRecent[1] && (
                                <motion.a   href={`/blog/${postRecent[1]?.slug}`}
                                className="group cursor-pointer"
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-6"
                                    variants={cardHoverVariants}
                                >
                                    <motion.div
                                        className="relative overflow-hidden rounded-xl flex-shrink-0 w-full lg:w-72"
                                        variants={imageHoverVariants}
                                    >
                                        <img
                                            src={`/api/posts/media/${postRecent[1]?.image}`}
                                            alt="Liderazgo consciente"
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                                    </motion.div>

                                    <div className="flex-1 space-y-3">
                                        <span className="inline-block py-1 text-secondary tracking-[8%] uppercase  text-sm  font-medium rounded-ful">
                                            {postRecent[1]?.category.name}
                                        </span>
                                        <h3 className="font-title text-2xl  line-clamp-3  lg:text-[28px] font-medium text-neutral group-hover:text-constrast transition-colors duration-300">
                                            {postRecent[1]?.name}
                                        </h3>
                                        <p className="font-title text-white text-base leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: postRecent[1]?.summary }}>

                                        </p>
                                       <button aria-label="leer más" className="inline-flex items-center gap-2 bg-constrast p-3  rounded-full text-white text-sm font-medium tracking-[8%] uppercase  hover:gap-3 transition-all duration-300">
                                           LEER MÁS
                                         
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.a>
                            )}

                            {/* Artículo 2 */}
                            {postRecent[2] && ( 
                                
                                
                            <motion.a
                               href={`/blog/${postRecent[2]?.slug}`}
                                className="group cursor-pointer"
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-6"
                                    variants={cardHoverVariants}
                                >
                                    <motion.div
                                        className="relative overflow-hidden rounded-xl flex-shrink-0 w-full lg:w-72"
                                        variants={imageHoverVariants}
                                    >
                                        <img
                                            src={`/api/posts/media/${postRecent[2]?.image}`}
                                            alt="Liderazgo consciente"
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                                    </motion.div>

                                    <div className="flex-1 space-y-3">
                                        <span className="inline-block py-1 text-secondary tracking-[8%] uppercase  text-sm  font-medium rounded-ful">
                                            {postRecent[2]?.category.name}
                                        </span>
                                        <h3 className="font-title text-2xl  line-clamp-3  lg:text-[28px] font-medium text-neutral group-hover:text-constrast transition-colors duration-300">
                                            {postRecent[2]?.name}
                                        </h3>
                                        <p className="font-title text-white text-base leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: postRecent[2]?.summary }}>

                                        </p>
                                       <button aria-label="leer más" className="inline-flex items-center gap-2 bg-constrast p-3 text-sm font-medium tracking-[8%] uppercase rounded-full text-white  hover:gap-3 transition-all duration-300">
                                           LEER MÁS
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.a>)}
                            
                        </div>
                    </div>
                </div>
            </motion.section>



        </div>
    );
};

export default BlogHeader;
