import React, { useState, useRef } from 'react'
import Swal from 'sweetalert2'
import MessagesRest from '../../../Actions/MessagesRest'
import TextWithHighlight from '../../../Utils/TextWithHighlight';

export default function ContactoSecctionEmpresa({landing}) {
    const messagesRest = new MessagesRest();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        ruc: ''
    });

    const [sending, setSending] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearForm = () => {
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            ruc: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sending) return;

        setSending(true);

        try {
            const requestData = {
                name: formData.nombre,
                fullname: formData.nombre,
                email: formData.email,
                phone: formData.telefono,
                ruc: formData.ruc,
                contact_type: 'empresa',
                subject: 'Contacto Empresarial',
                description: `Solicitud de información empresarial.
                
Datos de contacto:
- Empresa/Contacto: ${formData.nombre}
- Email: ${formData.email}
- Teléfono: ${formData.telefono}
- RUC: ${formData.ruc}

La empresa está interesada en conocer más sobre los servicios de cambio de moneda para empresas.`
            };

            const result = await messagesRest.save(requestData);

            if (result) {
                await Swal.fire({
                    title: '¡Mensaje enviado exitosamente!',
                    text: 'Nos comunicaremos contigo pronto para brindarte información detallada sobre nuestros servicios empresariales.',
                    icon: 'success',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#BBFF52',
                    background: '#fff',
                    color: '#2D3748',
                    backdrop: 'rgba(0,0,0,0.8)',
                    customClass: {
                        popup: 'rounded-2xl',
                        confirmButton: 'rounded-full px-6 py-3 font-medium'
                    }
                });
                clearForm();
            }
        } catch (error) {
            await Swal.fire({
                title: 'Error al enviar',
                text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo nuevamente.',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#DC2626',
                background: '#fff',
                color: '#2D3748',
                backdrop: 'rgba(0,0,0,0.8)',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-full px-6 py-3 font-medium'
                }
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="w-full bg-primary py-20 px-[5%] font-paragraph">
            <div className=" mx-auto">
                <div className="bg-neutral-dark rounded-3xl overflow-hidden relative">
                    {/* Imagen de fondo a la derecha */}
                    <div className="absolute inset-0 flex">
                        <div className="w-full lg:w-1/2"></div>
                        <div className="hidden lg:block w-1/2 relative">
                            <img
                                src={`/api/landing_home/media/${landing?.image}` || '/assets/cambiafx/blog-1.png'}
                                alt="Background"
                                className="w-full h-full object-cover "
                            />

                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="relative z-10 flex flex-col lg:flex-row">
                        {/* Columna izquierda - Formulario */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <div className="max-w-lg">
                                <div className="uppercase text-white text-sm font-medium tracking-[8%] mb-4">
                                    CONTACTO
                                </div>

                                <h2 className="text-3xl lg:text-[40px] font-medium text-white mb-4 leading-tight">

                                    <TextWithHighlight text={landing?.title || '*Déjanos tus datos*'} color="bg-white font-semibold" />
                                   
                                </h2>

                                <p className="text-white text-base mb-8 leading-relaxed whitespace-pre-line">
                                    {landing?.description || 'Si deseas más información sobre nuestros servicios de cambio de moneda para empresas, por favor completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.'}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nombre completo */}
                                    <div>
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre completo"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#C6FF6B] text-gray-800 placeholder-gray-500 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Email y Teléfono en la misma fila */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo electrónico"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#C6FF6B] text-gray-800 placeholder-gray-500 transition-all duration-300"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            name="telefono"
                                            placeholder="Teléfono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#C6FF6B] text-gray-800 placeholder-gray-500 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* RUC */}
                                    <div>
                                        <input
                                            type="text"
                                            name="ruc"
                                            placeholder="RUC"
                                            value={formData.ruc}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#C6FF6B] text-gray-800 placeholder-gray-500 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Botón de envío */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className={`${sending
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-secondary hover:shadow-lg hover:transform hover:scale-105'
                                                } text-neutral-dark font-medium text-sm px-8 py-4 rounded-full transition-all duration-300 uppercase tracking-[8%] flex items-center gap-2`}
                                        >
                                            {sending && (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {sending ? 'ENVIANDO...' : 'ENVIAR DATOS'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </section>
    )
}