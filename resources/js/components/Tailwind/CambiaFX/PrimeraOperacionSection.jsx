import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import TextWithHighlight from '../../../Utils/TextWithHighlight'
import WhatsAppButton from '../../Shared/WhatsAppButton';

export default function PrimeraOperacionSection({ banner }) {
    const [paymentMethods10min, setPaymentMethods10min] = useState([]);
    const [paymentMethods24h, setPaymentMethods24h] = useState([]);

    useEffect(() => {
        // Cargar métodos de pago de 10 min
        fetch('/api/payment-methods/immediate-10min')
            .then(response => response.json())
            .then(data => setPaymentMethods10min(data))
            .catch(error => {});

        // Cargar métodos de pago de 24h
        fetch('/api/payment-methods/immediate-24h')
            .then(response => response.json())
            .then(data => setPaymentMethods24h(data))
            .catch(error => {});
    }, []);

    return (
        <section className={`bg-neutral-dark px-[5%] py-6  md:pb-10 w-full font-title ${banner ? "md:pt-20":"md:pt-10"}`}>
            <div className=" mx-auto px-4">
                {/* Banner central */}
               {banner && (

                 <motion.div
                    className="bg-[#C6FF6B] p-4  lg:px-16 lg:py-2 rounded-2xl flex flex-col md:flex-row items-center justify-between   relative overflow-hidden  lg:overflow-visible "
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Texto y promo */}
                    <motion.div
                        className="flex-1 flex flex-col justify-center z-[999]"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <motion.h2
                            className=" text-3xl lg:text-[36px]  max-w-md font-semibold leading-[1.1] text-text-neutral-light mb-2"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <TextWithHighlight text={banner?.name} color='bg-constrast' />
                        </motion.h2>
                        <motion.p
                            className="w-9/12 lg:w-full text-base  text-text-neutral-light  font-paragraph"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            {banner?.description}
                        </motion.p>
                    </motion.div>
                    <motion.div
                        className="hidden lg:block absolute bottom-0 right-16 "
                       
                    >
                        <img src="/assets/cambiafx/operation-overlay.png" alt="Teléfono móvil" className=" h-[170px] w-auto z-10 relative" />
                    </motion.div>
                    {/* Teléfono */}
                    <motion.div
                        className=" absolute bottom-0 flex-1 left-1/3 translate-x-1/2 z-50"
                       
                    >
                        <img src={`/api/banners/media/${banner?.image}`} alt="Teléfono móvil"
                            className="w-[200px] md:w-[200px] lg:w-[250px] h-auto z-10 relative"
                            onError={(e) =>
                                (e.target.src =
                                    "/api/cover/thumbnail/null")
                            } />
                    </motion.div>
                    {/* Botón promo */}
                    <motion.div
                        className="flex-1 z-[999] flex mt-4 lg:mt-0 lg:justify-end items-center md:py-12 w-full md:w-auto"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                    <WhatsAppButton buttonData={banner?.button_link}>    <motion.button
                            className="bg-constrast uppercase  text-white px-6 py-4 rounded-full font-medium text-sm flex items-center gap-3 transition-all duration-300 shadow-lg"
                            whileHover={{ scale: 1.07, backgroundColor: '#1A1A1A', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)' }}
                        >
                            {banner?.button_text || "¡Quiero cambiar!"}
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_141_6110)">
                                    <path d="M0 24.5002C0.12869 24.0263 0.248084 23.5822 0.369923 23.1391C0.789268 21.6102 1.21302 20.0827 1.62355 18.5513C1.65487 18.4347 1.63432 18.2761 1.57805 18.1677C-0.391453 14.3705 -0.483445 10.5376 1.54037 6.76187C3.32344 3.43558 6.1419 1.33566 9.88077 0.709535C14.8752 -0.12692 18.9918 1.54257 21.8725 5.68873C26.7823 12.7547 22.7601 22.4403 14.246 24.0985C11.5635 24.6207 8.98826 24.2162 6.55195 22.9746C6.38607 22.8902 6.24221 22.8785 6.06557 22.9254C4.12787 23.4373 2.18822 23.9429 0.248573 24.4489C0.180068 24.467 0.110096 24.4777 0 24.5002ZM2.87327 21.678C4.04273 21.372 5.15593 21.0895 6.26276 20.7854C6.52014 20.7147 6.71587 20.7498 6.94438 20.884C9.13603 22.1714 11.4921 22.5984 13.9842 22.0962C21.021 20.6781 24.2955 12.5478 20.1246 6.71307C17.7309 3.36481 14.3575 2.00326 10.2923 2.67574C5.62323 3.44875 2.24645 7.44509 2.1207 12.1705C2.06638 14.2109 2.61882 16.0917 3.73006 17.8061C3.82988 17.9603 3.86071 18.095 3.80688 18.28C3.55978 19.1311 3.33029 19.9865 3.09591 20.8411C3.02349 21.1041 2.95547 21.3686 2.87327 21.678Z" fill="white" />
                                    <path d="M15.2814 18.494C14.3845 18.4799 13.6417 18.1671 12.8847 17.8825C10.3271 16.9216 8.51662 15.1121 7.07656 12.8672C6.6626 12.2221 6.25695 11.574 6.02844 10.8361C5.57191 9.36183 5.79406 8.03834 6.93857 6.93738C7.4 6.49378 7.95684 6.42106 8.55136 6.60797C8.83027 6.69581 9.01768 6.89053 9.12043 7.17065C9.40619 7.94903 9.71153 8.72058 9.97821 9.50482C10.0335 9.66684 10.0066 9.90206 9.92487 10.0543C9.79667 10.2934 9.59116 10.4911 9.41598 10.7044C9.34356 10.7922 9.26234 10.8732 9.19139 10.962C8.90367 11.3232 8.8978 11.4569 9.12631 11.8619C9.99093 13.3943 11.2147 14.5509 12.7854 15.3444C12.894 15.3995 13.0056 15.4503 13.1206 15.4913C13.3897 15.5869 13.627 15.5581 13.8247 15.3224C14.1178 14.9735 14.4285 14.6402 14.7212 14.2908C14.9751 13.9867 15.1067 13.9326 15.4806 14.118C16.1876 14.4694 16.8849 14.8412 17.5827 15.2107C18.2212 15.5484 18.2408 15.5957 18.1077 16.3009C17.8905 17.4521 16.9334 18.292 15.6484 18.4584C15.5031 18.4769 15.3568 18.4867 15.2814 18.494Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_141_6110">
                                        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </motion.button></WhatsAppButton>
                    </motion.div>
                </motion.div>
               )}

                {/* Bloques de transferencias */}
                <div className={`flex flex-col md:flex-row justify-between lg:items-end gap-8 ${banner ? 'mt-10' : 'mt-0'}`}>
                    {/* Izquierda */}
                    <motion.div
                        className="flex flex-col md:flex-row items-start gap-6 md:gap-10"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.0006 36.6663C10.7958 36.6663 3.33398 29.2043 3.33398 19.9997C3.33398 10.7949 10.7959 3.33301 20.0006 3.33301C27.4634 3.33301 33.7101 8.23782 35.8339 14.9997H31.6673" stroke="#BCFF52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 13.333V19.9997L23.3333 23.333" stroke="#BCFF52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M36.5918 21.6667C36.6413 21.1182 36.6667 20.5622 36.6667 20M25 36.6667C25.5693 36.4793 26.1255 36.2607 26.6667 36.013M34.651 28.3333C34.9725 27.714 35.2592 27.0722 35.5083 26.4103M30.3208 33.7153C30.8948 33.2402 31.4385 32.7263 31.948 32.1775" stroke="#BCFF52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <div>
                                <div className="text-white text-xl  leading-tight">Transferencias Inmediatas</div>
                                <div className="text-[#C6FF6B] text-xl font-semibold leading-tight">10 min
</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {paymentMethods10min.map((method, idx) => (
                                <motion.img
                                    key={method.id}
                                    src={`/api/payment-methods/media/${method.image}`}
                                    alt={method.name}
                                    className="w-12 h-12 rounded-lg"
                                    title={method.name}
                                    onError={(e) => {
                                        e.target.src = "/api/cover/thumbnail/null";
                                    }}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                                    whileHover={{ scale: 1.12, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)' }}
                                />
                            ))}
                        </div>
                    </motion.div>
                    {/* Derecha */}
                    <motion.div
                        className="flex flex-col md:flex-row items-start gap-6 md:gap-10"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.0006 36.6663C10.7958 36.6663 3.33398 29.2043 3.33398 19.9997C3.33398 10.7949 10.7959 3.33301 20.0006 3.33301C27.4634 3.33301 33.7101 8.23782 35.8339 14.9997H31.6673" stroke="#BCFF52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 13.333V19.9997L23.3333 23.333" stroke="#BCFF52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M36.5918 21.6667C36.6413 21.1182 36.6667 20.5622 36.6667 20M25 36.6667C25.5693 36.4793 26.1255 36.2607 26.6667 36.013M34.651 28.3333C34.9725 27.714 35.2592 27.0722 35.5083 26.4103M30.3208 33.7153C30.8948 33.2402 31.4385 32.7263 31.948 32.1775" stroke="#BCFF52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <div>
                                <div className="text-white text-xl  leading-tight">Transferencias Interbancarias </div>
                                <div className="text-[#C6FF6B] text-xl font-semibold leading-tight">Entre 2 y 24 hrs hábiles</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {paymentMethods24h.map((method, idx) => (
                                <motion.img
                                    key={method.id}
                                    src={`/api/payment-methods/media/${method.image}`}
                                    alt={method.name}
                                    className="w-12 h-12 rounded-lg"
                                    title={method.name}
                                    onError={(e) => {
                                        e.target.src = "/api/cover/thumbnail/null";
                                    }}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                                    whileHover={{ scale: 1.12, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)' }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}