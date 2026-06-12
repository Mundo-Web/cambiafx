import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Table';
import DxButton from '../Components/dx/DxButton';
import Swal from 'sweetalert2';
import CampaignSubscriptionsRest from '../actions/Admin/CampaignSubscriptionsRest';

const rest = new CampaignSubscriptionsRest();

const CampaignSubscriptions = () => {
  const gridRef = useRef();

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar registro',
      text: '¿Estás seguro de eliminar este suscriptor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;
    const result = await rest.delete(id);
    if (result) {
      $(gridRef.current).dxDataGrid('instance').refresh();
    }
  };

  return (
    <Table gridRef={gridRef} title='Suscriptores de Campañas' rest={rest}
      exportable={true}
      exportableName='Suscriptores-Sorteos'
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
      }}
      columns={[
        { dataField: 'id', caption: 'ID', visible: false },
        { dataField: 'name', caption: 'Nombre Completo' },
        { dataField: 'email', caption: 'Correo Electrónico' },
        { dataField: 'phone', caption: 'Celular' },
        { dataField: 'campaign_name', caption: 'Campaña / Sorteo' },
        { dataField: 'utm_campaign', caption: 'UTM Campaign' },
        { dataField: 'utm_source', caption: 'UTM Source' },
        { dataField: 'utm_medium', caption: 'UTM Medium' },
        { dataField: 'created_at', caption: 'Fecha de Registro', dataType: 'datetime' },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }));
          }
        }
      ]} />
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title='Suscriptores de Campañas'>
      <CampaignSubscriptions {...properties} />
    </BaseAdminto>
  );
});
