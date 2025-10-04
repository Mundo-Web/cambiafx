import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const beneficios = [
    {
        icon: "stack",
        title: "Cultura alineada a los objetivos estratégicos",
        desc: "Tus equipos actuarán en coherencia con la visión y desafíos empresariales.",
    },
    {
        icon: "users",
        title: "Mayor compromiso y sentido de pertenencia",
        desc: "Tus equipos actuarán en coherencia con la visión y desafíos empresariales.",
    },
    {
        icon: "users",
        title: "Liderazgo fortalecido",
        desc: "Preparamos a tus líderes para gestionar eficazmente la cultura y dirigir equipos alineados.",
    },
    {
        icon: "users",
        title: "Procesos de RR.HH. coherentes con la nueva cultura",
        desc: "Evita contradicciones entre la cultura declarada y las políticas internas.",
    },
    {
        icon: "stack",
        title: "Transformación cultural medible",
        desc: "Implementamos indicadores y sistemas de seguimiento para demostrar resultados reales.",
    },
    {
        icon: "users",
        title: "Mayor agilidad y capacidad de adaptación",
        desc: "Desarrolla una cultura flexible que responda a nuevos retos y mercados cambiantes.",
    },
];

const IconStack = () => (
    <svg width="50" height="50" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#D62828" /><path d="M10.667 13.333L16 16l5.333-2.667M16 21.333l-5.333-2.666M16 21.333l5.333-2.666M10.667 18.667V13.333M21.333 18.667V13.333M16 10.667l5.333 2.666-5.333 2.667-5.333-2.667L16 10.667z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconUsers = () => (
    <svg width="50" height="50" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#D62828" /><path d="M21.333 22.667v-1.334A2.667 2.667 0 0 0 18.667 18.667h-5.334A2.667 2.667 0 0 0 10.667 21.333v1.334M16 16a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const ServiceSeccionBeneficio = ({ service }) => {
    // Detectar si estamos en vista móvil
    const [isMobile, setIsMobile] = useState(false);

    // Comprobar tamaño de pantalla cuando el componente se monta y en resize
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Verificar inmediatamente
        checkIsMobile();

        // Actualizar en cambio de tamaño de ventana
        window.addEventListener('resize', checkIsMobile);

        // Limpiar event listener
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <section className="w-full bg-primary bg-cover bg-center py-16 px-[5%] flex flex-col items-center justify-center relative" >
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <img
                    src="/assets/cambiogerencia/mask-impacto.webp"
                    alt="Equipo de Cambio Gerencia"
                    className="w-full h-full object-cover rounded-xl opacity-30"
                />
            </div>
            <div className="w-full mx-auto z-50 relative">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <span>
                            <svg width="18" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.50225 0C5.95566 0 4.69727 1.2584 4.69727 2.80499C4.69727 4.35158 5.95566 5.60998 7.50225 5.60998C9.04885 5.60998 10.3072 4.35158 10.3072 2.80499C10.3072 1.2584 9.04885 0 7.50225 0Z" fill="#D62828" />
                                <path d="M7.50112 24.0025C3.65842 24.0025 0.759766 22.4639 0.759766 20.4219C0.759766 19.9629 1.13269 19.59 1.59168 19.59C2.05066 19.59 2.42359 19.9629 2.42359 20.4219C2.42359 21.203 4.40166 22.3387 7.49981 22.3387C10.5993 22.3387 12.576 21.2043 12.576 20.4219C12.576 19.8743 12.4874 19.3657 12.3048 18.8689C12.147 18.4373 12.3674 17.9601 12.799 17.801C13.2306 17.6432 13.7092 17.8636 13.8669 18.2952C14.1147 18.9693 14.2399 19.6839 14.2399 20.4206C14.2425 22.4639 11.3451 24.0025 7.50112 24.0025Z" fill="#D62828" />
                                <path d="M11.4896 21.804C12.3046 21.4414 12.7754 20.9968 12.8132 20.6225C5.70098 16.9581 5.32021 11.2634 5.32021 10.1015C5.32021 9.64249 4.94725 9.26953 4.48823 9.26953C4.02921 9.26953 3.65625 9.64249 3.65625 10.1015C3.65625 11.4082 4.06181 17.6884 11.4896 21.804Z" fill="#D62828" />
                                <path d="M7.49991 6.25781C5.37954 6.25781 3.6543 7.98306 3.6543 10.1034C3.6543 10.5624 4.02725 10.9354 4.48627 10.9354C4.9453 10.9354 5.31825 10.5624 5.31825 10.1034C5.31825 8.9011 6.29628 7.92177 7.49991 7.92177C8.70353 7.92177 9.68156 8.8998 9.68156 10.1034C9.68156 10.9432 8.14671 11.9108 6.66272 12.8458C6.33019 13.0558 5.98722 13.2709 5.64296 13.4965C5.81248 13.9855 6.03026 14.5059 6.31454 15.047C6.72531 14.7732 7.1426 14.5111 7.55077 14.2542C9.58768 12.971 11.3468 11.8626 11.3468 10.1034C11.3455 7.98306 9.62158 6.25781 7.49991 6.25781Z" fill="#D62828" />
                                <path d="M4.23503 14.4766C2.36765 15.8954 0.759766 17.7158 0.759766 20.4191C0.759766 20.8781 1.13272 21.251 1.59174 21.251C2.05076 21.251 2.42372 20.8781 2.42372 20.4191C2.42372 18.5465 3.53085 17.1707 4.95486 16.0271C4.66406 15.4937 4.42673 14.9734 4.23503 14.4766Z" fill="#D62828" />
                            </svg>
                        </span>
                        <span className="uppercase text-white text-sm lg:text-lg font-bold">Beneficios</span>
                    </div>
                    <h2 className="text-2xl mx-auto text-white lg:text-[52px] font-medium mb-6 leading-tight italic max-w-lg ">
                        <TextWithHighlight text={service?.title_benefits} color="bg-accent" />

                    </h2>
                </div>

                {/* Vista móvil con swiper */}
                {isMobile ? (
                    <div className="font-paragraph">                        <Swiper
                        spaceBetween={16}
                        slidesPerView={1.5}
                        centeredSlides={true}
                        loop={true}
                        className="mySwiper"
                        grabCursor={true}
                    >
                        {service?.benefits.map((b, i) => (
                            <SwiperSlide key={i}>
                                <div className="bg-white/5 font-paragraph group min-h-[220px] hover:bg-primary rounded-2xl p-5 md:p-7 flex flex-col h-full backdrop-blur-sm transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl">
                                    <div className="bg-accent rounded-full p-3 mr-4  h-12 w-12 flex items-center justify-center mb-4">
                                        <img
                                            src={`/api/service/media/${b?.image}`}
                                            alt={b?.title}
                                            className="w-6 h-6 object-cover rounded-xl"
                                        />

                                    </div>
                                    <h3 className="text-white text-base md:text-lg font-medium mb-1 md:mb-2 leading-snug line-clamp-2">{b.title}</h3>
                                    <p className="text-white text-sm md:text-base font-light line-clamp-3">{b.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    </div>
                ) : (
                    /* Vista desktop con grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-paragraph">
                        {service?.benefits.map((b, i) => (<div key={i} className="bg-white/5 group hover:bg-primary rounded-2xl p-5 md:p-7 flex flex-col h-full backdrop-blur-sm transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl">
                            <div className="bg-accent rounded-full p-3 mr-4 h-12 w-12 flex items-center justify-center mb-4">
                                <img
                                    src={`/api/service/media/${b?.image}`}
                                    alt={b?.title}
                                    className="w-6 h-6 object-cover rounded-xl"
                                />

                            </div>
                            <h3 className="text-white text-xl md:text-2xl font-medium mb-2 leading-snug line-clamp-2">{b.title}</h3>
                            <p className="text-white text-base md:text-lg font-light line-clamp-3">{b.description}</p>
                        </div>
                        ))}
                    </div>
                )}            </div>

            {/* Estilos personalizados para el swiper */}            <style>{`
                .swiper-slide {
                    transition: all 0.3s ease;
                    opacity: 0.7;
                    transform: scale(0.85);
                }
                .swiper-slide-active {
                    opacity: 1;
                    transform: scale(1);
                }
                .swiper-slide-next, .swiper-slide-prev {
                    opacity: 0.85;
                    transform: scale(0.9);
                }
                /* Asegurar que el contenido dentro de los slides tenga altura completa */
                .swiper-slide > div {
                    height: 100%;
                }
                /* Evitar que los slides se salgan de la pantalla en móvil */
                @media (max-width: 640px) {
                    .swiper-container {
                        padding: 0 5%;
                        overflow: visible;
                    }
                }
            `}</style>
        </section>
    );
};

export default ServiceSeccionBeneficio;
