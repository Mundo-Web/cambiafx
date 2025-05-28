import React, { useState } from "react";
import { X } from "lucide-react";

const menuData = {
  infraestructura: {
    title: "Infraestructura",
    subtitle: "Optimiza tu trabajo con herramientas diseñadas para potenciar la eficiencia y la colaboración.",
    services: [
      {
        title: "Centro de Datos",
        description: "Proin dui augue, eleifend ac feugiat ut, dignissim quis augue. Pellentesque ac enim convallis.",
      },
      {
        title: "Virtualización",
        description: "Proin dui augue, eleifend ac feugiat ut, dignissim quis augue. Pellentesque ac enim convallis.",
      },
      {
        title: "Redes",
        description: "Proin dui augue, eleifend ac feugiat ut, dignissim quis augue. Pellentesque ac enim convallis.",
      },
      {
        title: "Servidores",
        description: "Proin dui augue, eleifend ac feugiat ut, dignissim quis augue. Pellentesque ac enim convallis.",
      },
      {
        title: "aaaaaa",
        description: "Proin dui augue, eleifend ac feugiat ut, dignissim quis augue. Pellentesque ac enim convallis.",
      },
    ],
    additional: {
      title: "Almacenamiento",
      description: "Complemento de Cloud Pak for Business Automation para automatizar flujos de trabajo.",
    },
  },
  productividad: {
    title: "Productividad",
    subtitle: "Herramientas y soluciones para maximizar la eficiencia de tu equipo de trabajo.",
    services: [
      {
        title: "Colaboración",
        description: "Plataformas integradas para trabajo en equipo y comunicación efectiva.",
      },
      {
        title: "Automatización",
        description: "Procesos automatizados que reducen tareas repetitivas y errores.",
      },
      {
        title: "Análisis",
        description: "Herramientas de análisis para tomar decisiones basadas en datos.",
      },
      {
        title: "Gestión",
        description: "Sistemas de gestión empresarial para optimizar recursos.",
      },
    ],
    additional: {
      title: "Integración",
      description: "Conecta todas tus herramientas en un ecosistema unificado.",
    },
  },
  seguridad: {
    title: "Seguridad",
    subtitle: "Protege tu información y sistemas con las mejores prácticas de ciberseguridad.",
    services: [
      {
        title: "Firewall",
        description: "Protección perimetral avanzada contra amenazas externas.",
      },
      {
        title: "Antivirus",
        description: "Detección y eliminación de malware en tiempo real.",
      },
      {
        title: "Backup",
        description: "Respaldo automático y recuperación de datos críticos.",
      },
      {
        title: "Monitoreo",
        description: "Supervisión continua de la seguridad de tu infraestructura.",
      },
    ],
    additional: {
      title: "Auditoría",
      description: "Evaluación completa de vulnerabilidades y cumplimiento normativo.",
    },
  },
};

const navigationItems = [
  { key: "infraestructura", label: "Infraestructura" },
  { key: "productividad", label: "Productividad" },
  { key: "seguridad", label: "Seguridad" },
  { key: "transformacion", label: "Transformación Digital" },
  { key: "energia", label: "Energía" },
];

const MegaMenuPopup = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("infraestructura");

  if (!isOpen) return null;

  const currentData = menuData[activeSection] || menuData.infraestructura;
  // bg-black/40
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center mt-[72px]">
      <div className="bg-white 2xl:rounded-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-row h-full">
          
          {/* Sidebar Navigation */}
          <div className="w-1/5 bg-gray-50 border-t border-r border-gray-200 p-10 2xl:p-16">
            <nav className="space-y-1 w-full h-full max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm 2xl:text-lg transition-colors ${
                    activeSection === item.key
                      ? "bg-blue-100 text-[#3E2F4D] border-l-4 border-[#3E2F4D] font-Poppins_Medium"
                      : "text-[#3E2F4D] hover:bg-gray-100 hover:font-Poppins_Medium font-Poppins_Regular"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="w-4/5 px-8 py-8 overflow-y-auto border-t border-gray-200 relative">
            {/* Close Button */}
            <div className="flex justify-end mb-1 absolute right-5">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl 2xl:text-3xl font-Poppins_Medium text-[#3E2F4D] mb-1">{currentData.title}</h2>
              <p className="text-[#5C4774] text-base 2xl:text-lg font-Poppins_Regular leading-relaxed">{currentData.subtitle}</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 2xl:gap-8 max-h-96 overflow-y-auto">
              {currentData.services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 hover:bg-[#F5F2F9] rounded-lg p-4 2xl:p-6 cursor-pointer"
                >
                  <h3 className="text-base 2xl:text-lg font-semibold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm 2xl:text-base line-clamp-2">{service.description}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPopup;