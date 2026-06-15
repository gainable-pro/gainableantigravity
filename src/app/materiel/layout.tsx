import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue Climatisation & Pompes à Chaleur | Daikin, Mitsubishi, Heiwa | Gainable",
  description:
    "Consultez les fiches techniques et tarifs publics estimés de 340 climatiseurs et pompes à chaleur (Daikin, Mitsubishi Electric, Heiwa). Gainable : votre référence CVC en France.",
  keywords: [
    "climatisation",
    "pompe à chaleur",
    "fiche technique climatisation",
    "Daikin",
    "Mitsubishi Electric",
    "Heiwa",
    "split mural",
    "gainable",
    "console",
    "groupe extérieur",
    "SEER",
    "SCOP",
    "R32",
    "R410A",
    "installation climatisation",
    "CVC",
    "génie climatique",
    "artisan RGE",
    "installateur certifié",
    "tarif climatisation",
    "prix climatiseur",
    "catalogue matériel",
    "fournisseur climatisation France",
    "grossiste CVC",
    "Sonepar",
    "Andrety",
    "Clim+",
    "Cédéo",
  ].join(", "),
  openGraph: {
    title: "Catalogue Matériel Climatisation CVC | Gainable",
    description:
      "340 références Daikin, Mitsubishi Electric et Heiwa. Fiches techniques, SEER, SCOP, fluides réfrigérants. Installation par des experts certifiés RGE.",
    type: "website",
    url: "https://www.gainable.fr/materiel",
  },
  alternates: {
    canonical: "https://www.gainable.fr/materiel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function MaterielLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD – BreadcrumbList pour le catalogue */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://www.gainable.fr",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Matériel Climatisation",
                item: "https://www.gainable.fr/materiel",
              },
            ],
          }),
        }}
      />
      {/* JSON-LD – Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Gainable",
            url: "https://www.gainable.fr",
            description:
              "Spécialiste de l'installation de climatisation et pompes à chaleur en France. Experts certifiés RGE, partenaires des grossistes CVC officiels (Sonepar, Andrety, Clim+, Cédéo).",
            areaServed: ["FR", "BE", "CH"],
            knowsAbout: [
              "Climatisation",
              "Pompe à chaleur",
              "Génie climatique",
              "CVC",
              "Installation Daikin",
              "Installation Mitsubishi Electric",
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
