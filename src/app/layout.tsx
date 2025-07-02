import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/auth-provider";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import HeaderServer from "./components/HeaderServer";
import WelcomeToast from "./components/WelcomeToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
  title: "Portfolio by Johans Valerio",
  description:
    "Portfolio de Johans Valerio, Ingeniero Informático con experiencia en desarrollo web y creación de soluciones digitales.",
  keywords: [
    "Johans Valerio",
    "Portfolio",
    "Ingeniero Informático",
    "React",
    "Next.js",
    "TypeScript",
    "GitHub",
    "Guanacaste",
    "Costa Rica",
    "Portafolio",
  ],
  openGraph: {
    title: "Portfolio by Johans Valerio",
    description:
      "Portfolio de Johans Valerio, Ingeniero Informático con experiencia en desarrollo web y creación de soluciones digitales.",
    url: "https://johansvalerio.vercel.app",
    images: [
      {
        url: "https://johansvalerio.vercel.app/img/ogportfolio.jpg",
        width: 1200,
        height: 630,
        alt: "Johans Valerio",
      },
    ],
    siteName: "Portfolio by Johans Valerio",
    locale: "es_CR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <AuthProvider>
          <HeaderServer />
          <WelcomeToast />
          {children}
          <Toaster richColors position="bottom-center" />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
