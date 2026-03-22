import Link from "next/link";
import { getProject, getProjects } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ projectId: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: `${project.name} — ${project.subtitle}`,
    description: project.description,
  };
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-60 bg-[#0f172a] text-[#e2e8f0] flex flex-col fixed h-full shadow-xl">
        {/* Project header */}
        <div className="p-5 border-b border-[#1e293b]">
          <Link
            href="/"
            className="text-[10px] text-[#475569] hover:text-[#94a3b8] transition-colors mb-3 block uppercase tracking-wider font-medium"
          >
            &larr; Projets
          </Link>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0]}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate">{project.name}</h1>
              <p className="text-[10px] text-[#64748b] truncate">{project.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {project.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-all duration-150 group"
            >
              <span className="text-base w-5 text-center group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e293b] text-[10px] text-[#475569]">
          <p className="truncate">{project.author}{project.organization ? ` · ${project.organization}` : ""}</p>
        </div>
      </aside>
      <main className="flex-1 ml-60 p-8 min-h-screen">{children}</main>
    </div>
  );
}
