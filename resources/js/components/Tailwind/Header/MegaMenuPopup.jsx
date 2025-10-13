import React, { useState } from "react";
import { X } from "lucide-react";




const MegaMenuPopup = ({ info, isOpen, onClose, data }) => {
 

  if (!isOpen) return null;
 
  return (
    <div className="fixed bg-black/40 text-neutral-dark font-paragraph inset-0 z-[9999] flex items-start justify-center mt-[120px] backdrop-blur">
      <div className="bg-neutral-light px-[5%] relative 2xl:rounded-b-lg w-full max-h-[90vh] overflow-hidden">
        {/* Imagen de fondo alineada a la derecha debajo del contenido */}
        <div className="absolute top-0 right-0 h-full z-0 pointer-events-none flex justify-end items-end w-auto">
          <img
            src="/assets/cambiogerencia/mask-menu.png"
            alt="Equipo de Cambio Gerencia"
            className="h-full max-h-[90vh] object-cover max-w-[60vw]  lg:max-w-[60vw] opacity-50"
          />
        </div>
        <div className="flex flex-row h-full">

          {/* Sidebar Navigation */}
          <div className="w-1/5 py-8">
            <nav className="space-y-1 w-full h-full  overflow-y-auto">
              <img
                src={`/api/landing_home/media/${info?.image}`}
                alt={info?.title}
                className="w-full lg:w-auto  h-auto lg:h-full object-cover rounded-3xl shadow-lg"
              />
            </nav>
          </div>

          {/* Main Content */}
          <div className="w-4/5 px-8 py-8 overflow-y-auto border-t border-gray-200 relative">
            {/* Close Button */}
            <div className="flex justify-end mb-1 absolute right-5">
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="p-2 text-constrast border border-constrast hover:text-constrast  rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-4">
              <h2 className="text-[28px] font-semibold font-title text-primary mb-1">{info?.title}</h2>
              <p className="text-primary text-base max-w-2xl  leading-relaxed">{info?.description}</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 2xl:gap-8 max-h-96 overflow-y-auto">
              {data?.map((service, index) => {
                // Alternar aleatoriamente entre los 3 colores de hover
                const hoverColors = [
                  'hover:bg-accent hover:text-white',
                  'hover:bg-primary hover:text-white',
                  'hover:bg-constrast hover:text-white',
                ];
                // Para que sea "aleatorio" pero consistente en cada render, usar el index y un offset
                const colorClass = hoverColors[index % hoverColors.length];
                return (
                  <a
                    href={`/servicio/${service.slug}`}
                    key={index}
                    className={`block rounded-lg p-4 2xl:p-6 cursor-pointer transition-colors duration-200 ${colorClass}`}
                  >
                    <h3 className="text-base  font-semibold mb-1 transition-colors duration-200">{service?.name}</h3>
                    <p className="leading-relaxed text-sm  line-clamp-2 transition-colors duration-200">{service.description}</p>
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPopup;