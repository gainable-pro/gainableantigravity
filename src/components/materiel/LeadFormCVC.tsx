"use client";

import { useState } from "react";
import {
  Loader2,
  Send,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Thermometer,
  Home,
  Wrench,
  ChevronDown,
} from "lucide-react";

interface LeadFormCVCProps {
  productRef?: string;
  productTitle?: string;
}

export default function LeadFormCVC({ productRef, productTitle }: LeadFormCVCProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("type", "particulier");
    if (productRef) formData.append("productRef", productRef);
    if (productTitle) formData.append("productTitle", productTitle);

    // Ajout d'un message automatique si non renseigné
    const msg = formData.get("message");
    if (!msg || String(msg).trim() === "") {
      formData.set(
        "message",
        `Demande de devis pour : ${productTitle ?? productRef ?? "Climatisation"}`
      );
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur");
      setSubmitted(true);
    } catch {
      alert(
        "Une erreur est survenue. Veuillez réessayer ou nous contacter par email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">
          Demande envoyée !
        </h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Un expert Gainable vous recontactera sous{" "}
          <strong>24h ouvrées</strong> pour vous proposer un devis
          personnalisé matériel + pose.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
          <CheckCircle className="h-3.5 w-3.5" />
          Votre demande a bien été enregistrée
        </div>
      </div>
    );
  }

  return (
    <section
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      aria-labelledby="lead-form-title"
    >
      {/* Header */}
      <div className="bg-[#1F2D3D] px-8 py-6">
        <p className="text-xs font-bold text-[#D59B2B] uppercase tracking-widest mb-1">
          Devis gratuit &amp; sans engagement
        </p>
        <h2
          id="lead-form-title"
          className="text-xl md:text-2xl font-bold text-white font-outfit"
        >
          Obtenir un devis d&apos;installation CVC
        </h2>
        {productTitle && (
          <p className="text-slate-400 text-sm mt-1">
            Pour :{" "}
            <span className="text-[#D59B2B] font-semibold">{productTitle}</span>
          </p>
        )}
        {/* Avantages rapides */}
        <div className="flex flex-wrap gap-4 mt-4">
          {[
            "Réponse sous 24h",
            "Expert certifié RGE",
            "Tarif grossiste préférentiel",
            "Garantie décennale",
          ].map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D59B2B] inline-block" />
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
        {/* Champs cachés */}
        {productRef && (
          <input type="hidden" name="productRef" value={productRef} />
        )}
        {productTitle && (
          <input type="hidden" name="productTitle" value={productTitle} />
        )}

        {/* Identité */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="cvc-lastName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              <User className="inline h-3 w-3 mr-1" />
              Nom *
            </label>
            <input
              id="cvc-lastName"
              name="lastName"
              type="text"
              placeholder="Votre nom"
              required
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="cvc-firstName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Prénom
            </label>
            <input
              id="cvc-firstName"
              name="firstName"
              type="text"
              placeholder="Votre prénom"
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="cvc-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              <Mail className="inline h-3 w-3 mr-1" />
              Email *
            </label>
            <input
              id="cvc-email"
              name="email"
              type="email"
              placeholder="vous@exemple.fr"
              required
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="cvc-phone"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              <Phone className="inline h-3 w-3 mr-1" />
              Téléphone *
            </label>
            <input
              id="cvc-phone"
              name="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              required
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="cvc-zip"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              <MapPin className="inline h-3 w-3 mr-1" />
              Code Postal *
            </label>
            <input
              id="cvc-zip"
              name="zip"
              type="text"
              placeholder="06000"
              required
              pattern="[0-9]{4,5}"
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="cvc-city"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Ville *
            </label>
            <input
              id="cvc-city"
              name="city"
              type="text"
              placeholder="Nice, Marseille..."
              required
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Détails CVC */}
        <div className="border-t border-slate-100 pt-6">
          <p className="text-xs font-bold text-[#D59B2B] uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Thermometer className="h-3.5 w-3.5" />
            Détails de votre projet CVC
          </p>
          <div className="grid md:grid-cols-2 gap-5">

            {/* Type de logement */}
            <div className="space-y-1.5">
              <label
                htmlFor="cvc-housingType"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                <Home className="inline h-3 w-3 mr-1" />
                Type de logement
              </label>
              <div className="relative">
                <select
                  id="cvc-housingType"
                  name="housingType"
                  className="w-full h-11 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  <option value="maison">Maison individuelle</option>
                  <option value="appartement">Appartement</option>
                  <option value="local_commercial">Local commercial</option>
                  <option value="bureau">Bureaux / Tertiaire</option>
                  <option value="autre">Autre</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Surface à traiter */}
            <div className="space-y-1.5">
              <label
                htmlFor="cvc-surface"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Surface à traiter (m²)
              </label>
              <div className="relative">
                <select
                  id="cvc-surface"
                  name="surface"
                  className="w-full h-11 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  <option value="moins_30">Moins de 30 m²</option>
                  <option value="30_50">30 – 50 m²</option>
                  <option value="50_80">50 – 80 m²</option>
                  <option value="80_120">80 – 120 m²</option>
                  <option value="120_200">120 – 200 m²</option>
                  <option value="plus_200">Plus de 200 m²</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Type de prestation */}
            <div className="space-y-1.5">
              <label
                htmlFor="cvc-workType"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                <Wrench className="inline h-3 w-3 mr-1" />
                Prestation souhaitée
              </label>
              <div className="relative">
                <select
                  id="cvc-workType"
                  name="workType"
                  className="w-full h-11 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  <option value="fourniture_pose">Fourniture + Pose (clé en main)</option>
                  <option value="pose_seule">Pose seule (j&apos;ai déjà le matériel)</option>
                  <option value="entretien_sav">Entretien / SAV</option>
                  <option value="remplacement">Remplacement d&apos;un équipement existant</option>
                  <option value="multi_split">Installation multi-split</option>
                  <option value="gainable">Système gainable</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Budget estimé */}
            <div className="space-y-1.5">
              <label
                htmlFor="cvc-budget"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Budget estimé (HT)
              </label>
              <div className="relative">
                <select
                  id="cvc-budget"
                  name="budget"
                  className="w-full h-11 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all appearance-none"
                >
                  <option value="">Non défini</option>
                  <option value="moins_2000">Moins de 2 000 €</option>
                  <option value="2000_5000">2 000 – 5 000 €</option>
                  <option value="5000_10000">5 000 – 10 000 €</option>
                  <option value="10000_20000">10 000 – 20 000 €</option>
                  <option value="plus_20000">Plus de 20 000 €</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Message complémentaire */}
        <div className="space-y-1.5">
          <label
            htmlFor="cvc-message"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Précisions complémentaires
          </label>
          <textarea
            id="cvc-message"
            name="message"
            rows={4}
            placeholder={
              productRef
                ? `Ex : Je souhaite un devis pour l'installation du ${productRef}, maison neuve, pose en R+1, accès par l'extérieur...`
                : "Décrivez votre projet : type d'habitation, contraintes d'accès, délai souhaité..."
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D59B2B] focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 py-3.5 flex items-center justify-center gap-2 bg-[#D59B2B] hover:bg-amber-400 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-amber-300/40 hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Envoyer ma demande de devis
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-3 leading-relaxed">
            🔒 Données sécurisées — Pas de démarchage. Réponse d&apos;un expert sous 24h ouvrées.
            <br />
            En soumettant ce formulaire, vous acceptez notre{" "}
            <a href="/politique-confidentialite" className="underline hover:text-slate-600">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </form>
    </section>
  );
}
