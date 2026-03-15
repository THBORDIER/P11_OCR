// ╔══════════════════════════════════════════════════════════════════╗
// ║  REGISTRE DES PROJETS — Ajoutez vos projets ici                ║
// ║  Chaque projet a un id unique utilisé dans l'URL               ║
// ╚══════════════════════════════════════════════════════════════════╝

export interface ProjectConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  author: string;
  organization: string;
  color: string; // couleur principale du projet
  context: {
    summary: string;
    kpis: { label: string; value: string; color: string }[];
  };
  stack: {
    name: string;
    tag: string;
    tagColor: { bg: string; text: string };
    description: string;
  }[];
  methodology: {
    framework: string;
    frameworkDescription: string;
    prioritization: string;
    prioritizationDescription: string;
  };
  phases: {
    label: string;
    duration: string;
    detail: string;
    color: string;
  }[];
  deliverables: {
    href: string;
    title: string;
    desc: string;
    status: string;
  }[];
  skills: string[];
  navItems: { href: string; label: string; icon: string }[];
}

// Import des projets
import { p11Config } from "./projects/p11-spartcrm";
import { templateConfig } from "./projects/template";

// ── Liste de tous les projets disponibles ──
export const projects: ProjectConfig[] = [p11Config, templateConfig];

// ── Helpers ──
export function getProject(id: string): ProjectConfig | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectOrThrow(id: string): ProjectConfig {
  const project = getProject(id);
  if (!project) throw new Error(`Projet introuvable : ${id}`);
  return project;
}
