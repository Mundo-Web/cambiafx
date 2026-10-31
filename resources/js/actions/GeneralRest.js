import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

// Cache en memoria para deduplicar llamadas concurrentes en la misma página (Header + Footer)
const getCache = new Map();

const cachedFetch = async (url) => {
    if (getCache.has(url)) {
        return getCache.get(url);
    }
    const promise = Fetch(url, { method: "GET" }).catch((error) => {
        getCache.delete(url);
        throw error;
    });
    getCache.set(url, promise);
    return promise;
};

class GeneralRest extends BasicRest {
    path = "generals";

    getSocials = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-socials`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getSocials:", error);
            return [];
        }
    };

    getApps = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-apps`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getApps:", error);
            return [];
        }
    };

    getLanguages = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-languages`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getLanguages:", error);
            return [];
        }
    };

    getBenefits = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-benefits`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getBenefits:", error);
            return [];
        }
    };

    getAboutuses = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-aboutuses`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getAboutuses:", error);
            return [];
        }
    };

    getGenerals = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-generals`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getGenerals:", error);
            return [];
        }
    };

    getContactInfo = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-contact-info`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getContactInfo:", error);
            return [];
        }
    };

    getServices = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-services`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getServices:", error);
            return [];
        }
    };

    getModal = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-modal`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getModal:", error);
            return [];
        }
    };

    getTransactionalLandings = async () => {
        try {
            const { status, result } = await cachedFetch(`/api/${this.path}/get-transactional-landings`);
            if (!status) throw new Error(result?.message ?? "Ocurrió un error al consultar");
            return result?.data ?? [];
        } catch (error) {
            console.error("Error en getTransactionalLandings:", error);
            return [];
        }
    };
}

export default GeneralRest;
