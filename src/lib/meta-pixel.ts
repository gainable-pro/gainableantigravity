"use client";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Envoie un événement standard ou personnalisé au Pixel Meta.
 * Si le Pixel n'est pas encore initialisé, logge l'événement en développement sans lever d'erreur.
 */
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("track", eventName, params);
      } else {
        window.fbq("track", eventName);
      }
    } catch (err) {
      console.warn("[Meta Pixel] Erreur lors de l'envoi de l'événement:", err);
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info(`[Meta Pixel Mock] Événement déclenché : "${eventName}"`, params || "");
  }
}

/**
 * Envoie un événement personnalisé (Custom Event)
 */
export function trackMetaCustomEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("trackCustom", eventName, params);
      } else {
        window.fbq("trackCustom", eventName);
      }
    } catch (err) {
      console.warn("[Meta Pixel] Erreur lors de l'envoi du custom event:", err);
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info(`[Meta Pixel Mock Custom] "${eventName}"`, params || "");
  }
}
