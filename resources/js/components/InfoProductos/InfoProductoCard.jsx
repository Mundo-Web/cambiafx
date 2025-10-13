import React from "react";

const InfoProductoCard = ({ name, summary, image, collaborator, info_date }) => {
    // Formatear fecha
    const fecha = info_date ? new Date(info_date).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" }) : "";
    return (
        <div className=" rounded-lg overflow-hidden flex flex-col h-full text-paragraph">
            <img
                src={image ? `/api/infoproducts/media/${image}` : "/assets/img/placeholder.png"}
                alt={name}
                className="w-full aspect-[4/3] object-cover object-center rounded-lg"
            />
            <div className="flex-1 flex flex-col p-6">
                <h2 className="text-2xl font-medium text-neutral mb-2 leading-tight">
                    {name}
                </h2>
                <p className="text-neutral text-base mb-4 flex-1">
                    {summary}
                </p>
                <div className="flex justify-between items-end text-sm mt-4">
                    <div>
                        <span className="block text-accent font-semibold">Colaborador</span>
                        <span className="block text-neutral">{collaborator}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-accent font-semibold">Fecha</span>
                        <span className="block text-neutral">{fecha}</span>
                    </div>
                </div>
                <button aria-label="más información" className="mt-6 w-full bg-constrast text-white font-semibold py-3 rounded-xl transition-colors">
                    Más información
                </button>
            </div>
        </div>
    );
};

export default InfoProductoCard;
