import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gainable.fr'),
  title: {
    default: "Gainable.fr - Trouvez votre Installateur de Climatisation Gainable & VRV",
    template: "%s | Gainable.fr"
  },
  description: "La première plateforme de mise en relation d'experts en climatisation gainable & VRV. Trouvez un installateur, un bureau d'étude ou un diagnostiqueur certifié.",
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.gainable.fr',
    siteName: 'Gainable.fr',
    images: [{ url: '/assets/logo-share.jpg', width: 1200, height: 630, alt: 'Gainable.fr' }],
  },
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg', // Apple touch icon usually needs png, but jpg might work or fallback
  },
  verification: {
    google: "7CpozW1B0HyKKwPSynXwVeV6-y7CK65t7Lb6MpMINgE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { CookieBanner } from "@/components/layout/CookieBanner";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get Country from Vercel Headers
  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country') || 'FR';

  return (
    <html lang="fr">
      <body className={`${montserrat.variable} font-sans`}>
        <Header countryCode={country} />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
