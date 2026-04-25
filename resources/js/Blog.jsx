import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";

import BlogHeader from "./Components/Blog/BlogHeader";
import Filter from "./Components/Blog/Filter";
import Results from "./Components/Blog/Results";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import MaintenancePage from "./Utils/MaintenancePage";
import SliderInteractive from "./components/Tailwind/Sliders/SliderInteractive";
import FilterAgencia from "./components/Blog/FilterAgencia";
import TextWithHighlight from "./Utils/TextWithHighlight";
import WhatsAppButton from "./components/Shared/WhatsAppButton";
import CintilloSection from "./components/Tailwind/CambiaFX/CintilloSection";
function Blog({ categories, postRecent, landing, sliders, banner }) {

    const landingDestacados = landing?.find(
        (item) => item.correlative === "page_blog_destacados"
    );
    const landingTodos = landing?.find(
        (item) => item.correlative === "page_blog_todos"
    );

    const [filter, setFilter] = useState({
        category: null,
        search: null,
        sortOrder: "asc",
    });

    // Estado para coordinar las animaciones de scroll
    const [sectionsReady, setSectionsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSectionsReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: sectionsReady ? 1 : 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="sr-only">Blog sobre tipo de cambio y finanzas en Peru</h1>
            <Header />
            <CintilloSection/>

            {postRecent && postRecent.length > 0 ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: sectionsReady ? 1 : 0, y: sectionsReady ? 0 : 30 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <BlogHeader postRecent={postRecent} landing={landingDestacados} />
                    </motion.div>

                    <motion.div 
                        className="bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: sectionsReady ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.section 
                            className="w-full bg-primary pt-24 pb-10 flex justify-center items-center font-title px-[5%] mx-auto"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.div 
                                className="relative w-full px-4 md:px-16 rounded-[32px] md:rounded-[56px] bg-constrast flex flex-col md:flex-row items-center py-6 md:py-10 max-h-none md:max-h-[350px] overflow-hidden lg:overflow-visible"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Fondo decorativo - Solo desktop */}
                                <motion.div 
                                    className="hidden md:block absolute h-full w-auto right-0 z-0 overflow-hidden rounded-[56px]"
                                    initial={{ opacity: 0, x: 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.svg 
                                        className="z-0" 
                                        width="726" 
                                        height="406" 
                                        viewBox="0 0 726 406" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 1.2, delay: 0.6 }}
                                        viewport={{ once: true }}
                                    >
                                        <motion.path 
                                            d="M106.632 475.609C46.3026 412.336 8.96465 333.732 1.57527 254.167C-10.6896 86.2005 66.6131 -49.7434 208.283 -110.322C347.381 -169.827 511.454 -135.723 616.571 -25.4768C654.009 13.7878 683.587 61.4665 704.543 116.446L705.068 117.939C716.587 152.177 748.969 292.684 697.569 353.65C678.758 375.879 651.264 385.231 620.072 380.174L617.905 379.787C601.122 376.014 586.028 367.412 574.161 354.967C554.638 334.491 546.306 305.952 551.763 278.674C566.519 214.478 545.681 143.75 497.371 93.0833C473.867 68.4325 445.015 49.8011 413.966 39.3954L412.114 38.7093C357.011 16.7474 296.319 26.4814 245.657 65.4353C190.689 107.729 161.557 174.136 169.673 238.906C173.866 282.275 195.191 326.327 228.111 360.854C271.521 406.381 327.405 427.905 377.546 418.42C405.847 412.744 435.433 422.245 456.027 443.844C466.975 455.326 474.554 469.561 478.009 484.97C483.675 509.613 478.407 534.103 463.043 553.505C446.339 574.643 419.424 587.43 390.488 588.04C291.608 600.308 185.644 558.319 106.787 475.614L106.632 475.609Z" 
                                            fill="url(#paint0_linear_16_2457)" 
                                            fillOpacity="0.6"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 0.6 }}
                                            transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="paint0_linear_16_2457" x1="605.608" y1="-36.9748" x2="90.2411" y2="458.384" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.483986" stopColor="#7E5AFB" />
                                                <stop offset="1" stopColor="#C7B7FF" />
                                            </linearGradient>
                                        </defs>
                                    </motion.svg>

                                    <motion.svg 
                                        className="absolute top-0 right-0 z-[999]" 
                                        width="370" 
                                        height="406" 
                                        viewBox="0 0 370 406" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        initial={{ scale: 0.6, opacity: 0, rotate: 15 }}
                                        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ duration: 1.5, delay: 0.9 }}
                                        viewport={{ once: true }}
                                    >
                                        <motion.path 
                                            d="M62.0611 55.3248C99.5069 13.3718 147.971 -14.6335 198.601 -23.4874C305.657 -40.0404 396.815 2.48865 442.984 90.1853C488.331 176.288 474.954 283.246 409.708 356.345C386.471 382.379 357.433 403.809 323.267 420.089L322.337 420.503C300.981 429.659 212.572 457.69 170.825 427.889C155.6 416.978 148.182 399.835 149.81 379.575L149.946 378.166C151.497 367.21 156.231 357.088 163.597 348.836C175.714 335.259 193.581 328.441 211.352 330.528C253.275 336.668 297.543 319.648 327.528 286.054C342.117 269.71 352.569 250.247 357.635 229.802L357.979 228.579C369.209 192.114 359.828 153.706 332.232 123.24C302.272 90.1852 258.189 74.9433 217.082 83.4974C189.493 88.4295 162.353 104.38 141.92 127.274C114.976 157.461 104.067 194.403 112.742 226.06C117.846 243.911 113.285 263.372 100.502 277.693C93.7067 285.306 84.9724 290.902 75.2721 293.914C59.7655 298.821 43.7911 296.711 30.5573 287.865C16.1401 278.249 6.54982 261.654 4.66177 243.133C-8.31942 180.371 13.1198 110.261 62.0655 55.4244L62.0611 55.3248Z" 
                                            fill="url(#paint0_linear_20_827)" 
                                            fillOpacity="0.6"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 0.6 }}
                                            transition={{ duration: 2.5, delay: 1.1, ease: "easeInOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="paint0_linear_20_827" x1="416.513" y1="348.721" x2="72.2565" y2="43.9248" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.483986" stopColor="#7E5AFB" />
                                                <stop offset="1" stopColor="#C7B7FF" />
                                            </linearGradient>
                                        </defs>
                                    </motion.svg>
                                </motion.div>

                                {/* Columna izquierda: texto */}
                                <motion.div 
                                    className="flex-1 z-10 flex flex-col justify-center items-start gap-2 mb-4 md:mb-0"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.span 
                                        className="uppercase text-white tracking-widest text-lg md:text-2xl font-medium mb-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        viewport={{ once: true }}
                                    >
                                        {banner?.name}
                                    </motion.span>
                                    <motion.h2 
                                        className="text-2xl md:text-4xl lg:text-[50px] font-medium leading-tight text-white mb-2 max-w-md"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.9 }}
                                        viewport={{ once: true }}
                                    >
                                        <TextWithHighlight text={banner?.description} color="bg-secondary font-semibold" />
                                    </motion.h2>
                                </motion.div>

                                {/* Imagen principal - Responsive */}
                                <motion.div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:relative z-50 md:z-10 lg:relative flex-1 flex justify-center items-end"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.img 
                                        src={`/api/banners/media/${banner?.image}`} 
                                        alt={banner?.name} 
                                        className="w-[200px] md:w-auto h-[250px] md:h-[350px] object-cover md:absolute lg:relative md:bottom-0 select-none" 
                                        draggable="false"
                                        onError={(e) =>
                                            (e.target.src = "/api/cover/thumbnail/null")
                                        }
                                    />
                                </motion.div>

                                {/* Columna derecha: mensaje y WhatsApp */}
                                <motion.div 
                                    className="z-[999] flex flex-col md:flex-row gap-4 md:gap-10 items-center md:pr-8 justify-center md:justify-end min-w-[180px] mt-4 md:mt-8 w-full md:w-auto"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 1.1 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.div 
                                        className="text-white relative text-lg md:text-2xl text-center md:text-end mb-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 1.2 }}
                                        viewport={{ once: true }}
                                    >
                                        <TextWithHighlight text={banner?.button_text} color="bg-white italic font-semibold" split_coma />
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="relative"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 1.3 }}
                                        viewport={{ once: true }}
                                        whileHover={{ 
                                            scale: 1.1,
                                            rotate: 5,
                                            transition: { duration: 0.3 }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <WhatsAppButton buttonData={banner?.button_link}>   
                                            <motion.span 
                                                className="animate-pulse z-10"
                                                animate={{
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <svg width="80" height="80" className="md:w-[101px] md:h-[101px]" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="49.567" cy="49.567" r="49.567" transform="matrix(1 0 0 -1 0.933594 100.066)" fill="#D9D9D9" fillOpacity="0.4" />
                                                    <path d="M87.7015 50.6493C87.7015 30.021 70.979 13.2985 50.3507 13.2985C29.7225 13.2985 13 30.021 13 50.6493C13 71.2775 29.7225 88 50.3507 88C70.979 88 87.7015 71.2775 87.7015 50.6493Z" fill="#BCFF52" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M63.8167 37.8734C60.6384 34.6951 56.4006 33 51.951 33C42.6279 33 35 40.6279 35 49.951C35 52.9174 35.8476 55.8838 37.3308 58.4265L35 66.902L43.8993 64.5712C46.4419 65.8425 49.1964 66.6901 51.951 66.6901C61.274 66.6901 68.902 59.0621 68.902 49.7391C68.902 45.2895 66.995 41.0517 63.8167 37.8734ZM51.951 63.9355C49.4083 63.9355 46.8657 63.2999 44.7468 62.0286L44.323 61.8167L39.0258 63.2999L40.5091 58.2146L40.0853 57.5789C38.6021 55.2482 37.9664 52.7055 37.9664 50.1629C37.9664 42.5349 44.323 36.1783 51.951 36.1783C55.765 36.1783 59.1552 37.6615 61.9097 40.2042C64.6642 42.9587 65.9356 46.3489 65.9356 50.1629C65.9356 57.5789 59.7908 63.9355 51.951 63.9355ZM59.5789 53.3412C59.1552 53.1293 57.0363 52.0699 56.6125 52.0699C56.1888 51.858 55.9768 51.858 55.7649 52.2817C55.553 52.7055 54.7055 53.5531 54.4937 53.9768C54.2818 54.1887 54.0698 54.1887 53.6461 54.1887C53.2223 53.9768 51.951 53.5531 50.2559 52.0699C48.9846 51.0104 48.137 49.5272 47.9251 49.1034C47.7132 48.6797 47.9251 48.4678 48.137 48.2559C48.3489 48.044 48.5608 47.8321 48.7727 47.6202C48.9846 47.4083 48.9846 47.1964 49.1965 46.9846C49.4084 46.7727 49.1965 46.5608 49.1965 46.3489C49.1965 46.137 48.3489 44.0181 47.9251 43.1706C47.7132 42.5349 47.2895 42.5349 47.0776 42.5349C46.8657 42.5349 46.6538 42.5349 46.23 42.5349C46.0181 42.5349 45.5943 42.5349 45.1706 42.9587C44.7468 43.3825 43.6874 44.4419 43.6874 46.5608C43.6874 48.6797 45.1706 50.5866 45.3825 51.0104C45.5944 51.2223 48.3489 55.6719 52.5866 57.367C56.1887 58.8502 56.8244 58.4265 57.672 58.4265C58.5195 58.4265 60.2146 57.367 60.4265 56.5195C60.8502 55.4601 60.8503 54.6125 60.6384 54.6125C60.4265 53.5531 60.0027 53.5531 59.5789 53.3412Z" fill="#222222" />
                                                </svg>
                                            </motion.span>
                                        </WhatsAppButton>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.section>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: sectionsReady ? 1 : 0, y: sectionsReady ? 0 : 30 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <FilterAgencia
                                categories={categories}
                                filter={filter}
                                setFilter={setFilter}
                                landing={landingTodos}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: sectionsReady ? 1 : 0, y: sectionsReady ? 0 : 30 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <Results filter={filter} />
                        </motion.div>
                    </motion.div>



                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <MaintenancePage />
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: sectionsReady ? 1 : 0, y: sectionsReady ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <Footer />
            </motion.div>
        </motion.div>
    );
}

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Blog {...properties} />
            </Base>
        </CarritoProvider>
    );
});
