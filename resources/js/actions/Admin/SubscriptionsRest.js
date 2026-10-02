import BasicRest from "../BasicRest";
import { Fetch, Notify } from "sode-extend-react";

class SubscriptionsRest extends BasicRest {
  path = 'admin/subscriptions';

  import = async (items) => {
    try {
      const { status: fetchStatus, result } = await Fetch(`/api/${this.path}/import`, {
        method: "POST",
        body: JSON.stringify({ items }),
      });

      if (!fetchStatus) {
        throw new Error(result?.message ?? "Ocurrió un error al importar");
      }

      if (this.enableNotifications) {
        Notify.add({
          icon: "/assets/img/icon.png",
          title: "Correcto",
          body: result.message,
          type: "success",
        });
      }

      return result;
    } catch (error) {
      if (this.enableNotifications) {
        Notify.add({
          icon: "/assets/img/icon.png",
          title: "Error",
          body: error.message,
          type: "danger",
        });
      }
      return null;
    }
  };

  analyzeInvalid = async () => {
    try {
      const { status: fetchStatus, result } = await Fetch(`/api/${this.path}/analyze-invalid`, {
        method: "POST",
      });

      if (!fetchStatus) {
        throw new Error(result?.message ?? "Ocurrió un error al analizar");
      }

      return result.data;
    } catch (error) {
      if (this.enableNotifications) {
        Notify.add({
          icon: "/assets/img/icon.png",
          title: "Error",
          body: error.message,
          type: "danger",
        });
      }
      return null;
    }
  };

  cleanFailed = async (action = "deactivate") => {
    try {
      const { status: fetchStatus, result } = await Fetch(`/api/${this.path}/clean-failed`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });

      if (!fetchStatus) {
        throw new Error(result?.message ?? "Ocurrió un error al procesar");
      }

      if (this.enableNotifications) {
        Notify.add({
          icon: "/assets/img/icon.png",
          title: "Correcto",
          body: result.message,
          type: "success",
        });
      }

      return result;
    } catch (error) {
      if (this.enableNotifications) {
        Notify.add({
          icon: "/assets/img/icon.png",
          title: "Error",
          body: error.message,
          type: "danger",
        });
      }
      return null;
    }
  };
}

export default SubscriptionsRest;