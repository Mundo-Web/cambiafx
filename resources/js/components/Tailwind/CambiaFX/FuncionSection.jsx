import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { motion } from 'framer-motion';

const FuncionSection = ({ data, pasos }) => {
    return (
        <section className="bg-primary py-16 px-2 md:px-0 w-full font-title">
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
                        <TextWithHighlight text={data?.title} color='bg-neutral-dark font-semibold' />
                    </motion.h2>
                    <motion.p
                        className="text-base whitespace-pre-line text-neutral-light max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        {data?.description || ""}
                    </motion.p>
                </motion.div>

                {/* Desktop Grid - Mantener original */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-12 mt-10 max-w-5xl mx-auto">
                    {pasos && pasos.length > 0 && pasos.map((paso, index) => (
                        <motion.div
                            className="flex flex-col items-start"
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
                        >
                            <motion.div
                                className={`rounded-2xl ${index === 1 ? "w-[250px] mt-4 h-[200px]" : "w-[220px] h-[220px]"}  flex items-end justify-end mb-6`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.25 + index * 0.15 }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                                style={{ overflow: 'visible' }}
                            >
                                <motion.img
                                    src={`/api/speciality/media/${paso?.image}`}
                                    alt={paso?.name}
                                    className="w-full h-full object-cover cursor-pointer rounded-2xl"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                                />
                            </motion.div>
                          
                            <motion.div
                                className="text-2xl md:text-2xl font-medium text-neutral-dark mb-2 cursor-pointer"
                                initial={{ opacity: 0, x: 10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                                whileHover={{
                                    scale: 1.03,
                                    x: 3,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <TextWithHighlight text={`${paso?.name}`} color='bg-neutral-dark font-semibold' />
                            </motion.div>
                            <motion.div
                                className="text-neutral-light text-base cursor-pointer"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: 0.45 + index * 0.15 }}
                                whileHover={{
                                    color: '#4b5563',
                                    y: -2,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                {paso?.description}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Slider */}
                <motion.div
                    className="block md:hidden mt-10 px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="relative">
                        <div
                            className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-hide "
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {pasos && pasos.length > 0 && pasos.map((paso, index) => (
                                <motion.div
                                    className="flex flex-col items-center justify-center min-w-full min-h-full pt-4 snap-center"
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
                                >
                                    <motion.div
                                        className={`rounded-2xl ${index === 1 ? "w-[250px] mt-4 h-[200px]" : "w-[220px] h-[220px]"}  flex items-center justify-center mb-6`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.6, delay: 0.25 + index * 0.15 }}
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { duration: 0.3, ease: "easeOut" }
                                        }}
                                        style={{ overflow: 'visible' }}
                                    >
                                        <motion.img
                                            src={`/api/speciality/media/${paso?.image}`}
                                            alt={paso?.name}
                                            className="w-full h-full object-cover cursor-pointer rounded-2xl"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                                        />
                                    </motion.div>

                                    <motion.div className="text-center px-2">
                                       

                                        <motion.div
                                            className="text-xl font-medium text-neutral-dark mb-3"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                        >
                                            <TextWithHighlight text={`${paso?.name}`} color='bg-neutral-dark font-semibold' />
                                        </motion.div>

                                        <motion.div
                                            className="text-neutral-light text-sm leading-relaxed"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.5, delay: 0.45 + index * 0.1 }}
                                        >
                                            {paso?.description}
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Indicadores de scroll para mobile */}
                        <motion.div
                            className="flex justify-center mt-6 gap-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            {pasos?.map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="w-2 h-2 bg-constrast rounded-full opacity-60"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                                    whileHover={{ scale: 1.3, opacity: 1 }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* CSS para ocultar scrollbar en mobile */}
            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
export default FuncionSection;