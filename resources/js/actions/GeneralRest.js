import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

class GeneralRest extends BasicRest {
    path = "generals";

    getSocials = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-socials`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getSocials:", error);
            return [];
        }
    };

    getApps = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-apps`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getApps:", error);
            return [];
        }
    };
    getLanguages = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-languages`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getSocials:", error);
            return [];
        }
    };
    getBenefits = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-benefits`,
                {
                    method: "GET",
                }
            );
            console.log("Respuesta completa:", status, result);
            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );
            console.log(result);

            return result?.data ?? [];
        } catch (error) {
            console.log("Error en getSocials:", error);
            return [];
        }
    };

    getAboutuses = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-aboutuses`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getAboutuses:", error);
            return [];
        }
    };

    getGenerals = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-generals`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getGenerals:", error);
            return [];
        }
    };

    getContactInfo = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-contact-info`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getContactInfo:", error);
            return [];
        }
    };

    getServices = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-services`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getGenerals:", error);
            return [];
        }
    };

     getModal = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-modal`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getGenerals:", error);
            return [];
        }
    };

    getTransactionalLandings = async () => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/get-transactional-landings`,
                {
                    method: "GET",
                }
            );

            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getTransactionalLandings:", error);
            return [];
        }
    };
}

export default GeneralRest;
