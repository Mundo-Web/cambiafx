import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ImportSubscriptionsModal = ({ modalRef, rest, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [emailCol, setEmailCol] = useState('');
  const [nameCol, setNameCol] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const resetModal = () => {
    setStep(1);
    setFileName('');
    setHeaders([]);
    setRawRows([]);
    setEmailCol('');
    setNameCol('');
    setPreviewData([]);
    setIsSubmitting(false);
    setErrorMsg('');
  };

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const handleHidden = () => resetModal();
    el.addEventListener('hidden.bs.modal', handleHidden);
    return () => {
      el.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [modalRef]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Obtenemos los datos en forma de arreglos de celdas
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (!sheetData || sheetData.length < 2) {
          setErrorMsg('El archivo no contiene suficientes datos o está vacío.');
          return;
        }

        const fileHeaders = sheetData[0].map(h => String(h).trim()).filter(Boolean);
        const rows = sheetData.slice(1).filter(row => row.some(cell => String(cell).trim() !== ''));

        if (fileHeaders.length === 0) {
          setErrorMsg('No se detectaron encabezados válidos en la primera fila.');
          return;
        }

        setHeaders(fileHeaders);
        setRawRows(rows);

        // Auto-detectar columnas de correo y nombre
        let guessedEmail = '';
        let guessedName = '';

        fileHeaders.forEach((h, idx) => {
          const cleanH = h.toLowerCase();
          if (!guessedEmail && (cleanH.includes('email') || cleanH.includes('correo') || cleanH.includes('mail') || cleanH.includes('description'))) {
            guessedEmail = String(idx);
          }
          if (!guessedName && (cleanH.includes('nombre') || cleanH.includes('name') || cleanH.includes('cliente') || cleanH.includes('proveedor'))) {
            guessedName = String(idx);
          }
        });

        setEmailCol(guessedEmail);
        setNameCol(guessedName);
        setStep(2);
      } catch (err) {
        console.error(err);
        setErrorMsg('Error al leer el archivo Excel/CSV. Verifique el formato.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGeneratePreview = () => {
    if (emailCol === '') {
      setErrorMsg('Debe seleccionar la columna correspondiente al Correo / Email.');
      return;
    }
    setErrorMsg('');

    const emailIdx = Number(emailCol);
    const nameIdx = nameCol !== '' ? Number(nameCol) : -1;

    const parsed = rawRows.map(row => {
      const email = String(row[emailIdx] || '').trim();
      const name = nameIdx >= 0 ? String(row[nameIdx] || '').trim() : '';
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      return {
        description: email,
        name: name,
        isValid: isValidEmail
      };
    });

    setPreviewData(parsed);
    setStep(3);
  };

  const handleSubmitImport = async () => {
    const validItems = previewData
      .filter(item => item.isValid)
      .map(item => ({
        description: item.description,
        name: item.name
      }));

    if (validItems.length === 0) {
      setErrorMsg('No hay correos válidos para importar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await rest.import(validItems);
    setIsSubmitting(false);

    if (res) {
      $(modalRef.current).modal('hide');
      onSuccess?.();
    }
  };

  const validCount = previewData.filter(d => d.isValid).length;
  const invalidCount = previewData.length - validCount;

  return (
    <div className='modal fade' ref={modalRef} tabIndex='-1' aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content' style={{ boxShadow: '0 0 15px rgba(0,0,0,0.3)' }}>
          <div className='modal-header bg-light'>
            <h5 className='modal-title'>
              <i className='fas fa-file-import me-2 text-primary'></i>
              Importación Masiva de Suscriptores
            </h5>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>

          <div className='modal-body p-4'>
            {errorMsg && (
              <div className='alert alert-danger alert-dismissible fade show' role='alert'>
                <i className='fas fa-exclamation-triangle me-2'></i>
                {errorMsg}
              </div>
            )}

            {/* Stepper Header */}
            <div className='d-flex justify-content-between mb-4 position-relative px-4'>
              <div className={`text-center position-relative ${step >= 1 ? 'text-primary fw-bold' : 'text-muted'}`}>
                <span className={`badge rounded-circle me-1 ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`}>1</span>
                Cargar Archivo
              </div>
              <div className={`text-center position-relative ${step >= 2 ? 'text-primary fw-bold' : 'text-muted'}`}>
                <span className={`badge rounded-circle me-1 ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`}>2</span>
                Mapeo de Columnas
              </div>
              <div className={`text-center position-relative ${step >= 3 ? 'text-primary fw-bold' : 'text-muted'}`}>
                <span className={`badge rounded-circle me-1 ${step >= 3 ? 'bg-primary' : 'bg-secondary'}`}>3</span>
                Previsualizar & Importar
              </div>
            </div>

            {/* Paso 1: Subir Archivo */}
            {step === 1 && (
              <div className='text-center py-4 border border-2 border-dashed rounded bg-light'>
                <i className='fas fa-file-excel fa-4x text-success mb-3'></i>
                <h5>Selecciona o arrastra tu archivo Excel / CSV</h5>
                <p className='text-muted small mb-3'>Formatos soportados: .xlsx, .xls, .csv</p>
                
                <label className='btn btn-primary btn-sm px-4'>
                  <i className='fas fa-folder-open me-2'></i>
                  Buscar Archivo
                  <input
                    type='file'
                    className='d-none'
                    accept='.xlsx, .xls, .csv'
                    onChange={handleFileUpload}
                  />
                </label>

                {fileName && <p className='mt-3 text-success fw-bold'><i className='fas fa-check-circle me-1'></i> {fileName}</p>}
              </div>
            )}

            {/* Paso 2: Mapeo de Columnas */}
            {step === 2 && (
              <div>
                <div className='alert alert-info py-2 small mb-3'>
                  <i className='fas fa-info-circle me-1'></i>
                  Se encontraron <strong>{headers.length} columnas</strong> y <strong>{rawRows.length} filas</strong> de datos. Relaciona los campos requeridos:
                </div>

                <div className='row g-3'>
                  <div className='col-md-6'>
                    <label className='form-label fw-bold'>
                      Correo / Email <span className='text-danger'>*</span>
                    </label>
                    <select
                      className='form-select'
                      value={emailCol}
                      onChange={(e) => setEmailCol(e.target.value)}
                    >
                      <option value=''>-- Seleccionar Columna del Archivo --</option>
                      {headers.map((h, idx) => (
                        <option key={idx} value={idx}>
                          Columna {idx + 1}: {h}
                        </option>
                      ))}
                    </select>
                    <small className='text-muted'>Identificador principal del suscriptor (obligatorio).</small>
                  </div>

                  <div className='col-md-6'>
                    <label className='form-label fw-bold'>Nombre / Proveedor</label>
                    <select
                      className='form-select'
                      value={nameCol}
                      onChange={(e) => setNameCol(e.target.value)}
                    >
                      <option value=''>-- Ninguno (inferir por correo) --</option>
                      {headers.map((h, idx) => (
                        <option key={idx} value={idx}>
                          Columna {idx + 1}: {h}
                        </option>
                      ))}
                    </select>
                    <small className='text-muted'>Opcional. Si se omite, se deduce del dominio del correo.</small>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Previsualización & Confirmación */}
            {step === 3 && (
              <div>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <span className='badge bg-success fs-6 me-2'>
                    <i className='fas fa-check-circle me-1'></i> {validCount} Correos Válidos
                  </span>
                  {invalidCount > 0 && (
                    <span className='badge bg-warning text-dark fs-6'>
                      <i className='fas fa-exclamation-circle me-1'></i> {invalidCount} Inválidos (Omitidos)
                    </span>
                  )}
                </div>

                <div className='table-responsive border rounded style-scroll mb-3' style={{ maxHeight: '250px' }}>
                  <table className='table table-sm table-striped table-hover mb-0'>
                    <thead className='table-dark sticky-top'>
                      <tr>
                        <th>#</th>
                        <th>Correo / Email</th>
                        <th>Nombre / Proveedor</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 50).map((row, idx) => (
                        <tr key={idx} className={!row.isValid ? 'table-danger' : ''}>
                          <td>{idx + 1}</td>
                          <td className='fw-bold'>{row.description || <em className='text-muted'>(Vacío)</em>}</td>
                          <td>{row.name || <em className='text-muted'>Autogenerado</em>}</td>
                          <td>
                            {row.isValid ? (
                              <span className='badge bg-success rounded-pill'>Válido</span>
                            ) : (
                              <span className='badge bg-danger rounded-pill'>Inválido</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {previewData.length > 50 && (
                  <p className='text-muted small text-center mb-0'>
                    Mostrando las primeras 50 filas de un total de {previewData.length} registros.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className='modal-footer bg-light'>
            {step === 1 && (
              <button className='btn btn-sm btn-secondary' type='button' data-bs-dismiss='modal'>
                Cancelar
              </button>
            )}

            {step === 2 && (
              <>
                <button className='btn btn-sm btn-outline-secondary' type='button' onClick={() => setStep(1)}>
                  <i className='fas fa-arrow-left me-1'></i> Atrás
                </button>
                <button className='btn btn-sm btn-primary' type='button' onClick={handleGeneratePreview}>
                  Siguiente <i className='fas fa-arrow-right ms-1'></i>
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <button
                  className='btn btn-sm btn-outline-secondary'
                  type='button'
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  <i className='fas fa-arrow-left me-1'></i> Volver al Mapeo
                </button>
                <button
                  className='btn btn-sm btn-success'
                  type='button'
                  onClick={handleSubmitImport}
                  disabled={isSubmitting || validCount === 0}
                >
                  {isSubmitting ? (
                    <>
                      <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                      Importando...
                    </>
                  ) : (
                    <>
                      <i className='fas fa-cloud-upload-alt me-1'></i> Confirmar e Importar ({validCount})
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportSubscriptionsModal;
