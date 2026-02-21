import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Climatisation Gainable & Réversible : Tout sur la Solution Invisible",
    description: "Découvrez la climatisation gainable : fonctionnement, esthétique, silence et performance. Trouvez un installateur expert pour votre projet de clim réversible.",
    alternates: {
        canonical: 'https://www.gainable.fr/la-solution-gainable',
    },
    openGraph: {
        title: "La Solution Climatisation Gainable : Le Confort Absolu",
        description: "Esthétique, silence et performance. Découvrez pourquoi le gainable est le standard du confort moderne.",
        images: ['/assets/images/solution/gainable_unit_attic.png'],
    }
};

export default function SolutionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
