import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SupportedLanguage } from "@/context/adapt";
import { CMSService } from "@/services/supabase.conf";
import { CMSProvider } from "@/components/cms/cms-provider";
import { CMSPopupManager } from "@/components/cms/cms-popup-manager"; // Import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` 
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Website AEE",
  description: "Association Evangelique El Shaddai",
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "fr": "/fr",
      "es": "/es",
      "ht": "/ht",
    },
  },
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'es' }, { lang: 'ht' }];
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  
  // Fetch content for the current language server-side
  // We fetch with empty prefix '' to get all global content needed for initial render
  const dictionary = await CMSService.getPageContent('', lang);

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CMSProvider dictionary={dictionary}>
          <CMSPopupManager /> {/* Add Manager here */}
          {children}
        </CMSProvider>
      </body>
    </html>
  );
}
