import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Table';
import DxButton from '../Components/dx/DxButton';
import SubscriptionsRest from '@Rest/Admin/SubscriptionsRest';
import ReactAppend from '../Utils/ReactAppend';
import Swal from 'sweetalert2';
import ImportSubscriptionsModal from './components/ImportSubscriptionsModal';

const subscriptionsRest = new SubscriptionsRest()

const Subscriptions = () => {
  const gridRef = useRef()
  const modalImportRef = useRef()

  const onStatusChange = async ({ id, status }) => {
    const result = await subscriptionsRest.status({ id, status })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar subscripcion',
      text: '¿Estas seguro de eliminar esta subscripcion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await subscriptionsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onCleanClicked = async () => {
    Swal.fire({
      title: 'Analizando suscriptores...',
      text: 'Por favor espera un momento mientras se verifica la base de datos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const stats = await subscriptionsRest.analyzeInvalid();
    if (!stats) {
      Swal.close();
      return;
    }

    if (stats.total_problematic === 0) {
      Swal.fire({
        title: '¡Base de datos limpia!',
        text: 'No se encontraron correos fallidos ni con formato inválido en tus suscriptores.',
        icon: 'success',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const samplesHtml = (stats.invalid_samples && stats.invalid_samples.length > 0)
      ? `
        <div class="mt-2 text-start">
          <small class="fw-bold text-dark">Correos problemáticos detectados:</small>
          <div class="p-2 mt-1 bg-light border rounded" style="max-height: 110px; overflow-y: auto;">
            <ul class="mb-0 ps-3 small text-danger font-monospace">
              ${stats.invalid_samples.map(e => `<li><strong>${e}</strong></li>`).join('')}
            </ul>
          </div>
        </div>
      `
      : '';
    /* <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span><i class="fa fa-times-circle text-danger me-2"></i>Correos con fallo en último envío:</span>
                  <span class="badge bg-danger rounded-pill">${stats.failed_send_count}</span>
                </li> */
    Swal.fire({
      title: 'Depurador de Suscriptores',
      html: `
        <div class="text-start px-2 py-1">
          <p class="mb-2">Se ha detectado lo siguiente en la base de datos:</p>
          <ul class="list-group list-group-flush mb-2 small">
           
            <li class="list-group-item d-flex justify-content-between align-items-center px-0">
              <span><i class="fa fa-exclamation-triangle text-warning me-2"></i>Correos con dominios falsos/sin servidor:</span>
              <span class="badge bg-warning rounded-pill">${stats.invalid_format_count}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 text-muted">
              <span>Total suscriptores activos:</span>
              <strong>${stats.total_active}</strong>
            </li>
          </ul>
          ${samplesHtml}
          <p class="small text-muted mt-3 mb-0">¿Qué deseas hacer con los <strong>${stats.total_problematic}</strong> correos detectados?</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '<i class="fa fa-ban me-1"></i> Desactivar fallidos',
      confirmButtonColor: '#f7b84b',
      denyButtonText: '<i class="fa fa-trash me-1"></i> Eliminar fallidos',
      denyButtonColor: '#f1556c',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await subscriptionsRest.cleanFailed('deactivate');
        $(gridRef.current).dxDataGrid('instance').refresh();
      } else if (result.isDenied) {
        await subscriptionsRest.cleanFailed('delete');
        $(gridRef.current).dxDataGrid('instance').refresh();
      }
    });
  };

  return (<>
    <Table gridRef={gridRef} title='Subscripciones' rest={subscriptionsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'trash',
            text: 'Depurar Fallidos',
            type: 'danger',
            hint: 'Analizar y depurar correos fallidos o inválidos',
            onClick: onCleanClicked
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'upload',
            text: 'Importar',
            type: 'default',
            hint: 'Importar suscriptores desde Excel/CSV',
            onClick: () => $(modalImportRef.current).modal('show')
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
      }}
      exportable={true}
      pageSize={25}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'name',
          caption: 'Proveedor',
        },
        {
          dataField: 'description',
          caption: 'Correo',
        },
        {
          dataField: 'created_at',
          caption: 'Fecha subscripcion',
          dataType: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          sortOrder: 'desc'
        },
        {
          dataField: 'is_email_valid',
          caption: 'Envío Email',
          width: '140px',
          alignment: 'center',
          dataType: 'boolean',
          trueText: 'Válido',
          falseText: 'Inválido',
          allowSorting: false,
          calculateFilterExpression: (filterValue) => {
            if (filterValue === true) {
              return ['last_error', '=', null];
            } else if (filterValue === false) {
              return ['last_error', '<>', null];
            }
            return null;
          },
          cellTemplate: (container, { data }) => {
            const isInvalid = data.is_email_valid === false || Boolean(data.last_error);
            if (isInvalid) {
              ReactAppend(container, (
                <span
                  className='badge bg-danger rounded-pill'
                  title={data.email_error_message || data.last_error || 'Dominio o sintaxis no válida'}
                  style={{ cursor: 'pointer' }}
                >
                  <i className='fa fa-times-circle me-1'></i>Inválido
                </span>
              ));
            } else {
              ReactAppend(container, (
                <span
                  className='badge bg-soft-success text-success rounded-pill'
                  title='Servidor de correo activo'
                >
                  <i className='fa fa-check me-1'></i>Válido
                </span>
              ));
            }
          }
        },
        {
          dataField: 'status',
          caption: 'Estado',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            // Primero verificar si es null o undefined (eliminado)
            if (data.status === null || data.status === undefined) {
              ReactAppend(container, <span className='badge bg-dark rounded-pill'>Eliminado</span>)
              return
            }

            // Convertir a número para comparación robusta (maneja "1", 1, "0", 0, true, false)
            const statusNum = Number(data.status)

            if (statusNum === 1) {
              ReactAppend(container, <span className='badge bg-success rounded-pill'>Activo</span>)
            } else {
              ReactAppend(container, <span className='badge bg-danger rounded-pill'>Inactivo</span>)
            }
          }
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.append(DxButton({
              className: 'btn btn-xs btn-light',
              title: data.status === null ? 'Restaurar' : 'Cambiar estado',
              icon: data.status === 1 ? 'fa fa-toggle-on text-success' : data.status === 0 ? 'fa fa-toggle-off text-danger' : 'fas fa-trash-restore',
              onClick: () => onStatusChange(data)
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
    <ImportSubscriptionsModal
      modalRef={modalImportRef}
      rest={subscriptionsRest}
      onSuccess={() => $(gridRef.current).dxDataGrid('instance').refresh()}
    />
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Subscripciones'>
    <Subscriptions {...properties} />
  </BaseAdminto>);
})