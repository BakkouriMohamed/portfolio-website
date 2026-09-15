import type { Metadata } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: "Mohamed Bakkouri — Digital Marketing Specialist",
  description:
    "Mohamed Bakkouri — Spécialiste en Marketing Digital. Étudiant en Master Marketing Digital à l'ENCG Fès. SEO, Social Media, Analytics & Stratégie de marque.",
  keywords: [
    "Mohamed Bakkouri",
    "Marketing Digital",
    "SEO",
    "Social Media",
    "ENCG Fès",
    "Digital Marketing Specialist",
    "Maroc",
  ],
  authors: [{ name: "Mohamed Bakkouri" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Mohamed Bakkouri — Digital Marketing Specialist",
    description:
      "Stratégie, créativité et analyse de données au service de la visibilité des marques.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
