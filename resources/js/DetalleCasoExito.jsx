import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { ArrowRight } from "lucide-react";
import ServiceSeccionFaq from "./components/Tailwind/CambioGerencia/ServiceSeccionFaq";
import TextWithHighlight from "./Utils/TextWithHighlight";
import WhatsAppButton, { WhatsAppButtonWithArrow } from "./components/Shared/WhatsAppButton";
const DetalleCasoExito = ({
  successStory,
  successStoryRecents = [],
  relatedServices = [],



  
}) => {
  // Iconos para los beneficios
  const IconPeople = () => (
    <div className="bg-accent rounded-full p-3 text-white">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const IconTarget = () => (
    <div className="bg-accent rounded-full p-3 text-white">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
  const DownIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#0090E3" /><path d="M8 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  const UpIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#D62828" /><path d="M16 14l-4-4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    // Crear una nueva copia del Set para mantener la inmutabilidad
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  }

  const CaseCard = ({ title, slug, image, description }) => {
    return (
      <a href={`/casos-de-exito/${slug}`} className="relative group overflow-hidden rounded-lg shadow-lg font-paragraph">
        {/* Imagen de fondo */}
        <img
          src={`/api/success_story/media/${image}`}
          alt={title}
          className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay oscuro por defecto - solo muestra título y botón */}
        <div className="absolute inset-0 font-paragraph italic  bg-black/50 flex items-end justify-end p-6 transition-all duration-300 group-hover:hidden group-hover:opacity-0 z-10">
          <div className="flex gap-2">
            <h3 className="text-white text-xl font-medium mb-2 leading-tight">
              {(title || "").replace(/\*/g, "")}
            </h3>

            <div className="flex justify-end">
              <a href={`/casos-de-exito/${slug}`} className="bg-accent transition-colors h-10 w-10 duration-300 rounded-lg p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Overlay azulado en hover - muestra título, descripción y botón */}
        <div className="absolute inset-0 bg-constrast  opacity-0 flex items-end  justify-end p-6  group-hover:bg-opacity-80 group-hover:opacity-100 transition-all duration-500 z-[999]">
          <div className="flex  gap-4 w-full">
            <div>
              <h3 className="text-white italic text-2xl line-clamp-2 font-medium mb-2 leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {(title || "").replace(/\*/g, "")}
              </h3>
              {description && (
                <p className="text-white/90 line-clamp-1 text-sm mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  {description}
                </p>
              )}
            </div>
            <div className="flex justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-150">
              <a href={`/casos-de-exito/${slug}`} className="bg-accent  transition-colors w-10 h-10 duration-300 rounded-lg p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </a>
    );
  };

 
  return (
    <>
      <Header />
      <div className="w-full font-paragraph">
        {/* Sección de información del proyecto */}
        <section className="w-full px-[5%] py-10 bg-white flex flex-col md:flex-row gap-10">
          {/* Tarjeta de información del proyecto */}
          <div className="hidden lg:flex  w-full md:w-64  flex-col gap-10">
            <div className="w-full  bg-neutral-light shadow-md rounded-lg p-6 h-fit">
              <h3 className="text-neutral text-lg font-semibold mb-4">Información del proyecto</h3>

              <div className="space-y-2 bg-white p-4 rounded-lg">
                <div className="border-b-2 border-neutral-light pb-2">
                  <p className="text-xs font-semibold text-constrast mb-1">Categoría</p>
                  <p className="text-base text-neutral font-normal">{successStory?.category_project}</p>
                </div>

                <div className="border-b-2 border-neutral-light pb-2">
                  <p className="text-xs font-semibold text-constrast mb-1">Cliente</p>
                  <p className="text-base text-neutral font-normal">{successStory?.client_project}</p>
                </div>

                <div className="border-b-2 border-neutral-light pb-2">
                  <p className="text-xs font-semibold text-constrast mb-1">Fecha de inicio</p>
                  <p className="text-base text-neutral font-normal">{successStory?.date_start_project}</p>
                </div>

                <div className="border-b-2 border-neutral-light pb-2">
                  <p className="text-xs font-semibold text-constrast mb-1">Fecha de finalización</p>
                  <p className="text-base text-neutral font-normal">{successStory?.date_end_project}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-constrast mb-1">Duración</p>
                  <p className="text-base text-neutral font-normal">{successStory?.duration}</p>
                </div>
              </div>


            </div>
            {/* Tarjeta de información de la empresa */}
            <div className="w-full  bg-neutral-light shadow-md rounded-lg p-6 h-fit">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={`/api/success_story/media/${successStory?.company_logo}`}
                  alt={successStory?.company_name}
                  className="h-28  object-cover "
                />
              </div>

              <h4 className="text-center text-2xl font-medium text-neutral mb-2">{successStory?.company_name}</h4>
              <p className="text-sm text-center text-neutral-dark mb-6">{successStory?.company_summary}</p>

              <div className="mb-8">
                <div className="flex justify-center items-center mb-2">
                  <span className="text-6xl  font-medium text-neutral-dark">{successStory?.company_percentage} <span className="text-accent">%</span></span>
                  <span></span>
                </div>
                <p className="text-sm text-neutral-dark">{successStory?.company_description_percentage}</p>
              </div>

              <div>
                <h5 className="text-xl text-center font-medium text-neutral-dark mb-3">Productos o servicios utilizados</h5>
                <ul className="space-y-2">
                  {relatedServices && relatedServices.length > 0 ? (
                    relatedServices.map((service, index) => (
                      <a href={`/servicio/${service.slug}`} target="_blank" rel="noopener noreferrer" key={index} className="flex items-center gap-2">
                        <span className="bg-accent rounded-full p-1">
                          <img src={`/api/service/media/${service?.image_secondary}`} 
                          alt={service.name || service.title} className="w-4 h-4 rounded-full" 
                          onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          loading="lazy" />
                        </span>
                        <span className="text-base">{service.name || service.title}</span>
                      </a>
                    ))
                  ) : (
                    <li className="flex items-center gap-2">
                      <span className="text-neutral-dark text-sm">No hay servicios asociados</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div
              className={`relative w-full aspect-[9/10] h-[350px] font-paragraph rounded-lg shadow-xl overflow-hidden flex flex-col  transition-all duration-300 z-10`}
            >
              {/* Overlay gradiente negro a transparente de abajo hacia arriba */}
              <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none "
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0), #ffffff)"
                }}
              />              <img
                src={"/assets/cambiogerencia/card-contact.webp"}
                alt={"Servicios de RR.HH"}
                className="w-full h-full object-cover z-10 relative group-hover:opacity-0 transition-opacity duration-300"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/808080?text=Imagen+no+disponible"; }}
              />
              <div className="p-6 flex flex-col flex-grow z-20  absolute bottom-0 text-white">
                <h3 className={`text-xl font-medium mb-2 `}>Servicios de RR.HH</h3>
                <p className={`text-xs mb-4 flex-grow  text-white`}>Herramientas ágiles para la gestión del talent, enean commodo ligula eget dolor. </p>
                <WhatsAppButton
                  variant="constrast"

                  className="w-full bg-constrast hover:bg-primary transition-colors duration-300s"
                >
                  Reserva una consulta
                </WhatsAppButton>



              </div>
            </div>
          </div>






          {/* Contenido principal */}
          <div className="flex-1">
            {/* Imagen de proyecto */}
            <div className="hidden lg:flex flex-1 rounded-lg overflow-hidden mb-8">
              <img
                src={`/api/success_story/media/${successStory?.image}`}
                alt={successStory?.name}
                className="w-full aspect-[16/7] object-cover"
              />
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span>
                  <svg width="18" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.50225 0C5.95566 0 4.69727 1.2584 4.69727 2.80499C4.69727 4.35158 5.95566 5.60998 7.50225 5.60998C9.04885 5.60998 10.3072 4.35158 10.3072 2.80499C10.3072 1.2584 9.04885 0 7.50225 0Z" fill="#D62828" />
                    <path d="M7.50112 24.0025C3.65842 24.0025 0.759766 22.4639 0.759766 20.4219C0.759766 19.9629 1.13269 19.59 1.59168 19.59C2.05066 19.59 2.42359 19.9629 2.42359 20.4219C2.42359 21.203 4.40166 22.3387 7.49981 22.3387C10.5993 22.3387 12.576 21.2043 12.576 20.4219C12.576 19.8743 12.4874 19.3657 12.3048 18.8689C12.147 18.4373 12.3674 17.9601 12.799 17.801C13.2306 17.6432 13.7092 17.8636 13.8669 18.2952C14.1147 18.9693 14.2399 19.6839 14.2399 20.4206C14.2425 22.4639 11.3451 24.0025 7.50112 24.0025Z" fill="#D62828" />
                    <path d="M11.4896 21.804C12.3046 21.4414 12.7754 20.9968 12.8132 20.6225C5.70098 16.9581 5.32021 11.2634 5.32021 10.1015C5.32021 9.64249 4.94725 9.26953 4.48823 9.26953C4.02921 9.26953 3.65625 9.64249 3.65625 10.1015C3.65625 11.4082 4.06181 17.6884 11.4896 21.804Z" fill="#D62828" />
                    <path d="M7.49991 6.25781C5.37954 6.25781 3.6543 7.98306 3.6543 10.1034C3.6543 10.5624 4.02725 10.9354 4.48627 10.9354C4.9453 10.9354 5.31825 10.5624 5.31825 10.1034C5.31825 8.9011 6.29628 7.92177 7.49991 7.92177C8.70353 7.92177 9.68156 8.8998 9.68156 10.1034C9.68156 10.9432 8.14671 11.9108 6.66272 12.8458C6.33019 13.0558 5.98722 13.2709 5.64296 13.4965C5.81248 13.9855 6.03026 14.5059 6.31454 15.047C6.72531 14.7732 7.1426 14.5111 7.55077 14.2542C9.58768 12.971 11.3468 11.8626 11.3468 10.1034C11.3455 7.98306 9.62158 6.25781 7.49991 6.25781Z" fill="#D62828" />
                    <path d="M4.23503 14.4766C2.36765 15.8954 0.759766 17.7158 0.759766 20.4191C0.759766 20.8781 1.13272 21.251 1.59174 21.251C2.05076 21.251 2.42372 20.8781 2.42372 20.4191C2.42372 18.5465 3.53085 17.1707 4.95486 16.0271C4.66406 15.4937 4.42673 14.9734 4.23503 14.4766Z" fill="#D62828" />
                  </svg>
                </span>
                <h3 className="uppercase text-neutral-dark text-sm lg:text-lg font-bold">Caso de éxito</h3>
              </div>

            </div>

            <h2 className="text-[40px]  lg:text-[52px] font-medium mb-6 leading-tight italic">
              <TextWithHighlight text={successStory?.name} />

            </h2>

            <div className="space-y-6 mb-8 font-light">
              <p className="text-neutral-dark ">{successStory?.description}</p>
            </div>
            <div className=" lg:hidden flex gap-10 mb-10 flex-col">
              <div className="w-full  bg-neutral-light shadow-md rounded-lg p-6 h-fit">
                <h3 className="text-neutral text-lg font-semibold mb-4">Información del proyecto</h3>

                <div className="space-y-2 bg-white p-4 rounded-lg">
                  <div className="border-b-2 border-neutral-light pb-2">
                    <p className="text-xs font-semibold text-constrast mb-1">Categoría</p>
                    <p className="text-base text-neutral font-normal">{successStory?.category_project}</p>
                  </div>

                  <div className="border-b-2 border-neutral-light pb-2">
                    <p className="text-xs font-semibold text-constrast mb-1">Cliente</p>
                    <p className="text-base text-neutral font-normal">{successStory?.client_project}</p>
                  </div>

                  <div className="border-b-2 border-neutral-light pb-2">
                    <p className="text-xs font-semibold text-constrast mb-1">Fecha de inicio</p>
                    <p className="text-base text-neutral font-normal">{successStory?.date_start_project}</p>
                  </div>

                  <div className="border-b-2 border-neutral-light pb-2">
                    <p className="text-xs font-semibold text-constrast mb-1">Fecha de finalización</p>
                    <p className="text-base text-neutral font-normal">{successStory?.date_end_project}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-constrast mb-1">Duración</p>
                    <p className="text-base text-neutral font-normal">{successStory?.duration}</p>
                  </div>

                </div>

                {/* Botón de ver más detalles */}
                <div className="flex justify-start mt-4">
                  {/*FUNCION PARA ABRIR MAS DETALLES ID: EMPRESA-INFO incio en hidden ademas cambiar el texto de ver mas informacion a ver menos*/}
                  <button
                   onClick={() => {
                    const empresaInfo = document.getElementById("empresa-info");
                    const button = document.getElementById("toggle-empresa-info");
                    empresaInfo.classList.toggle("hidden");
                    if (empresaInfo.classList.contains("hidden")) {
                      button.textContent = "Ver más información";
                    } else {
                      button.textContent = "Ver menos información";
                    }
                  }} 
                  id="toggle-empresa-info"
                   className="text-sm uppercase underline text-accent font-semibold" 
                   aria-label="ver más información"
                   >Ver más información</button>
                </div>
              </div>
              {/* Tarjeta de información de la empresa */}
              <div id="empresa-info" className="hidden w-full  bg-neutral-light shadow-md rounded-lg p-6 h-fit">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={`/api/success_story/media/${successStory?.company_logo}`}
                    alt={successStory?.company_name}
                    className="h-28  object-cover "
                  />
                </div>

                <h4 className="text-center text-2xl font-medium text-neutral mb-2">{successStory?.company_name}</h4>
                <p className="text-sm text-center text-neutral-dark mb-6">{successStory?.company_summary}</p>

                <div className="mb-8">
                  <div className="flex justify-center items-center mb-2">
                    <span className="text-6xl  font-medium text-neutral-dark">{successStory?.company_percentage} <span className="text-accent">%</span></span>
                    <span></span>
                  </div>
                  <p className="text-sm text-neutral-dark">{successStory?.company_description_percentage}</p>
                </div>

                <div>
                  <h5 className="text-xl text-center font-medium text-neutral-dark mb-3">Productos o servicios utilizados</h5>
                  <ul className="space-y-2">
                    {relatedServices && relatedServices.length > 0 ? (
                      relatedServices.map((service, index) => (
                      <a href={`/servicio/${service.slug}`} target="_blank" rel="noopener noreferrer" key={index} className="flex items-center gap-2">
                        <span className="bg-accent rounded-full p-1">
                          <img src={`/api/service/media/${service?.image_secondary}`} 
                          alt={service.name || service.title} className="w-4 h-4 rounded-full" 
                          onError={e => e.target.src = '/api/cover/thumbnail/null'}
                          loading="lazy" />
                        </span>
                        <span className="text-base">{service.name || service.title}</span>
                      </a>
                      ))
                    ) : (
                      <li className="flex items-center gap-2">
                        <span className="text-neutral-dark text-sm">No hay servicios asociados</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <h2 className="text-[32px] lg:text-[40px] font-medium text-neutral-dark mb-4">{successStory?.title_benefits}</h2>
            <p className="text-neutral-dark font-light mb-8">{successStory?.description_benefits}</p>

            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {successStory?.benefits?.map((benefit, index) => (
                <div key={index} className="flex gap-4 text-neutral p-4 rounded-xl bg-neutral-light group hover:text-white hover:bg-constrast transition-colors duration-200">
                  <div className="bg-accent rounded-full h-12 w-12 flex items-center justify-center mr-4 flex-shrink-0">
                    <img
                      src={`/api/success_story/media/${benefit?.image}`}
                      alt={benefit?.title}
                      className="w-6 h-6 object-cover rounded-xl"
                    />

                  </div>
                  <div>
                    <h3 className="font-medium text-xl  mb-1">{benefit.title}</h3>
                    <p className="text-sm ">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/*    <p className="text-neutral-dark font-light mb-8">{contenido.descripcion}</p> */}



            {/* Sección azul */}
            <section className="w-full py-10  lg:px-12 mb-10  lg:bg-primary rounded-xl text-neutral-dark lg:text-white flex flex-col lg:flex-row gap-10">

              <div className="w-full ">
                <h2 className="text-[32px] font-medium mb-4">{successStory?.title_challenges}</h2>
                <p className="mb-8  font-light ">{successStory?.description_challenges}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                  <div>
                    <h3 className="font-medium text-xl mb-4">Solución del proyecto</h3>
                    <ul className="space-y-3">
                      {successStory?.solutions?.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">

                          <span className="text-accent">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#D62828" /><path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>

                          <p className="text-sm">{item?.title}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-xl mb-4">Desafío del proyecto</h3>
                    <ul className="space-y-3">
                      {successStory?.challenges?.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">

                          <span className="text-accent">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#D62828" /><path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>

                          <p className="text-sm">{item?.title}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex h-[350px]">
                <img
                  src={`/api/success_story/media/${successStory?.image_challenges}`}
                  alt={successStory?.title_challenges}
                  className="rounded-xl h-full w-full  object-cover shadow-md"
                />
              </div>
              <div
                className={` lg:hidden relative w-full  font-paragraph rounded-lg shadow-xl overflow-hidden flex flex-col  transition-all duration-300 z-10`}
              >
                {/* Overlay gradiente negro a transparente de abajo hacia arriba */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 pointer-events-none "
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0), #ffffff)"
                  }}
                />                <img
                  src={"/assets/cambiogerencia/card-contact.webp"}
                  alt={"Servicios de RR.HH"}
                  className="w-full h-[350px] object-cover z-10 relative group-hover:opacity-0 transition-opacity duration-300"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/808080?text=Imagen+no+disponible"; }}
                />
                <div className="p-6 flex flex-col flex-grow z-20  absolute bottom-0 text-white">
                  <h3 className={`text-xl font-medium mb-2 `}>Servicios de RR.HH</h3>
                  <p className={`text-xs mb-4 flex-grow  text-white`}>Herramientas ágiles para la gestión del talent, enean commodo ligula eget dolor. </p>
                  <WhatsAppButton
                    variant="constrast"

                    className="w-full bg-constrast hover:bg-primary transition-colors duration-300s"
                  >
                    Reserva una consulta
                  </WhatsAppButton>
                </div>
              </div>
            </section>
            <section>





              {/* Sección de preguntas frecuentes 

              <div className="flex-1 w-full">
                <h2 className="text-3xl md:text-4xl text-neutral-dark lg:text-[52px] font-medium mb-4 md:mb-6 leading-tight italic">
                  Preguntas <span className="text-constrast">Frecuentes</span>
                </h2>
                <div className="space-y-4">
                  {faqs.map((item) => (
                    <div key={item.id} className="border border-neutral-light rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleItem(item.id)} className={`w-full px-4 md:px-6 py-3 md:py-4 text-left transition-colors duration-200 flex items-center justify-between ${openItems.has(item.id) ? "bg-constrast text-white border-b" : "text-neutral-dark border-neutral-light bg-neutral-light"}`}
                      >
                        <span className="text-base md:text-lg font-medium pr-2 md:pr-4">{item.question}</span><div className="flex-shrink-0">
                          {openItems.has(item.id) ? <UpIcon /> : <DownIcon />}
                        </div>
                      </button>                {openItems.has(item.id) && item.answer && (<div className="px-4 md:px-6 py-4 md:py-6 bg-constrast text-white">
                        <p className="text-sm md:text-base leading-relaxed">{item.answer}</p>
                      </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>*/}
            </section>


          </div>
        </section>
        {/* Sección de casos similares */}
        <section className="w-full px-[5%] mx-auto  py-12 bg-neutral-light">
          <div className="text-center mb-12 lg:mb-16 px-[5%] mx-auto">
            <div className="flex w-full justify-center  mb-4">
              <div className=" mr-2">
                <span>
                  <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.50225 0C5.95566 0 4.69727 1.2584 4.69727 2.80499C4.69727 4.35158 5.95566 5.60998 7.50225 5.60998C9.04885 5.60998 10.3072 4.35158 10.3072 2.80499C10.3072 1.2584 9.04885 0 7.50225 0Z" fill="#D62828" />
                    <path d="M7.50112 24.0025C3.65842 24.0025 0.759766 22.4639 0.759766 20.4219C0.759766 19.9629 1.13269 19.59 1.59168 19.59C2.05066 19.59 2.42359 19.9629 2.42359 20.4219C2.42359 21.203 4.40166 22.3387 7.49981 22.3387C10.5993 22.3387 12.576 21.2043 12.576 20.4219C12.576 19.8743 12.4874 19.3657 12.3048 18.8689C12.147 18.4373 12.3674 17.9601 12.799 17.801C13.2306 17.6432 13.7092 17.8636 13.8669 18.2952C14.1147 18.9693 14.2399 19.6839 14.2399 20.4206C14.2425 22.4639 11.3451 24.0025 7.50112 24.0025Z" fill="#D62828" />
                    <path d="M11.4896 21.804C12.3046 21.4414 12.7754 20.9968 12.8132 20.6225C5.70098 16.9581 5.32021 11.2634 5.32021 10.1015C5.32021 9.64249 4.94725 9.26953 4.48823 9.26953C4.02921 9.26953 3.65625 9.64249 3.65625 10.1015C3.65625 11.4082 4.06181 17.6884 11.4896 21.804Z" fill="#D62828" />
                    <path d="M7.49991 6.25781C5.37954 6.25781 3.6543 7.98306 3.6543 10.1034C3.6543 10.5624 4.02725 10.9354 4.48627 10.9354C4.9453 10.9354 5.31825 10.5624 5.31825 10.1034C5.31825 8.9011 6.29628 7.92177 7.49991 7.92177C8.70353 7.92177 9.68156 8.8998 9.68156 10.1034C9.68156 10.9432 8.14671 11.9108 6.66272 12.8458C6.33019 13.0558 5.98722 13.2709 5.64296 13.4965C5.81248 13.9855 6.03026 14.5059 6.31454 15.047C6.72531 14.7732 7.1426 14.5111 7.55077 14.2542C9.58768 12.971 11.3468 11.8626 11.3468 10.1034C11.3455 7.98306 9.62158 6.25781 7.49991 6.25781Z" fill="#D62828" />
                    <path d="M4.23503 14.4766C2.36765 15.8954 0.759766 17.7158 0.759766 20.4191C0.759766 20.8781 1.13272 21.251 1.59174 21.251C2.05076 21.251 2.42372 20.8781 2.42372 20.4191C2.42372 18.5465 3.53085 17.1707 4.95486 16.0271C4.66406 15.4937 4.42673 14.9734 4.23503 14.4766Z" fill="#D62828" />
                  </svg>

                </span>
              </div>
              <h3 className="uppercase text-neutral-dark text-sm lg:text-lg font-bold">Casos de éxito</h3>
            </div>
            <h2 className="text-4xl lg:text-[52px] font-medium mb-6 leading-tight italic">

              Revisa otros <span className="text-constrast">casos de éxito</span><br className="hidden lg:block" />

            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStoryRecents.map((caso, index) => (
              <CaseCard
                key={caso.id}
                slug={caso?.slug}
                title={caso?.name}
                image={caso?.image}

                description={caso?.description}
              />
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <CarritoProvider>
      <Base {...properties}>
        <DetalleCasoExito {...properties} />
      </Base>
    </CarritoProvider>
  );
});