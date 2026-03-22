import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTracker — Suivi de projets",
  description:
    "Outil de suivi de projets de développement : backlog, sprints, roadmap, questionnaire client, recettage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased text-[#1e293b]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
