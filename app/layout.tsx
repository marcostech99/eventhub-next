import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EventHub - Sistema de Gerenciamento de Eventos",
    template: "%s | EventHub",
  },
  description:
    "Gerencie e descubra eventos com o EventHub — uma plataforma moderna integrada à API da Ticketmaster. Desenvolvido em Next.js 14 com TypeScript.",
  keywords: [
    "eventos",
    "Next.js 14",
    "Ticketmaster",
    "EventHub",
    "TypeScript",
    "Zustand",
    "frontend",
  ],
  authors: [{ name: "Marcos Vinicius" }],
  openGraph: {
    title: "EventHub - Sistema de Gerenciamento de Eventos",
    description:
      "Descubra e gerencie eventos incríveis com o EventHub, desenvolvido em Next.js 14 e integrado à Ticketmaster.",
    url: "https://eventhub.vercel.app",
    siteName: "EventHub",
    locale: "pt_BR",
    type: "website",
  },
  metadataBase: new URL("https://eventhub.vercel.app"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className="antialiased"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
