import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CambiaFXService from "../../../services/CambiaFXService";

const ComparisonTable = ({ data = [] }) => {
    const [ownRates, setOwnRates] = useState({
        compra: "3.715",
        venta: "3.725",
    });

    useEffect(() => {
        // Obtener tasas reales de Cambia FX
        const fetchOwnRates = async () => {
            try {
                const rates = await CambiaFXService.getExchangeRates();
                if (rates && rates.length > 0) {
                    setOwnRates({
                        compra: rates[0].tc_compra.toFixed(4),
                        venta: rates[0].tc_venta.toFixed(4),
                    });
                }
            } catch (error) {
                console.error(
                    "Error fetching own rates for comparison:",
                    error,
                );
            }
        };
        fetchOwnRates();
    }, []);

    // 1. Identificar y limpiar Cambia FX de la lista de competidores para evitar duplicidad
    const competitors = data.filter(
        (row) => !row.entity.toLowerCase().includes("cambia"),
    );

    // 2. Definir la fila maestra de Cambia FX (siempre primera)
    const cambiaFXRow = {
        entity: "Cambia FX",
        buy: ownRates.compra,
        sell: ownRates.venta,
        is_highlight: true,
        category: "Nosotros",
    };

    const finalRows = [cambiaFXRow, ...competitors];

    if (finalRows.length === 0) return null;

    // Mapeo de logos para entidades conocidas
    const logoMapping = {
        "Cambia FX": "/assets/img/logo.png",
        CambiaFX: "/assets/img/logo.png",
        BCP: "/assets/img/bcp_logo.png",
        Interbank: "/assets/img/interbank_logo.png",
        Scotiabank: "/assets/img/scotiabank_logo.png",
        BBVA: "/assets/img/bbva_logo.png",
        SUNAT: "/assets/img/sunat_logo.avif",
        Otros: "/assets/img/otros_logo.png",
        Pichincha: "/assets/img/pichincha_logo.png",
        Banbif: "/assets/img/banbif_logo.png",
        Paralelo: "/assets/img/ocona_logo.png",
    };

    // Colores por categoría para los badges
    const categoryStyles = {
        Nosotros: "bg-majorelle text-white ring-majorelle/20",
        Oficial: "bg-neutral-dark/10 text-neutral-dark/60 ring-neutral-dark/5",
        Paralelo: "bg-amber-100 text-amber-700 ring-amber-500/20",
        Digital: "bg-blue-50 text-blue-600 ring-blue-500/20",
        Banco: "bg-red-50 text-red-600 ring-red-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
        >
            <div className="grid grid-cols-12 items-center mb-6 px-5">
                <div className="col-span-6">
                    <h3 className="text-base font-semibold   text-white">
                        Comparativa de Mercado
                    </h3>
                </div>
                <div className="col-span-3 text-center">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Compra
                    </span>
                </div>
                <div className="col-span-3 text-center">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Venta
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {finalRows.map((row, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.05 }}
                        className={`grid grid-cols-12 items-center px-5 py-4 rounded-[28px] transition-all duration-500 group ${
                            row.is_highlight
                                ? "bg-white border-2 border-mindaro shadow-[0_20px_50px_rgba(187,255,82,0.2)] scale-[1.03] z-10 relative"
                                : "bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                    >
                        {/* Entidad con Logo */}
                        <div className="col-span-6 flex items-center gap-4">
                            <div
                                className={`${row.entity.includes("Cambia") ? "w-28 h-8" : "w-10 h-10 rounded-2xl "} flex items-center justify-center overflow-hidden ${row.is_highlight ? "bg-neutral-dark/5 border-neutral-dark/10" : "bg-white/10 border-white/10"}`}
                            >
                                {logoMapping[row.entity] ? (
                                    <img
                                        src={logoMapping[row.entity]}
                                        alt={row.entity}
                                        className={`w-full h-full object-contain ${row.entity.includes("Cambia") ? "scale-100" : ""}`}
                                    />
                                ) : (
                                    <span
                                        className={`text-[10px] font-black ${row.is_highlight ? "text-neutral-dark/40" : "text-white/40"}`}
                                    >
                                        {row.entity
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Compra */}
                        <div
                            className={`col-span-3 text-center text-sm font-bold ${row.is_highlight ? "text-neutral-dark" : "text-white/60"}`}
                        >
                            {row.buy}
                        </div>

                        {/* Venta */}
                        <div
                            className={`col-span-3 text-center text-sm font-bold ${row.is_highlight ? "text-majorelle scale-110" : "text-white/60"}`}
                        >
                            {row.sell}
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-xs text-white text-center mt-8  font-medium">
                * Actualizado en tiempo real • {new Date().toLocaleDateString()}
            </p>
        </motion.div>
    );
};

export default ComparisonTable;
