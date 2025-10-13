import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ServicesRest from "../Actions/Admin/ServicesRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import { LanguageProvider } from "../context/LanguageContext";
import DragDropImage from "../components/Adminto/form/DragDropImage";
import SelectAPIFormGroupSupport from "../components/Adminto/form/SelectAPIFormGroupSupport";

const servicesRest = new ServicesRest();
// Componente FeatureCard simplificado
const FeatureCard = ({
    feature,
    index,
    onUpdate,
    onRemove,
    type,
    canRemove,
    characteristics,
    benefits,
    addCharacteristic,
    addBenefit,
    addStep,
    steps,
}) => {
    const handleFieldChange = (field, value) => {
        onUpdate(index, field, value);
    };

    const handleImageChange = (imageData) => {
        onUpdate(index, "image", imageData);
    };

    const getCardIcon = () => {
        switch (type) {
            case "characteristic": return "fas fa-check-circle text-success";
            case "benefit": return "fas fa-star text-warning";
            case "step": return "fas fa-arrow-right text-primary";
            default: return "fas fa-circle";
        }
    };

    const getCardTitle = () => {
        switch (type) {
            case "characteristic": return "Característica";
            case "benefit": return "Beneficio";
            case "step": return "Paso";
            default: return "Item";
        }
    };

    return (
        <div className="card border shadow-sm h-100">
            <div className="card-header bg-transparent border-bottom-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <h6 className="card-title mb-0">
                        <i className={getCardIcon() + " me-2"}></i>
                        {getCardTitle()} {index + 1}
                    </h6>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                        onClick={() => onRemove(index)}
                        disabled={!canRemove}
                        title="Eliminar"
                        style={{ width: '30px', height: '30px' }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div className="card-body pt-2">
                {type === "characteristic" ? (
                    <div className="mb-3">
                        <InputFormGroup
                            label="Título de la característica"
                            value={feature.title}
                            onChange={(e) =>
                                handleFieldChange("title", e.target.value)
                            }
                            placeholder="Ingresa el título..."
                        />
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8 mb-3">
                            <InputFormGroup
                                label="Título"
                                value={feature.title}
                                onChange={(e) =>
                                    handleFieldChange("title", e.target.value)
                                }
                                placeholder="Ingresa el título..."
                            />

                            <label className="form-label fw-semibold">Descripción</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={feature.description}
                                onChange={(e) =>
                                    handleFieldChange("description", e.target.value)
                                }
                                placeholder="Describe brevemente..."
                            />
                        </div>

                        <div className="col-lg-3">
                            <DragDropImage
                                label="Imagen"
                                currentImage={feature.image}
                                onChange={handleImageChange}
                                aspect={1}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="card-footer bg-transparent border-top-0 pt-0">
                {(type === "characteristic" && index === characteristics.length - 1) ||
                    (type === "benefit" && index === benefits.length - 1) ||
                    (type === "step" && index === steps.length - 1) ? (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={
                            type === "characteristic"
                                ? addCharacteristic
                                : type === "benefit"
                                    ? addBenefit
                                    : addStep
                        }
                    >
                        <i className="fas fa-plus me-2"></i>
                        Agregar {getCardTitle()}
                    </button>
                ) : null}
            </div>
        </div>
    );
};
const Services = ({ brands }) => {
    const gridRef = useRef();
    const modalRef = useRef();
    /* 'name',
            'title_approach',
            'description_approach',
            'characteristics_approach',
            'title_benefits',
            'title_methodology',
            'description_methodology',
            'steps_methodology', */
    // Form elements ref - Siguiendo el patrón del primer código
    const idRef = useRef();
    // Refs para los campos de texto - igual que en el primer código
    const nameRef = useRef();
    const titleRef = useRef();
    // const titlesecondRef = useRef();
    //const categoryRef = useRef();
    const descriptionRef = useRef();
    //const descriptionsecondRef = useRef();
    //const howItHelpsRef = useRef();
    //const descriptionHelpsRef = useRef();
    // const valuePropositionRef = useRef();
    // const innovationFocusRef = useRef();
    // const customerRelationRef = useRef();

    const title_approachRef = useRef();
    const description_approachRef = useRef();

   // const title_benefitsRef = useRef();
    const title_methodologyRef = useRef();
    const description_methodologyRef = useRef();

    // Refs para imágenes - igual que en el primer código
    const imageRef = useRef();
    const imageEnfoqueRef = useRef();
   // const imageSecondaryRef = useRef();
    // const imageBannerRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    // const [selectedItem, setSelectedItem] = useState(null);

    // Estados para características y beneficios
    const [characteristics, setCharacteristics] = useState([
        { title: "" },
    ]);
    const [benefits, setBenefits] = useState([
        { title: "", description: "", image: undefined },
    ]);

    const [steps, setSteps] = useState([
        { title: "", description: "", image: undefined },
    ]);
    //const [selectedCategory, setSelectedCategory] = useState("");

    // Funciones para características (simplificadas)
    const addCharacteristic = () => {
        setCharacteristics([
            ...characteristics,
            {
                title: "",
                // description: "",
                // image: undefined,
            },
        ]);
    };

    const updateCharacteristic = useCallback((index, field, value) => {
        setCharacteristics((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const removeCharacteristic = (index) => {
        if (characteristics.length <= 1) return;
        setCharacteristics(characteristics.filter((_, i) => i !== index));
    };

    // Funciones para beneficios (simplificadas)
    const addBenefit = () => {
        setBenefits([
            ...benefits,
            {
                title: "",
                description: "",
                image: undefined,
            },
        ]);
    };
    const updateBenefit = useCallback((index, field, value) => {
        setBenefits((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const removeBenefit = (index) => {
        if (benefits.length <= 1) return;
        setBenefits(benefits.filter((_, i) => i !== index));
    };



    const addStep = () => {
        setSteps([
            ...steps,
            {
                title: "",
                description: "",
                image: undefined,
            },
        ]);
    };
    const updateStep = useCallback((index, field, value) => {
        setSteps((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const removeStep = (index) => {
        if (steps.length <= 1) return;
        setSteps(steps.filter((_, i) => i !== index));
    };


    // Cargar datos al editar - similar al primer código
    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Resetear valores como en el primer código
        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        titleRef.current.value = data?.title ?? "";
        //titlesecondRef.current.value = data?.title_second ?? "";
        // categoryRef.current.value = data?.category.name ?? "";
        // setSelectedCategory(data?.category.name);
        // setSelectedItem(data);

        descriptionRef.current.value = data?.description ?? "";
        // descriptionsecondRef.current.value = data?.description_second ?? "";
        //howItHelpsRef.current.value = data?.how_it_helps ?? "";
        // descriptionHelpsRef.current.value = data?.description_helps ?? "";
        //valuePropositionRef.current.value = data?.value_proposition ?? "";
        // innovationFocusRef.current.value = data?.innovation_focus ?? "";
        //customerRelationRef.current.value = data?.customer_relation ?? "";

        title_approachRef.current.value = data?.title_approach ?? "";
        description_approachRef.current.value = data?.description_approach ?? "";

      //  title_benefitsRef.current.value = data?.title_benefits ?? "";
        title_methodologyRef.current.value = data?.title_methodology ?? "";
        description_methodologyRef.current.value = data?.description_methodology ?? "";
        // Manejo de imágenes como en el primer código
        imageRef.image.src = `/api/service/media/${data?.image ?? "undefined"}`;
        imageEnfoqueRef.image.src = `/api/service/media/${data?.image_banner ?? "undefined"}`;
        /*imageSecondaryRef.image.src = `/api/service/media/${data?.image_secondary ?? "undefined"
            }`;*/
        /* imageBannerRef.image.src = `/api/service/media/${data?.image_banner ?? "undefined"
             }`;*/

        // Cargar características y beneficios si existen
        /*if (data?.characteristics) {
            setCharacteristics(
                data.characteristics.map((char) => ({
                    title: char.title || "",
                    description: char.description || "",
                    image: char.image
                        ? { preview: `/api/service/media/${char.image}` }
                        : null,
                }))
            );
        }

        if (data?.benefits) {
            setBenefits(
                data.benefits.map((benefit) => ({
                    title: benefit.title || "",
                    description: benefit.description || "",
                    image: benefit.image
                        ? { preview: `/api/service/media/${benefit.image}` }
                        : null,
                }))
            );
        }*/
        // En onModalOpen, al cargar características y beneficios
        if (data?.characteristics_approach) {
            setCharacteristics(
                data.characteristics_approach.map((char) => ({
                    title: char.title,
                    // description: char.description,
                    // image: char.image, // Guardar directamente el string del nombre de archivo
                }))
            );
        }

        if (data?.benefits) {
            setBenefits(
                data.benefits.map((char) => ({
                    title: char.title,
                    description: char.description,
                    image: char.image, // Guardar directamente el string del nombre de archivo
                }))
            );
        }

        if (data?.steps_methodology) {
            setSteps(
                data.steps_methodology.map((char) => ({
                    title: char.title,
                    description: char.description,
                    image: char.image, // Guardar directamente el string del nombre de archivo
                }))
            );
        }

        $(modalRef.current).modal("show");
    };

    // Enviar formulario - similar al primer código pero adaptado
    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Campos básicos como en el primer código
        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            title: titleRef.current.value,
            //title_second: titlesecondRef.current.value,
            description: descriptionRef.current.value,
            //  description_second: descriptionsecondRef.current.value,
            //how_it_helps: howItHelpsRef.current.value,
            // description_helps: descriptionHelpsRef.current.value,
            // value_proposition: valuePropositionRef.current.value,
            // innovation_focus: innovationFocusRef.current.value,
            //customer_relation: customerRelationRef.current.value,

            title_approach: title_approachRef.current.value,
            description_approach: description_approachRef.current.value,
        //    title_benefits: title_benefitsRef.current.value,
            title_methodology: title_methodologyRef.current.value,
            description_methodology: description_methodologyRef.current.value,
        };

        // Añadir campos básicos al formData
        for (const key in request) {
            formData.append(key, request[key]);
        }

        // Añadir imágenes como en el primer código
        const image = imageRef.current.files[0];
        if (image) formData.append("image", image);

        const imageEnfoque = imageEnfoqueRef.current.files[0];
        if (imageEnfoque) formData.append("image_banner", imageEnfoque);

       {/* const imageSecondary = imageSecondaryRef.current.files[0];
        if (imageSecondary) formData.append("image_secondary", imageSecondary); */}

        /* const imageBanner = imageBannerRef.current.files[0];
         if (imageBanner) formData.append("image_banner", imageBanner);*/


        // Dentro de onModalSubmit, al procesar características
        characteristics.forEach((char, index) => {
            formData.append(`characteristics[${index}][title]`, char.title);
            /*  formData.append(
                  `characteristics[${index}][description]`,
                  char.description
              );
  
              if (char.image) {
                  if (char.image.file) {
                      formData.append(
                          `characteristics[${index}][image]`,
                          char.image.file
                      );
                  }
                  // Si es una imagen existente (viene del servidor como string)
                  else if (typeof char.image === "string") {
                      formData.append(
                          `characteristics[${index}][existing_image]`,
                          char.image
                      );
                  }
              }*/
        });

        benefits.forEach((char, index) => {
            formData.append(`benefits[${index}][title]`, char.title);
            formData.append(
                `benefits[${index}][description]`,
                char.description
            );

            if (char.image) {
                if (char.image.file) {
                    formData.append(
                        `benefits[${index}][image]`,
                        char.image.file
                    );
                }
                // Si es una imagen existente (viene del servidor como string)
                else if (typeof char.image === "string") {
                    formData.append(
                        `benefits[${index}][existing_image]`,
                        char.image
                    );
                }
            }
        });

        steps.forEach((char, index) => {
            formData.append(`steps[${index}][title]`, char.title);
            formData.append(
                `steps[${index}][description]`,
                char.description
            );

            if (char.image) {
                if (char.image.file) {
                    formData.append(
                        `steps[${index}][image]`,
                        char.image.file
                    );
                }
                // Si es una imagen existente (viene del servidor como string)
                else if (typeof char.image === "string") {
                    formData.append(
                        `steps[${index}][existing_image]`,
                        char.image
                    );
                }
            }
        });

        // Separar IDs existentes y nuevos nombres
        // formData.append("category_name", selectedCategory);

        const result = await servicesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await servicesRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };


      const onDeleteClicked = async (id) => {
            const { isConfirmed } = await Swal.fire({
                title: "Eliminar Servicio",
                text: "¿Estás seguro de eliminar este Servicio?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
            if (!isConfirmed) return;
            const result = await servicesRest.delete(id);
            if (!result) return;
            $(gridRef.current).dxDataGrid("instance").refresh();
        };
    return (
        <>
            <Table
                gridRef={gridRef}
                title="Servicios"
                rest={servicesRest}
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
                   {/* container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar nuevo servicio",
                            onClick: () => onModalOpen(),
                        },
                    }); */}
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Nombre del servicio",
                        width: "200px",
                    },
                    {
                        dataField: "title",
                        caption: "Título",
                        width: "200px",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <div
                                        className="text-truncate"
                                        style={{ maxWidth: "300px" }}
                                    >
                                        {data.description}
                                    </div>
                                )
                            );
                        },
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/service/media/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "45px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                    (e.target.src =
                                        "/images/default-thumbnail.jpg")
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "80px",
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
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className:
                                        "btn btn-xs btn-soft-primary me-1",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                         {/*   container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            ); */}
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Servicio" : "Nuevo Servicio"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />

                {/* Pestañas de navegación */}
                <ul className="nav nav-tabs nav-justified" id="serviceModalTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button aria-label="información básica" className="nav-link active" id="basic-tab" data-bs-toggle="tab" data-bs-target="#basic-tab-pane" type="button" role="tab">
                            <i className="fas fa-info-circle me-1"></i>
                            Información Básica
                        </button>
                    </li>
                  {/*  <li className="nav-item" role="presentation">
                        <button aria-label="enfoque" className="nav-link" id="approach-tab" data-bs-toggle="tab" data-bs-target="#approach-tab-pane" type="button" role="tab">
                            <i className="fas fa-bullseye me-1"></i>
                            Enfoque
                        </button>
                    </li> */}
                    <li className="nav-item" role="presentation">
                        <button aria-label="beneficios" className="nav-link" id="benefits-tab" data-bs-toggle="tab" data-bs-target="#benefits-tab-pane" type="button" role="tab">
                            <i className="fas fa-star me-1"></i>
                            Beneficios
                        </button>
                    </li>
                 {/*   <li className="nav-item" role="presentation">
                        <button aria-label="metodología" className="nav-link" id="methodology-tab" data-bs-toggle="tab" data-bs-target="#methodology-tab-pane" type="button" role="tab">
                            <i className="fas fa-tasks me-1"></i>
                            Metodología
                        </button>
                    </li> */}

                </ul>

                {/* Contenido de las pestañas */}
                <div className="tab-content mt-3" id="serviceModalTabsContent">

                    {/* Pestaña 1: Información Básica */}
                    <div className="tab-pane fade show active" id="basic-tab-pane" role="tabpanel" aria-labelledby="basic-tab">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <h5 className="card-title text-primary mb-3">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Información General del Servicio
                                </h5>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <h6 className="fw-bold text-muted mb-3">Datos Principales</h6>
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Nombre del servicio"
                                                required
                                            />
                                            <InputFormGroup
                                                eRef={titleRef}
                                                label="Título del servicio"
                                                required
                                            />
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Descripción del servicio</label>
                                                <textarea
                                                    ref={descriptionRef}
                                                    className="form-control"
                                                    rows={4}
                                                    placeholder="Describe brevemente el servicio..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <h6 className="fw-bold text-muted mb-3">Imágenes del Servicio</h6>
                                            <div className="row">
                                                <div className="mb-3 ">
                                                    <ImageFormGroup
                                                        eRef={imageRef}
                                                        label="Imagen principal"
                                                        aspect={1}
                                                    />
                                                    <small className="text-muted">
                                                        <i className="fas fa-info-circle me-1"></i>
                                                        Imagen que representa el servicio
                                                    </small>
                                                </div>
                                             {/*   <div className="mb-3 col-lg-6">
                                                    <ImageFormGroup
                                                        eRef={imageSecondaryRef}
                                                        label="Icono del servicio"
                                                        aspect={1}
                                                    />
                                                    <small className="text-muted">
                                                        <i className="fas fa-info-circle me-1"></i>
                                                        Icono cuadrado para representar el servicio
                                                    </small>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pestaña 2: Enfoque */}
                    <div className="tab-pane fade" id="approach-tab-pane" role="tabpanel" aria-labelledby="approach-tab">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <h5 className="card-title text-primary mb-3">
                                    <i className="fas fa-bullseye me-2"></i>
                                    Enfoque del Servicio
                                </h5>
                                <div className="row mb-4">
                                    <div className="col-lg-8">
                                        <InputFormGroup
                                            eRef={title_approachRef}
                                            label="Título del enfoque"
                                            required
                                        />

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Descripción del enfoque</label>
                                            <textarea
                                                ref={description_approachRef}
                                                className="form-control"
                                                rows={6}
                                                placeholder="Explica el enfoque del servicio..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-lg-4">
                                        <ImageFormGroup
                                            eRef={imageEnfoqueRef}
                                            label="Imagen del enfoque al servicio"
                                            aspect={4 / 3}
                                        />

                                    </div>
                                </div>

                                <div className="border-top pt-4">
                                    <h6 className="fw-bold text-muted mb-3">
                                        <i className="fas fa-list-check me-2"></i>
                                        Características del Enfoque
                                    </h6>
                                    <div className="row">
                                        {characteristics.map((char, index) => (
                                            <div key={`char-${index}`} className="col-lg-6 mb-3">
                                                <FeatureCard
                                                    feature={char}
                                                    index={index}
                                                    onUpdate={updateCharacteristic}
                                                    onRemove={removeCharacteristic}
                                                    canRemove={characteristics.length > 1}
                                                    type="characteristic"
                                                    characteristics={characteristics}
                                                    addCharacteristic={addCharacteristic}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pestaña 3: Metodología */}
                    <div className="tab-pane fade" id="methodology-tab-pane" role="tabpanel" aria-labelledby="methodology-tab">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <h5 className="card-title text-primary mb-3">
                                    <i className="fas fa-tasks me-2"></i>
                                    Metodología del Servicio
                                </h5>
                                <div className="row mb-4">
                                    <div className="col-lg-12">
                                        <InputFormGroup
                                            eRef={title_methodologyRef}
                                            label="Título de metodología"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Descripción de metodología</label>
                                            <textarea
                                                ref={description_methodologyRef}
                                                className="form-control"
                                                rows={4}
                                                placeholder="Describe la metodología utilizada..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-top pt-4">
                                    <h6 className="fw-bold text-muted mb-3">
                                        <i className="fas fa-route me-2"></i>
                                        Pasos de la Metodología
                                    </h6>
                                    <div className="row">
                                        {steps.map((step, index) => (
                                            <div key={`step-${index}`} className="col-lg-6 mb-3">
                                                <div className="position-relative">
                                                    <span className="badge bg-primary position-absolute" style={{ top: '-5px', left: '-5px', zIndex: 10 }}>
                                                        {index + 1}
                                                    </span>
                                                    <FeatureCard
                                                        feature={step}
                                                        index={index}
                                                        onUpdate={updateStep}
                                                        onRemove={removeStep}
                                                        canRemove={steps.length > 1}
                                                        type="step"
                                                        addStep={addStep}
                                                        steps={steps}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pestaña 4: Beneficios */}
                    <div className="tab-pane fade" id="benefits-tab-pane" role="tabpanel" aria-labelledby="benefits-tab">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <h5 className="card-title text-primary mb-3">
                                    <i className="fas fa-star me-2"></i>
                                    Beneficios del Servicio
                                </h5>
                               {/* <div className="row mb-4">
                                    <div className="col-lg-12">
                                        <InputFormGroup
                                            eRef={title_benefitsRef}
                                            label="Título de beneficios"
                                            required
                                        />
                                    </div>
                                </div>
 */}
                                <div className="border-top pt-4">
                                    <h6 className="fw-bold text-muted mb-3">
                                        <i className="fas fa-thumbs-up me-2"></i>
                                        Lista de Beneficios
                                    </h6>
                                    <div className="row">
                                        {benefits.map((benefit, index) => (
                                            <div key={`benefit-${index}`} className="col-lg-6 mb-3">
                                                <FeatureCard
                                                    feature={benefit}
                                                    index={index}
                                                    onUpdate={updateBenefit}
                                                    onRemove={removeBenefit}
                                                    canRemove={benefits.length > 1}
                                                    type="benefit"
                                                    benefits={benefits}
                                                    addBenefit={addBenefit}
                                                />
                                            </div>
                                        ))}
                                    </div>
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
        <LanguageProvider>
            <BaseAdminto {...properties} title="Servicios">
                <Services {...properties} />
            </BaseAdminto>
        </LanguageProvider>
    );
});
