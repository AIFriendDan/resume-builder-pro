import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl text-center space-y-6">
        <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
          Resume Builder Pro
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Craft polished, ATS-ready resumes without leaving your browser.
        </h1>
        <p className="text-lg text-slate-600">
          Import an existing resume, tailor it to new roles, generate AI cover letters, and export to PDF or Word.
          Your work stays cached locally so you never lose progress.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/resume"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Open the Builder
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-blue-700 font-medium border border-blue-200 hover:border-blue-400"
          >
            View Demo
          </Link>
        </div>
      </div>
    </main>
  );
}