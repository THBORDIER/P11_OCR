import Link from "next/link";
import { getProjects } from "@/lib/data";
import { auth } from "@/lib/auth";
import AuthHeader from "@/components/AuthHeader";

function ProjectProgress({ counts }: { counts: { userStories: number; sprints: number; testCases: number; phases: number; personas: number } }) {
  const steps = [
    { label: "Personas", done: counts.personas > 0 },
    { label: "Phases", done: counts.phases > 0 },
    { label: "US", done: counts.userStories > 0 },
    { label: "Sprints", done: counts.sprints > 0 },
    { label: "Tests", done: counts.testCases > 0 },
  ];
  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? "#22c55e" : pct > 50 ? "#3b82f6" : "#f59e0b",
            }}
          />
        </div>
        <span className="text-[10px] font-semibold text-[#94a3b8]">
          {completed}/{steps.length}
        </span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {steps.map((s) => (
          <span
            key={s.label}
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              s.done
                ? "bg-[#ecfdf5] text-[#059669] font-medium"
                : "bg-[#f8fafc] text-[#cbd5e1]"
            }`}
          >
            {s.done ? "✓" : "○"} {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default async function HomePage() {
  const session = await auth();
  const projects = await getProjects(session?.user?.id);

  const visibleProjects = projects.filter((p) => p.id !== "template");
  const totalProjects = visibleProjects.length;
  const totalUS = visibleProjects.reduce((s, p) => s + p._count.userStories, 0);
  const totalTests = visibleProjects.reduce((s, p) => s + p._count.testCases, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-[#1e293b] text-lg">DevTracker</span>
          </div>
          <AuthHeader />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#0f172a] mb-3 tracking-tight">
            Pilotez vos projets
          </h1>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            {session
              ? "Créez, suivez et pilotez vos projets de développement de bout en bout."
              : "Connectez-vous pour créer et gérer vos propres projets."}
          </p>
        </div>

        {/* Global stats */}
        {totalProjects > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#3b82f6]">{totalProjects}</p>
              <p className="text-xs text-[#64748b] mt-1">Projets</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#8b5cf6]">{totalUS}</p>
              <p className="text-xs text-[#64748b] mt-1">User Stories</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#22c55e]">{totalTests}</p>
              <p className="text-xs text-[#64748b] mt-1">Tests</p>
            </div>
          </div>
        )}

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.filter((p) => p.id !== "template").map((project) => (
            <Link
              key={project.id}
              href={`/${project.id}`}
              className="block group bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-xl hover:border-[#cbd5e1] transition-all duration-200 hover:-translate-y-1 will-change-transform"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#1e293b] truncate">
                      {project.name}
                    </h2>
                    {["p11-spartcrm", "template"].includes(project.id) && (
                      <span className="bg-[#dbeafe] text-[#1d4ed8] px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">
                        Démo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94a3b8] truncate">{project.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#64748b] mb-3 leading-relaxed line-clamp-2">
                {project.description || "Aucune description."}
              </p>

              {/* KPIs or counts */}
              {project.kpis.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.kpis.slice(0, 4).map((kpi) => (
                    <span
                      key={kpi.label}
                      className="text-[10px] bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-full font-medium"
                    >
                      {kpi.label}: <strong>{kpi.value}</strong>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3 text-[10px] text-[#94a3b8] mb-2">
                  {project._count.userStories > 0 && <span>{project._count.userStories} US</span>}
                  {project._count.sprints > 0 && <span>{project._count.sprints} sprints</span>}
                  {project._count.phases > 0 && <span>{project._count.phases} phases</span>}
                  {project._count.testCases > 0 && <span>{project._count.testCases} tests</span>}
                  {project._count.userStories === 0 && project._count.sprints === 0 && (
                    <span className="italic">Projet vide</span>
                  )}
                </div>
              )}

              {/* Progress */}
              <ProjectProgress counts={project._count} />

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f1f5f9]">
                <span className="text-[10px] text-[#94a3b8]">
                  {project.author || "—"}{project.organization ? ` · ${project.organization}` : ""}
                </span>
                <span className="text-[10px] text-[#94a3b8]">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            </Link>
          ))}

          {/* New project card */}
          <Link
            href="/new-project"
            className="group bg-white/50 rounded-xl border-2 border-dashed border-[#cbd5e1] p-5 hover:shadow-lg hover:border-[#3b82f6] hover:bg-white transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#f1f5f9] flex items-center justify-center text-2xl text-[#94a3b8] group-hover:bg-[#dbeafe] group-hover:text-[#3b82f6] transition-all duration-200 mb-4">
              +
            </div>
            <h2 className="text-base font-semibold text-[#64748b] group-hover:text-[#3b82f6] transition-colors">
              Nouveau projet
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Démarrer un nouveau cadrage
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
