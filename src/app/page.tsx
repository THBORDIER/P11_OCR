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
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? "#22c55e" : pct > 50 ? "#3b82f6" : "#f59e0b",
            }}
          />
        </div>
        <span className="text-[10px] font-medium text-[#94a3b8] whitespace-nowrap">
          {completed}/{steps.length}
        </span>
      </div>
      <div className="flex gap-1">
        {steps.map((s) => (
          <span
            key={s.label}
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              s.done
                ? "bg-[#f0fdf4] text-[#166534]"
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

export default async function HomePage() {
  const session = await auth();
  const projects = await getProjects(session?.user?.id);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <AuthHeader />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e293b] mb-3">
            Portail Cadrage Projets
          </h1>
          <p className="text-[#64748b] text-lg">
            {session
              ? `${projects.length} projet${projects.length > 1 ? "s" : ""} — Créez, suivez et pilotez vos projets de développement.`
              : "Connectez-vous pour créer et gérer vos propres projets."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${project.id}`}
              className="group bg-white rounded-xl border-2 border-[#e2e8f0] p-6 hover:shadow-lg transition-all hover:border-transparent"
              style={
                {
                  "--hover-border": project.color,
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name[0]}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-[#1e293b] truncate">
                    {project.name}
                  </h2>
                  <p className="text-xs text-[#94a3b8] truncate">{project.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-[#475569] mb-3 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Project stats */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.kpis.length > 0 ? (
                  project.kpis.map((kpi) => (
                    <span
                      key={kpi.label}
                      className="text-xs bg-[#f1f5f9] text-[#475569] px-2 py-1 rounded-full"
                    >
                      {kpi.label}: <strong>{kpi.value}</strong>
                    </span>
                  ))
                ) : (
                  <div className="flex gap-3 text-xs text-[#94a3b8]">
                    {project._count.userStories > 0 && (
                      <span>{project._count.userStories} US</span>
                    )}
                    {project._count.sprints > 0 && (
                      <span>{project._count.sprints} sprints</span>
                    )}
                    {project._count.testCases > 0 && (
                      <span>{project._count.testCases} tests</span>
                    )}
                    {project._count.phases > 0 && (
                      <span>{project._count.phases} phases</span>
                    )}
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <ProjectProgress counts={project._count} />

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f1f5f9]">
                <span className="text-xs text-[#94a3b8] flex items-center gap-2">
                  {project.author}{project.organization ? ` — ${project.organization}` : ""}
                  {project.isPublic && (
                    <span className="bg-[#dbeafe] text-[#1d4ed8] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      DÉMO
                    </span>
                  )}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: project.color }}
                >
                  Ouvrir &rarr;
                </span>
              </div>
            </Link>
          ))}

          {session && (
            <Link
              href="/new-project"
              className="group bg-white rounded-xl border-2 border-dashed border-[#cbd5e1] p-6 hover:shadow-lg transition-all hover:border-[#3b82f6] flex flex-col items-center justify-center text-center min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-2xl text-[#94a3b8] group-hover:bg-[#dbeafe] group-hover:text-[#3b82f6] transition-colors mb-4">
                +
              </div>
              <h2 className="text-lg font-semibold text-[#64748b] group-hover:text-[#3b82f6] transition-colors">
                Nouveau projet
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                Créer un nouveau projet de cadrage
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
