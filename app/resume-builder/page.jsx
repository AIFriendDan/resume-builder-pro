"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Personal Info", "Summary", "Skills"];

const emptyForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  skills: "",
};

export default function ResumeBuilderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const progress = (step / STEPS.length) * 100;

  const inp =
    "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-600/60 text-sm";
  const lbl = "block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5";

  const handleFinish = async () => {
    setSaving(true);
    try {
      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const content = {
        header: {
          name: form.name,
          title: form.title,
          email: form.email,
          phone: form.phone,
          location: form.location,
          linkedin: form.linkedin,
        },
        summary: form.summary,
        skills: skillsArray,
        experience: [],
        education: [],
        certifications: [],
        customSections: [],
      };

      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.name ? `${form.name}'s Resume` : "My Resume", content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save to database");

      // Persist locally so ResumeBuilder picks it up
      localStorage.setItem("dan-resume-data", JSON.stringify(content));
      router.push("/");
    } catch (err) {
      alert("Database Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Progress bar */}
      <div className="h-1.5 bg-white/5">
        <div
          className="h-full bg-red-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step label */}
          <p className="text-white/40 text-sm font-semibold uppercase tracking-widest mb-2">
            Step {step} of {STEPS.length}
          </p>
          <h1 className="text-3xl font-black text-red-500 mb-8">
            Step {step}: {STEPS[step - 1]}
          </h1>

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={lbl}>Full Name</label>
                <input className={inp} value={form.name} onChange={set("name")} placeholder="Jane Smith" />
              </div>
              <div>
                <label className={lbl}>Professional Title</label>
                <input className={inp} value={form.title} onChange={set("title")} placeholder="Senior Software Engineer" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Email</label>
                  <input className={inp} type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" />
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <input className={inp} value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Location</label>
                  <input className={inp} value={form.location} onChange={set("location")} placeholder="City, State" />
                </div>
                <div>
                  <label className={lbl}>LinkedIn</label>
                  <input className={inp} value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/yourname" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Summary */}
          {step === 2 && (
            <div>
              <label className={lbl}>Professional Summary</label>
              <textarea
                className={`${inp} h-48 resize-none`}
                value={form.summary}
                onChange={set("summary")}
                placeholder="Versatile professional with X years of experience in…"
              />
              <p className="text-xs text-white/30 mt-2 text-right">{form.summary.length} characters</p>
            </div>
          )}

          {/* Step 3 — Skills */}
          {step === 3 && (
            <div>
              <label className={lbl}>Skills (comma-separated)</label>
              <textarea
                className={`${inp} h-40 resize-none`}
                value={form.skills}
                onChange={set("skills")}
                placeholder="JavaScript, React, Node.js, SQL, AWS…"
              />
              <p className="text-xs text-white/30 mt-2">Separate each skill with a comma</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-white/50 hover:text-white transition-colors text-sm font-medium"
              >
                Back
              </button>
            )}
            {step < STEPS.length ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-sm"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-sm"
              >
                {saving ? "Saving..." : "Finish & Build Resume"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
