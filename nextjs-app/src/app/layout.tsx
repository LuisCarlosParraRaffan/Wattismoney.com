import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wattismoney - Tu banco verde",
  description: "Aporta liquidez a contratos de suministro de energía limpia. Genera utilidades atractivas y un impacto sostenible para tu región.",
  keywords: ["inversión", "energía renovable", "energía limpia", "solar", "eólica", "sostenibilidad"],
  authors: [{ name: "Wattismoney" }],
  openGraph: {
    title: "Wattismoney - Tu banco verde",
    description: "Invierte en energía limpia y genera impacto sostenible",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Material Symbols for icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

