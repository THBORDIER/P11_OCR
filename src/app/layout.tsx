import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpartCRM — Cadrage Projet P11",
  description: "Livrables de cadrage du projet CRM pour Spart — OpenClassrooms P11",
};

const navItems = [
  { href: "/", label: "Accueil", icon: "🏠" },
  { href: "/questionnaire", label: "Questionnaire", icon: "📋" },
  { href: "/analyse", label: "Analyse retours", icon: "🔍" },
  { href: "/roadmap", label: "Roadmap", icon: "🗺️" },
  { href: "/product-backlog", label: "Product Backlog", icon: "📦" },
  { href: "/sprint-backlog", label: "Sprint Backlog", icon: "🏃" },
  { href: "/veille", label: "Veille", icon: "📡" },
  { href: "/communication", label: "Communication", icon: "💬" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen">
        <aside className="w-64 bg-[#1e293b] text-[#e2e8f0] flex flex-col fixed h-full">
          <div className="p-6 border-b border-[#334155]">
            <h1 className="text-xl font-bold text-white">SpartCRM</h1>
            <p className="text-xs text-[#94a3b8] mt-1">Cadrage Projet P11</p>
          </div>
          <nav className="flex-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-[#334155] transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[#334155] text-xs text-[#64748b]">
            Thomas Bordier — OC P11
          </div>
        </aside>
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
