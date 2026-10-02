import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Table";
import Modal from "../Components/Modal";
import InputFormGroup from "../Components/form/InputFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SelectFormGroup from "../Components/form/SelectFormGroup";
import Swal from "sweetalert2";
import PostsRest from "../Actions/Admin/PostsRest";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import html2string from "../Utils/html2string";
import SetSelectValue from "../Utils/SetSelectValue";

const postsRest = new PostsRest();

const Posts = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const categoryRef = useRef();
    const descriptionRef = useRef();
    const tagsRef = useRef();
    const imageRef = useRef();
    const postDateRef = useRef();
    const seoTitleRef = useRef();
    const seoDescriptionRef = useRef();
    const seoKeywordsRef = useRef();
    const authorRef = useRef();
    const authorTypeRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [sendNewsletter, setSendNewsletter] = useState(false);
    const [newsletterTarget, setNewsletterTarget] = useState("recent");
    const [newsletterDailyLimit, setNewsletterDailyLimit] = useState(5000);
    const [campaignData, setCampaignData] = useState(null);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        SetSelectValue(
            categoryRef.current,
            data?.category?.id,
            data?.category?.name,
        );
        descriptionRef.editor.root.innerHTML = data?.description ?? "";
        imageRef.image.src = `/api/posts/media/${data?.image}`;
        imageRef.current.value = null;
        SetSelectValue(tagsRef.current, data?.tags ?? [], "id", "name");
        postDateRef.current.value = data?.post_date
            ? moment(data.post_date).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD");

        seoTitleRef.current.value = data?.seo_title ?? "";
        seoDescriptionRef.current.value = data?.seo_description ?? "";
        authorRef.current.value = data?.author || "Equipo Cambia FX";
        $(authorTypeRef.current).val(data?.author_type || "Organization").trigger("change");
        seoKeywordsRef.current.value = data?.seo_keywords ?? "";

        // Reset y datos de campaña de boletín
        setCampaignData(data?.newsletter_campaign || null);
        setSendNewsletter(false); // Siempre deshabilitado por defecto para evitar envíos involuntarios
        setNewsletterTarget(data?.newsletter_campaign?.target_order || "recent");
        setNewsletterDailyLimit(data?.newsletter_campaign?.daily_limit || 5000);
        setActiveTab("general");

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            category_id: categoryRef.current.value,
            summary: html2string(descriptionRef.current.value),
            description: descriptionRef.current.value,
            tags: $(tagsRef.current).val(),
            post_date: postDateRef.current.value,
            seo_title: seoTitleRef.current.value || nameRef.current.value,
            seo_description:
                seoDescriptionRef.current.value ||
                html2string(descriptionRef.current.value).substring(0, 155),
            author: authorRef.current.value,
            author_type: $(authorTypeRef.current).val(),
            seo_keywords: seoKeywordsRef.current.value,
            send_newsletter: sendNewsletter ? 1 : 0,
            newsletter_target: newsletterTarget,
            newsletter_daily_limit: newsletterDailyLimit,
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }
        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }

        const result = await postsRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await postsRest.boolean({ id, field: "visible", value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
    const onBooleanChange = async ({ id, field, value }) => {
        const result = await postsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await postsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const [activeTab, setActiveTab] = useState("general");

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Posts"
                rest={postsRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Nuevo registro",
                            hint: "Nuevo registro",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "post_date",
                        caption: "Fecha",
                        dataType: "date",
                        sortOrder: "desc",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span>
                                    {moment
                                        .utc(data.post_date)
                                        .format("DD/MM/YYYY")}
                                </span>,
                            );
                        },
                    },
                    {
                        dataField: "category.name",
                        caption: "Categoría",
                        width: "150px",
                    },
                    {
                        dataField: "name",
                        caption: "Título",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <>
                                    <span className="fw-bold">{data.name}</span>
                                    <br />
                                    {data.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-soft-primary me-1"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </>,
                            );
                        },
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/posts/media/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />,
                            );
                        },
                    },
                    /* {
            dataField: "featured",
            caption: "Destacado",
            dataType: "boolean",
            width: "80px",
            alignment: 'center',
            cellTemplate: (container, { data }) => {
                ReactAppend(
                    container,
                    <SwitchFormGroup
                        checked={data.featured}
                        onChange={(e) =>
                            onBooleanChange({
                                id: data.id,
                                field: "featured",
                                value: e.target.checked,
                            })
                        }
                    />
                );
            },
        },*/
                    {
                        dataField: "newsletter_campaign",
                        caption: "Boletín Email",
                        width: "160px",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            const campaign = data.newsletter_campaign;
                            if (!campaign) {
                                ReactAppend(
                                    container,
                                    <span className="badge badge-soft-secondary">
                                        Sin boletín
                                    </span>,
                                );
                                return;
                            }
                            if (campaign.status === "completed") {
                                ReactAppend(
                                    container,
                                    <span
                                        className="badge badge-soft-success"
                                        title={`Enviado a ${campaign.sent_count} suscriptores`}
                                    >
                                        <i className="fa fa-check-circle me-1"></i>
                                        Enviado ({campaign.sent_count})
                                    </span>,
                                );
                            } else if (campaign.status === "processing") {
                                ReactAppend(
                                    container,
                                    <span
                                        className="badge badge-soft-warning"
                                        title={`Enviando: ${campaign.sent_count} de ${campaign.total_subscribers}`}
                                    >
                                        <i className="fa fa-spinner fa-spin me-1"></i>
                                        Enviando ({campaign.sent_count}/{campaign.total_subscribers})
                                    </span>,
                                );
                            } else if (campaign.status === "paused") {
                                ReactAppend(
                                    container,
                                    <span
                                        className="badge badge-soft-info"
                                        title="Pausado hoy para no saturar Microsoft 365. Se reanuda automáticamente mañana"
                                    >
                                        <i className="fa fa-clock me-1"></i>
                                        Pausado hoy ({campaign.sent_count}/{campaign.total_subscribers})
                                    </span>,
                                );
                            } else {
                                ReactAppend(
                                    container,
                                    <span className="badge badge-soft-primary">
                                        En cola ({campaign.total_subscribers})
                                    </span>,
                                );
                            }
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                }),
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar post" : "Agregar post"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <div className="row" id="posts-container">
                    <input ref={idRef} type="hidden" />

                    <div className="col-12 mb-3">
                        <ul
                            className="nav nav-tabs nav-tabs-custom"
                            role="tablist"
                        >
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("general");
                                    }}
                                    type="button"
                                >
                                    <i className="fa fa-home me-2"></i>General
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "content" ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("content");
                                    }}
                                    type="button"
                                >
                                    <i className="fa fa-file-text me-2"></i>
                                    Contenido
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "seo" ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("seo");
                                    }}
                                    type="button"
                                >
                                    <i className="fa fa-search me-2"></i>SEO
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "newsletter" ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("newsletter");
                                    }}
                                    type="button"
                                >
                                    <i className="fa fa-envelope me-2"></i>
                                    Notificación Email
                                    {campaignData && (
                                        <span
                                            className={`badge ms-1 ${
                                                campaignData.status === "completed"
                                                    ? "bg-success"
                                                    : campaignData.status === "processing"
                                                    ? "bg-warning"
                                                    : "bg-info"
                                            }`}
                                        >
                                            {campaignData.status === "completed"
                                                ? "Enviado"
                                                : "En cola"}
                                        </span>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="col-12">
                        <div className="tab-content">
                            {/* General Tab */}
                            <div
                                className={`tab-pane fade ${activeTab === "general" ? "show active" : ""}`}
                            >
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="row">
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Título"
                                                col="col-12"
                                                required
                                            />
                                            <div className="col-md-6">
                                                <SelectAPIFormGroup
                                                    eRef={categoryRef}
                                                    searchAPI="/api/admin/categories/paginate"
                                                    searchBy="name"
                                                    label="Categoría"
                                                    required
                                                    dropdownParent="#posts-container"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    eRef={postDateRef}
                                                    label="Fecha de publicación"
                                                    type="date"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <InputFormGroup
                                                    eRef={authorRef}
                                                    label="Autor"
                                                    placeholder="Equipo Cambia FX"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <SelectFormGroup
                                                    eRef={authorTypeRef}
                                                    label="Tipo de Autor"
                                                    dropdownParent="#posts-container"
                                                >
                                                    <option value="Organization">
                                                        Organización
                                                    </option>
                                                    <option value="Person">
                                                        Persona
                                                    </option>
                                                </SelectFormGroup>
                                            </div>
                                            <div
                                                className="col-12 hidden"
                                                hidden
                                            >
                                                <SelectAPIFormGroup
                                                    id="tags"
                                                    eRef={tagsRef}
                                                    searchAPI={
                                                        "/api/admin/tags/paginate"
                                                    }
                                                    searchBy="name"
                                                    label="Tags"
                                                    dropdownParent="#posts-container"
                                                    tags
                                                    multiple
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <ImageFormGroup
                                            eRef={imageRef}
                                            label="Imagen Principal"
                                            aspect="16/9"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Tab */}
                            <div
                                className={`tab-pane fade ${activeTab === "content" ? "show active" : ""}`}
                            >
                                <div className="row">
                                    <QuillFormGroup
                                        eRef={descriptionRef}
                                        label="Contenido del Artículo"
                                        col="col-12"
                                        height="1000px"
                                        style={{ height: "1000px" }}
                                    />
                                </div>
                            </div>

                            {/* SEO Tab */}
                            <div
                                className={`tab-pane fade ${activeTab === "seo" ? "show active" : ""}`}
                            >
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <div className="alert alert-info">
                                            <i className="fa fa-info-circle me-2"></i>
                                            Configura los metadatos para
                                            optimizar la aparición de este
                                            artículo en los motores de búsqueda.
                                        </div>
                                    </div>
                                    <InputFormGroup
                                        eRef={seoTitleRef}
                                        label="Título SEO (Meta Title)"
                                        col="col-12"
                                        placeholder="Si se deja vacío, se usará el título del post"
                                    />
                                    <TextareaFormGroup
                                        eRef={seoDescriptionRef}
                                        label="Descripción SEO (Meta Description)"
                                        col="col-12"
                                        rows={3}
                                        placeholder="Breve resumen para los resultados de búsqueda..."
                                    />
                                    <TextareaFormGroup
                                        eRef={seoKeywordsRef}
                                        label="Palabras Clave (Meta Keywords)"
                                        col="col-12"
                                        rows={2}
                                        placeholder="palabra1, palabra2, palabra clave 3..."
                                    />
                                </div>
                            </div>

                            {/* Newsletter Tab */}
                            <div
                                className={`tab-pane fade ${activeTab === "newsletter" ? "show active" : ""}`}
                            >
                                <div className="row">
                                    {campaignData ? (
                                        <div className="col-12">
                                            <div
                                                className={`alert ${
                                                    campaignData.status === "completed"
                                                        ? "alert-success"
                                                        : campaignData.status === "paused"
                                                        ? "alert-info"
                                                        : "alert-warning"
                                                } p-3`}
                                            >
                                                <div className="d-flex align-items-center mb-2">
                                                    <i
                                                        className={`fa ${
                                                            campaignData.status === "completed"
                                                                ? "fa-check-circle text-success"
                                                                : "fa-info-circle text-warning"
                                                        } fa-2x me-2`}
                                                    ></i>
                                                    <div>
                                                        <h5 className="mb-0">
                                                            {campaignData.status === "completed" && "Boletín Enviado Completamente"}
                                                            {campaignData.status === "processing" && "Boletín en Proceso de Envío"}
                                                            {campaignData.status === "paused" && "Boletín Pausado por Límite Diario"}
                                                            {campaignData.status === "pending" && "Boletín Programado en Cola"}
                                                        </h5>
                                                        <small className="text-muted">
                                                            Orden: {campaignData.target_order === "recent" ? "Más recientes primero" : "Más antiguos primero"} | Ritmo: {Number(campaignData.daily_limit || 5000).toLocaleString()} correos/día
                                                        </small>
                                                    </div>
                                                </div>

                                                <div className="my-3">
                                                    <div className="d-flex justify-content-between mb-1 small fw-bold">
                                                        <span>Progreso de envíos:</span>
                                                        <span>
                                                            {campaignData.sent_count} / {campaignData.total_subscribers}{" "}
                                                            ({Math.round((campaignData.sent_count / (campaignData.total_subscribers || 1)) * 100)}%)
                                                        </span>
                                                    </div>
                                                    <div className="progress" style={{ height: "14px" }}>
                                                        <div
                                                            className={`progress-bar progress-bar-striped ${
                                                                campaignData.status === "completed"
                                                                    ? "bg-success"
                                                                    : "bg-warning progress-bar-animated"
                                                            }`}
                                                            role="progressbar"
                                                            style={{
                                                                width: `${Math.min(100, Math.round((campaignData.sent_count / (campaignData.total_subscribers || 1)) * 100))}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {campaignData.status === "paused" && campaignData.next_batch_at && (
                                                    <div className="alert alert-light border small mb-2">
                                                        <i className="fa fa-clock me-1 text-primary"></i>
                                                        <strong>Próximo lote programado:</strong> Se reanudará automáticamente el{" "}
                                                        {moment(campaignData.next_batch_at).format("DD/MM/YYYY [a las] hh:mm A")}.
                                                    </div>
                                                )}

                                                {campaignData.status !== "completed" && (
                                                    <p className="small text-muted mb-0">
                                                        * Los correos se envían en segundo plano de manera escalonada respetando la cuota de Microsoft 365 para no saturar tu buzón corporativo.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-12">
                                            <div className="card border mb-3">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                                                        <div>
                                                            <h5 className="mb-1 text-primary">
                                                                <i className="fa fa-paper-plane me-2"></i>
                                                                Notificar publicación a los suscriptores
                                                            </h5>
                                                            <p className="text-muted small mb-0">
                                                                Envía un correo masivo a los suscriptores registrados informando sobre este post.
                                                            </p>
                                                        </div>
                                                        <div className="form-check form-switch form-switch-md">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="send_newsletter_switch"
                                                                checked={sendNewsletter}
                                                                onChange={(e) => setSendNewsletter(e.target.checked)}
                                                                style={{ width: "45px", height: "24px", cursor: "pointer" }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {!sendNewsletter ? (
                                                        <div className="alert alert-secondary mb-0">
                                                            <i className="fa fa-info-circle me-2"></i>
                                                            <strong>Envío desactivado:</strong> Al guardar el post, <strong>NO</strong> se enviará ningún correo masivo. Activa la casilla solo cuando desees lanzar la campaña a los suscriptores.
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2">
                                                            <div className="alert alert-warning border-0 bg-soft-warning mb-3">
                                                                <h6 className="alert-heading text-warning fw-bold mb-1">
                                                                    <i className="fa fa-shield-alt me-2"></i>
                                                                    Protección activa de Microsoft 365
                                                                </h6>
                                                                <p className="small mb-0">
                                                                    Para proteger tu buzón <code>hola@cambiafx.pe</code> contra bloqueos por spam o límites de destinatarios (máx. 10,000/día y 30/minuto), los correos se enviarán automáticamente en <strong>lotes diarios espaciados</strong>.
                                                                </p>
                                                            </div>

                                                            <div className="row g-3">
                                                                <div className="col-md-6">
                                                                    <label className="form-label fw-bold small text-dark">
                                                                        Prioridad de destinatarios:
                                                                    </label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={newsletterTarget}
                                                                        onChange={(e) => setNewsletterTarget(e.target.value)}
                                                                    >
                                                                        <option value="recent">
                                                                            Más recientes primero (Recomendado)
                                                                        </option>
                                                                        <option value="oldest">
                                                                            Más antiguos primero
                                                                        </option>
                                                                    </select>
                                                                    <small className="form-text text-muted d-block mt-1">
                                                                        {newsletterTarget === "recent"
                                                                            ? "👉 Llegará primero a los clientes más nuevos y recientemente activos."
                                                                            : "👉 Llegará primero a los primeros clientes registrados en la base."}
                                                                    </small>
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <label className="form-label fw-bold small text-dark">
                                                                        Ritmo de envío diario:
                                                                    </label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={newsletterDailyLimit}
                                                                        onChange={(e) => setNewsletterDailyLimit(Number(e.target.value))}
                                                                    >
                                                                        <option value={3000}>
                                                                            3,000 correos / día (Máxima seguridad)
                                                                        </option>
                                                                        <option value={5000}>
                                                                            5,000 correos / día (Recomendado)
                                                                        </option>
                                                                        <option value={8000}>
                                                                            8,000 correos / día (Rápido, cerca del tope)
                                                                        </option>
                                                                    </select>
                                                                    <small className="form-text text-muted d-block mt-1">
                                                                        Tope de correos diarios para que tu buzón corporativo funcione sin restricciones.
                                                                    </small>
                                                                </div>
                                                            </div>

                                                            <div className="p-3 bg-light rounded mt-3 border">
                                                                <h6 className="fw-bold text-dark mb-1 small">
                                                                    <i className="fa fa-calculator text-primary me-2"></i>
                                                                    Estimación para los 18,000 suscriptores:
                                                                </h6>
                                                                <p className="small text-muted mb-0">
                                                                    {newsletterDailyLimit === 3000 &&
                                                                        "⏱️ Con 3,000 diarios, el envío total tomará aprox. 6 días hábiles en completarse (1 correo cada 2.2 segundos)."}
                                                                    {newsletterDailyLimit === 5000 &&
                                                                        "⏱️ Con 5,000 diarios, el envío total tomará aprox. 3 a 4 días hábiles en completarse (1 correo cada 2.2 segundos)."}
                                                                    {newsletterDailyLimit === 8000 &&
                                                                        "⏱️ Con 8,000 diarios, el envío total tomará aprox. 2 a 3 días hábiles en completarse (1 correo cada 2.2 segundos)."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Posts">
            <Posts {...properties} />
        </BaseAdminto>,
    );
});
