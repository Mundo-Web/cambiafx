import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Table';
import Modal from '../Components/Modal';
import InputFormGroup from '../Components/form/InputFormGroup';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import SelectFormGroup from '../Components/form/SelectFormGroup';
import Swal from 'sweetalert2';
import PostsRest from '../Actions/Admin/PostsRest';
import QuillFormGroup from '../Components/Adminto/form/QuillFormGroup';
import SelectAPIFormGroup from '../Components/Adminto/form/SelectAPIFormGroup';
import html2string from '../Utils/html2string';
import SetSelectValue from '../Utils/SetSelectValue';

const postsRest = new PostsRest()

const Posts = ({ }) => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const categoryRef = useRef()
  const descriptionRef = useRef()
  const tagsRef = useRef()
  const imageRef = useRef()
  const postDateRef = useRef()
  const seoTitleRef = useRef()
  const seoDescriptionRef = useRef()
  const seoKeywordsRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    SetSelectValue(categoryRef.current, data?.category?.id, data?.category?.name);
    descriptionRef.editor.root.innerHTML = data?.description ?? ''
    imageRef.image.src = `/api/posts/media/${data?.image}`
    imageRef.current.value = null
    SetSelectValue(tagsRef.current, data?.tags ?? [], 'id', 'name')
    postDateRef.current.value = data?.post_date ? moment(data.post_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    
    seoTitleRef.current.value = data?.seo_title ?? ''
    seoDescriptionRef.current.value = data?.seo_description ?? ''
    seoKeywordsRef.current.value = data?.seo_keywords ?? ''

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      category_id: categoryRef.current.value,
      summary: html2string(descriptionRef.current.value),
      description: descriptionRef.current.value,
      tags: $(tagsRef.current).val(),
      post_date: postDateRef.current.value,
      seo_title: seoTitleRef.current.value || nameRef.current.value,
      seo_description: seoDescriptionRef.current.value || html2string(descriptionRef.current.value).substring(0, 155),
      seo_keywords: seoKeywordsRef.current.value,
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }
    const file = imageRef.current.files[0]
    if (file) {
      formData.append('image', file)
    }

    const result = await postsRest.save(formData)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await postsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }
 const onBooleanChange = async ({ id, field, value }) => {
        const result = await postsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar registro',
      text: '¿Estas seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await postsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const [activeTab, setActiveTab] = useState('general');

  return (<>
    <Table gridRef={gridRef} title='Posts' rest={postsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'plus',
            text: 'Nuevo registro',
            hint: 'Nuevo registro',
            onClick: () => onModalOpen()
          }
        });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
            dataField: 'post_date',
            caption: 'Fecha',
            dataType: 'date',
            sortOrder: 'desc',
            width: '120px',
            cellTemplate: (container, { data }) => {
                ReactAppend(container, <span>{moment.utc(data.post_date).format('DD/MM/YYYY')}</span>)
            }
        },
        {
          dataField: 'category.name',
          caption: 'Categoría',
          width: '150px'
        },
        {
          dataField: 'name',
          caption: 'Título',
          cellTemplate: (container, {data}) => {
            ReactAppend(container, <>
              <span className='fw-bold'>{data.name}</span><br/>
              {data.tags?.map((tag, index) => <span key={index} className='badge badge-soft-primary me-1'>{tag.name}</span>)}
            </>)
          }
        },
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '90px',
          alignment: 'center',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={`/api/posts/media/${data.image}`} style={{ width: '80px', height: '48px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
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
          caption: 'Acciones',
          width: '100px',
          alignment: 'center',
          cellTemplate: (container, { data }) => {
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar post' : 'Agregar post'} onSubmit={onModalSubmit} size='xl' >
      <div className="row" id='posts-container'>
        <input ref={idRef} type='hidden' />
        
        <div className="col-12 mb-3">
            <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('general'); }}
                        type="button"
                    >
                        <i className="fa fa-home me-2"></i>General
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('content'); }}
                        type="button"
                    >
                        <i className="fa fa-file-text me-2"></i>Contenido
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'seo' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('seo'); }}
                        type="button"
                    >
                        <i className="fa fa-search me-2"></i>SEO
                    </button>
                </li>
            </ul>
        </div>
        
        <div className="col-12">
            <div className="tab-content">
                {/* General Tab */}
                <div className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <InputFormGroup eRef={nameRef} label='Título' col="col-12" required />
                                <div className="col-md-6">
                                    <SelectAPIFormGroup eRef={categoryRef} searchAPI='/api/admin/categories/paginate' searchBy='name' label='Categoría' required dropdownParent='#posts-container' />
                                </div>
                                <div className="col-md-6">
                                    <InputFormGroup eRef={postDateRef} label='Fecha de publicación' type='date' required />
                                </div>
                                <div className="col-12 hidden" hidden>
                                     <SelectAPIFormGroup id='tags' eRef={tagsRef} searchAPI={'/api/admin/tags/paginate'} searchBy='name' label='Tags' dropdownParent='#posts-container' tags multiple/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <ImageFormGroup eRef={imageRef} label='Imagen Principal' aspect='16/9' />
                        </div>
                    </div>
                </div>

                {/* Content Tab */}
                <div className={`tab-pane fade ${activeTab === 'content' ? 'show active' : ''}`}>
                    <div className="row">
                        <QuillFormGroup eRef={descriptionRef} label='Contenido del Artículo' col="col-12" height='1000px' style={{height: '1000px'}} />
                    </div>
                </div>

                {/* SEO Tab */}
                <div className={`tab-pane fade ${activeTab === 'seo' ? 'show active' : ''}`}>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="alert alert-info">
                                <i className="fa fa-info-circle me-2"></i>
                                Configura los metadatos para optimizar la aparición de este artículo en los motores de búsqueda.
                            </div>
                        </div>
                        <InputFormGroup eRef={seoTitleRef} label="Título SEO (Meta Title)" col="col-12" placeholder="Si se deja vacío, se usará el título del post" />
                        <TextareaFormGroup eRef={seoDescriptionRef} label="Descripción SEO (Meta Description)" col="col-12" rows={3} placeholder="Breve resumen para los resultados de búsqueda..." />
                        <TextareaFormGroup eRef={seoKeywordsRef} label="Palabras Clave (Meta Keywords)" col="col-12" rows={2} placeholder="palabra1, palabra2, palabra clave 3..." />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Posts'>
    <Posts {...properties} />
  </BaseAdminto>);
})