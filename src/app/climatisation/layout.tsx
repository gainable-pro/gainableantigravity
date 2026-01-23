import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Climatisation gainable : installateur pour particuliers & professionnels | Gainable.fr",
    description: "Climatisation gainable pour villas, maisons, commerces et hôtels. Trouvez un installateur vérifié ou un bureau d’étude CVC avec Gainable.fr.",
    openGraph: {
        title: "Climatisation gainable : installateur pour particuliers & professionnels | Gainable.fr",
        description: "Climatisation gainable pour villas, maisons, commerces et hôtels. Trouvez un installateur vérifié ou un bureau d’étude CVC avec Gainable.fr.",
        url: "https://gainable.fr/climatisation",
        siteName: "Gainable.fr",
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Climatisation gainable : installateur pour particuliers & professionnels | Gainable.fr",
        description: "Climatisation gainable pour villas, maisons, commerces et hôtels. Trouvez un installateur vérifié ou un bureau d’étude CVC avec Gainable.fr.",
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
