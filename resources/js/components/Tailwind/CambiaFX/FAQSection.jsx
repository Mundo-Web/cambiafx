import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const FAQSection = ({ faqs = [] }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="bg-white py-24 px-[5%]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium text-neutral-dark mb-4">
                        <TextWithHighlight
                            text="Preguntas *Frecuentes*"
                            color="bg-constrast font-bold"
                        />
                    </h2>
                    <p className="text-neutral-light/60 text-lg">
                        Todo lo que necesitas saber para cambiar tus soles a
                        dólares.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-neutral-light/10 rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-neutral-light/5 transition-colors"
                            >
                                <span className="text-xl font-medium text-neutral-dark pr-8">
                                    {faq.question || faq.title}
                                </span>
                                <motion.div
                                    animate={{
                                        rotate: activeIndex === index ? 180 : 0,
                                    }}
                                    className="flex-shrink-0"
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 md:px-8 pb-8 text-neutral-light/70 text-lg leading-relaxed whitespace-pre-line">
                                            {faq.answer || faq.description}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
