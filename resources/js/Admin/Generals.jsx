import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../Components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import Global from "../Utils/Global";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import TinyMCEFormGroup from "../components/Adminto/form/TinyMCEFormGroup";

const generalsRest = new GeneralsRest();

const Generals = ({ generals }) => {
    const location =
        generals.find((x) => x.correlative == "location")?.description ?? "0,0";
    // Filtrar solo los generales que son plantillas de email (excluyendo correo de soporte)
    const emailTemplates = generals.filter(g => g.correlative.endsWith('_email') && g.correlative !== 'support_email');

    const [showPreview, setShowPreview] = useState(false);
    const [selectedEmailCorrelative, setSelectedEmailCorrelative] = useState(emailTemplates[0]?.correlative || "");
    const [templateVariables, setTemplateVariables] = useState({});
    const [loadingVars, setLoadingVars] = useState(false);
    const [varsError, setVarsError] = useState(null);
    // Fetch variables for selected template
    useEffect(() => {
        if (!selectedEmailCorrelative) return;
        // Map correlatives to API types
        const correlativeToType = {
            purchase_summary_email: "purchase_summary",
            order_status_changed_email: "order_status_changed",
            blog_published_email: "blog_published",
            claim_email: "claim",
            password_changed_email: "password_changed",
            reset_password_email: "password_reset",
            subscription_email: "subscription",
            verify_account_email: "verify_account",
            message_contact_email: "message_contact",
            admin_contact_notification_email: "admin_contact_notification",
        };
        const type = correlativeToType[selectedEmailCorrelative];
        if (!type) {
            setTemplateVariables({});
            return;
        }
        setLoadingVars(true);
        setVarsError(null);
        fetch(`/api/notification-variables/${type}`)
            .then(res => res.json())
            .then(data => {
                setTemplateVariables(data.variables || {});
                setLoadingVars(false);
            })
            .catch(err => {
                setVarsError("No se pudieron cargar las variables.");
                setLoadingVars(false);
            });
    }, [selectedEmailCorrelative]);
    const [formData, setFormData] = useState({

        email_templates: Object.fromEntries(
            emailTemplates.map(t => [t.correlative, t.description ?? ""])
        ),
        whatsapp_phone:
            generals.find((x) => x.correlative == "whatsapp_phone")?.description ?? "",
        whatsapp_message:
            generals.find((x) => x.correlative == "whatsapp_message")?.description ?? "",
        phones: generals
            .find((x) => x.correlative == "phone_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        emails: generals
            .find((x) => x.correlative == "email_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        address:
            generals.find((x) => x.correlative == "address")?.description ?? "",
        openingHours:
            generals.find((x) => x.correlative == "opening_hours")
                ?.description ?? "",
        supportPhone:
            generals.find((x) => x.correlative == "support_phone")
                ?.description ?? "",
        supportEmail:
            generals.find((x) => x.correlative == "support_email")
                ?.description ?? "",
        privacyPolicy:
            generals.find((x) => x.correlative == "privacy_policy")
                ?.description ?? "",
        termsConditions:
            generals.find((x) => x.correlative == "terms_conditions")
                ?.description ?? "",
        exchangePolicy:
            generals.find((x) => x.correlative == "exchange_policy")
                ?.description ?? "",
        seoTitle:
            generals.find((x) => x.correlative == "seo_title")?.description ??
            "",
        seoDescription:
            generals.find((x) => x.correlative == "seo_description")
                ?.description ?? "",
        seoKeywords:
            generals.find((x) => x.correlative == "seo_keywords")
                ?.description ?? "",
        cintillo:
            generals.find((x) => x.correlative == "cintillo")?.description ?? "",

        // Datos de empresa para SEO
        companyName:
            generals.find((x) => x.correlative == "company_name")?.description ?? "",
        companyDescription:
            generals.find((x) => x.correlative == "company_description")?.description ?? "",
        companyLogo:
            generals.find((x) => x.correlative == "company_logo")?.description ?? "",
        companyUrl:
            generals.find((x) => x.correlative == "company_url")?.description ?? "",
        companyPhone:
            generals.find((x) => x.correlative == "company_phone")?.description ?? "",
        companyEmail:
            generals.find((x) => x.correlative == "company_email")?.description ?? "",
        companyAddress:
            generals.find((x) => x.correlative == "company_address")?.description ?? "",
        
        // Redes sociales
        twitterSite:
            generals.find((x) => x.correlative == "twitter_site")?.description ?? "",
        facebookPage:
            generals.find((x) => x.correlative == "facebook_page")?.description ?? "",
        instagramProfile:
            generals.find((x) => x.correlative == "instagram_profile")?.description ?? "",
        linkedinProfile:
            generals.find((x) => x.correlative == "linkedin_profile")?.description ?? "",
        
        // Datos geográficos para SEO
        companyLocality:
            generals.find((x) => x.correlative == "company_locality")?.description ?? "San Isidro",
        companyRegion:
            generals.find((x) => x.correlative == "company_region")?.description ?? "Lima",
        companyCountry:
            generals.find((x) => x.correlative == "company_country")?.description ?? "PE",
        
        // Imágenes por defecto
        ogImageDefault:
            generals.find((x) => x.correlative == "og_image_default")?.description ?? "",
        twitterImageDefault:
            generals.find((x) => x.correlative == "twitter_image_default")?.description ?? "",
        
        // Verificaciones de sitio
        googleSiteVerification:
            generals.find((x) => x.correlative == "google_site_verification")?.description ?? "",
        bingSiteVerification:
            generals.find((x) => x.correlative == "bing_site_verification")?.description ?? "",

        copyright:
            generals.find((x) => x.correlative == "copyright")?.description ?? 
            "Cambia FX © 2019 - Marca registrada de Tu Cambio S.A.C. - RUC: 20603864957",
        emailCoorporativo:
            generals.find((x) => x.correlative == "email_coorporativo")
                ?.description ?? "",

        // Configuración para LLMS.txt y LLMS-full.txt (Estándar IA)
        llms_title:
            generals.find((x) => x.correlative == "llms_title")?.description ??
            "Cambia FX - Casa de Cambio Online en Perú",
        llms_summary:
            generals.find((x) => x.correlative == "llms_summary")?.description ??
            "Casa de cambio online registrada y supervisada por la SBS para cambio de dólares y soles en Perú con transferencias directas e interbancarias en minutos.",
        llms_description:
            generals.find((x) => x.correlative == "llms_description")?.description ??
            "Cambia FX (marca registrada de Tu Cambio S.A.C., RUC 20603864957) es una plataforma digital de cambio de divisas (USD / PEN) en el Perú, diseñada para personas naturales y empresas que buscan cotizaciones preferenciales en tiempo real, seguridad bancaria y rapidez en sus transferencias.",
        llms_legal_info:
            generals.find((x) => x.correlative == "llms_legal_info")?.description ??
            "Razón Social: TU CAMBIO S.A.C.\nNombre Comercial: Cambia FX\nRUC: 20603864957\nPartida Electrónica SUNARP: N° 14190692 (Registro de Personas Jurídicas de Lima)\nRegistro SBS: Resolución SBS N° 04993-2018 (Casa de Cambio Online Regulada)\nSupervisión: Superintendencia de Banca, Seguros y AFP (SBS) y Unidad de Inteligencia Financiera (UIF)\nDomicilio Fiscal y Oficinas: Av. Javier Prado Este N° 560, Oficina 2302, San Isidro, Lima - Perú",
        llms_banks_schedules:
            generals.find((x) => x.correlative == "llms_banks_schedules")?.description ??
            "Bancos con transferencias inmediatas: BCP, Interbank.\nBancos con transferencias interbancarias (CCE): BBVA, Scotiabank, BanBif, Banco Pichincha.\nHorario de atención: Lunes a Viernes de 8:30 AM a 6:30 PM | Sábados de 9:00 AM a 2:00 PM.\nTiempos promedio: Inmediatas (10 a 20 minutos), Interbancarias (según horarios de cámara CCE).",
        llms_how_it_works:
            generals.find((x) => x.correlative == "llms_how_it_works")?.description ??
            "1. Cotiza tu cambio en cambiafx.pe con el tipo de cambio preferencial en tiempo real.\n2. Transfiere el monto acordado a la cuenta bancaria de Cambia FX indicada.\n3. Adjunta o confirma el comprobante de transferencia en la plataforma.\n4. Recibe tus fondos cambiados directamente en tu cuenta bancaria destino en minutos.",
        llms_key_links:
            generals.find((x) => x.correlative == "llms_key_links")?.description ??
            "- [Tipo de Cambio Hoy](https://cambiafx.pe/tipo-de-cambio-hoy): Cotización oficial en tiempo real para compra y venta de dólares en Perú.\n- [Cotizador y Simulador Online](https://cambiafx.pe/): Herramienta web para simular operaciones de cambio de dólares a soles o viceversa.\n- [Términos y Condiciones](https://cambiafx.pe/legal/terminos-y-condiciones): Contrato de uso de la plataforma, condiciones legales y operativas del servicio.\n- [Políticas de Privacidad](https://cambiafx.pe/legal/politicas-de-privacidad): Tratamiento de datos personales conforme a la Ley N° 29733 y registro ante la Autoridad Nacional de Protección de Datos.\n- [Blog Financiero](https://cambiafx.pe/blog): Artículos y análisis de tendencias económicas, tipo de cambio e inflación.\n- [Preguntas Frecuentes](https://cambiafx.pe/preguntas-frecuentes): Respuestas sobre seguridad, límites, transferencias y tiempos de espera.",
        llms_full_extra:
            generals.find((x) => x.correlative == "llms_full_extra")?.description ??
            "## Seguridad y Cumplimiento Normativo (SPLAFT / UIF)\n- **Supervisión SBS y UIF:** Cambia FX opera bajo el amparo de la Resolución SBS N° 04993-2018 y aplica estrictas políticas del Sistema de Prevención del Lavado de Activos y Financiamiento del Terrorismo (SPLAFT).\n- **Protección de Datos Personales (Ley N° 29733):** Toda información recolectada se almacena en el banco de datos 'Usuarios Web' registrado ante la Autoridad Nacional de Protección de Datos Personales, con cifrado bancario y un período de retención legal de 5 años.\n- **Comprobantes Electrónicos SUNAT:** Toda transacción cambiaria emite automáticamente su Boleta o Factura Electrónica con validez tributaria ante SUNAT.\n- **Canales Oficiales Exclusivos:** Las transacciones se realizan 100% mediante transferencias bancarias a cuentas corporativas de Tu Cambio S.A.C. Cambia FX nunca solicita claves bancarias, tokens ni retiros en efectivo.\n\n## Preguntas Frecuentes para Asistentes y Modelos de IA\n- ¿Es seguro cambiar en Cambia FX?: Sí, está formalmente registrada ante la SBS (Res. 04993-2018), inscrita en SUNARP (Partida N° 14190692) y opera con cuentas en BCP, Interbank y BBVA.\n- ¿Hay montos mínimos de cambio?: El monto mínimo recomendado es desde $10 USD o su equivalente en Soles.\n- ¿Cómo se garantiza el tipo de cambio?: Al congelar la cotización en la web, el usuario cuenta con 15 minutos de reserva para realizar su transferencia.\n- ¿Se atiende a empresas?: Sí, personas jurídicas pueden cambiar con facturación electrónica deducible de impuestos.\n\n## Canales Oficiales de Verificación\n- Sitio Web Principal: https://cambiafx.pe\n- Plataforma Transaccional: https://mi.cambiafx.pe\n- Términos y Condiciones: https://cambiafx.pe/legal/terminos-y-condiciones\n- Políticas de Privacidad: https://cambiafx.pe/legal/politicas-de-privacidad\n- Domicilio: Av. Javier Prado Este N° 560, Oficina 2302, San Isidro, Lima - Perú\n- Soporte Oficial WhatsApp: +51 987 654 321\n- Correo Oficial: contacto@cambiafx.pe",

        location: {
            lat: Number(location.split(",").map((x) => x.trim())[0]),
            lng: Number(location.split(",").map((x) => x.trim())[1]),
        },
    });

    const [activeTab, setActiveTab] = useState("policies");

    const handleInputChange = (e, index, field) => {
        const { value } = e.target;
        const list = [...formData[field]];
        list[index] = value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleAddField = (field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: [...prevState[field], ""],
        }));
    };

    const handleRemoveField = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleMapClick = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        }));
    };

    const handleGenerateSitemap = async () => {
        await generalsRest.generateSitemap();
    };

    const handleGenerateRobot = async () => {
        await generalsRest.generateRobots();
    };

    const handleGenerateLlms = async () => {
        await generalsRest.generateLlms();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await generalsRest.save([
                // Guardar solo el template seleccionado
                ...Object.keys(formData.email_templates).map(correlative => ({
                    correlative,
                    name: emailTemplates.find(t => t.correlative === correlative)?.name || correlative,
                    description: formData.email_templates[correlative],
                })),
                {
                    correlative: "whatsapp_phone",
                    name: "Número de WhatsApp",
                    description: formData.whatsapp_phone,
                },
                {
                    correlative: "whatsapp_message",
                    name: "Mensaje de WhatsApp",
                    description: formData.whatsapp_message,
                },
                {
                    correlative: "phone_contact",
                    name: "Teléfono de contacto",
                    description: formData.phones.join(","),
                },
                {
                    correlative: "email_contact",
                    name: "Correo de contacto",
                    description: formData.emails.join(","),
                },
                {
                    correlative: "address",
                    name: "Dirección",
                    description: formData.address,
                },
                {
                    correlative: "opening_hours",
                    name: "Horarios de atención",
                    description: formData.openingHours,
                },
                {
                    correlative: "support_phone",
                    name: "Número de soporte",
                    description: formData.supportPhone,
                },
                {
                    correlative: "support_email",
                    name: "Correo de soporte",
                    description: formData.supportEmail,
                },
                {
                    correlative: "privacy_policy",
                    name: "Política de privacidad",
                    description: formData.privacyPolicy,
                },
                {
                    correlative: "terms_conditions",
                    name: "Términos y condiciones",
                    description: formData.termsConditions,
                },
                {
                    correlative: "exchange_policy",
                    name: "Política de cambio",
                    description: formData.exchangePolicy,
                },
                {
                    correlative: "seo_title",
                    name: "Titulo - SEO",
                    description: formData.seoTitle,
                },
                {
                    correlative: "seo_description",
                    name: "Descripcion - SEO",
                    description: formData.seoDescription,
                },
                {
                    correlative: "seo_keywords",
                    name: "Palabras clave - SEO",
                    description: formData.seoKeywords,
                },
                {
                    correlative: "cintillo",
                    name: "Texto del Cintillo",
                    description: formData.cintillo,
                },
                // Datos de empresa para SEO
                {
                    correlative: "company_name",
                    name: "Nombre de la Empresa",
                    description: formData.companyName,
                },
                {
                    correlative: "company_description",
                    name: "Descripción de la Empresa",
                    description: formData.companyDescription,
                },
                {
                    correlative: "company_logo",
                    name: "Logo de la Empresa",
                    description: formData.companyLogo,
                },
                {
                    correlative: "company_url",
                    name: "URL de la Empresa",
                    description: formData.companyUrl,
                },
                {
                    correlative: "company_phone",
                    name: "Teléfono de la Empresa",
                    description: formData.companyPhone,
                },
                {
                    correlative: "company_email",
                    name: "Email de la Empresa",
                    description: formData.companyEmail,
                },
                {
                    correlative: "company_address",
                    name: "Dirección de la Empresa",
                    description: formData.companyAddress,
                },
                // Redes sociales
                {
                    correlative: "twitter_site",
                    name: "Twitter Site",
                    description: formData.twitterSite,
                },
                {
                    correlative: "facebook_page",
                    name: "Página de Facebook",
                    description: formData.facebookPage,
                },
                {
                    correlative: "instagram_profile",
                    name: "Perfil de Instagram",
                    description: formData.instagramProfile,
                },
                {
                    correlative: "linkedin_profile",
                    name: "Perfil de LinkedIn",
                    description: formData.linkedinProfile,
                },
                // Datos geográficos para SEO
                {
                    correlative: "company_locality",
                    name: "Localidad/Distrito (SEO)",
                    description: formData.companyLocality,
                },
                {
                    correlative: "company_region",
                    name: "Región/Estado (SEO)",
                    description: formData.companyRegion,
                },
                {
                    correlative: "company_country",
                    name: "País (Código ISO, ej: PE)",
                    description: formData.companyCountry,
                },
                // Imágenes por defecto
                {
                    correlative: "og_image_default",
                    name: "Imagen Open Graph por Defecto",
                    description: formData.ogImageDefault,
                },
                {
                    correlative: "twitter_image_default",
                    name: "Imagen Twitter por Defecto",
                    description: formData.twitterImageDefault,
                },
                // Verificaciones de sitio
                {
                    correlative: "google_site_verification",
                    name: "Verificación de Google",
                    description: formData.googleSiteVerification,
                },
                {
                    correlative: "bing_site_verification",
                    name: "Verificación de Bing",
                    description: formData.bingSiteVerification,
                },
                {
                    correlative: "copyright",
                    name: "Texto de Copyright",
                    description: formData.copyright,
                },
                {
                    correlative: "email_coorporativo",
                    name: "Email Corporativo",
                    description: formData.emailCoorporativo,
                },
                {
                    correlative: "location",
                    name: "Ubicación",
                    description: `${formData.location.lat},${formData.location.lng}`,
                },
                // LLMS.txt & LLMS-full.txt
                {
                    correlative: "llms_title",
                    name: "Título LLMS (H1)",
                    description: formData.llms_title,
                },
                {
                    correlative: "llms_summary",
                    name: "Resumen LLMS (Blockquote)",
                    description: formData.llms_summary,
                },
                {
                    correlative: "llms_description",
                    name: "Descripción LLMS",
                    description: formData.llms_description,
                },
                {
                    correlative: "llms_legal_info",
                    name: "Información Legal y Regulatoria LLMS",
                    description: formData.llms_legal_info,
                },
                {
                    correlative: "llms_banks_schedules",
                    name: "Bancos y Horarios LLMS",
                    description: formData.llms_banks_schedules,
                },
                {
                    correlative: "llms_how_it_works",
                    name: "Cómo Funciona LLMS",
                    description: formData.llms_how_it_works,
                },
                {
                    correlative: "llms_key_links",
                    name: "Enlaces Clave LLMS",
                    description: formData.llms_key_links,
                },
                {
                    correlative: "llms_full_extra",
                    name: "Contenido Extendido LLMS Full",
                    description: formData.llms_full_extra,
                },
            ]);
            // alert('Datos guardados exitosamente');
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            // alert('Error al guardar los datos');
        }
    };

    const seo_keywords = (
        generals.find((x) => x.correlative == "seo_keywords")?.description ?? ""
    )
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    useEffect(() => {
        $("#cbo-keywords option").prop("selected", true).trigger("change");
    }, [null]);

    console.log(formData);

    return (
        <div className="card">
            <form className="card-body" onSubmit={handleSubmit}>
                <ul className="nav nav-tabs" id="contactTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        {" "}
                        {/* Quitar el hidden para que se muestren las opciones */}
                        <button
                            className={`nav-link ${activeTab === "contact" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("contact")}
                            type="button"
                            role="tab"
                        >
                            Información de Contacto
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "policies" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("policies")}
                            type="button"
                            role="tab"
                        >
                            Políticas y Términos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "seo" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("seo")}
                            type="button"
                            role="tab"
                        >
                            SEO Básico
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "seo-advanced" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("seo-advanced")}
                            type="button"
                            role="tab"
                        >
                            SEO Avanzado
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "social" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("social")}
                            type="button"
                            role="tab"
                        >
                            Redes Sociales
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        {" "}
                        {/* Quitar el hidden para que se muestren las opciones */}
                        <button
                            className={`nav-link ${activeTab === "location" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("location")}
                            type="button"
                            role="tab"
                        >
                            Ubicación
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "robots" ? "active" : ""}`}
                            onClick={() => setActiveTab("robots")}
                            type="button"
                            role="tab"
                        >
                            Robot y Sitemap
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "llms" ? "active" : ""}`}
                            onClick={() => setActiveTab("llms")}
                            type="button"
                            role="tab"
                        >
                            <i className="fa fa-robot me-1"></i> LLMS (IA)
                        </button>
                    </li>
                    {Global.APP_CORRELATIVE === "cambioDev" && (
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                                onClick={() => setActiveTab("email")}
                                type="button"
                                role="tab"
                            >
                                Email
                            </button>
                        </li>
                    )}
                </ul>

                <div className="tab-content" id="contactTabsContent">
                    <div
                        className={`tab-pane fade ${activeTab === "contact" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-6">
                                {formData.phones.map((phone, index) => (
                                    <div
                                        key={`phone-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`phone-${index}`}
                                            className="form-label"
                                        >
                                            Teléfono {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id={`phone-${index}`}
                                                value={phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("phones")}
                                >
                                    Agregar teléfono
                                </button>
                            </div>
                            <div className="col-md-6">
                                {formData.emails.map((email, index) => (
                                    <div
                                        key={`email-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`email-${index}`}
                                            className="form-label"
                                        >
                                            Correo {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`email-${index}`}
                                                value={email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("emails")}
                                >
                                    Agregar correo
                                </button>
                            </div>
                        </div>
                        <div className="mb-3 mt-2">
                            <label htmlFor="address" className="form-label">
                                Dirección
                            </label>
                            <textarea
                                className="form-control"
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <TextareaFormGroup
                                label="Horarios de atencion"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        openingHours: e.target.value,
                                    })
                                }
                                value={formData.openingHours}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportPhone"
                                className="form-label"
                            >
                                Número de soporte
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="supportPhone"
                                value={formData.supportPhone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportPhone: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportEmail"
                                className="form-label"
                            >
                                Correo de soporte
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="supportEmail"
                                value={formData.supportEmail}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportEmail: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="whatsapp_phone"
                                className="form-label"
                            >
                                Número de WhatsApp
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="whatsapp_phone"
                                value={formData.whatsapp_phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        whatsapp_phone: e.target.value,
                                    })
                                }
                            />
                            <small className="form-text text-muted">
                                Este número se utilizará para recibir consultas a través de WhatsApp.
                            </small>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="whatsapp_message"
                                className="form-label"
                            >
                                Mensaje de WhatsApp
                            </label>
                            <textarea
                                className="form-control"
                                id="whatsapp_message"
                                value={formData.whatsapp_message}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        whatsapp_message: e.target.value,
                                    })
                                }
                            ></textarea>
                            <small className="form-text text-muted">
                                Este mensaje se enviará automáticamente al iniciar una conversación.
                            </small>
                        </div>
                               <div className="mb-3">
                            <label
                                htmlFor="copyright"
                                className="form-label"
                            >
                                Texto del Cintillo
                            </label>
                            <textarea
                                className="form-control"
                                id="cintillo"
                                value={formData.cintillo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cintillo: e.target.value,
                                    })
                                }
                                rows="3"
                            ></textarea>
                            <small className="form-text text-muted">
                                Este texto aparecerá en el header del sitio web.
                            </small>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="copyright"
                                className="form-label"
                            >
                                Texto de Copyright
                            </label>
                            <textarea
                                className="form-control"
                                id="copyright"
                                value={formData.copyright}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        copyright: e.target.value,
                                    })
                                }
                                rows="3"
                            ></textarea>
                            <small className="form-text text-muted">
                                Este texto aparecerá en el footer del sitio web.
                            </small>
                        </div>
                        
                        <div className="mb-3">
                            <label
                                htmlFor="emailCoorporativo"
                                className="form-label"
                            >
                                Email Corporativo
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailCoorporativo"
                                value={formData.emailCoorporativo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emailCoorporativo: e.target.value,
                                    })
                                }
                                placeholder="admin@cambiafx.com"
                            />
                            <small className="form-text text-muted">
                                Email donde se enviarán las notificaciones de nuevos contactos.
                            </small>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "policies" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Política de privacidad"
                                value={formData.privacyPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        privacyPolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Términos y condiciones"
                                value={formData.termsConditions}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        termsConditions: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Políticas de cambio"
                                value={formData.exchangePolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        exchangePolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <InputFormGroup
                                label="Email Corporativo (para notificaciones)"
                                type="email"
                                value={formData.emailCoorporativo ?? ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emailCoorporativo: e.target.value,
                                    })
                                }
                                placeholder="admin@empresa.com"
                            />
                            <small className="form-text text-muted">
                                Este email recibirá las notificaciones de nuevos mensajes de contacto.
                            </small>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "seo" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="alert alert-info">
                            <strong>SEO Básico:</strong> Estos campos son los principales para el posicionamiento en buscadores.
                        </div>
                        
                        <InputFormGroup
                            label="Titulo - SEO"
                            value={formData.seoTitle ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoTitle: e.target.value,
                                })
                            }
                            placeholder="CambiaFX - Casa de Cambio Online"
                        />
                        <small className="form-text text-muted mb-3">
                            Máximo 60 caracteres. Aparece en resultados de Google y pestañas del navegador.
                        </small>
                        
                        <TextareaFormGroup
                            label="Descripcion - SEO"
                            value={formData.seoDescription ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoDescription: e.target.value,
                                })
                            }
                            placeholder="Casa de cambio online con las mejores tasas de cambio. Compra y vende dólares de forma segura y rápida."
                            rows={3}
                        />
                        <small className="form-text text-muted mb-3">
                            Entre 150-160 caracteres. Aparece debajo del título en Google.
                        </small>
                        
                        <SelectFormGroup
                            id="cbo-keywords"
                            label="Palabras clave - SEO"
                            tags
                            multiple
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoKeywords: [...$(e.target).val()].join(
                                        ", "
                                    ),
                                })
                            }
                        >
                            {seo_keywords.map((keyword, index) => {
                                return (
                                    <option key={index} value={keyword}>
                                        {keyword}
                                    </option>
                                );
                            })}
                        </SelectFormGroup>
                        <small className="form-text text-muted mb-3">
                            Separadas por comas. Máximo 10 palabras clave relevantes.
                        </small>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "seo-advanced" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="alert alert-info">
                            <strong>SEO Avanzado:</strong> Datos de empresa para Schema.org y Open Graph.
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Nombre de la Empresa"
                                    value={formData.companyName ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyName: e.target.value,
                                        })
                                    }
                                    placeholder="CambiaFX - Tu Cambio S.A.C."
                                />
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="URL de la Empresa"
                                    value={formData.companyUrl ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://cambiafx.com"
                                />
                            </div>
                        </div>
                        
                        <TextareaFormGroup
                            label="Descripción de la Empresa"
                            value={formData.companyDescription ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    companyDescription: e.target.value,
                                })
                            }
                            placeholder="Casa de cambio online líder en Perú..."
                            rows={3}
                        />
                        
                        <div className="row">
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Teléfono de la Empresa"
                                    value={formData.companyPhone ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyPhone: e.target.value,
                                        })
                                    }
                                    placeholder="+51 945 622 983"
                                />
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Email de la Empresa"
                                    value={formData.companyEmail ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyEmail: e.target.value,
                                        })
                                    }
                                    placeholder="info@cambiafx.com"
                                />
                            </div>
                        </div>
                        
                        <InputFormGroup
                            label="Dirección de la Empresa"
                            value={formData.companyAddress ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    companyAddress: e.target.value,
                                })
                            }
                            placeholder="Lima, Perú"
                        />
                        
                        <div className="row">
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Logo de la Empresa (Open Graph)"
                                    value={formData.companyLogo ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyLogo: e.target.value,
                                        })
                                    }
                                    placeholder="/assets/img/logo-og.png"
                                />
                                <small className="form-text text-muted">
                                    Tamaño recomendado: 1200x630 píxeles
                                </small>
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Imagen Open Graph por Defecto"
                                    value={formData.ogImageDefault ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            ogImageDefault: e.target.value,
                                        })
                                    }
                                    placeholder="/assets/img/og-default.jpg"
                                />
                                <small className="form-text text-muted">
                                    Se usa cuando no se especifica imagen
                                </small>
                            </div>
                        </div>
                        
                        <h5 className="mt-4 mb-3">Verificaciones de Sitio Web</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Google Site Verification"
                                    value={formData.googleSiteVerification ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            googleSiteVerification: e.target.value,
                                        })
                                    }
                                    placeholder="código de verificación de Google"
                                />
                                <small className="form-text text-muted">
                                    Desde Google Search Console
                                </small>
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Bing Site Verification"
                                    value={formData.bingSiteVerification ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bingSiteVerification: e.target.value,
                                        })
                                    }
                                    placeholder="código de verificación de Bing"
                                />
                                <small className="form-text text-muted">
                                    Desde Bing Webmaster Tools
                                </small>
                            </div>
                        </div>

                        <h5 className="mt-4 mb-3">Datos Geográficos (Schema.org)</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <InputFormGroup
                                    label="Distrito / Localidad"
                                    value={formData.companyLocality ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyLocality: e.target.value,
                                        })
                                    }
                                    placeholder="San Isidro"
                                />
                            </div>
                            <div className="col-md-4">
                                <InputFormGroup
                                    label="Provincia / Región"
                                    value={formData.companyRegion ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyRegion: e.target.value,
                                        })
                                    }
                                    placeholder="Lima"
                                />
                            </div>
                            <div className="col-md-4">
                                <InputFormGroup
                                    label="País (Código ISO)"
                                    value={formData.companyCountry ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyCountry: e.target.value,
                                        })
                                    }
                                    placeholder="PE"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "social" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="alert alert-info">
                            <strong>Redes Sociales:</strong> URLs de perfiles para Open Graph y Schema.org.
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Twitter Site"
                                    value={formData.twitterSite ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            twitterSite: e.target.value,
                                        })
                                    }
                                    placeholder="@cambiafx"
                                />
                                <small className="form-text text-muted">
                                    Usuario de Twitter (incluye @)
                                </small>
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Página de Facebook"
                                    value={formData.facebookPage ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            facebookPage: e.target.value,
                                        })
                                    }
                                    placeholder="https://facebook.com/cambiafx"
                                />
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Perfil de Instagram"
                                    value={formData.instagramProfile ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            instagramProfile: e.target.value,
                                        })
                                    }
                                    placeholder="https://instagram.com/cambiafx"
                                />
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    label="Perfil de LinkedIn"
                                    value={formData.linkedinProfile ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            linkedinProfile: e.target.value,
                                        })
                                    }
                                    placeholder="https://linkedin.com/company/cambiafx"
                                />
                            </div>
                        </div>
                        
                        <InputFormGroup
                            label="Imagen Twitter por Defecto"
                            value={formData.twitterImageDefault ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    twitterImageDefault: e.target.value,
                                })
                            }
                            placeholder="/assets/img/twitter-default.jpg"
                        />
                        <small className="form-text text-muted">
                            Tamaño recomendado: 1200x600 píxeles para Twitter Cards
                        </small>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "location" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "400px",
                                }}
                                center={formData.location}
                                zoom={10}
                                onClick={handleMapClick}
                            >
                                <Marker position={formData.location} />
                            </GoogleMap>
                        </LoadScript>
                        <small className="form-text text-muted">
                            Haz clic en el mapa para seleccionar la ubicación.
                        </small>
                    </div>


                    <div className={`tab-pane fade ${activeTab === "robots" ? "show active" : ""}`} role="tabpanel">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Sitemap</h5>
                                        <p className="card-text mb-4">Genera el archivo <code>sitemap.xml</code> con las rutas configuradas (incluyendo servicios, blog, empresas, etc.).</p>
                                        <div className="d-flex gap-2">
                                            <button type="button" className="btn btn-primary w-100" onClick={handleGenerateSitemap}>
                                                <i className="fa fa-refresh me-2"></i> Generar
                                            </button>
                                            <a href="/sitemap.xml" target="_blank" className="btn btn-outline-secondary w-100">
                                                <i className="fa fa-eye me-2"></i> Ver
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Robots.txt</h5>
                                        <p className="card-text mb-4">Genera el archivo <code>robots.txt</code> básico permitiendo la indexación y referenciando al sitemap.</p>
                                        <div className="d-flex gap-2">
                                            <button type="button" className="btn btn-primary w-100" onClick={handleGenerateRobot}>
                                                <i className="fa fa-refresh me-2"></i> Generar
                                            </button>
                                            <a href="/robots.txt" target="_blank" className="btn btn-outline-secondary w-100">
                                                <i className="fa fa-eye me-2"></i> Ver
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`tab-pane fade ${activeTab === "llms" ? "show active" : ""}`} role="tabpanel">
                        <div className="card bg-light border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div>
                                        <h5 className="card-title mb-1 text-primary">
                                            <i className="fa fa-robot me-2"></i> Configuración de LLMS.txt & LLMS-full.txt
                                        </h5>
                                        <p className="card-text text-muted mb-0">
                                            Estandarizado según <a href="https://llmstxt.org" target="_blank" rel="noreferrer" className="fw-semibold">llmstxt.org</a> para permitir que asistentes de Inteligencia Artificial (ChatGPT, Perplexity, Claude, Gemini, Copilot) indexen y citen a Cambia FX como casa de cambio regulada.
                                        </p>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button type="button" className="btn btn-primary" onClick={handleGenerateLlms}>
                                            <i className="fa fa-refresh me-2"></i> Generar Archivos
                                        </button>
                                        <a href="/llms.txt" target="_blank" rel="noreferrer" className="btn btn-outline-secondary">
                                            <i className="fa fa-file-text-o me-2"></i> Ver /llms.txt
                                        </a>
                                        <a href="/llms-full.txt" target="_blank" rel="noreferrer" className="btn btn-outline-info">
                                            <i className="fa fa-book me-2"></i> Ver /llms-full.txt
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-info d-flex align-items-center mb-4">
                            <i className="fa fa-info-circle fa-2x me-3"></i>
                            <div>
                                <strong>Gestión autónoma para el cliente:</strong> Puedes actualizar cualquier dato en este formulario. Al hacer clic en <b>"Guardar cambios"</b> al final de la página, los archivos <code>/llms.txt</code> y <code>/llms-full.txt</code> se actualizarán automáticamente en vivo.
                            </div>
                        </div>

                        <h5 className="text-secondary mb-3 pb-2 border-bottom">1. Identidad y Resumen para Modelos de IA</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <InputFormGroup
                                    label="Título H1 del Proyecto (llms_title)"
                                    type="text"
                                    value={formData.llms_title ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_title: e.target.value })}
                                />
                                <small className="form-text text-muted">Nombre que los LLMs leen en el primer encabezado (# Nombre).</small>
                            </div>
                            <div className="col-md-6 mb-3">
                                <TextareaFormGroup
                                    label="Resumen Ejecutivo / Blockquote (llms_summary)"
                                    rows={2}
                                    value={formData.llms_summary ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_summary: e.target.value })}
                                />
                                <small className="form-text text-muted">1 a 2 oraciones para el bloque de cita (&gt; cita) que resume la empresa.</small>
                            </div>
                            <div className="col-12 mb-3">
                                <TextareaFormGroup
                                    label="Descripción General de la Empresa (llms_description)"
                                    rows={3}
                                    value={formData.llms_description ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_description: e.target.value })}
                                />
                                <small className="form-text text-muted">Párrafo introductorio detallando el propósito y propuesta de valor de Cambia FX.</small>
                            </div>
                        </div>

                        <h5 className="text-secondary mt-3 mb-3 pb-2 border-bottom">2. Información Regulatoria y Operativa</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <TextareaFormGroup
                                    label="Información Legal y Registro SBS (llms_legal_info)"
                                    rows={4}
                                    value={formData.llms_legal_info ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_legal_info: e.target.value })}
                                />
                                <small className="form-text text-muted">Razón social oficial, RUC, Resolución SBS, domicilio fiscal y supervisión.</small>
                            </div>
                            <div className="col-md-6 mb-3">
                                <TextareaFormGroup
                                    label="Bancos Soportados y Horarios (llms_banks_schedules)"
                                    rows={4}
                                    value={formData.llms_banks_schedules ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_banks_schedules: e.target.value })}
                                />
                                <small className="form-text text-muted">Bancos con transferencias inmediatas vs interbancarias (CCE) y horarios.</small>
                            </div>
                            <div className="col-12 mb-3">
                                <TextareaFormGroup
                                    label="Proceso Operativo Paso a Paso (llms_how_it_works)"
                                    rows={3}
                                    value={formData.llms_how_it_works ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_how_it_works: e.target.value })}
                                />
                                <small className="form-text text-muted">Instrucciones claras de cómo un cliente realiza un cambio de divisas.</small>
                            </div>
                        </div>

                        <h5 className="text-secondary mt-3 mb-3 pb-2 border-bottom">3. Enlaces Clave del Sitio Web (Estructura Markdown)</h5>
                        <div className="row">
                            <div className="col-12 mb-3">
                                <TextareaFormGroup
                                    label="Directorio de Enlaces Principales (llms_key_links)"
                                    rows={6}
                                    value={formData.llms_key_links ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_key_links: e.target.value })}
                                />
                                <small className="form-text text-muted">Formato estándar recomendado: <code>- [Título](URL): Descripción</code>.</small>
                            </div>
                        </div>

                        <h5 className="text-secondary mt-3 mb-3 pb-2 border-bottom">4. Contexto Extendido Exclusivo para /llms-full.txt</h5>
                        <div className="row">
                            <div className="col-12 mb-3">
                                <TextareaFormGroup
                                    label="Políticas de Seguridad, PLAFT/UIF, FAQs y Validación (llms_full_extra)"
                                    rows={8}
                                    value={formData.llms_full_extra ?? ""}
                                    onChange={(e) => setFormData({ ...formData, llms_full_extra: e.target.value })}
                                />
                                <small className="form-text text-muted">
                                    Contenido exhaustivo incluido solo en <code>/llms-full.txt</code>. <i>(Nota: Los últimos 10 artículos del blog se agregan automáticamente al final de este archivo).</i>
                                </small>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "email" ? "show active" : ""}`}
                        role="tabpanel"
                    >
                        <div className="mb-3">
                            <label htmlFor="email_correlative" className="form-label">
                                Tipo de Email <span className="badge bg-info">{emailTemplates.length} disponibles</span>
                            </label>

                            {emailTemplates.length === 0 ? (
                                <div className="alert alert-warning">
                                    <strong>No se encontraron plantillas de email.</strong><br />
                                    Asegúrate de que el seeder se haya ejecutado correctamente: <code>php artisan db:seed --class=EmailsGeneralSeeder</code>
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="email_correlative"
                                        className="form-select mb-3"
                                        value={selectedEmailCorrelative}
                                        onChange={e => setSelectedEmailCorrelative(e.target.value)}
                                    >
                                        <option value="">Selecciona un template</option>
                                        {emailTemplates.map(t => (
                                            <option key={t.correlative} value={t.correlative}>
                                                {t.name || t.correlative.replace(/_/g, ' ').replace(/email/g, '').trim()}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedEmailCorrelative && (
                                        <TinyMCEFormGroup
                                            label={
                                                <>
                                                    Plantilla de Email (HTML seguro, variables: <code>{`{{variable}}`}</code>)
                                                    <small className="d-block text-muted">
                                                        No se permite código PHP ni Blade. Solo variables seguras.<br />
                                                        {loadingVars && <span>Cargando variables...</span>}
                                                        {varsError && <span className="text-danger">{varsError}</span>}
                                                        {!loadingVars && !varsError && (
                                                            <>
                                                                <b>Variables disponibles:</b>{" "}
                                                                {Object.keys(templateVariables).length === 0
                                                                    ? <span>No hay variables para esta notificación.</span>
                                                                    : Object.entries(templateVariables).map(([key, desc]) => (
                                                                        <span key={key} style={{ display: 'inline-block', marginRight: 8 }}>
                                                                            <code>{`{{${key}}}`}</code> <span className="text-muted">({desc})</span>{" "}
                                                                        </span>
                                                                    ))
                                                                }
                                                            </>
                                                        )}
                                                    </small>
                                                </>
                                            }
                                            value={formData.email_templates[selectedEmailCorrelative] || ""}
                                            onChange={content => setFormData({
                                                ...formData,
                                                email_templates: {
                                                    ...formData.email_templates,
                                                    [selectedEmailCorrelative]: content
                                                }
                                            })}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>



                </div>

                <button aria-label="guardar" type="submit" className="btn btn-primary mt-3">
                    Guardar
                </button>
            </form>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Datos Generales">
            <Generals {...properties} />
        </BaseAdminto>
    );
});
