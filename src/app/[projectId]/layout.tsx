import Link from "next/link";
import { projects, getProjectOrThrow } from "@/config/project.config";
import { notFound } from "next/navigation";
import SidebarNav from "./sidebar-nav";

export async function generateStaticParams() {
  return projects.map((p) => ({ projectId: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  try {
    const project = getProjectOrThrow(projectId);
    return {
      title: `${project.name} — ${project.subtitle}`,
      description: project.description,
    };
  } catch {
    return { title: "Projet introuvable" };
  }
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let project;
  try {
    project = getProjectOrThrow(projectId);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#1e293b] text-[#e2e8f0] flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#334155]">
          <Link
            href="/"
            className="text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors mb-2 block"
          >
            &larr; Tous les projets
          </Link>
          <h1 className="text-xl font-bold text-white">{project.name}</h1>
          <p className="text-xs text-[#94a3b8] mt-1">{project.subtitle}</p>
        </div>
        <SidebarNav items={project.navItems} />
        <div className="p-4 border-t border-[#334155] text-xs text-[#64748b]">
          {project.author} — {project.organization}
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
