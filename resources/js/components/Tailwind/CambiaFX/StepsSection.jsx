import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const StepsSection = ({ data, pasos }) => {
    const getImagePath = (paso) => {
        if (!paso?.image) return "/api/cover/thumbnail/null";
        // Si el paso tiene 'title', es una landing-specific step
        if (paso.title !== undefined) {
            return `/api/transactional_landings/media/${paso.image}`;
        }
        // Si no, es una Specialty global
        return `/api/speciality/media/${paso.image}`;
    };

    const getTitle = (paso) => paso?.title || paso?.name || "";

    const count = pasos?.length || 0;
    const colClass =
        count === 1 ? "md:grid-cols-1 max-w-sm" :
            count === 2 ? "md:grid-cols-2 max-w-2xl" :
                count === 3 ? "md:grid-cols-3 max-w-4xl" :
                    "md:grid-cols-4 max-w-6xl";

    return (
        <section className="bg-primary py-16 px-2 md:px-0 w-full font-title overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.h2
                        className="text-4xl md:text-6xl font-medium text-neutral-dark mb-4"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <TextWithHighlight
                            text={data?.title || "Cambia en 3 pasos"}
                            color="bg-neutral-dark font-semibold"
                        />
                    </motion.h2>
                    <motion.p
                        className="text-base whitespace-pre-line text-neutral-light max-w-xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        {data?.description ||
                            "Es más fácil que el banco y 100% seguro."}
                    </motion.p>
                </motion.div>

                {/* Desktop Grid - columnas dinámicas según cantidad de pasos, centrado */}
                <div className={`hidden md:grid grid-cols-1 ${colClass} gap-12 mt-10 mx-auto`}>
                    {pasos &&
                        pasos.length > 0 &&
                        pasos.map((paso, index) => (
                            <motion.div
                                className="flex flex-col items-start"
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.2 + index * 0.15,
                                }}
                            >
                                <motion.div
                                    className="w-full aspect-square flex items-center justify-center mb-6 "
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.25 + index * 0.15,
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    <motion.img
                                        src={getImagePath(paso)}
                                        alt={getTitle(paso)}
                                        className="w-full h-full object-cover cursor-pointer"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.3 + index * 0.15,
                                        }}
                                    />
                                </motion.div>

                                <motion.div
                                    className="text-2xl md:text-2xl font-medium text-neutral-dark mb-2 cursor-pointer"
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.15,
                                    }}
                                    whileHover={{
                                        scale: 1.03,
                                        x: 3,
                                        transition: { duration: 0.2 },
                                    }}
                                >
                                    <TextWithHighlight
                                        text={getTitle(paso)}
                                        color="bg-neutral-dark font-semibold"
                                    />
                                </motion.div>
                                <motion.div
                                    className="text-neutral-light text-base cursor-pointer leading-relaxed"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.45 + index * 0.15,
                                    }}
                                    whileHover={{
                                        color: "#4b5563",
                                        y: -2,
                                        transition: { duration: 0.2 },
                                    }}
                                >
                                    {paso?.description}
                                </motion.div>
                            </motion.div>
                        ))}
                </div>

                {/* Mobile Swiper */}
                <motion.div
                    className="block md:hidden mt-10 pb-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <Swiper
                        modules={[Pagination]}
                        slidesPerView={1}
                        spaceBetween={24}
                        loop={true}
                        pagination={{ clickable: true }}
                        className="steps-swiper"
                    >
                        {pasos &&
                            pasos.length > 0 &&
                            pasos.map((paso, index) => (
                                <SwiperSlide key={index}>
                                    <div className="flex flex-col items-center justify-center pt-4 pb-2 px-6">
                                        {/* Imagen */}
                                        <div className="w-[240px] h-[240px] flex items-center justify-center mb-6 overflow-hidden rounded-3xl">
                                            <img
                                                src={getImagePath(paso)}
                                                alt={getTitle(paso)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Texto */}
                                        <div className="text-center px-2">
                                            <div className="text-xl font-medium text-neutral-dark mb-3">
                                                <TextWithHighlight
                                                    text={getTitle(paso)}
                                                    color="bg-neutral-dark font-semibold"
                                                />
                                            </div>
                                            <div className="text-neutral-light text-sm leading-relaxed">
                                                {paso?.description}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </motion.div>
            </div>

            <style>{`
                .steps-swiper .swiper-pagination {
                    position: relative;
                    margin-top: 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                }
                .steps-swiper .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: rgba(12, 12, 12, 0.2);
                    opacity: 1;
                    margin: 0 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 9999px;
                }
                .steps-swiper .swiper-pagination-bullet-active {
                    background: #7e5afa;
                    width: 24px;
                }
            `}</style>
        </section>
    );
};

export default StepsSection;
