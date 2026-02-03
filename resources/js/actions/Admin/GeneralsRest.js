import BasicRest from "../BasicRest";
import { Cookies, Fetch, Notify } from "sode-extend-react";

class GeneralsRest extends BasicRest {
    path = 'admin/generals';

    generateSitemap = async () => {
        try {
            const { status, result } = await Fetch(`/admin/generals/sitemap`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
                },
            });

            if (!status)
                throw new Error(result?.message || "Ocurrió un error inesperado");

            if (this.enableNotifications) {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Correcto",
                    body: "Sitemap generado exitosamente",
                    type: "success",
                });
            }
            return true;
        } catch (error) {
            if (this.enableNotifications) {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Error",
                    body: error.message,
                    type: "danger",
                });
            }
            return false;
        }
    }

    generateRobots = async () => {
        try {
            const { status, result } = await Fetch(`/admin/generals/robot`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
                },
            });

            if (!status)
                throw new Error(result?.message || "Ocurrió un error inesperado");

            if (this.enableNotifications) {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Correcto",
                    body: "Robots.txt generado exitosamente",
                    type: "success",
                });
            }
            return true;
        } catch (error) {
            if (this.enableNotifications) {
                Notify.add({
                    icon: "/assets/img/icon.png",
                    title: "Error",
                    body: error.message,
                    type: "danger",
                });
            }
            return false;
        }
    }
}

export default GeneralsRest;