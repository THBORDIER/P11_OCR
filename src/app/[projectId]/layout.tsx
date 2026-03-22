import Link from "next/link";
import { getProject, getProjects } from "@/lib/data";
import { notFound } from "next/navigation";
import AuthHeader from "@/components/AuthHeader";

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
      <aside className="w-60 bg-[#0f172a] text-[#e2e8f0] flex flex-col fixed h-full shadow-xl z-10">
        {/* Back to projects */}
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-3 text-xs text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-all border-b border-[#1e293b]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tous les projets
        </Link>

        {/* Project header */}
        <div className="p-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
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
          {project.navItems.map((item) => {
            // Progress indicator based on nav href
            const counts = project._count;
            const progressMap: Record<string, boolean> = {
              questionnaire: counts.questionnaireSections > 0,
              analyse: counts.personas > 0,
              roadmap: counts.phases > 0,
              "product-backlog": counts.userStories > 0,
              "sprint-backlog": counts.sprints > 0,
              recettage: counts.testCases > 0,
              communication: counts.stakeholders > 0,
            };
            const segment = item.href.split("/").pop() || "";
            const isDone = progressMap[segment];

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-all duration-150 group"
              >
                <span className="text-base w-5 text-center group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isDone && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e293b] text-[10px] text-[#475569]">
          <p className="truncate">{project.author}{project.organization ? ` · ${project.organization}` : ""}</p>
        </div>
      </aside>

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top bar with auth */}
        <header className="flex items-center justify-between px-6 py-2.5 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] min-w-0">
            <Link href="/" className="hover:text-[#1e293b] transition-colors shrink-0">DevTracker</Link>
            <span>/</span>
            <span className="text-[#1e293b] font-medium truncate">{project.name}</span>
          </div>
          <div className="shrink-0 ml-3">
            <AuthHeader />
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
