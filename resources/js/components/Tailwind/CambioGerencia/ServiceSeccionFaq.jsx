import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppButton from "../../Shared/WhatsAppButton";
import TextWithHighlight from "../../../Utils/TextWithHighlight";




const DownIcon = ({ isOpen }) => (
  <motion.div
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    <svg width="53" height="52" viewBox="0 0 53 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect 
        x="0.230469" 
        width="52" 
        height="52" 
        rx="26" 
        fill={isOpen ? "#7D5AFA" : "#BBFF52"}
        transition={{ duration: 0.3 }}
      />
      <motion.path 
        d="M20.2305 29.5L25.5234 24.2071C25.8567 23.8738 26.0234 23.7071 26.2305 23.7071C26.4376 23.7071 26.6042 23.8738 26.9376 24.2071L32.2305 29.5" 
        stroke={isOpen ? "#BCFF52" : "#1A1A1A"} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        transition={{ duration: 0.3 }}
      />
    </svg>
  </motion.div>
);


const ServiceSeccionFaq = ({ landingFAQS, faqs = [] }) => {
  // Cambiamos a un solo ID para accordion tipo "accordion"
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    // Si el item ya está abierto, lo cerramos, sino abrimos el nuevo y cerramos el anterior
    if (openItem === id) {
      setOpenItem(null);
    } else {
      setOpenItem(id);
    }
    
    // Debug: verificar el estado y los datos
    console.log('Toggle FAQ:', {
      id,
      isOpen: id === openItem,
      previousOpen: openItem,
      item: faqs.find(f => f.id === id),
      allFaqs: faqs
    });
  }
  return (
    <motion.section 
      className="w-full overflow-hidden font-title relative bg-constrast text-white px-[5%] py-12 md:py-24 flex flex-col lg:flex-row gap-10 lg:gap-20 mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* FAQ */}
      <motion.div 
        className="flex-1 w-full lg:w-6/12 z-[999]"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.p
          className="uppercase text-white text-sm font-medium tracking-[8%] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          FAQS
        </motion.p>
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-[40px] font-medium mb-4 md:mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <TextWithHighlight text={landingFAQS?.title} color="bg-white font-semibold" />
        </motion.h2>
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="rounded-2xl overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <motion.button
              onClick={() => toggleItem(item.id)}
              className={`w-full px-4 md:px-6 text-left flex items-center justify-between transition-all duration-300 ease-in-out relative ${
                openItem === item.id
                  ? "bg-neutral-dark text-white pt-3 md:pt-4 pb-0" 
                  : "bg-primary text-neutral-dark py-3 md:py-8"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base w-9/12 md:text-2xl font-medium pr-2 md:pr-4">
                {item.name}
              </span>

              <div className="flex-shrink-0 flex items-center justify-center cursor-pointer">
                <DownIcon isOpen={openItem === item.id} />
              </div>
            </motion.button>
            
            <AnimatePresence>
              {openItem === item.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1,
                    transition: {
                      height: { duration: 0.4, ease: "easeInOut" },
                      opacity: { duration: 0.3, delay: 0.1 }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: "easeInOut" },
                      opacity: { duration: 0.2 }
                    }
                  }}
                  className="bg-neutral-dark text-neutral overflow-hidden"
                >
                  <motion.div 
                    className="px-4 md:px-6 py-4"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {item.description ? (
                      <p className="text-sm w-10/12 md:text-lg leading-relaxed">
                        {item.description}
                      </p>
                    ) : (
                      <p className="text-sm w-10/12 md:text-lg leading-relaxed text-red-400">
                        No hay respuesta para este FAQ.
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      </motion.div>

    <motion.div 
      className="z-10 flex-1 flex justify-center items-end"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <motion.svg 
        className="absolute z-10 right-0 -bottom-10 h-full" 
        width="1166" 
        height="446" 
        viewBox="0 0 1166 446" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <motion.path 
          d="M1423 147.293C1400.84 161.266 1366.96 179.673 1322.76 192.775C1245.03 215.813 1181.04 208.91 1136.85 203.694C1084 197.456 1042.34 192.536 998.337 163.666C994.889 161.405 919.964 127.924 925.428 67.248C930.893 6.56248 1003.8 -0.379801 1053.01 47.2344C1102.22 94.8486 1104.22 140.033 1094.93 180.04C1081.76 236.789 1033.96 271.163 994.69 294.658C823.359 397.156 669.747 367.974 473 425C367.639 455.538 92 509.5 15 654.5" 
          stroke="#BCFF52" 
          strokeWidth="32" 
          strokeMiterlimit="10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 0.8, ease: "easeInOut" }}
        />
      </motion.svg>
      
      <motion.img 
        src={`/api/landing_home/media/${landingFAQS?.image}`} 
        alt={landingFAQS?.title} 
        className="h-[700px] object-cover absolute bottom-0 right-28 select-none z-20" 
        draggable="false"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
    {/* Card lateral 
      <div className="w-full max-w-xs mx-auto lg:mx-0">
        <div className="rounded-2xl overflow-hidden shadow-lg relative bg-white">
          <img
            src="/assets/cambiogerencia/card-contact-2.webp"
            alt="Servicios de RR.HH"
            className="w-full  h-96 md:h-96 object-cover"
          />          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 md:p-6">
            <h3 className="text-white text-lg md:text-xl font-medium mb-1 drop-shadow">Servicios de RR.HH</h3>
            <p className="text-white text-xs mb-3 md:mb-4 drop-shadow">Herramientas ágiles para la gestión del talent, enean commodo ligula eget dolor.</p>
            <WhatsAppButton 
              variant="constrast" 
              size="medium"
              className="bg-constrast text-white hover:bg-primary border-none"
              showIcon={true}
            >
              Reserva una consulta
            </WhatsAppButton>
          </div>
        </div>
      </div>
      */}

  </motion.section>
  );
};

export default ServiceSeccionFaq;
