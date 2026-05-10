import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Modal from "../Components/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import TransactionalLandingRest from "../actions/Admin/TransactionalLandingRest";
import { Notify } from "sode-extend-react";
import Swal from "sweetalert2";

const transactionalLandingRest = new TransactionalLandingRest();

const TransactionalLanding = ({
    items: initialItems,
    current_lang_id,
    default_lang_id,
}) => {
    const modalRef = useRef();
    const [items, setItems] = useState(initialItems);
    const [isEditing, setIsEditing] = useState(false);

    // Form states for complex fields
    const [stats, setStats] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [faqData, setFaqData] = useState([]);
    const [stepsData, setStepsData] = useState([]);

    // Form refs
    const idRef = useRef();
    const nameRef = useRef();
    const urlRef = useRef();
    const h1Ref = useRef();
    const metaTitleRef = useRef();
    const metaDescriptionRef = useRef();
    const metaKeywordsRef = useRef();
    const heroEyebrowRef = useRef();
    const heroTitleRef = useRef();
    const heroSubtitleRef = useRef();

    // Schema refs
    const schemaServiceNameRef = useRef();
    const schemaServiceDescriptionRef = useRef();
    const schemaServicePaymentsRef = useRef();

    // New comparison section refs
    const comparisonTitleRef = useRef();
    const comparisonSubtitleRef = useRef();
    const comparisonCtaRef = useRef();

    // New steps and CTA section refs
    const stepsTitleRef = useRef();
    const stepsSubtitleRef = useRef();
    const ctaTitleRef = useRef();
    const ctaSubtitleRef = useRef();
    const ctaButtonTextRef = useRef();
    const ctaButtonLinkRef = useRef();
    const ctaImageRef = useRef();

    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);

        setStats(
            data?.stats || [
                { label: "clientes", value: "60k+" },
                { label: "promedio", value: "15min" },
                { label: "registrado", value: "SBS" },
            ],
        );

        setComparisonData(
            data?.comparison_data || [
                {
                    entity: "Cambia FX",
                    buy: "3.510",
                    sell: "3.510",
                    is_highlight: true,
                },
            ],
        );

        setFaqData(data?.schema_faq || [{ question: "", answer: "" }]);
        setStepsData(data?.steps || [{ title: "", description: "", image: "" }]);

        setTimeout(() => {
            if (idRef.current) idRef.current.value = data?.id ?? "";
            if (nameRef.current) nameRef.current.value = data?.name ?? "";
            if (urlRef.current) urlRef.current.value = data?.url ?? "";
            if (h1Ref.current) h1Ref.current.value = data?.h1 ?? "";
            if (metaTitleRef.current)
                metaTitleRef.current.value = data?.meta_title ?? "";
            if (metaDescriptionRef.current)
                metaDescriptionRef.current.value = data?.meta_description ?? "";
            if (metaKeywordsRef.current)
                metaKeywordsRef.current.value = data?.meta_keywords ?? "";
            if (heroEyebrowRef.current)
                heroEyebrowRef.current.value = data?.hero_eyebrow ?? "";
            if (heroTitleRef.current)
                heroTitleRef.current.value = data?.hero_title ?? "";
            if (heroSubtitleRef.current)
                heroSubtitleRef.current.value = data?.hero_subtitle ?? "";

            if (schemaServiceNameRef.current)
                schemaServiceNameRef.current.value =
                    data?.schema_service_name ?? "";
            if (schemaServiceDescriptionRef.current)
                schemaServiceDescriptionRef.current.value =
                    data?.schema_service_description ?? "";
            if (schemaServicePaymentsRef.current)
                schemaServicePaymentsRef.current.value =
                    data?.schema_service_payments_accepted ?? "";

            if (comparisonTitleRef.current)
                comparisonTitleRef.current.value =
                    data?.comparison_title ?? "Ahorra más en cada *operación*";
            if (comparisonSubtitleRef.current)
                comparisonSubtitleRef.current.value =
                    data?.comparison_subtitle ??
                    "Nuestra tecnología se conecta con los principales indicadores para ofrecerte el mejor precio.";
            if (comparisonCtaRef.current)
                comparisonCtaRef.current.value =
                    data?.comparison_cta ?? "Comenzar ahora";

            if (stepsTitleRef.current)
                stepsTitleRef.current.value =
                    data?.steps_title ?? "Cambia en 3 pasos";
            if (stepsSubtitleRef.current)
                stepsSubtitleRef.current.value =
                    data?.steps_subtitle ??
                    "Es más fácil que el banco y 100% seguro.";

            if (ctaTitleRef.current)
                ctaTitleRef.current.value =
                    data?.cta_title ?? "Empieza a ahorrar ahora";
            if (ctaSubtitleRef.current)
                ctaSubtitleRef.current.value =
                    data?.cta_subtitle ??
                    "Únete a los más de 60,000 peruanos que ya ahorran con la casa de cambio digital líder en Perú.";
            if (ctaButtonTextRef.current)
                ctaButtonTextRef.current.value =
                    data?.cta_button_text ?? "Cambiar ahora";
            if (ctaButtonLinkRef.current)
                ctaButtonLinkRef.current.value =
                    data?.cta_button_link ?? "https://cambiafx.pe/registro";

            if (ctaImageRef.image) {
                ctaImageRef.image.src = data?.cta_image
                    ? `/api/transactional_landings/media/${data.cta_image}`
                    : "/api/cover/thumbnail/null";
            }
        }, 100);

        if (modalRef.current) {
            const modalInstance = bootstrap.Modal.getInstance(modalRef.current) || new bootstrap.Modal(modalRef.current);
            modalInstance.show();
        }
    };

    const addStat = () => setStats([...stats, { label: "", value: "" }]);
    const removeStat = (index) => setStats(stats.filter((_, i) => i !== index));
    const updateStat = (index, field, value) => {
        const newStats = [...stats];
        newStats[index][field] = value;
        setStats(newStats);
    };

    const addComparison = () =>
        setComparisonData([
            ...comparisonData,
            { entity: "", buy: "", sell: "", is_highlight: false },
        ]);
    const removeComparison = (index) =>
        setComparisonData(comparisonData.filter((_, i) => i !== index));
    const updateComparison = (index, field, value) => {
        const newData = [...comparisonData];
        newData[index][field] = value;
        setComparisonData(newData);
    };

    const addFaq = () => setFaqData([...faqData, { question: "", answer: "" }]);
    const removeFaq = (index) =>
        setFaqData(faqData.filter((_, i) => i !== index));
    const updateFaq = (index, field, value) => {
        const newData = [...faqData];
        newData[index][field] = value;
        setFaqData(newData);
    };

    const addStep = () => setStepsData([...stepsData, { title: "", description: "", image: "" }]);
    const removeStep = (index) => setStepsData(stepsData.filter((_, i) => i !== index));
    const updateStep = (index, field, value) => {
        const newData = [...stepsData];
        newData[index][field] = value;
        setStepsData(newData);
    };

    const onStepImageChange = (index, file) => {
        const newData = [...stepsData];
        newData[index].file = file;
        setStepsData(newData);
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            if (idRef.current?.value)
                formData.append("id", idRef.current.value);
            formData.append("name", nameRef.current?.value || "");
            formData.append("url", urlRef.current?.value || "");
            formData.append("h1", h1Ref.current?.value || "");
            formData.append(
                "schema_service_name",
                schemaServiceNameRef.current?.value || "",
            );
            formData.append(
                "schema_service_description",
                schemaServiceDescriptionRef.current?.value || "",
            );
            formData.append(
                "schema_service_payments_accepted",
                schemaServicePaymentsRef.current?.value || "",
            );
            formData.append("meta_title", metaTitleRef.current?.value || "");
            formData.append(
                "meta_description",
                metaDescriptionRef.current?.value || "",
            );
            formData.append(
                "meta_keywords",
                metaKeywordsRef.current?.value || "",
            );

            formData.append(
                "hero_eyebrow",
                heroEyebrowRef.current?.value || "",
            );
            formData.append("hero_title", heroTitleRef.current?.value || "");
            formData.append(
                "hero_subtitle",
                heroSubtitleRef.current?.value || "",
            );

            formData.append("stats", JSON.stringify(stats));
            formData.append("comparison_data", JSON.stringify(comparisonData));
            formData.append("schema_faq", JSON.stringify(faqData));

            // Para los pasos, enviamos la data y los archivos por separado
            const stepsWithoutFiles = stepsData.map((step, i) => {
                const { file, ...rest } = step;
                if (file) {
                    formData.append(`step_image_${i}`, file);
                }
                return rest;
            });
            formData.append("steps", JSON.stringify(stepsWithoutFiles));

            formData.append(
                "comparison_title",
                comparisonTitleRef.current?.value || "",
            );
            formData.append(
                "comparison_subtitle",
                comparisonSubtitleRef.current?.value || "",
            );
            formData.append(
                "comparison_cta",
                comparisonCtaRef.current?.value || "",
            );

            formData.append("steps_title", stepsTitleRef.current?.value || "");
            formData.append(
                "steps_subtitle",
                stepsSubtitleRef.current?.value || "",
            );

            formData.append("cta_title", ctaTitleRef.current?.value || "");
            formData.append(
                "cta_subtitle",
                ctaSubtitleRef.current?.value || "",
            );
            formData.append(
                "cta_button_text",
                ctaButtonTextRef.current?.value || "",
            );
            formData.append(
                "cta_button_link",
                ctaButtonLinkRef.current?.value || "",
            );

            if (ctaImageRef.current?.files[0]) {
                formData.append("cta_image", ctaImageRef.current.files[0]);
            }

            formData.append("lang_id", default_lang_id);

            const result = await transactionalLandingRest.save(formData);
            if (result) {
                // Cerramos el modal inmediatamente antes de actualizar estados para evitar bloqueos de React
                const modalEl = document.getElementById("modal-transactional-landing");
                if (modalEl) {
                    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modalInstance.hide();
                    // Refuerzo con jQuery y limpieza de backdrop por si falla la transición
                    $(modalEl).modal("hide");
                    $(".modal-backdrop").remove();
                    $("body").removeClass("modal-open").css("overflow", "").css("padding-right", "");
                }

                const updatedLanding = result.data || result;
                if (isEditing) {
                    setItems(
                        items.map((item) =>
                            item.id == updatedLanding.id
                                ? updatedLanding
                                : item,
                        ),
                    );
                } else {
                    setItems([updatedLanding, ...items]);
                }
                Notify.success("Landing guardada correctamente");
            }
        } catch (error) {
            console.error("Error al guardar landing:", error);
            Notify.error("Ocurrió un error al intentar guardar los cambios.");
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title">Listado de Landings SEO</h4>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onModalOpen()}
                    >
                        <i className="fa fa-plus me-1"></i> Nueva Landing
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>URL</th>
                                    <th>Nombre Interno</th>
                                    <th>Título Hero (H1)</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <code>/{item.url}</code>
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.hero_title}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-xs btn-soft-primary"
                                                    onClick={() =>
                                                        onModalOpen(item)
                                                    }
                                                >
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                                <a
                                                    href={`/${item.url}`}
                                                    target="_blank"
                                                    className="btn btn-xs btn-soft-info"
                                                >
                                                    <i className="fa fa-eye"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL EDIT */}
            <div
                className="modal fade"
                id="modal-transactional-landing"
                ref={modalRef}
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <form onSubmit={onModalSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {isEditing
                                        ? "Editar Landing"
                                        : "Nueva Landing"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body p-0">
                                <input type="hidden" ref={idRef} />
                                <ul
                                    className="nav nav-tabs nav-bordered mb-0"
                                    id="landingTabs"
                                    role="tablist"
                                >
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link active"
                                            id="seo-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#seo"
                                            type="button"
                                            role="tab"
                                        >
                                            SEO & General
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link"
                                            id="hero-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#hero"
                                            type="button"
                                            role="tab"
                                        >
                                            Hero & Stats
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link"
                                            id="comparison-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#comparison"
                                            type="button"
                                            role="tab"
                                        >
                                            Comparativa
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link"
                                            id="steps-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#steps"
                                            type="button"
                                            role="tab"
                                        >
                                            Marketing & Pasos
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className="nav-link"
                                            id="faqs-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#faqs"
                                            type="button"
                                            role="tab"
                                        >
                                            Estructurados
                                        </button>
                                    </li>
                                </ul>

                                <div
                                    className="tab-content p-4"
                                    id="landingTabsContent"
                                >
                                    {/* TAB 1: SEO & General */}
                                    <div
                                        className="tab-pane fade show active"
                                        id="seo"
                                        role="tabpanel"
                                    >
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    label="Nombre Interno"
                                                    colSize="12"
                                                    eRef={nameRef}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    label="URL Slug (sin /)"
                                                    colSize="12"
                                                    eRef={urlRef}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <hr className="my-2" />
                                                <h5 className="mb-3 text-primary">
                                                    Metadatos SEO
                                                </h5>
                                            </div>
                                            <div className="col-md-12">
                                                <InputFormGroup
                                                    label="Meta Title"
                                                    colSize="12"
                                                    eRef={metaTitleRef}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <TextareaFormGroup
                                                    label="Meta Description"
                                                    colSize="12"
                                                    eRef={metaDescriptionRef}
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <TextareaFormGroup
                                                    label="Palabras Clave (Meta Keywords)"
                                                    colSize="12"
                                                    eRef={metaKeywordsRef}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB 2: Hero & Stats */}
                                    <div
                                        className="tab-pane fade"
                                        id="hero"
                                        role="tabpanel"
                                    >
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <h5 className="mb-3 text-primary">
                                                    Contenido Hero
                                                </h5>
                                            </div>
                                            <div className="col-md-4">
                                                <InputFormGroup
                                                    label="Hero Eyebrow"
                                                    colSize="12"
                                                    eRef={heroEyebrowRef}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <InputFormGroup
                                                    label="Título Principal del Hero (H1)"
                                                    colSize="12"
                                                    eRef={heroTitleRef}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <TextareaFormGroup
                                                    label="Hero Subtitle"
                                                    colSize="12"
                                                    eRef={heroSubtitleRef}
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <hr />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="mb-0 text-primary">
                                                        Estadísticas (Stats)
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-outline-primary"
                                                        onClick={addStat}
                                                    >
                                                        + Agregar
                                                    </button>
                                                </div>
                                                <div className="row g-2">
                                                    {stats.map((stat, i) => (
                                                        <div
                                                            key={i}
                                                            className="col-md-4 mb-2"
                                                        >
                                                            <div className="input-group input-group-sm">
                                                                <input
                                                                    className="form-control"
                                                                    placeholder="Label"
                                                                    value={
                                                                        stat.label
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateStat(
                                                                            i,
                                                                            "label",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <input
                                                                    className="form-control"
                                                                    placeholder="Valor"
                                                                    value={
                                                                        stat.value
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateStat(
                                                                            i,
                                                                            "value",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() =>
                                                                        removeStat(
                                                                            i,
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB 3: Comparativa */}
                                    <div
                                        className="tab-pane fade"
                                        id="comparison"
                                        role="tabpanel"
                                    >
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <h5 className="mb-3 text-primary">
                                                    Configuración de Comparativa
                                                </h5>
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    label="Título Comparativa (* para destacar)"
                                                    colSize="12"
                                                    eRef={comparisonTitleRef}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    label="Texto Botón (CTA)"
                                                    colSize="12"
                                                    eRef={comparisonCtaRef}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <TextareaFormGroup
                                                    label="Subtítulo de Comparativa"
                                                    colSize="12"
                                                    eRef={comparisonSubtitleRef}
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <hr />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="mb-0 text-primary">
                                                        Tabla de Mercado
                                                        (Bancos)
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-outline-primary"
                                                        onClick={addComparison}
                                                    >
                                                        + Agregar Entidad
                                                    </button>
                                                </div>
                                                <div className="table-responsive border rounded">
                                                    <table className="table table-sm table-centered mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Entidad</th>
                                                                <th>Compra</th>
                                                                <th>Venta</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {comparisonData.map(
                                                                (comp, i) => (
                                                                    <tr key={i}>
                                                                        <td>
                                                                            <select
                                                                                className="form-select form-select-sm border-0"
                                                                                value={comp.entity}
                                                                                onChange={(e) => updateComparison(i, "entity", e.target.value)}
                                                                            >
                                                                                <option value="">Seleccionar Entidad</option>
                                                                                <option value="BCP">BCP</option>
                                                                                <option value="Interbank">Interbank</option>
                                                                                <option value="Scotiabank">Scotiabank</option>
                                                                                <option value="BBVA">BBVA</option>
                                                                                <option value="Pichincha">Pichincha</option>
                                                                                <option value="Banbif">Banbif</option>
                                                                                <option value="Otros">Otros</option>
                                                                            </select>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control form-control-sm border-0"
                                                                                value={
                                                                                    comp.buy
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateComparison(
                                                                                        i,
                                                                                        "buy",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control form-control-sm border-0"
                                                                                value={
                                                                                    comp.sell
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateComparison(
                                                                                        i,
                                                                                        "sell",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-link text-danger p-0"
                                                                                onClick={() =>
                                                                                    removeComparison(
                                                                                        i,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i className="fa fa-trash"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB 4: Marketing & Pasos */}
                                    <div
                                        className="tab-pane fade"
                                        id="steps"
                                        role="tabpanel"
                                    >
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <h5 className="mb-3 text-primary">
                                                    Sección Pasos
                                                </h5>
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    label="Título Pasos"
                                                    colSize="12"
                                                    eRef={stepsTitleRef}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    label="Subtítulo Pasos"
                                                    colSize="12"
                                                    eRef={stepsSubtitleRef}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="mb-0 text-primary">Gestionar Pasos Individuales</h6>
                                                    <button type="button" className="btn btn-xs btn-outline-primary" onClick={addStep}>+ Agregar Paso</button>
                                                </div>
                                                <div className="row g-3">
                                                    {stepsData.map((step, i) => (
                                                        <div key={i} className="col-md-4">
                                                            <div className="card border shadow-none mb-0">
                                                                <div className="card-body p-2">
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <span className="badge bg-primary">Paso {i + 1}</span>
                                                                        <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeStep(i)}>
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control form-control-sm" 
                                                                            placeholder="Título del paso" 
                                                                            value={step.title}
                                                                            onChange={(e) => updateStep(i, 'title', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <textarea 
                                                                            className="form-control form-control-sm" 
                                                                            placeholder="Descripción" 
                                                                            rows="2"
                                                                            value={step.description}
                                                                            onChange={(e) => updateStep(i, 'description', e.target.value)}
                                                                        ></textarea>
                                                                    </div>
                                                                    <div className="mb-0">
                                                                        <ImageFormGroup
                                                                            label="Imagen del paso"
                                                                            aspect={1}
                                                                            fit="cover"
                                                                            src={step.image ? `/api/transactional_landings/media/${step.image}` : ''}
                                                                            onChange={(e) => onStepImageChange(i, e.target.files[0])}
                                                                            col="col-12"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <hr />
                                                <h5 className="mb-3 text-primary">
                                                    CTA Final Premium
                                                </h5>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="row g-3">
                                                    <div className="col-md-12">
                                                        <InputFormGroup
                                                            label="Título CTA Final"
                                                            colSize="12"
                                                            eRef={ctaTitleRef}
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <InputFormGroup
                                                            label="Texto Botón Final"
                                                            colSize="12"
                                                            eRef={
                                                                ctaButtonTextRef
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <InputFormGroup
                                                            label="Link del Botón Final (URL)"
                                                            colSize="12"
                                                            eRef={
                                                                ctaButtonLinkRef
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <TextareaFormGroup
                                                            label="Descripción CTA Final"
                                                            colSize="12"
                                                            eRef={
                                                                ctaSubtitleRef
                                                            }
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <ImageFormGroup
                                                    label="Imagen Banner (Sugerido PNG Transparente)"
                                                    colSize="12"
                                                    eRef={ctaImageRef}
                                                    aspect="16/9"
                                                    fit="contain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB 5: Estructurados */}
                                    <div
                                        className="tab-pane fade"
                                        id="faqs"
                                        role="tabpanel"
                                    >
                                        <div className="row g-4">
                                            <div className="col-md-12">
                                                <div className="d-flex align-items-center mb-3">
                                                    <h5 className="mb-0 text-primary">
                                                        Schema Markup:
                                                        FinancialService
                                                    </h5>
                                                </div>
                                                <div className="row g-3 border rounded p-3 bg-light-subtle mx-0">
                                                    <div className="col-md-6">
                                                        <InputFormGroup
                                                            label="Nombre del Servicio"
                                                            colSize="12"
                                                            eRef={
                                                                schemaServiceNameRef
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <InputFormGroup
                                                            label="Métodos de Pago"
                                                            colSize="12"
                                                            eRef={
                                                                schemaServicePaymentsRef
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <TextareaFormGroup
                                                            label="Descripción del Servicio (para buscadores)"
                                                            colSize="12"
                                                            eRef={
                                                                schemaServiceDescriptionRef
                                                            }
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div
                                                            className="alert alert-info d-flex align-items-center mb-0 py-2 px-3 border-info-subtle shadow-sm"
                                                            role="alert"
                                                            style={{
                                                                fontSize:
                                                                    "0.85rem",
                                                            }}
                                                        >
                                                            <i className="fa fa-info-circle me-2"></i>
                                                            <div>
                                                                Los datos de{" "}
                                                                <strong>
                                                                    contacto,
                                                                    dirección y
                                                                    horarios
                                                                </strong>{" "}
                                                                se sincronizan
                                                                automáticamente
                                                                con la
                                                                configuración
                                                                global del
                                                                sitio.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <hr className="my-4" />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="mb-0 text-primary">
                                                        Preguntas Frecuentes
                                                        (Schema FAQ)
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary rounded-pill px-3"
                                                        onClick={addFaq}
                                                    >
                                                        <i className="fa fa-plus me-1"></i>{" "}
                                                        Agregar Pregunta
                                                    </button>
                                                </div>
                                                <div
                                                    className="accordion"
                                                    id="faqAccordion"
                                                >
                                                    {faqData.map((faq, i) => (
                                                        <div
                                                            className="accordion-item border rounded mb-2 overflow-hidden shadow-sm"
                                                            key={i}
                                                        >
                                                            <h2 className="accordion-header d-flex align-items-center pr-3 bg-white">
                                                                <button
                                                                    className="accordion-button collapsed py-3 shadow-none fw-medium"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#faqCollapse${i}`}
                                                                >
                                                                    FAQ #{i + 1}
                                                                    :{" "}
                                                                    {faq.question ||
                                                                        "(Sin pregunta)"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-link text-danger text-decoration-none px-3"
                                                                    onClick={() =>
                                                                        removeFaq(
                                                                            i,
                                                                        )
                                                                    }
                                                                    title="Eliminar"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </h2>
                                                            <div
                                                                id={`faqCollapse${i}`}
                                                                className="accordion-collapse collapse"
                                                                data-bs-parent="#faqAccordion"
                                                            >
                                                                <div className="accordion-body bg-light-subtle border-top p-3">
                                                                    <div className="row g-2">
                                                                        <div className="col-md-12">
                                                                            <input
                                                                                className="form-control form-control-sm border-0 bg-white"
                                                                                placeholder="Escribe la pregunta..."
                                                                                value={
                                                                                    faq.question
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateFaq(
                                                                                        i,
                                                                                        "question",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <textarea
                                                                                className="form-control form-control-sm border-0 bg-white"
                                                                                rows="3"
                                                                                placeholder="Escribe la respuesta..."
                                                                                value={
                                                                                    faq.answer
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateFaq(
                                                                                        i,
                                                                                        "answer",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                            ></textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Landings Transaccionales">
            <TransactionalLanding {...properties} />
        </BaseAdminto>,
    );
});
