import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portail Cadrage Projets",
  description:
    "Plateforme multi-projets pour structurer et piloter le cadrage de vos projets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
