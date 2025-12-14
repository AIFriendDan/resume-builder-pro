"use client";

import { useState } from "react";
import ResumeBuilder from "../../components/ResumeBuilder";

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [error, setError] = useState("");

  const handleTailor = async () => {
    if (!resumeText || !jobDescription) {
      alert("Resume and job description are required.");
      return;
    }

    setIsTailoring(true);
    setError("");
    setOptimizedResume("");

    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description_text: jobDescription,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to tailor resume.");
      }

      setOptimizedResume(data.optimized_resume || "");
    } catch (err) {
      console.error("Tailor request failed:", err);
      setError(err.message || "Failed to tailor resume.");
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <>
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-semibold text-slate-900">Tailor Your Resume</h1>
          <p className="text-slate-600 mt-2 mb-6">
            Use the tailoring endpoint to align your resume with a specific job description.
          </p>

          <div className="space-y-4">
            <textarea
              placeholder="Paste resume text here"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <textarea
              placeholder="Paste job description here"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              style={{ width: "100%", marginTop: "1rem" }}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <button
              onClick={handleTailor}
              disabled={isTailoring}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:bg-slate-400"
            >
              {isTailoring ? "Tailoring..." : "Tailor Resume"}
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {optimizedResume && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Optimized Resume</p>
                <textarea
                  value={optimizedResume}
                  readOnly
                  rows={12}
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg font-mono text-sm bg-emerald-50"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <ResumeBuilder />
    </>
  );
}