import Link from "next/link";
import { getProjectOrThrow, projects } from "@/config/project.config";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return projects.map((p) => ({ projectId: p.id }));
}

export default async function ProjectDashboard({
  params,
}: {
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Cadrage du projet {project.name}
        </h1>
        <p className="text-[#64748b] mt-2">
          {project.author} — {project.organization}
        </p>
      </div>

      {/* Contexte */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3">Contexte</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          {project.context.summary}
        </p>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {project.context.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#f1f5f9] rounded p-3 text-center"
            >
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-xs text-[#64748b]">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack technique */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-3">
          Stack technique retenue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.stack.map((tech) => (
            <div key={tech.name} className="bg-[#f1f5f9] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-lg font-bold"
                  style={{ color: tech.tagColor.text }}
                >
                  {tech.name}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: tech.tagColor.bg,
                    color: tech.tagColor.text,
                  }}
                >
                  {tech.tag}
                </span>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Méthodologie */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-3">
          Méthodologie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dbeafe] text-[#3b82f6] text-xs font-bold">
                S
              </span>
              Framework {project.methodology.framework}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {project.methodology.frameworkDescription}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#fef3c7] text-[#f59e0b] text-xs font-bold">
                M
              </span>
              Priorisation {project.methodology.prioritization}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {project.methodology.prioritizationDescription}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                {
                  label: "Must Have",
                  color: "#dc2626",
                  desc: "Indispensable au MVP",
                },
                {
                  label: "Should Have",
                  color: "#f59e0b",
                  desc: "Important, intégré si possible",
                },
                {
                  label: "Could Have",
                  color: "#3b82f6",
                  desc: "Confort, si reste du budget",
                },
                {
                  label: "Won't Have",
                  color: "#64748b",
                  desc: "Hors périmètre v1",
                },
              ].map((p) => (
                <div
                  key={p.label}
                  className="bg-[#f1f5f9] rounded p-2 text-center"
                >
                  <div
                    className="text-xs font-bold"
                    style={{ color: p.color }}
                  >
                    {p.label}
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phases du projet */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Phases du projet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {project.phases.map((phase, index) => (
            <div key={phase.label} className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: phase.color }}
                >
                  {index + 1}
                </span>
                <span className="font-semibold text-[#1e293b]">
                  {phase.label}
                </span>
              </div>
              <div
                className="text-xs font-medium mb-1 px-2 py-0.5 rounded-full inline-block text-white"
                style={{ backgroundColor: phase.color }}
              >
                {phase.duration}
              </div>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                {phase.detail}
              </p>
              {index < project.phases.length - 1 && (
                <div className="hidden md:block absolute top-3.5 -right-2 text-[#cbd5e1] text-lg">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-1 rounded-full overflow-hidden h-2">
          {project.phases.map((phase) => (
            <div
              key={phase.label}
              className="flex-1"
              style={{ backgroundColor: phase.color }}
            />
          ))}
        </div>
      </div>

      {/* Livrables */}
      <h2 className="text-lg font-semibold mb-4">Livrables du projet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.deliverables.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bg-white rounded-lg border border-[#e2e8f0] p-5 hover:border-[#3b82f6] hover:shadow-md transition-all"
          >
            <div className="text-xs font-medium text-[#3b82f6] mb-1">
              {l.status}
            </div>
            <h3 className="font-semibold text-[#1e293b] mb-2">{l.title}</h3>
            <p className="text-sm text-[#64748b]">{l.desc}</p>
          </Link>
        ))}
      </div>

      {/* Compétences */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mt-8">
        <h2 className="text-lg font-semibold mb-3">Compétences visées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {project.skills.map((c) => (
            <div
              key={c}
              className="flex items-start gap-2 text-sm text-[#475569]"
            >
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
