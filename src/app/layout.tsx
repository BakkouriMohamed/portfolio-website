import type { Metadata } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://mohamedbakkouri.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Mohamed BAKKOURI- Digital Marketing Specialist",
  description:
    "Mohamed BAKKOURI- Spécialiste en Marketing Digital. Étudiant en Master Marketing Digital à l'ENCG Fès. SEO, Social Media, Analytics & Stratégie de marque.",
  keywords: [
    "Mohamed Bakkouri",
    "Marketing Digital",
    "SEO",
    "Social Media",
    "ENCG Fès",
    "Digital Marketing Specialist",
    "Maroc",
    "Spécialiste Marketing Digital",
    "Marketing Digital Maroc",
    "SEO Maroc",
    "Fès",
  ],
  authors: [{ name: "Mohamed Bakkouri" }],
  creator: "Mohamed Bakkouri",
  publisher: "Mohamed Bakkouri",
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Mohamed BAKKOURI- Digital Marketing Specialist",
    description:
      "Mohamed BAKKOURI- Spécialiste en Marketing Digital. Étudiant en Master Marketing Digital à l'ENCG Fès. SEO, Social Media, Analytics & Stratégie de marque.",
    type: "website",
    url: `${BASE_URL}/`,
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Mohamed BAKKOURI — Spécialiste en Marketing Digital",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed BAKKOURI- Digital Marketing Specialist",
    description:
      "Mohamed BAKKOURI- Spécialiste en Marketing Digital. Étudiant en Master Marketing Digital à l'ENCG Fès. SEO, Social Media, Analytics & Stratégie de marque.",
    url: `${BASE_URL}/`,
    images: [`${BASE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "EclGD6eXzkMTbBDVDiU89iRiY5tZtsGE1c2ToCngjZI",
  },
};

// Schema.org Person structured data (JSON-LD)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohamed BAKKOURI",
  jobTitle: "Digital Marketing Specialist",
  description:
    "Spécialiste en Marketing Digital. Étudiant en Master Marketing Digital à l'ENCG Fès. SEO, Social Media, Analytics & Stratégie de marque.",
  url: BASE_URL,
  image: `${BASE_URL}/mohamed-portrait.jpeg`,
  email: "mailto:mohamedbakkouri88@gmail.com",
  telephone: "+212649942204",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Fès",
    addressCountry: "MA",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "ENCG Fès",
    sameAs: "https://encgf.ma",
  },
  knowsAbout: [
    "SEO",
    "Social Media Marketing",
    "Google Analytics 4",
    "Content Marketing",
    "Marketing Strategy",
    "Brand Strategy",
    "Email Marketing",
    "Search Engine Optimization",
  ],
  sameAs: [
    "https://www.linkedin.com/in/mohamedbakkouri/",
    "https://github.com/BakkouriMohamed",
    BASE_URL,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
