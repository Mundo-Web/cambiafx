import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    CalendarClockIcon,
    Facebook,
    Link,
    Linkedin,
    MessageCircle,
    Twitter,
} from "lucide-react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import HtmlContent from "./Utils/HtmlContent";
import Tippy from "@tippyjs/react";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import PostCard from "./Components/Blog/PostCard";
import TextWithHighlight from "./Utils/TextWithHighlight";
import { AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// Animaciones reutilizables
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "backOut" },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const Toast = ({ show, message }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 500 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-none z-50"
                >
                    <motion.div
                        className="bg-azul text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ type: "spring" }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring" }}
                        >
                            <Check className="h-5 w-5" />
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {message}
                        </motion.span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const BlogArticle = ({ article, posts, landing }) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(article.name);
    const shareText = encodeURIComponent(
        `${article.name} - ${article.description.substring(0, 100)}...`
    );
    const [showToast, setShowToast] = useState(false);
    const [hoveredShare, setHoveredShare] = useState(null);

    const socialShareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareText}`,
        whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
        email: `mailto:?subject=${shareTitle}&body=${shareText}%0A%0ALeer más: ${shareUrl}`,
        copy: shareUrl,
    };

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            })
            .catch((err) => {
                console.error("Error al copiar: ", err);
            });
    };

    const ArrowLeftIcon = ({ width = 24, height = 24, color = "#3E2F4D" }) => (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={width} 
          height={height} 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <mask 
            id="mask0_202_13054" 
            style={{ maskType: "alpha" }} 
            maskUnits="userSpaceOnUse" 
            x="0" 
            y="0" 
            width={width} 
            height={height}
          >
            <rect x={width} width={width} height={height} transform={`rotate(90 ${width} 0)`} fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_202_13054)">
            <path 
              d="M8.62539 12L14.6254 6L16.0254 7.4L11.4504 12L16.0254 16.6L14.6254 18L8.62539 12Z" 
              fill={color}
            />
          </g>
        </svg>
    );

    return (
        <>
            <Header />
            <motion.section
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="px-[5%] bg-white pt-10 lg:pt-16"
            >
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        variants={fadeInUp}
                        className="mb-8 w-auto flex flex-col gap-3"
                    >   
                        <a href="/blog" className="flex w-40">
                            <motion.span
                                className="w-auto flex flex-row py-1 text-base 2xl:text-lg font-medium text-[#3E2F4D] rounded-full"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeftIcon />
                                Volver a blog
                            </motion.span>
                        </a>
                        
                        <motion.h1
                            className="font-Poppins_Medium text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight"
                            variants={fadeInUp}
                        >
                            <TextWithHighlight text={article.name} />
                        </motion.h1>

                        <motion.div className="w-auto">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="w-auto rounded-lg text-sm text-[#3E2F4D] font-medium mb-1 px-3 py-2 bg-[#D7C8E6]">{article.category.name}</span>
                            </motion.span>
                        </motion.div>

                        <motion.div
                            className="flex mt-2 text-sm customtext-neutral-dark gap-2"
                            variants={fadeInUp}
                        >
                            <CalendarClockIcon className="h-4 w-4" />
                            {moment(article.post_date).format("LL")}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={scaleUp}
                        className="mb-8 overflow-hidden rounded-lg shadow-lg"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <motion.img
                            src={`/api/posts/media/${article.image}`}
                            alt="Article main image"
                            className="w-full h-auto object-cover object-center aspect-video"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        transition={{ delay: 0.4 }}
                        className="prose max-w-none ql-editor !p-0 customtext-neutral-dark"
                    >
                        <HtmlContent html={article.description} />
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        transition={{ delay: 0.6 }}
                        className="mt-12 pt-6 border-t border-slate-200"
                    >
                        <div className="flex justify-between items-center text-sm text-negro">
                            <Toast
                                show={showToast}
                                message="Enlace copiado al portapapeles"
                            />
                            <div className="flex flex-col items-start gap-2">
                                <motion.span
                                    className="mr-2 text-bold text-negro"
                                    whileHover={{ x: 2 }}
                                >
                                    Compartir
                                </motion.span>
                                <div className="flex gap-4">
                                    {[
                                        "copy",
                                        "linkedin",
                                        "twitter",
                                        "facebook",
                                    ].map((type) => (
                                        <motion.div
                                            key={type}
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.9 }}
                                            onHoverStart={() =>
                                                setHoveredShare(type)
                                            }
                                            onHoverEnd={() =>
                                                setHoveredShare(null)
                                            }
                                        >
                                            <Tippy
                                                content={`Compartir ${
                                                    type === "copy"
                                                        ? "URL"
                                                        : "en " + type
                                                }`}
                                            >
                                                <a
                                                    href={
                                                        type !== "copy"
                                                            ? socialShareLinks[
                                                                  type
                                                              ]
                                                            : undefined
                                                    }
                                                    onClick={
                                                        type === "copy"
                                                            ? copyToClipboard
                                                            : undefined
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-azul rounded-full p-2 block transition-colors ${
                                                        hoveredShare === type
                                                            ? "bg-azul/30"
                                                            : "bg-azul/20"
                                                    }`}
                                                >
                                                    {type === "copy" && (
                                                        <Link className="h-5 w-5" />
                                                    )}
                                                    {type === "linkedin" && (
                                                        <Linkedin className="h-5 w-5" />
                                                    )}
                                                    {type === "twitter" && (
                                                        <Twitter className="h-5 w-5" />
                                                    )}
                                                    {type === "facebook" && (
                                                        <Facebook className="h-5 w-5" />
                                                    )}
                                                </a>
                                            </Tippy>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="mt-8 pt-6 border-slate-200 text-sm font-medium px-[5%] py-8 md:py-12  text-negro"
            >
                <motion.h2
                    className="font-Poppins_Medium text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight"
                    variants={fadeInUp}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <TextWithHighlight text={landing?.title} />
                </motion.h2>

                <motion.p
                    className="flex mt-3 text-center lg:text-left text-base font-Poppins_Regular 2xl:text-lg"
                    variants={fadeInUp}
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {landing?.description}
                </motion.p>

                <motion.section
                    className="py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.3,
                            },
                        },
                    }}
                >
                    {posts.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring" }}
                        >
                            <PostCard {...item} firstImage />
                        </motion.div>
                    ))}
                </motion.section>
            </motion.section>

            <Footer />
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <BlogArticle {...properties} />
            </Base>
        </CarritoProvider>
    );
});
