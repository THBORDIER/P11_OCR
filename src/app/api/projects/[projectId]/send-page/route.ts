import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { to, pageType } = await request.json();

  if (!to || !pageType) {
    return NextResponse.json({ error: "to et pageType requis" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY non configurée" }, { status: 500 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      personas: true,
      userStories: true,
      phases: { orderBy: { order: "asc" } },
      sprints: { include: { tasks: true } },
      testCases: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const subject = getSubject(pageType, project.name);
  const html = buildHtml(pageType, project);

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: to.split(",").map((e: string) => e.trim()),
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur d'envoi" },
      { status: 500 }
    );
  }
}

function getSubject(pageType: string, projectName: string): string {
  const titles: Record<string, string> = {
    analyse: "Analyse & Personas",
    backlog: "Product Backlog",
    roadmap: "Roadmap",
    sprints: "Sprint Backlog",
    recettage: "Recettage",
  };
  return `[${projectName}] ${titles[pageType] || pageType}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildHtml(pageType: string, project: any): string {
  const header = `
    <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px 40px;text-align:center;">
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 4px;">${project.name}</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">${getSubject(pageType, "").replace(/^\[.*?\]\s*/, "")}</p>
    </td></tr>`;

  const footer = `
    <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        Envoyé via <strong style="color:#64748b;">DevTracker</strong> — Outil de suivi de projets
      </p>
    </td></tr>`;

  let content = "";

  if (pageType === "analyse") {
    if (project.personas.length === 0) {
      content = `<p style="color:#64748b;font-size:14px;">Aucun persona généré.</p>`;
    } else {
      content = project.personas.map((p: { initials: string; nom: string; age: number; role: string; contexte: string; besoinPrincipal: string; frustration: string; objectif: string }) => `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;margin-bottom:12px;">
            <div style="width:40px;height:40px;background:#dbeafe;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;color:#2563eb;font-size:16px;margin-right:12px;">${p.initials}</div>
            <div>
              <div style="font-weight:700;color:#1e293b;font-size:15px;">${p.nom}</div>
              <div style="color:#64748b;font-size:12px;">${p.age} ans — ${p.role}</div>
            </div>
          </div>
          <table cellpadding="0" cellspacing="0" width="100%" style="font-size:13px;color:#475569;line-height:1.6;">
            <tr><td style="padding:4px 0;"><strong style="color:#334155;">Contexte :</strong> ${p.contexte}</td></tr>
            <tr><td style="padding:4px 0;"><strong style="color:#334155;">Besoin :</strong> ${p.besoinPrincipal}</td></tr>
            <tr><td style="padding:4px 0;"><strong style="color:#dc2626;">Frustration :</strong> ${p.frustration}</td></tr>
            <tr><td style="padding:4px 0;"><strong style="color:#166534;">Objectif :</strong> ${p.objectif}</td></tr>
          </table>
        </div>
      `).join("");
    }
  }

  if (pageType === "backlog") {
    if (project.userStories.length === 0) {
      content = `<p style="color:#64748b;font-size:14px;">Aucune User Story.</p>`;
    } else {
      const priorityColors: Record<string, string> = { Must: "#dc2626", Should: "#f59e0b", Could: "#3b82f6", Wont: "#94a3b8" };
      content = `
        <p style="color:#64748b;font-size:13px;margin:0 0 16px;">${project.userStories.length} User Stories</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <tr style="background:#f1f5f9;">
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">US</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">Priorité</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">Pts</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">Sprint</th>
          </tr>
          ${project.userStories.map((us: { titre: string; priorite: string; estimation: string; sprint: string }, i: number) => `
            <tr style="border-top:1px solid #e2e8f0;${i % 2 ? "background:#fafbfc;" : ""}">
              <td style="padding:10px 12px;font-size:13px;color:#1e293b;">${us.titre}</td>
              <td style="padding:10px 12px;"><span style="color:${priorityColors[us.priorite] || "#64748b"};font-size:12px;font-weight:600;">${us.priorite}</span></td>
              <td style="padding:10px 12px;font-size:13px;color:#3b82f6;font-weight:600;">${us.estimation}</td>
              <td style="padding:10px 12px;font-size:12px;color:#64748b;">${us.sprint || "—"}</td>
            </tr>
          `).join("")}
        </table>`;
    }
  }

  if (pageType === "roadmap") {
    if (project.phases.length === 0) {
      content = `<p style="color:#64748b;font-size:14px;">Aucune phase définie.</p>`;
    } else {
      const colors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e", "#ef4444", "#06b6d4"];
      content = project.phases.map((p: { phase: string; title: string; objectif: string; periode: string; fonctionnalites: string[] }, i: number) => `
        <div style="border-left:4px solid ${colors[i % colors.length]};padding:16px 20px;margin-bottom:16px;background:#f8fafc;border-radius:0 12px 12px 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div>
              <span style="color:${colors[i % colors.length]};font-size:11px;font-weight:700;text-transform:uppercase;">${p.phase}</span>
              <div style="font-size:15px;font-weight:700;color:#1e293b;margin-top:2px;">${p.title}</div>
            </div>
            <span style="color:#64748b;font-size:12px;">${p.periode || ""}</span>
          </div>
          <p style="color:#475569;font-size:13px;line-height:1.5;margin:0 0 8px;">${p.objectif}</p>
          ${(p.fonctionnalites || []).length > 0 ? `
            <div style="margin-top:8px;">
              ${p.fonctionnalites.map((f: string) => `<span style="display:inline-block;background:#e2e8f0;color:#334155;font-size:11px;padding:3px 8px;border-radius:4px;margin:2px 4px 2px 0;">${f}</span>`).join("")}
            </div>
          ` : ""}
        </div>
      `).join("");
    }
  }

  if (pageType === "sprints") {
    if (project.sprints.length === 0) {
      content = `<p style="color:#64748b;font-size:14px;">Aucun sprint.</p>`;
    } else {
      content = project.sprints.map((s: { nom: string; objectif: string; debut: string; fin: string; tasks: { titre: string; type: string; estimation: string; status: string }[] }) => {
        const done = s.tasks.filter((t) => t.status === "Termine").length;
        const pct = s.tasks.length > 0 ? Math.round((done / s.tasks.length) * 100) : 0;
        return `
          <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:20px;">
            <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:16px 20px;">
              <div style="color:#fff;font-size:16px;font-weight:700;">${s.nom}</div>
              <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">${s.objectif}</div>
              ${s.debut ? `<div style="color:rgba(255,255,255,0.6);font-size:11px;margin-top:4px;">${s.debut} → ${s.fin}</div>` : ""}
            </div>
            <div style="padding:16px 20px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;">
                  <div style="height:100%;background:#22c55e;width:${pct}%;border-radius:3px;"></div>
                </div>
                <span style="font-size:12px;color:#64748b;font-weight:600;">${done}/${s.tasks.length}</span>
              </div>
              ${s.tasks.map((t) => {
                const statusColor = t.status === "Termine" ? "#22c55e" : t.status === "En cours" ? "#3b82f6" : "#94a3b8";
                return `
                  <div style="display:flex;align-items:center;padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;">
                    <span style="width:8px;height:8px;border-radius:50%;background:${statusColor};margin-right:10px;flex-shrink:0;"></span>
                    <span style="flex:1;color:#1e293b;">${t.titre}</span>
                    <span style="color:#64748b;font-size:11px;margin:0 8px;">${t.type}</span>
                    <span style="color:#3b82f6;font-size:11px;font-weight:600;">${t.estimation}</span>
                  </div>`;
              }).join("")}
            </div>
          </div>`;
      }).join("");
    }
  }

  if (pageType === "recettage") {
    if (project.testCases.length === 0) {
      content = `<p style="color:#64748b;font-size:14px;">Aucun cas de test.</p>`;
    } else {
      const statusColors: Record<string, string> = { OK: "#22c55e", KO: "#dc2626", "A tester": "#94a3b8", "A retester": "#f59e0b", "En cours": "#3b82f6" };
      const ok = project.testCases.filter((t: { statut: string }) => t.statut === "OK").length;
      const ko = project.testCases.filter((t: { statut: string }) => t.statut === "KO").length;
      content = `
        <div style="display:flex;gap:16px;margin-bottom:20px;">
          <div style="background:#f0fdf4;border-radius:8px;padding:12px 20px;text-align:center;flex:1;">
            <div style="font-size:24px;font-weight:700;color:#22c55e;">${ok}</div>
            <div style="font-size:11px;color:#64748b;">OK</div>
          </div>
          <div style="background:#fef2f2;border-radius:8px;padding:12px 20px;text-align:center;flex:1;">
            <div style="font-size:24px;font-weight:700;color:#dc2626;">${ko}</div>
            <div style="font-size:11px;color:#64748b;">KO</div>
          </div>
          <div style="background:#f1f5f9;border-radius:8px;padding:12px 20px;text-align:center;flex:1;">
            <div style="font-size:24px;font-weight:700;color:#1e293b;">${project.testCases.length}</div>
            <div style="font-size:11px;color:#64748b;">Total</div>
          </div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <tr style="background:#f1f5f9;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;">US</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;">Action</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;">Attendu</th>
            <th style="padding:8px 12px;text-align:center;font-size:11px;color:#64748b;font-weight:600;">Statut</th>
          </tr>
          ${project.testCases.map((tc: { us: string; action: string; attendu: string; statut: string }, i: number) => `
            <tr style="border-top:1px solid #e2e8f0;${i % 2 ? "background:#fafbfc;" : ""}">
              <td style="padding:8px 12px;font-size:12px;color:#1e293b;">${tc.us}</td>
              <td style="padding:8px 12px;font-size:12px;color:#475569;">${tc.action}</td>
              <td style="padding:8px 12px;font-size:12px;color:#475569;">${tc.attendu}</td>
              <td style="padding:8px 12px;text-align:center;">
                <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;color:#fff;background:${statusColors[tc.statut] || "#94a3b8"};">${tc.statut}</span>
              </td>
            </tr>
          `).join("")}
        </table>`;
    }
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        ${header}
        <tr><td style="padding:32px 40px;">
          ${content}
        </td></tr>
        ${footer}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
