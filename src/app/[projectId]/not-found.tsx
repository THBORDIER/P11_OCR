import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-3">
          Projet introuvable
        </h1>
        <p className="text-[#64748b] mb-6">
          Ce projet n&apos;existe pas ou vous n&apos;avez pas les droits pour y accéder.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
        >
          &larr; Retour aux projets
        </Link>
      </div>
    </div>
  );
}
