'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Download, Plus, Trash2, FileText, Loader2, CheckCircle, Sparkles,
  BookOpen, ArrowUp, TrendingUp, ChevronRight,
  User, Briefcase, Zap, GraduationCap, Award, AlignLeft, Mail, Check,
  GripVertical, Lock
} from './icons';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DEFAULT_SECTION_ORDER, SECTION_META, normalizeSectionOrder } from '../lib/sections';

// ── Additional Links helpers ─────────────────────────────────
const LINK_SUGGESTIONS = ['GitHub', 'Portfolio', 'Website', 'Publications'];
const stripProtocol = (url) => (url || '').replace(/^https?:\/\//i, '');
const toHref = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
const getValidLinks = (links) => (links || []).filter(l => l.label?.trim() && l.url?.trim());

// ── Sortable section row (module scope — stable identity for dnd-kit) ──
const SortableSectionRow = ({ id, label, subtitle, step, active, done, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center">
      <button
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="px-1.5 py-2.5 text-pro-muted hover:text-pro-sub cursor-grab active:cursor-grabbing touch-none shrink-0"
      >
        <GripVertical size={14} />
      </button>
      <button
        onClick={onClick}
        className={`relative flex items-center gap-3 flex-1 min-w-0 pr-3 py-2.5 text-left transition-all border-l-2
          ${active
            ? 'bg-pro-elevated border-pro-gold'
            : 'border-transparent hover:bg-pro-elevated/40 hover:border-pro-border'}`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all
          ${active ? 'bg-pro-gold text-pro-base' :
            done  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    'bg-pro-card border border-pro-border text-pro-muted'}`}
        >
          {done && !active ? <Check size={12} /> : step}
        </div>
        <div className="min-w-0">
          <div className={`text-sm font-semibold truncate ${active ? 'text-pro-gold' : 'text-pro-text'}`}>{label}</div>
          <div className="text-[11px] text-pro-muted truncate">{subtitle}</div>
        </div>
        {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-pro-gold rounded-l-full" />}
      </button>
    </div>
  );
};

const ResumeBuilder = () => {
  const defaultData = {
    header: {
      name: "Dan Garza",
      title: "Technical Support Strategist",
      location: "Ventura, CA",
      phone: "805-616-4676",
      email: "danraygarza490@gmail.com",
      linkedin: "linkedin.com/in/dan-garza-mba490"
    },
    additionalLinks: [],
    sectionOrder: DEFAULT_SECTION_ORDER,
    summary: "Versatile IT operations professional with 10+ years of experience in Microsoft 365 administration, technical documentation, and process automation. Skilled in Exchange Admin, OneDrive Admin, Teams, and SharePoint governance. Experienced in Jira administration (dashboards, Kanban boards, workflow schemes), Confluence knowledge base management, and automation with PowerShell and Power Automate. Adept at Slack and LastPass administration, Okta identity management, and Microsoft MFA security enforcement. Proven ability to translate complex systems into clear documentation and training resources that drive adoption and efficiency. Specialized in platform stewardship, documentation ownership, and process improvement.",
    customSections: [],
    skills: [
      "Microsoft 365 Administration (Teams, SharePoint, Exchange Admin, OneDrive Admin)",
      "Jira Administration (Dashboards, Kanban Boards, Workflow Schemes)",
      "Confluence Knowledge Base Management",
      "PowerShell & Power Automate Workflow Automation",
      "SharePoint Site Design & Governance",
      "Slack Administration & Enablement",
      "LastPass Administration & Credential Governance",
      "Okta Administration & Identity Management",
      "Microsoft MFA Administration & Security Policy Enforcement",
      "ITIL V4 & Agile Methodologies",
      "Active Directory, Jira Service Desk, ServiceNow, Ivanti, ManageEngine, Zendesk",
      "Ticket Workflow Optimization & Escalation Management"
    ],
    experience: [
      {
        id: 1,
        company: "Avantor",
        title: "Lead Administrator, IT Ops Site Services",
        location: "",
        startDate: "October 2024",
        endDate: "September 2025",
        bullets: [
          "Led IT operations across 3 global sites supporting 500+ users; ensured 99.9% uptime",
          "Automated onboarding with PowerShell scripts and digital playbooks, achieving 100% Day-One readiness",
          "Introduced Agile workflows and automated triage, reducing resolution time by 30%",
          "Administered Microsoft 365 (Exchange, OneDrive, Teams, SharePoint) and Jira (dashboards, Kanban boards, workflows)",
          "Authored Confluence pages to support repeatable processes and cross-team enablement"
        ]
      },
      {
        id: 2,
        company: "AeroVironment",
        title: "Service Desk Coordinator | IT Support Analyst",
        location: "",
        startDate: "June 2023",
        endDate: "September 2024",
        bullets: [
          "Reduced ERP ticket backlog by 40% through analytics and workflow refinement",
          "Designed custom service desk widget for enhanced visibility across Jira Service Desk and Zendesk",
          "Facilitated Agile standups and sprint cycles to improve team responsiveness",
          "Authored Confluence documentation and standardized support procedures",
          "Supported Microsoft 365 integrations and user enablement initiatives"
        ]
      },
      {
        id: 3,
        company: "Teladoc Health",
        title: "Technical Lead | Knowledge Management | IT Documentation",
        location: "",
        startDate: "January 2020",
        endDate: "March 2023",
        bullets: [
          "Improved help desk efficiency by 25% via process reengineering and escalation protocols",
          "Led rebranding initiative to position Service Desk as IT Business Partner, aligning support with enterprise goals",
          "Designed and launched global Confluence knowledge base serving 4,000+ users",
          "Documented 200+ runbooks and led knowledge management initiatives",
          "Administered Slack, LastPass, Okta, and Microsoft MFA platforms to support secure collaboration and identity management",
          "Delivered training on Microsoft 365 tools, including Teams and SharePoint"
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: "Master of Business Administration",
        institution: "University of Phoenix",
        startDate: "January 2023",
        endDate: "May 2024"
      },
      {
        id: 2,
        degree: "Bachelor of Science in Information Technology",
        institution: "University of Phoenix",
        startDate: "January 2021",
        endDate: "January 2023"
      }
    ],
    certifications: [
      "Foundations of Leadership Certificate 1 & 2 - National Society of Leadership and Success - August 2023",
      "Executive Presence on Video Calls - LinkedIn - April 2022"
    ]
  };

  // ── State ──────────────────────────────────────────────────
  const [resumeData, setResumeData] = useState(defaultData);
  const [template] = useState('modern');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [autoSave, setAutoSave] = useState(true);
  const [coverLetterData, setCoverLetterData] = useState({ jobTitle: '', company: '', hiringManager: '', content: '' });
  const [showImportResume, setShowImportResume] = useState(false);
  const [importedResumeText, setImportedResumeText] = useState('');
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredData, setTailoredData] = useState(null);
  const [enhancingBullet, setEnhancingBullet] = useState(null);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [activeTab, setActiveTab] = useState('header');
  const [showIntro, setShowIntro] = useState(false);

  // ── Preview scaling ────────────────────────────────────────
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.48);

  useEffect(() => {
    const update = () => {
      if (previewContainerRef.current) {
        const w = previewContainerRef.current.clientWidth - 32;
        setPreviewScale(Math.max(0.28, Math.min(w / 816, 1)));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Load / auto-save ───────────────────────────────────────
  useEffect(() => {
    try {
      const local = localStorage.getItem('dan-resume-data');
      if (local) {
        const parsed = JSON.parse(local);
        if (!parsed.customSections) parsed.customSections = [];
        if (!parsed.additionalLinks) parsed.additionalLinks = [];
        parsed.sectionOrder = normalizeSectionOrder(parsed.sectionOrder);
        setResumeData(parsed);
      }
      if (!localStorage.getItem('has-seen-intro')) setShowIntro(true);
    } catch { /* use defaults */ }
  }, []);

  const saveData = async (data) => {
    if (!autoSave) { setSaveStatus('unsaved'); return; }
    setSaveStatus('saving');
    try {
      localStorage.setItem('dan-resume-data', JSON.stringify(data));
      setSaveStatus('saved');
    } catch { setSaveStatus('error'); }
  };

  const closeIntro = () => {
    setShowIntro(false);
    localStorage.setItem('has-seen-intro', 'true');
  };

  // ── Field updaters ────────────────────────────────────────
  const updateField = (section, field, value) => {
    const d = { ...resumeData };
    if (section === 'header') d.header[field] = value;
    else if (section === 'summary') d.summary = value;
    setResumeData(d); saveData(d);
  };

  const addSkill = () => { const d = { ...resumeData }; d.skills.push("New Skill"); setResumeData(d); saveData(d); };
  const updateSkill = (i, v) => { const d = { ...resumeData }; d.skills[i] = v; setResumeData(d); saveData(d); };
  const deleteSkill = (i) => { const d = { ...resumeData }; d.skills.splice(i, 1); setResumeData(d); saveData(d); };

  const addExperience = () => {
    const d = { ...resumeData };
    d.experience.push({ id: Date.now(), company: "Company Name", title: "Job Title", location: "", startDate: "Month Year", endDate: "Month Year", bullets: ["Achievement or responsibility"] });
    setResumeData(d); saveData(d);
  };
  const updateExperience = (id, field, value) => { const d = { ...resumeData }; const e = d.experience.find(x => x.id === id); if (e) e[field] = value; setResumeData(d); saveData(d); };
  const addBullet = (expId) => { const d = { ...resumeData }; const e = d.experience.find(x => x.id === expId); if (e) e.bullets.push("New achievement"); setResumeData(d); saveData(d); };
  const updateBullet = (expId, idx, value) => { const d = { ...resumeData }; const e = d.experience.find(x => x.id === expId); if (e) e.bullets[idx] = value; setResumeData(d); saveData(d); };
  const deleteBullet = (expId, idx) => { const d = { ...resumeData }; const e = d.experience.find(x => x.id === expId); if (e) e.bullets.splice(idx, 1); setResumeData(d); saveData(d); };
  const deleteExperience = (id) => { const d = { ...resumeData }; d.experience = d.experience.filter(e => e.id !== id); setResumeData(d); saveData(d); };

  const addEducation = () => { const d = { ...resumeData }; d.education.push({ id: Date.now(), degree: "Degree", institution: "University", startDate: "Start Date", endDate: "End Date" }); setResumeData(d); saveData(d); };
  const updateEducation = (id, field, value) => { const d = { ...resumeData }; const e = d.education.find(x => x.id === id); if (e) e[field] = value; setResumeData(d); saveData(d); };
  const deleteEducation = (id) => { const d = { ...resumeData }; d.education = d.education.filter(e => e.id !== id); setResumeData(d); saveData(d); };

  const addCertification = () => { const d = { ...resumeData }; d.certifications.push("New Certification"); setResumeData(d); saveData(d); };
  const updateCertification = (i, v) => { const d = { ...resumeData }; d.certifications[i] = v; setResumeData(d); saveData(d); };
  const deleteCertification = (i) => { const d = { ...resumeData }; d.certifications.splice(i, 1); setResumeData(d); saveData(d); };

  const addCustomSection = () => { const d = { ...resumeData }; d.customSections.push({ id: Date.now(), title: "Custom Section", items: ["Item 1"] }); setResumeData(d); saveData(d); };
  const updateCustomSection = (id, field, value) => { const d = { ...resumeData }; const s = d.customSections.find(x => x.id === id); if (s) s[field] = value; setResumeData(d); saveData(d); };
  const deleteCustomSection = (id) => { const d = { ...resumeData }; d.customSections = d.customSections.filter(s => s.id !== id); setResumeData(d); saveData(d); };
  const addCustomItem = (sid) => { const d = { ...resumeData }; const s = d.customSections.find(x => x.id === sid); if (s) s.items.push("New item"); setResumeData(d); saveData(d); };
  const updateCustomItem = (sid, idx, v) => { const d = { ...resumeData }; const s = d.customSections.find(x => x.id === sid); if (s) s.items[idx] = v; setResumeData(d); saveData(d); };
  const deleteCustomItem = (sid, idx) => { const d = { ...resumeData }; const s = d.customSections.find(x => x.id === sid); if (s) s.items.splice(idx, 1); setResumeData(d); saveData(d); };

  // ── Additional Links ───────────────────────────────────────
  const addLink = () => { const d = { ...resumeData }; d.additionalLinks = [...(d.additionalLinks || []), { id: Date.now(), label: "", url: "" }]; setResumeData(d); saveData(d); };
  const updateLink = (id, field, value) => { const d = { ...resumeData }; d.additionalLinks = d.additionalLinks.map(l => l.id === id ? { ...l, [field]: value } : l); setResumeData(d); saveData(d); };
  const deleteLink = (id) => { const d = { ...resumeData }; d.additionalLinks = d.additionalLinks.filter(l => l.id !== id); setResumeData(d); saveData(d); };

  // ── Section reordering ─────────────────────────────────────
  const sectionSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const sortableIds = resumeData.sectionOrder.filter(id => id !== 'identity');
    const oldIndex = sortableIds.indexOf(active.id);
    const newIndex = sortableIds.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(sortableIds, oldIndex, newIndex);
    const d = { ...resumeData, sectionOrder: normalizeSectionOrder(['identity', ...reordered]) };
    setResumeData(d); saveData(d);
  };

  // ── AI actions ────────────────────────────────────────────
  const enhanceBullet = async (expId, bulletIdx) => {
    const exp = resumeData.experience.find(e => e.id === expId);
    if (!exp) return;
    setEnhancingBullet(`${expId}-${bulletIdx}`);
    try {
      const res = await fetch('/api/enhance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: exp.bullets[bulletIdx], role: exp.title, company: exp.company }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.output) updateBullet(expId, bulletIdx, data.output);
    } catch { alert('Failed to enhance bullet point'); }
    finally { setEnhancingBullet(null); }
  };

  const generateCoverLetter = async () => {
    if (!coverLetterData.jobTitle || !coverLetterData.company) { alert('Please enter Job Title and Company Name'); return; }
    setIsGeneratingCoverLetter(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: coverLetterData.jobTitle, company: coverLetterData.company, hiringManager: coverLetterData.hiringManager, resumeSummary: resumeData.summary, experience: resumeData.experience.slice(0, 3).map(e => `${e.title} at ${e.company}: ${e.bullets.slice(0, 2).join('. ')}`).join('\n'), skills: resumeData.skills.slice(0, 10).join(', ') })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoverLetterData(prev => ({ ...prev, content: data.content }));
    } catch { alert('Failed to generate cover letter'); }
    finally { setIsGeneratingCoverLetter(false); }
  };

  const analyzeImportedResume = async () => {
    if (!importedResumeText.trim()) { alert('Please paste resume text first'); return; }
    setAnalyzingResume(true);
    try {
      const res = await fetch('/api/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: importedResumeText }) });
      const parsed = await res.json();
      if (!res.ok) throw new Error(parsed.error);
      setAnalyzedData(parsed);
    } catch { alert('Failed to analyze resume.'); }
    finally { setAnalyzingResume(false); }
  };

  const applyResumeUpdates = () => {
    if (!analyzedData) return;
    const d = { ...resumeData };
    if (analyzedData.title) d.header.title = analyzedData.title;
    if (analyzedData.summary) d.summary = analyzedData.summary;
    if (analyzedData.skills?.length) d.skills = analyzedData.skills;
    if (analyzedData.experience?.length) d.experience = analyzedData.experience.map((exp, idx) => ({ id: Date.now() + idx, company: exp.company || "Company", title: exp.title || "Title", location: exp.location || "", startDate: exp.startDate || "", endDate: exp.endDate || "", bullets: exp.bullets || [] }));
    setResumeData(d); saveData(d);
    setShowImportResume(false); setImportedResumeText(''); setAnalyzedData(null);
    alert('Resume updated successfully!');
  };

  const handleTailorResume = async () => {
    const pane = document.getElementById('editor-scroll-pane');
    if (pane) pane.scrollTo({ top: 0, behavior: 'smooth' });
    if (!jobDescription.trim()) { alert('Please paste a job description first'); return; }
    setIsTailoring(true);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume: { title: resumeData.header.title, summary: resumeData.summary, skills: resumeData.skills, experience: resumeData.experience.map(e => ({ company: e.company, title: e.title, bullets: e.bullets })) } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTailoredData(data);
      setTimeout(() => { const p = document.getElementById('editor-scroll-pane'); if (p) p.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
    } catch (e) { alert('Failed to tailor resume: ' + e.message); }
    finally { setIsTailoring(false); }
  };

  const applyTailoring = () => {
    if (!tailoredData) return;
    const d = { ...resumeData };
    if (tailoredData.tailored_content?.summary) d.summary = tailoredData.tailored_content.summary;
    if (tailoredData.current_analysis?.missing_keywords?.length) {
      const newSkills = tailoredData.current_analysis.missing_keywords.filter(s => !d.skills.includes(s));
      d.skills = [...d.skills, ...newSkills];
    }
    setResumeData(d); saveData(d);
    setTailoredData({ ...tailoredData, current_analysis: { ...tailoredData.current_analysis, match_score: tailoredData.projected_analysis.match_score, impact_score: tailoredData.projected_analysis.impact_score, missing_keywords: [], executive_summary: "Great job! You've integrated the critical keywords and optimized your summary. Your resume is now highly competitive for this role." }, projected_analysis: { match_score: tailoredData.projected_analysis.match_score, impact_score: tailoredData.projected_analysis.impact_score } });
    alert('Improvements applied! Your Match Score has been updated.');
    setTimeout(() => { const p = document.getElementById('editor-scroll-pane'); if (p) p.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
  };

  const exportToPDF = () => {
    try {
      const s = document.createElement('style');
      s.id = 'print-styles';
      s.textContent = `@media print { body * { visibility: hidden; } #preview-wrapper, #preview-wrapper * { visibility: visible; } #preview-wrapper { position: absolute; left: 0; top: 0; zoom: 1 !important; width: auto !important; margin: 0 !important; padding: 0 !important; } #resume-preview { box-shadow: none !important; } }`;
      document.head.appendChild(s);
      window.print();
      setTimeout(() => { const el = document.getElementById('print-styles'); if (el) el.remove(); }, 1000);
    } catch { alert('Print dialog failed. Please use Ctrl+P.'); }
  };

  const exportToWord = () => {
    try {
      const html = document.getElementById('resume-preview').innerHTML;
      if (!html) return;
      const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>${html}</body></html>`;
      const blob = new Blob(['﻿', doc], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${resumeData.header.name.replace(/\s+/g, '_')}_Resume.doc`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (e) { console.error('Export failed:', e); }
  };

  // ── Step helpers ──────────────────────────────────────────
  const isStepComplete = (tabId) => {
    switch (tabId) {
      case 'header':         return !!(resumeData.header.name && resumeData.header.email);
      case 'summary':        return resumeData.summary.length > 50;
      case 'experience':     return resumeData.experience.length > 0;
      case 'skills':         return resumeData.skills.length > 0;
      case 'education':      return resumeData.education.length > 0;
      case 'certifications': return resumeData.certifications.length > 0;
      case 'custom':         return true;
      case 'cover-letter':   return !!coverLetterData.content;
      case 'tailor':         return !!tailoredData;
      default:               return false;
    }
  };

  // ── Resume templates (print output) ────────────────────────
  // Render contract: sectionOrder is the single source of truth. Each template
  // maps sectionId -> block once, then iterates sectionOrder. PDF/Word exports
  // capture this same rendered DOM, so they automatically follow the order too.
  const validLinks = getValidLinks(resumeData.additionalLinks);
  const sortableSectionIds = resumeData.sectionOrder.filter(id => id !== 'identity');

  const ModernTemplate = () => {
    const blocks = {
      summary: <div className="mb-4"><h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Professional Summary</h3><p className="text-sm text-justify leading-relaxed">{resumeData.summary}</p></div>,
      skills: <div className="mb-4"><h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Core Competencies</h3><div className="grid grid-cols-2 gap-x-4 gap-y-1">{resumeData.skills.map((s, i) => <div key={i} className="text-sm">- {s}</div>)}</div></div>,
      experience: <div className="mb-4"><h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Professional Experience</h3>{resumeData.experience.map(exp => (<div key={exp.id} className="mb-3"><div className="flex justify-between items-baseline mb-1"><span className="font-bold text-sm">{exp.company}</span><span className="text-xs italic text-gray-600">{exp.startDate} - {exp.endDate}</span></div><div className="italic text-sm text-gray-700 mb-1">{exp.title}</div><ul className="ml-4">{exp.bullets.map((b, i) => <li key={i} className="text-sm mb-1">- {b}</li>)}</ul></div>))}</div>,
      education: <div className="mb-4"><h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Education</h3>{resumeData.education.map(edu => <div key={edu.id} className="text-sm mb-1"><span className="font-bold">{edu.degree}</span> - <span className="italic">{edu.institution}</span> - {edu.startDate} - {edu.endDate}</div>)}</div>,
      certifications: <div className="mb-4"><h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Certifications</h3>{resumeData.certifications.map((c, i) => <div key={i} className="text-sm mb-1">- {c}</div>)}</div>,
      custom: resumeData.customSections?.map(sec => (<div key={sec.id} className="mt-4"><h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">{sec.title}</h3>{sec.items.map((item, i) => <div key={i} className="text-sm mb-1">- {item}</div>)}</div>)),
    };
    return (
      <div id="resume-preview" className="bg-white p-8 shadow-lg text-left" style={{ width: '8.5in', minHeight: '11in' }}>
        <div className="text-center border-b-2 border-blue-900 pb-4 mb-4">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">{resumeData.header.name}</h1>
          <h2 className="text-lg text-gray-700 mb-2">{resumeData.header.title}</h2>
          <p className="text-sm text-gray-600">{resumeData.header.location} | {resumeData.header.phone} | {resumeData.header.email}<br />
            {resumeData.header.linkedin}
            {validLinks.map(l => <React.Fragment key={l.id}> | <a href={toHref(l.url)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{stripProtocol(l.url)}</a></React.Fragment>)}
          </p>
        </div>
        {sortableSectionIds.map(id => <React.Fragment key={id}>{blocks[id]}</React.Fragment>)}
      </div>
    );
  };

  const ClassicTemplate = () => {
    const blocks = {
      summary: <div className="mb-4"><h3 className="text-sm font-bold uppercase mb-2">Professional Summary</h3><p className="text-sm text-justify leading-relaxed">{resumeData.summary}</p></div>,
      skills: <div className="mb-4"><h3 className="text-sm font-bold uppercase mb-2">Core Competencies</h3><div className="grid grid-cols-2 gap-x-4 gap-y-1">{resumeData.skills.map((s, i) => <div key={i} className="text-sm">- {s}</div>)}</div></div>,
      experience: <div className="mb-4"><h3 className="text-sm font-bold uppercase mb-2">Professional Experience</h3>{resumeData.experience.map(exp => (<div key={exp.id} className="mb-3"><div className="flex justify-between items-baseline"><span className="font-bold text-sm">{exp.company}</span><span className="text-xs italic">{exp.startDate} - {exp.endDate}</span></div><div className="italic text-sm mb-1">{exp.title}</div><ul className="ml-4">{exp.bullets.map((b, i) => <li key={i} className="text-sm mb-1">- {b}</li>)}</ul></div>))}</div>,
      education: <div className="mb-4"><h3 className="text-sm font-bold uppercase mb-2">Education</h3>{resumeData.education.map(edu => <div key={edu.id} className="text-sm mb-1"><span className="font-bold">{edu.degree}</span> - <span className="italic">{edu.institution}</span> - {edu.startDate} - {edu.endDate}</div>)}</div>,
      certifications: <div className="mb-4"><h3 className="text-sm font-bold uppercase mb-2">Certifications</h3>{resumeData.certifications.map((c, i) => <div key={i} className="text-sm mb-1">- {c}</div>)}</div>,
      custom: resumeData.customSections?.map(sec => (<div key={sec.id} className="mt-4"><h3 className="text-sm font-bold uppercase mb-2">{sec.title}</h3>{sec.items.map((item, i) => <div key={i} className="text-sm mb-1">- {item}</div>)}</div>)),
    };
    return (
      <div id="resume-preview" className="bg-white p-8 shadow-lg text-left" style={{ width: '8.5in', minHeight: '11in' }}>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-1">{resumeData.header.name}</h1>
          <p className="text-sm">
            {resumeData.header.location} | {resumeData.header.phone} | {resumeData.header.email} | {resumeData.header.linkedin}
            {validLinks.map(l => <React.Fragment key={l.id}> | <a href={toHref(l.url)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{stripProtocol(l.url)}</a></React.Fragment>)}
          </p>
        </div>
        <hr className="border-t-2 border-black mb-4" />
        {sortableSectionIds.map(id => <React.Fragment key={id}>{blocks[id]}</React.Fragment>)}
      </div>
    );
  };

  const ATSTemplate = () => {
    const blocks = {
      summary: <div className="mb-3"><h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Profile</h3><p className="text-xs leading-relaxed">{resumeData.summary}</p></div>,
      skills: <div className="mb-3"><h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Skills</h3><ul className="ml-4">{resumeData.skills.map((s, i) => <li key={i} className="text-xs mb-1">- {s}</li>)}</ul></div>,
      experience: <div className="mb-3"><h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Professional Experience</h3>{resumeData.experience.map(exp => (<div key={exp.id} className="mb-3"><div className="flex justify-between items-baseline"><span className="font-bold text-xs">{exp.company}</span><span className="text-xs italic">{exp.startDate} - {exp.endDate}</span></div><div className="italic text-xs mb-1">{exp.title}</div><ul className="ml-4">{exp.bullets.map((b, i) => <li key={i} className="text-xs mb-1">- {b}</li>)}</ul></div>))}</div>,
      education: <div className="mb-3"><h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Education</h3>{resumeData.education.map(edu => <div key={edu.id} className="text-xs mb-1"><span className="font-bold">{edu.degree}</span> - <span className="italic">{edu.institution}</span> - {edu.startDate} - {edu.endDate}</div>)}</div>,
      certifications: <div className="mb-3"><h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Certifications</h3>{resumeData.certifications.map((c, i) => <div key={i} className="text-xs mb-1">- {c}</div>)}</div>,
      custom: resumeData.customSections?.map(sec => (<div key={sec.id} className="mb-3"><h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">{sec.title}</h3>{sec.items.map((item, i) => <div key={i} className="text-xs mb-1">- {item}</div>)}</div>)),
    };
    return (
      <div id="resume-preview" className="bg-white p-8 shadow-lg text-left" style={{ width: '8.5in', minHeight: '11in' }}>
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">{resumeData.header.name}</h1>
          <h2 className="text-base font-semibold text-gray-700 mb-2">{resumeData.header.title}</h2>
          <div className="text-xs leading-relaxed">
            <div>{resumeData.header.location}</div>
            <div>Phone: {resumeData.header.phone}</div>
            <div>Email: {resumeData.header.email}</div>
            <div>LinkedIn: {resumeData.header.linkedin}</div>
            {validLinks.map(l => <div key={l.id}>{l.label}: <a href={toHref(l.url)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{stripProtocol(l.url)}</a></div>)}
          </div>
        </div>
        <hr className="border-t border-gray-400 mb-3" />
        {sortableSectionIds.map(id => <React.Fragment key={id}>{blocks[id]}</React.Fragment>)}
      </div>
    );
  };

  // ── Step / tab config — derived from sectionOrder (single source of truth) ──
  const SECTION_ICONS = { identity: User, summary: AlignLeft, experience: Briefcase, skills: Zap, education: GraduationCap, certifications: Award, custom: Plus };
  const sectionIdToTabId = (sid) => sid === 'identity' ? 'header' : sid;
  const resumeSteps = resumeData.sectionOrder.map((sid, i) => ({
    id: sectionIdToTabId(sid),
    sectionId: sid,
    label: SECTION_META[sid].label,
    subtitle: SECTION_META[sid].subtitle,
    icon: SECTION_ICONS[sid],
    step: i + 1,
  }));
  const proTools = [
    { id: 'cover-letter', label: 'Cover Letter', subtitle: 'AI-generated letter', icon: Mail },
    { id: 'tailor',       label: 'AI Tailor',    subtitle: 'Beat the ATS system',  icon: Sparkles },
  ];
  const allTabs = [...resumeSteps, ...proTools];
  const currentTabIdx = allTabs.findIndex(t => t.id === activeTab);
  const nextTab = allTabs[currentTabIdx + 1];
  const stepLabel = (tabId) => {
    const step = resumeSteps.find(s => s.id === tabId);
    return step ? `${step.step} of ${resumeSteps.length}` : undefined;
  };

  // ── Style constants ───────────────────────────────────────
  const inp = "w-full px-3 py-2.5 bg-pro-base border border-pro-border rounded-lg text-pro-text placeholder:text-pro-muted focus:outline-none focus:ring-2 focus:ring-pro-gold/40 focus:border-pro-gold/60 transition-colors text-sm";
  const lbl = "block text-xs font-semibold text-pro-sub uppercase tracking-wider mb-1.5";
  const card = "bg-pro-card border border-pro-border rounded-xl p-5";

  // ── Section header renderer ───────────────────────────────
  const SectionHeader = ({ icon: Icon, title, subtitle, step }: { icon: any, title: string, subtitle: string, step?: string }) => (
    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-pro-border">
      <div className="w-12 h-12 rounded-xl bg-pro-elevated border border-pro-border flex items-center justify-center text-pro-gold shrink-0">
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-pro-text">{title}</h2>
        <p className="text-pro-sub text-sm mt-0.5">{subtitle}</p>
      </div>
      {step && (
        <span className="shrink-0 text-xs font-bold text-pro-gold bg-pro-elevated px-2.5 py-1 rounded-full border border-pro-border tracking-wide">
          STEP {step}
        </span>
      )}
    </div>
  );

  // ── Next-step CTA ─────────────────────────────────────────
  const NextStep = () => {
    if (!nextTab) return null;
    return (
      <div className="mt-10 pt-6 border-t border-pro-border">
        <button
          onClick={() => setActiveTab(nextTab.id)}
          className="flex items-center gap-2 text-pro-sub hover:text-pro-gold transition-colors text-sm font-medium group"
        >
          <span>Continue to <span className="text-pro-text font-semibold">{nextTab.label}</span></span>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  };

  // ── Intro modal ───────────────────────────────────────────
  const IntroModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-pro-card border border-pro-border rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-pro-gold rounded-xl flex items-center justify-center">
            <span className="text-pro-base font-black text-sm">RB</span>
          </div>
          <div>
            <div className="text-lg font-bold text-pro-text">Resume Builder</div>
            <div className="text-xs text-pro-gold font-bold tracking-widest uppercase">Pro</div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-pro-text mb-2">Build your winning resume</h2>
        <p className="text-pro-sub mb-8">Follow the steps on the left — fill in each section, then use AI tools to maximize your interview odds.</p>
        <div className="space-y-4 mb-8">
          {[
            { icon: User, color: 'text-pro-gold', bg: 'bg-pro-elevated', label: '1. Fill in your sections', desc: 'Work through Identity → Summary → Experience → Skills → Education' },
            { icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-950/40', label: '2. Tailor with AI', desc: 'Paste any job description and get a match score + ATS keyword gaps' },
            { icon: Download, color: 'text-emerald-400', bg: 'bg-emerald-950/40', label: '3. Export & apply', desc: 'Download as PDF or Word and send it out' },
          ].map(({ icon: Ic, color, bg, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`${bg} border border-pro-border p-2 rounded-lg ${color} shrink-0`}><Ic size={18} /></div>
              <div><p className="font-semibold text-pro-text text-sm">{label}</p><p className="text-pro-muted text-xs mt-0.5">{desc}</p></div>
            </div>
          ))}
        </div>
        <button onClick={closeIntro} className="w-full bg-pro-gold text-pro-base py-3 rounded-xl font-bold hover:bg-pro-gold-dim transition-colors">
          Start Building
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <div className="h-screen bg-pro-base flex flex-col font-sans text-pro-text overflow-hidden" style={{ minWidth: '1060px' }}>

      {/* ── Header ── */}
      <header className="h-14 shrink-0 bg-pro-surface border-b border-pro-border px-5 flex items-center justify-between z-30">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-pro-gold rounded-lg flex items-center justify-center shrink-0">
            <span className="text-pro-base font-black text-sm leading-none">RB</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-pro-text">Resume Builder</div>
            <div className="text-[10px] text-pro-gold font-black tracking-[0.2em] uppercase">Pro</div>
          </div>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center gap-1.5">
          {resumeSteps.map((step, i) => {
            const active = activeTab === step.id;
            const done = isStepComplete(step.id) && !active;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveTab(step.id)}
                  title={step.label}
                  className={`w-7 h-7 rounded-full text-[11px] font-bold transition-all flex items-center justify-center border
                    ${active ? 'bg-pro-gold text-pro-base border-pro-gold scale-110 shadow-lg shadow-pro-gold/20' :
                      done  ? 'bg-emerald-500 text-white border-emerald-500' :
                              'bg-pro-elevated text-pro-muted border-pro-border hover:border-pro-sub'}`}
                >
                  {done ? <Check size={12} /> : step.step}
                </button>
                {i < resumeSteps.length - 1 && (
                  <div className={`w-5 h-px transition-colors ${done ? 'bg-emerald-500/50' : 'bg-pro-border'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pr-3 border-r border-pro-border">
            <span className={`text-xs ${saveStatus === 'saved' ? 'text-emerald-400' : saveStatus === 'saving' ? 'text-pro-gold' : 'text-pro-sub'}`}>
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '● Saved' : saveStatus === 'unsaved' ? 'Unsaved' : 'Error'}
            </span>
            <label className="flex items-center gap-1.5 text-xs text-pro-sub cursor-pointer select-none">
              <input type="checkbox" checked={autoSave} onChange={e => setAutoSave(e.target.checked)} className="rounded accent-pro-gold h-3 w-3" />
              Auto-save
            </label>
          </div>

          <button
            onClick={() => setShowImportResume(true)}
            className="text-pro-sub hover:text-pro-text px-3 py-1.5 rounded-lg hover:bg-pro-elevated transition-colors text-sm font-medium"
          >
            Import
          </button>

          <button
            onClick={() => {
              if (activeTab === 'tailor' && tailoredData) {
                if (window.confirm('Start a new analysis? This will clear your current results.')) { setTailoredData(null); setJobDescription(""); }
              } else { setActiveTab('tailor'); }
            }}
            className="flex items-center gap-1.5 bg-violet-900/60 text-violet-300 border border-violet-700/50 px-3 py-1.5 rounded-lg hover:bg-violet-800/60 transition-colors text-sm font-semibold"
          >
            <Sparkles size={14} /> AI Tailor
          </button>

          <div className="w-px h-5 bg-pro-border mx-1" />

          <button onClick={exportToPDF} className="flex items-center gap-1.5 bg-pro-gold text-pro-base px-4 py-1.5 rounded-lg hover:bg-pro-gold-dim transition-colors text-sm font-bold shadow-md">
            <Download size={14} /> PDF
          </button>
          <button onClick={exportToWord} className="flex items-center gap-1.5 bg-pro-elevated text-pro-text border border-pro-border px-3 py-1.5 rounded-lg hover:bg-pro-border transition-colors text-sm font-medium">
            <FileText size={14} /> Word
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── Left nav ── */}
        <nav className="w-56 shrink-0 bg-pro-surface border-r border-pro-border flex flex-col overflow-y-auto">
          <div className="px-4 pt-5 pb-1.5">
            <span className="text-[10px] font-black text-pro-muted uppercase tracking-[0.15em]">Resume Sections</span>
          </div>

          {/* Identity — pinned at top, not draggable (ATS parsers expect contact info first) */}
          {resumeSteps.filter(tab => tab.sectionId === 'identity').map(tab => {
            const active = activeTab === tab.id;
            const done = isStepComplete(tab.id);
            return (
              <div key={tab.id} className="relative flex items-center">
                <div title="Locked — always first" className="px-1.5 py-2.5 text-pro-muted/40 shrink-0">
                  <Lock size={14} />
                </div>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 flex-1 min-w-0 pr-3 py-2.5 text-left transition-all border-l-2
                    ${active
                      ? 'bg-pro-elevated border-pro-gold'
                      : 'border-transparent hover:bg-pro-elevated/40 hover:border-pro-border'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all
                    ${active ? 'bg-pro-gold text-pro-base' :
                      done  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                              'bg-pro-card border border-pro-border text-pro-muted'}`}
                  >
                    {done && !active ? <Check size={12} /> : tab.step}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold truncate ${active ? 'text-pro-gold' : 'text-pro-text'}`}>{tab.label}</div>
                    <div className="text-[11px] text-pro-muted truncate">{tab.subtitle}</div>
                  </div>
                  {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-pro-gold rounded-l-full" />}
                </button>
              </div>
            );
          })}

          {/* Reorderable sections */}
          <DndContext sensors={sectionSensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
            <SortableContext
              items={resumeSteps.filter(tab => tab.sectionId !== 'identity').map(tab => tab.sectionId)}
              strategy={verticalListSortingStrategy}
            >
              {resumeSteps.filter(tab => tab.sectionId !== 'identity').map(tab => (
                <SortableSectionRow
                  key={tab.sectionId}
                  id={tab.sectionId}
                  label={tab.label}
                  subtitle={tab.subtitle}
                  step={tab.step}
                  active={activeTab === tab.id}
                  done={isStepComplete(tab.id)}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="mx-4 my-3 border-t border-pro-border" />

          <div className="px-4 pb-1.5">
            <span className="text-[10px] font-black text-pro-muted uppercase tracking-[0.15em]">Pro Tools</span>
          </div>

          {proTools.map(tab => {
            const active = activeTab === tab.id;
            const done = isStepComplete(tab.id);
            const IconEl = tab.icon;
            const isAI = tab.id === 'tailor';
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'tailor' && activeTab === 'tailor' && tailoredData) {
                    if (window.confirm('Start a new analysis?')) { setTailoredData(null); setJobDescription(""); }
                  } else { setActiveTab(tab.id); }
                }}
                className={`relative flex items-center gap-3 w-full px-3 py-2.5 text-left transition-all border-l-2
                  ${active
                    ? isAI ? 'bg-violet-900/30 border-violet-500' : 'bg-pro-elevated border-pro-gold'
                    : 'border-transparent hover:bg-pro-elevated/40 hover:border-pro-border'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                  ${active && isAI ? 'bg-violet-600 text-white' :
                    active ? 'bg-pro-gold text-pro-base' :
                    done  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                            'bg-pro-card border border-pro-border text-pro-muted'}`}
                >
                  {done && !active ? <Check size={12} /> : <IconEl size={13} />}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate
                    ${active && isAI ? 'text-violet-300' : active ? 'text-pro-gold' : 'text-pro-text'}`}>{tab.label}</div>
                  <div className="text-[11px] text-pro-muted truncate">{tab.subtitle}</div>
                </div>
              </button>
            );
          })}

          {/* Save status at bottom */}
          <div className="mt-auto p-4 border-t border-pro-border">
            <p className="text-[11px] text-pro-muted text-center">
              {saveStatus === 'saved' ? '✓ All changes saved' : saveStatus === 'saving' ? 'Saving…' : 'Changes not saved'}
            </p>
          </div>
        </nav>

        {/* ── Editor panel ── */}
        <div id="editor-scroll-pane" className="flex-1 overflow-y-auto bg-pro-base">
          <div className="max-w-2xl mx-auto px-8 py-8">

            {/* ── Header tab ── */}
            {activeTab === 'header' && (
              <div>
                <SectionHeader icon={User} title="Identity & Contact" subtitle="Your name and how recruiters reach you" step={stepLabel('header')} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={lbl}>Full Name</label>
                    <input type="text" value={resumeData.header.name} onChange={e => updateField('header', 'name', e.target.value)} className={inp} placeholder="Jane Smith" />
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>Professional Title</label>
                    <input type="text" value={resumeData.header.title} onChange={e => updateField('header', 'title', e.target.value)} className={inp} placeholder="Senior Software Engineer" />
                  </div>
                  <div>
                    <label className={lbl}>Email</label>
                    <input type="email" value={resumeData.header.email} onChange={e => updateField('header', 'email', e.target.value)} className={inp} placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className={lbl}>Phone</label>
                    <input type="text" value={resumeData.header.phone} onChange={e => updateField('header', 'phone', e.target.value)} className={inp} placeholder="(555) 000-0000" />
                  </div>
                  <div>
                    <label className={lbl}>Location</label>
                    <input type="text" value={resumeData.header.location} onChange={e => updateField('header', 'location', e.target.value)} className={inp} placeholder="City, State" />
                  </div>
                  <div>
                    <label className={lbl}>LinkedIn</label>
                    <input type="text" value={resumeData.header.linkedin} onChange={e => updateField('header', 'linkedin', e.target.value)} className={inp} placeholder="linkedin.com/in/yourname" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className={lbl}>Additional Links</label>
                    <button onClick={addLink} className="flex items-center gap-1.5 text-pro-gold hover:text-pro-gold-dim font-semibold text-sm transition-colors">
                      <Plus size={16} /> Add Link
                    </button>
                  </div>
                  <datalist id="link-label-suggestions">
                    {LINK_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                  </datalist>
                  <div className="space-y-2">
                    {(resumeData.additionalLinks || []).map(link => (
                      <div key={link.id} className="flex gap-2">
                        <input
                          type="text"
                          list="link-label-suggestions"
                          value={link.label}
                          onChange={e => updateLink(link.id, 'label', e.target.value)}
                          className={`${inp} !w-40 shrink-0`}
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={e => updateLink(link.id, 'url', e.target.value)}
                          className={inp}
                          placeholder="github.com/yourname"
                        />
                        <button onClick={() => deleteLink(link.id)} className="text-pro-muted hover:text-red-400 transition-colors shrink-0"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                  {(resumeData.additionalLinks || []).length === 0 && (
                    <p className="text-xs text-pro-muted mt-1">GitHub, portfolio, publications — anything else recruiters should see.</p>
                  )}
                </div>

                <NextStep />
              </div>
            )}

            {/* ── Summary tab ── */}
            {activeTab === 'summary' && (
              <div>
                <SectionHeader icon={AlignLeft} title="Professional Summary" subtitle="Your elevator pitch — 3–5 sentences, keyword-rich" step={stepLabel('summary')} />
                <div className="bg-pro-elevated border border-pro-border rounded-lg px-4 py-3 mb-4 text-xs text-pro-sub">
                  <strong className="text-pro-gold">Pro tip:</strong> Lead with your years of experience, top 2–3 skills, and the value you bring. Avoid generic phrases like &quot;hard worker.&quot;
                </div>
                <textarea
                  value={resumeData.summary}
                  onChange={e => updateField('summary', null, e.target.value)}
                  className={`${inp} h-48 resize-none`}
                  placeholder="Versatile professional with X years of experience in…"
                />
                <p className="text-xs text-pro-muted mt-2 text-right">{resumeData.summary.length} characters</p>
                <NextStep />
              </div>
            )}

            {/* ── Experience tab ── */}
            {activeTab === 'experience' && (
              <div>
                <SectionHeader icon={Briefcase} title="Work Experience" subtitle="List roles in reverse chronological order" step={stepLabel('experience')} />
                <div className="flex justify-end mb-4">
                  <button onClick={addExperience} className="flex items-center gap-1.5 text-pro-gold hover:text-pro-gold-dim font-semibold text-sm transition-colors">
                    <Plus size={16} /> Add Job
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.experience.map(exp => (
                    <div key={exp.id} className={card}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-pro-sub uppercase tracking-wider">Position</span>
                        <button onClick={() => deleteExperience(exp.id)} className="text-pro-muted hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className={inp} placeholder="Company" />
                        <input type="text" value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} className={inp} placeholder="Job Title" />
                        <input type="text" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className={inp} placeholder="Start Date" />
                        <input type="text" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className={inp} placeholder="End Date / Present" />
                      </div>
                      <div>
                        <label className={lbl}>Achievements & Responsibilities</label>
                        <div className="space-y-2">
                          {exp.bullets.map((bullet, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                              <textarea
                                value={bullet}
                                onChange={e => updateBullet(exp.id, idx, e.target.value)}
                                className={`${inp} resize-none`}
                                rows={2}
                                placeholder="Start with an action verb — Led, Built, Reduced…"
                              />
                              <button
                                onClick={() => enhanceBullet(exp.id, idx)}
                                disabled={enhancingBullet === `${exp.id}-${idx}`}
                                title="Enhance with AI"
                                className="mt-1 text-violet-400 hover:text-violet-300 disabled:opacity-40 transition-colors shrink-0"
                              >
                                {enhancingBullet === `${exp.id}-${idx}` ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                              </button>
                              <button onClick={() => deleteBullet(exp.id, idx)} className="mt-1 text-pro-muted hover:text-red-400 transition-colors shrink-0"><Trash2 size={15} /></button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => addBullet(exp.id)} className="mt-2 text-xs text-pro-gold hover:text-pro-gold-dim font-semibold transition-colors">+ Add bullet</button>
                      </div>
                    </div>
                  ))}
                </div>
                <NextStep />
              </div>
            )}

            {/* ── Skills tab ── */}
            {activeTab === 'skills' && (
              <div>
                <SectionHeader icon={Zap} title="Skills & Competencies" subtitle="One skill per line — be specific, not generic" step={stepLabel('skills')} />
                <div className="flex justify-end mb-4">
                  <button onClick={addSkill} className="flex items-center gap-1.5 text-pro-gold hover:text-pro-gold-dim font-semibold text-sm transition-colors">
                    <Plus size={16} /> Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {resumeData.skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={skill} onChange={e => updateSkill(idx, e.target.value)} className={inp} placeholder="Skill or tool name" />
                      <button onClick={() => deleteSkill(idx)} className="text-pro-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                <NextStep />
              </div>
            )}

            {/* ── Education tab ── */}
            {activeTab === 'education' && (
              <div>
                <SectionHeader icon={GraduationCap} title="Education" subtitle="Most recent degree first" step={stepLabel('education')} />
                <div className="flex justify-end mb-4">
                  <button onClick={addEducation} className="flex items-center gap-1.5 text-pro-gold hover:text-pro-gold-dim font-semibold text-sm transition-colors">
                    <Plus size={16} /> Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className={card}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-pro-sub uppercase tracking-wider">Degree</span>
                        <button onClick={() => deleteEducation(edu.id)} className="text-pro-muted hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className={inp} placeholder="Degree / Major" />
                        <input type="text" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} className={inp} placeholder="University / School" />
                        <input type="text" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} className={inp} placeholder="Start Year" />
                        <input type="text" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} className={inp} placeholder="End Year / Expected" />
                      </div>
                    </div>
                  ))}
                </div>
                <NextStep />
              </div>
            )}

            {/* ── Certifications tab ── */}
            {activeTab === 'certifications' && (
              <div>
                <SectionHeader icon={Award} title="Certifications" subtitle="Include issuer and date — helps with ATS" step={stepLabel('certifications')} />
                <div className="flex justify-end mb-4">
                  <button onClick={addCertification} className="flex items-center gap-1.5 text-pro-gold hover:text-pro-gold-dim font-semibold text-sm transition-colors">
                    <Plus size={16} /> Add Cert
                  </button>
                </div>
                <div className="space-y-2">
                  {resumeData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={cert} onChange={e => updateCertification(idx, e.target.value)} className={inp} placeholder="Certification Name — Issuer — Month Year" />
                      <button onClick={() => deleteCertification(idx)} className="text-pro-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                <NextStep />
              </div>
            )}

            {/* ── Custom tab ── */}
            {activeTab === 'custom' && (
              <div>
                <SectionHeader icon={Plus} title="Custom Sections" subtitle="Awards, publications, volunteer work, languages…" step={stepLabel('custom')} />
                <div className="flex justify-end mb-4">
                  <button onClick={addCustomSection} className="flex items-center gap-1.5 text-pro-gold hover:text-pro-gold-dim font-semibold text-sm transition-colors">
                    <Plus size={16} /> Add Section
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.customSections.map(sec => (
                    <div key={sec.id} className={card}>
                      <div className="flex justify-between items-center mb-3">
                        <input type="text" value={sec.title} onChange={e => updateCustomSection(sec.id, 'title', e.target.value)} className={`${inp} font-semibold`} placeholder="Section Title" />
                        <button onClick={() => deleteCustomSection(sec.id)} className="ml-2 text-pro-muted hover:text-red-400 transition-colors shrink-0"><Trash2 size={15} /></button>
                      </div>
                      <div className="space-y-2">
                        {sec.items.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <textarea value={item} onChange={e => updateCustomItem(sec.id, idx, e.target.value)} className={`${inp} resize-none`} rows={2} />
                            <button onClick={() => deleteCustomItem(sec.id, idx)} className="text-pro-muted hover:text-red-400 transition-colors shrink-0"><Trash2 size={15} /></button>
                          </div>
                        ))}
                        <button onClick={() => addCustomItem(sec.id)} className="text-xs text-pro-gold hover:text-pro-gold-dim font-semibold transition-colors">+ Add item</button>
                      </div>
                    </div>
                  ))}
                  {resumeData.customSections.length === 0 && (
                    <div className="text-center py-10 text-pro-muted">
                      <Plus size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No custom sections yet — click &quot;Add Section&quot; above</p>
                    </div>
                  )}
                </div>
                <NextStep />
              </div>
            )}

            {/* ── Cover Letter tab ── */}
            {activeTab === 'cover-letter' && (
              <div>
                <SectionHeader icon={Mail} title="Cover Letter Generator" subtitle="AI writes a tailored letter using your resume in seconds" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={lbl}>Target Company</label>
                    <input type="text" value={coverLetterData.company} onChange={e => setCoverLetterData({ ...coverLetterData, company: e.target.value })} className={inp} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className={lbl}>Job Title</label>
                    <input type="text" value={coverLetterData.jobTitle} onChange={e => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })} className={inp} placeholder="Senior Developer" />
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>Hiring Manager <span className="text-pro-muted normal-case font-normal">(optional)</span></label>
                    <input type="text" value={coverLetterData.hiringManager} onChange={e => setCoverLetterData({ ...coverLetterData, hiringManager: e.target.value })} className={inp} placeholder="Jane Doe" />
                  </div>
                </div>
                <button
                  onClick={generateCoverLetter}
                  disabled={isGeneratingCoverLetter}
                  className="w-full flex items-center justify-center gap-2 bg-pro-gold text-pro-base py-3 rounded-xl font-bold hover:bg-pro-gold-dim disabled:opacity-50 transition-colors mb-6"
                >
                  {isGeneratingCoverLetter ? <><Loader2 className="animate-spin" size={18} /> Generating…</> : <><Sparkles size={18} /> Generate Cover Letter</>}
                </button>
                {coverLetterData.content && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={lbl}>Generated Letter</label>
                      <button onClick={() => { navigator.clipboard.writeText(coverLetterData.content); alert('Copied!'); }} className="text-xs text-pro-gold hover:text-pro-gold-dim font-semibold transition-colors">Copy to clipboard</button>
                    </div>
                    <textarea
                      value={coverLetterData.content}
                      onChange={e => setCoverLetterData({ ...coverLetterData, content: e.target.value })}
                      className={`${inp} h-96 resize-none font-serif leading-relaxed`}
                    />
                  </div>
                )}
                <NextStep />
              </div>
            )}

            {/* ── AI Tailor tab ── */}
            {activeTab === 'tailor' && (
              <div>
                <SectionHeader icon={Sparkles} title="AI Resume Tailor" subtitle="Optimize your resume for any job description" />

                {!tailoredData ? (
                  <div>
                    <div className="bg-violet-950/40 border border-violet-800/50 rounded-xl p-4 mb-4 text-sm text-violet-300">
                      <strong className="text-violet-200">How it works:</strong> Paste the job description below. The AI analyzes it against your resume, gives you a match score, surfaces keyword gaps, and suggests targeted improvements to beat ATS filters.
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      className={`${inp} h-56 resize-none mb-4`}
                      placeholder="Paste the full job description here…"
                    />
                    <button
                      onClick={handleTailorResume}
                      disabled={isTailoring}
                      className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 transition-colors"
                    >
                      {isTailoring ? <><Loader2 className="animate-spin" size={18} /> Analyzing…</> : <><Sparkles size={18} /> Analyze & Tailor Resume</>}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'JD Match Score', value: `${tailoredData.current_analysis?.match_score || 0}%`, delta: (tailoredData.projected_analysis?.match_score || 0) - (tailoredData.current_analysis?.match_score || 0), sub: `Target: ${tailoredData.projected_analysis?.match_score || 0}%` },
                        { label: 'Impact Score', value: `${tailoredData.current_analysis?.impact_score || 0}%`, delta: (tailoredData.projected_analysis?.impact_score || 0) - (tailoredData.current_analysis?.impact_score || 0), sub: 'Metrics & numbers' },
                        { label: 'Fluff Factor', value: tailoredData.current_analysis?.fluff_factor || 'N/A', delta: null, sub: 'Power verb usage', fluff: tailoredData.current_analysis?.fluff_factor },
                      ].map(m => (
                        <div key={m.label} className={card}>
                          <p className="text-[10px] font-black text-pro-muted uppercase tracking-widest mb-2">{m.label}</p>
                          <div className="flex items-end gap-1.5">
                            <span className={`text-2xl font-black ${m.fluff === 'Low' ? 'text-emerald-400' : m.fluff === 'Medium' ? 'text-yellow-400' : m.fluff === 'High' ? 'text-red-400' : 'text-pro-text'}`}>{m.value}</span>
                            {m.delta !== null && m.delta > 0 && (
                              <span className="flex items-center text-emerald-400 text-xs font-bold mb-1"><ArrowUp size={12} />+{m.delta}%</span>
                            )}
                          </div>
                          <p className="text-[11px] text-pro-muted mt-1">{m.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recruiter note */}
                    <div className="bg-pro-card border border-pro-border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-pro-gold" size={16} />
                        <span className="text-xs font-black text-pro-sub uppercase tracking-widest">Recruiter Note</span>
                      </div>
                      <p className="text-sm text-pro-sub italic">&quot;{tailoredData.current_analysis?.executive_summary || "No analysis available"}&quot;</p>
                    </div>

                    {/* Missing keywords */}
                    {tailoredData.current_analysis?.missing_keywords?.length > 0 && (
                      <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4">
                        <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Critical Keyword Gaps</h3>
                        <div className="flex flex-wrap gap-2">
                          {tailoredData.current_analysis.missing_keywords.map((kw, i) => (
                            <span key={i} className="bg-pro-base text-red-300 border border-red-800/50 px-2.5 py-1 rounded-lg text-xs font-semibold">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-pro-border">
                      <button
                        onClick={applyTailoring}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                      >
                        <Sparkles size={16} />
                        Apply Improvements (+{(tailoredData.projected_analysis?.match_score || 0) - (tailoredData.current_analysis?.match_score || 0)}%)
                      </button>
                      <button
                        onClick={() => { setTailoredData(null); setJobDescription(""); const p = document.getElementById('editor-scroll-pane'); if (p) p.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-5 py-3 bg-pro-elevated border border-pro-border rounded-xl font-medium text-pro-sub hover:text-pro-text hover:bg-pro-border transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Preview panel ── */}
        <div
          ref={previewContainerRef}
          className="w-[400px] shrink-0 bg-pro-surface border-l border-pro-border flex flex-col overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-pro-border flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black text-pro-muted uppercase tracking-[0.15em]">Live Preview</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-pro-muted">Updates as you type</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#080c15] p-4">
            <div id="preview-wrapper" style={{ zoom: previewScale as any }}>
              {template === 'modern' ? <ModernTemplate /> : template === 'ats' ? <ATSTemplate /> : <ClassicTemplate />}
            </div>
          </div>
        </div>

      </div>

      {/* ── Modals ── */}
      {showIntro && <IntroModal />}

      {showImportResume && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-pro-card border border-pro-border rounded-2xl max-w-2xl w-full p-7 shadow-2xl">
            <h2 className="text-xl font-bold text-pro-text mb-1">Import Existing Resume</h2>
            <p className="text-pro-sub text-sm mb-5">Paste plain text from your resume. AI will parse it into structured data.</p>
            {!analyzedData ? (
              <>
                <textarea
                  value={importedResumeText}
                  onChange={e => setImportedResumeText(e.target.value)}
                  className={`${inp} h-56 resize-none mb-5`}
                  placeholder="Paste your resume text here…"
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowImportResume(false)} className="px-4 py-2.5 text-pro-sub hover:text-pro-text transition-colors text-sm">Cancel</button>
                  <button
                    onClick={analyzeImportedResume}
                    disabled={analyzingResume}
                    className="flex items-center gap-2 bg-pro-gold text-pro-base px-5 py-2.5 rounded-lg font-bold hover:bg-pro-gold-dim disabled:opacity-50 transition-colors text-sm"
                  >
                    {analyzingResume ? <><Loader2 className="animate-spin" size={15} /> Analyzing…</> : 'Analyze Resume'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-4 text-emerald-300 text-sm">
                  Analysis complete — found <strong>{analyzedData.experience?.length || 0}</strong> positions and <strong>{analyzedData.skills?.length || 0}</strong> skills.
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setAnalyzedData(null)} className="px-4 py-2.5 text-pro-sub hover:text-pro-text transition-colors text-sm">Back</button>
                  <button onClick={applyResumeUpdates} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors text-sm">
                    <CheckCircle size={16} /> Apply Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #preview-wrapper, #preview-wrapper * { visibility: visible; }
          #preview-wrapper {
            position: absolute;
            left: 0; top: 0;
            zoom: 1 !important;
            width: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #resume-preview { box-shadow: none !important; }
        }
        * { scrollbar-width: thin; scrollbar-color: #2a3a56 transparent; }
        *::-webkit-scrollbar { width: 5px; height: 5px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: #2a3a56; border-radius: 99px; }
        *::-webkit-scrollbar-thumb:hover { background: #3d5070; }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
