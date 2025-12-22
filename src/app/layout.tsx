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
  title: "Gainable.fr - La climatisation gainable, encastrable et invisible",
  description: "La première plateforme de mise en relation d'experts en climatisation gainable & VRV.",
};

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
      </body>
    </html >
  );
}
