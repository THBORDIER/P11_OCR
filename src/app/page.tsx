import Link from "next/link";
import { getProjects } from "@/lib/data";
import { auth } from "@/lib/auth";
import AuthHeader from "@/components/AuthHeader";

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
              ? "Vos projets et les projets publics."
              : "Connectez-vous pour créer et gérer vos propres projets."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${project.id}`}
              className="group bg-white rounded-xl border-2 border-[#e2e8f0] p-8 hover:shadow-lg transition-all hover:border-transparent"
              style={
                {
                  "--hover-border": project.color,
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e293b] group-hover:text-[#1e293b]">
                    {project.name}
                  </h2>
                  <p className="text-xs text-[#94a3b8]">{project.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-[#475569] mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.kpis.map((kpi) => (
                  <span
                    key={kpi.label}
                    className="text-xs bg-[#f1f5f9] text-[#475569] px-2 py-1 rounded-full"
                  >
                    {kpi.label}: <strong>{kpi.value}</strong>
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
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
              className="group bg-white rounded-xl border-2 border-dashed border-[#cbd5e1] p-8 hover:shadow-lg transition-all hover:border-[#3b82f6] flex flex-col items-center justify-center text-center"
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
