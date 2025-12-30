const fs = require('fs');

const filePath = 'C:\\Users\\danra\\Documents\\Project_Workspace\\aifrienddan.com\\components\\ResumeBuilder.tsx';

const newContent = `'use client';

import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Edit3, FileText, Loader2, X, ChevronRight, CheckCircle, Layout, Sparkles, BookOpen } from './icons';

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

  const [resumeData, setResumeData] = useState(defaultData);
  const [template, setTemplate] = useState('modern');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [autoSave, setAutoSave] = useState(true);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState({
    jobTitle: '',
    company: '',
    hiringManager: '',
    content: ''
  });
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [showImportResume, setShowImportResume] = useState(false);
  const [importedResumeText, setImportedResumeText] = useState('');
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredData, setTailoredData] = useState(null);
  
  // New UX States
  const [activeTab, setActiveTab] = useState('header');
  const [showIntro, setShowIntro] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const localData = localStorage.getItem('dan-resume-data');
        if (localData) {
          const loadedData = JSON.parse(localData);
          if (!loadedData.customSections) {
            loadedData.customSections = [];
          }
          setResumeData(loadedData);
        }
        
        // Check if user has seen intro
        const hasSeenIntro = localStorage.getItem('has-seen-intro');
        if (!hasSeenIntro) {
          setShowIntro(true);
        }
      } catch (e) {
        console.log('No saved data found, using defaults');
      }
    };
    loadData();
  }, []);

  // Auto-save
  const saveData = async (data) => {
    if (!autoSave) {
      setSaveStatus('unsaved');
      return;
    }
    setSaveStatus('saving');
    try {
      localStorage.setItem('dan-resume-data', JSON.stringify(data));
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('Save failed:', error);
    }
  };

  const closeIntro = () => {
    setShowIntro(false);
    localStorage.setItem('has-seen-intro', 'true');
  };

  const updateField = (section, field, value) => {
    const newData = { ...resumeData };
    if (section === 'header') {
      newData.header[field] = value;
    } else if (section === 'summary') {
      newData.summary = value;
    }
    setResumeData(newData);
    saveData(newData);
  };

  const addSkill = () => {
    const newData = { ...resumeData };
    newData.skills.push("New Skill");
    setResumeData(newData);
    saveData(newData);
  };

  const updateSkill = (index, value) => {
    const newData = { ...resumeData };
    newData.skills[index] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const deleteSkill = (index) => {
    const newData = { ...resumeData };
    newData.skills.splice(index, 1);
    setResumeData(newData);
    saveData(newData);
  };

  const addExperience = () => {
    const newData = { ...resumeData };
    newData.experience.push({
      id: Date.now(),
      company: "Company Name",
      title: "Job Title",
      location: "",
      startDate: "Month Year",
      endDate: "Month Year",
      bullets: ["Achievement or responsibility"]
    });
    setResumeData(newData);
    saveData(newData);
  };

  const updateExperience = (id, field, value) => {
    const newData = { ...resumeData };
    const exp = newData.experience.find(e => e.id === id);
    if (exp) exp[field] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const addBullet = (expId) => {
    const newData = { ...resumeData };
    const exp = newData.experience.find(e => e.id === expId);
    if (exp) exp.bullets.push("New achievement");
    setResumeData(newData);
    saveData(newData);
  };

  const updateBullet = (expId, bulletIndex, value) => {
    const newData = { ...resumeData };
    const exp = newData.experience.find(e => e.id === expId);
    if (exp) exp.bullets[bulletIndex] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const deleteBullet = (expId, bulletIndex) => {
    const newData = { ...resumeData };
    const exp = newData.experience.find(e => e.id === expId);
    if (exp) exp.bullets.splice(bulletIndex, 1);
    setResumeData(newData);
    saveData(newData);
  };

  const deleteExperience = (id) => {
    const newData = { ...resumeData };
    newData.experience = newData.experience.filter(e => e.id !== id);
    setResumeData(newData);
    saveData(newData);
  };
  
  // Education CRUD
  const addEducation = () => {
    const newData = { ...resumeData };
    newData.education.push({
      id: Date.now(),
      degree: "Degree",
      institution: "University",
      startDate: "Start Date",
      endDate: "End Date"
    });
    setResumeData(newData);
    saveData(newData);
  };

  const updateEducation = (id, field, value) => {
    const newData = { ...resumeData };
    const edu = newData.education.find(e => e.id === id);
    if (edu) edu[field] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const deleteEducation = (id) => {
    const newData = { ...resumeData };
    newData.education = newData.education.filter(e => e.id !== id);
    setResumeData(newData);
    saveData(newData);
  };

  // Certifications CRUD
  const addCertification = () => {
    const newData = { ...resumeData };
    newData.certifications.push("New Certification");
    setResumeData(newData);
    saveData(newData);
  };

  const updateCertification = (index, value) => {
    const newData = { ...resumeData };
    newData.certifications[index] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const deleteCertification = (index) => {
    const newData = { ...resumeData };
    newData.certifications.splice(index, 1);
    setResumeData(newData);
    saveData(newData);
  };

  const addCustomSection = () => {
    const newData = { ...resumeData };
    newData.customSections.push({
      id: Date.now(),
      title: "Custom Section",
      items: ["Item 1"]
    });
    setResumeData(newData);
    saveData(newData);
  };

  const updateCustomSection = (id, field, value) => {
    const newData = { ...resumeData };
    const section = newData.customSections.find(s => s.id === id);
    if (section) section[field] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const deleteCustomSection = (id) => {
    const newData = { ...resumeData };
    newData.customSections = newData.customSections.filter(s => s.id !== id);
    setResumeData(newData);
    saveData(newData);
  };

  const addCustomItem = (sectionId) => {
    const newData = { ...resumeData };
    const section = newData.customSections.find(s => s.id === sectionId);
    if (section) section.items.push("New item");
    setResumeData(newData);
    saveData(newData);
  };

  const updateCustomItem = (sectionId, itemIndex, value) => {
    const newData = { ...resumeData };
    const section = newData.customSections.find(s => s.id === sectionId);
    if (section) section.items[itemIndex] = value;
    setResumeData(newData);
    saveData(newData);
  };

  const deleteCustomItem = (sectionId, itemIndex) => {
    const newData = { ...resumeData };
    const section = newData.customSections.find(s => s.id === sectionId);
    if (section) section.items.splice(itemIndex, 1);
    setResumeData(newData);
    saveData(newData);
  };

  const exportToPDF = () => {
    try {
      const style = document.createElement('style');
      style.id = 'print-styles';
      style.textContent = \`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; left: 0; top: 0; }
        }
      \`;
      document.head.appendChild(style);
      window.print();
      setTimeout(() => {
        const styleEl = document.getElementById('print-styles');
        if (styleEl) styleEl.remove();
      }, 1000);
    } catch (error) {
      alert('Print dialog failed to open. Please use Ctrl+P to print.');
    }
  };

  const exportToWord = () => {
    try {
      const htmlContent = document.getElementById('resume-preview').innerHTML;
      if (!htmlContent) return;
      
      const wordDoc = \`
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><meta charset='utf-8'><title>Resume</title></head>
          <body>\${htmlContent}</body>
        </html>
      \`;
      
      const blob = new Blob(['\\ufeff', wordDoc], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`\${resumeData.header.name.replace(/\\s+/g, '_')}_Resume.doc\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const generateCoverLetter = async () => {
    if (!coverLetterData.jobTitle || !coverLetterData.company) {
      alert('Please enter at least a job title and company name');
      return;
    }
    setGeneratingCoverLetter(true);
    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: coverLetterData.jobTitle,
          company: coverLetterData.company,
          hiringManager: coverLetterData.hiringManager,
          resumeSummary: resumeData.summary,
          experience: resumeData.experience.slice(0, 2).map(exp => \`\${exp.title} at \${exp.company}\\n- \${exp.bullets.join('\\n- ')}\`).join('\\n'),
          skills: resumeData.skills.slice(0, 8).join(', ')
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCoverLetterData(prev => ({ ...prev, content: data.content }));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate cover letter.');
    } finally {
      setGeneratingCoverLetter(false);
    }
  };
  
  const exportCoverLetterToWord = () => {
      const wordDoc = \`
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>Cover Letter</title>
            <style>
              body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; }
              .page { max-width: 6.5in; margin: 0 auto; padding: 1in; }
              p { margin-bottom: 12pt; }
            </style>
          </head>
          <body>
            <div class="page">\${coverLetterData.content.replace(/\\n/g, '<br>')}</div>
          </body>
        </html>
      \`;
      
      const blob = new Blob(['\\ufeff', wordDoc], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`\${resumeData.header.name.replace(/\\s+/g, '_')}_CoverLetter.doc\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

  const analyzeImportedResume = async () => {
    if (!importedResumeText.trim()) {
      alert('Please paste resume text first');
      return;
    }
    setAnalyzingResume(true);
    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: importedResumeText })
      });
      const parsed = await response.json();
      if (!response.ok) throw new Error(parsed.error);
      setAnalyzedData(parsed);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze resume.');
    } finally {
      setAnalyzingResume(false);
    }
  };

  const applyResumeUpdates = () => {
    if (!analyzedData) return;
    const newData = { ...resumeData };
    if (analyzedData.title) newData.header.title = analyzedData.title;
    if (analyzedData.summary) newData.summary = analyzedData.summary;
    if (analyzedData.skills?.length) newData.skills = analyzedData.skills;
    if (analyzedData.experience?.length) {
      newData.experience = analyzedData.experience.map((exp, idx) => ({
        id: Date.now() + idx,
        company: exp.company || "Company",
        title: exp.title || "Title",
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        bullets: exp.bullets || []
      }));
    }
    setResumeData(newData);
    saveData(newData);
    setShowImportResume(false);
    setImportedResumeText('');
    setAnalyzedData(null);
    alert('Resume updated successfully!');
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description first');
      return;
    }
    setIsTailoring(true);
    try {
      const cleanResume = {
        title: resumeData.header.title,
        summary: resumeData.summary,
        skills: resumeData.skills,
        experience: resumeData.experience.map(exp => ({
          company: exp.company,
          title: exp.title,
          bullets: exp.bullets
        }))
      };
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume: cleanResume })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setTailoredData(data);
    } catch (error) {
      console.error('Tailor error:', error);
      alert('Failed to tailor resume: ' + error.message);
    } finally {
      setIsTailoring(false);
    }
  };
  
  const applyTailoring = () => {
      if (!tailoredData) return;
      const newData = { ...resumeData };
      if (tailoredData.suggestedSummaryChanges) {
         newData.summary = tailoredData.suggestedSummaryChanges;
      }
      if (tailoredData.missingSkills && tailoredData.missingSkills.length > 0) {
        const newSkills = tailoredData.missingSkills.filter(skill => !newData.skills.includes(skill));
        newData.skills = [...newData.skills, ...newSkills];
      }
      setResumeData(newData);
      saveData(newData);
      setShowTailorModal(false);
      setTailoredData(null);
      setJobDescription("");
      alert('Tailoring suggestions applied! Review your summary and skills.');
    };

  const ModernTemplate = () => (
    <div id="resume-preview" className="bg-white p-8 shadow-lg text-left" style={{ width: '8.5in', minHeight: '11in' }}>
      <div className="text-center border-b-2 border-blue-900 pb-4 mb-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-1">{resumeData.header.name}</h1>
        <h2 className="text-lg text-gray-700 mb-2">{resumeData.header.title}</h2>
        <p className="text-sm text-gray-600">
          {resumeData.header.location} | {resumeData.header.phone} | {resumeData.header.email}
          <br />
          {resumeData.header.linkedin}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Professional Summary</h3>
        <p className="text-sm text-justify leading-relaxed">{resumeData.summary}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Core Competencies</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {resumeData.skills.map((skill, idx) => (
            <div key={idx} className="text-sm">- {skill}</div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Professional Experience</h3>
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-bold text-sm">{exp.company}</span>
              <span className="text-xs italic text-gray-600">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="italic text-sm text-gray-700 mb-1">{exp.title}</div>
            <ul className="ml-4">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-sm mb-1">- {bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Education</h3>
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="text-sm mb-1">
            <span className="font-bold">{edu.degree}</span> - <span className="italic">{edu.institution}</span> - {edu.startDate} - {edu.endDate}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">Certifications</h3>
        {resumeData.certifications.map((cert, idx) => (
          <div key={idx} className="text-sm mb-1">- {cert}</div>
        ))}
      </div>
      {resumeData.customSections && resumeData.customSections.map((section) => (
        <div key={section.id} className="mt-4">
          <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-gray-300 pb-1 mb-2">{section.title}</h3>
          {section.items.map((item, idx) => (
            <div key={idx} className="text-sm mb-1">- {item}</div>
          ))}
        </div>
      ))}
    </div>
  );

  const ClassicTemplate = () => (
    <div id="resume-preview" className="bg-white p-8 shadow-lg text-left" style={{ width: '8.5in', minHeight: '11in' }}>
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1">{resumeData.header.name}</h1>
        <p className="text-sm">
          {resumeData.header.location} | {resumeData.header.phone} | {resumeData.header.email} | {resumeData.header.linkedin}
        </p>
      </div>
      <hr className="border-t-2 border-black mb-4" />
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase mb-2">Professional Summary</h3>
        <p className="text-sm text-justify leading-relaxed">{resumeData.summary}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase mb-2">Core Competencies</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {resumeData.skills.map((skill, idx) => (
            <div key={idx} className="text-sm">- {skill}</div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase mb-2">Professional Experience</h3>
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm">{exp.company}</span>
              <span className="text-xs italic">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="italic text-sm mb-1">{exp.title}</div>
            <ul className="ml-4">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-sm mb-1">- {bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase mb-2">Education</h3>
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="text-sm mb-1">
            <span className="font-bold">{edu.degree}</span> - <span className="italic">{edu.institution}</span> - {edu.startDate} - {edu.endDate}
          </div>
        ))}
      </div>
      <div className="mb-4">
         <h3 className="text-sm font-bold uppercase mb-2">Certifications</h3>
         {resumeData.certifications.map((cert, idx) => (
           <div key={idx} className="text-sm mb-1">- {cert}</div>
         ))}
       </div>
    </div>
  );
  
  const ATSTemplate = () => (
      <div id="resume-preview" className="bg-white p-8 shadow-lg text-left" style={{ width: '8.5in', minHeight: '11in' }}>
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">{resumeData.header.name}</h1>
          <h2 className="text-base font-semibold text-gray-700 mb-2">{resumeData.header.title}</h2>
          <div className="text-xs leading-relaxed">
            <div>{resumeData.header.location}</div>
            <div>Phone: {resumeData.header.phone}</div>
            <div>Email: {resumeData.header.email}</div>
            <div>LinkedIn: {resumeData.header.linkedin}</div>
          </div>
        </div>
        <hr className="border-t border-gray-400 mb-3" />
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Profile</h3>
          <p className="text-xs leading-relaxed">{resumeData.summary}</p>
        </div>
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Skills</h3>
          <ul className="ml-4">
            {resumeData.skills.map((skill, idx) => (
              <li key={idx} className="text-xs mb-1">- {skill}</li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Professional Experience</h3>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs">{exp.company}</span>
                <span className="text-xs italic">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="italic text-xs mb-1">{exp.title}</div>
              <ul className="ml-4">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="text-xs mb-1">- {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Education</h3>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="text-xs mb-1">
              <span className="font-bold">{edu.degree}</span> - <span className="italic">{edu.institution}</span> - {edu.startDate} - {edu.endDate}
            </div>
          ))}
        </div>
        <div className="mb-3">
           <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">Certifications</h3>
           {resumeData.certifications.map((cert, idx) => (
             <div key={idx} className="text-xs mb-1">- {cert}</div>
           ))}
         </div>
      </div>
    );

  // --- Components for Sections ---

  const IntroModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Welcome to Resume Builder Pro! 🚀</h2>
        <p className="text-gray-600 mb-6 text-lg">Build a professional, ATS-friendly resume in minutes with AI assistance.</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><CheckCircle size={20} /></div>
            <div>
              <h3 className="font-bold">1. Fill in your details</h3>
              <p className="text-sm text-gray-500">Use the tabs on the left to complete each section.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Sparkles size={20} /></div>
            <div>
              <h3 className="font-bold">2. Tailor with AI</h3>
              <p className="text-sm text-gray-500">Paste a job description to get instant suggestions.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600"><Download size={20} /></div>
            <div>
              <h3 className="font-bold">3. Export & Apply</h3>
              <p className="text-sm text-gray-500">Download as PDF or Word and land that interview!</p>
            </div>
          </div>
        </div>

        <button 
          onClick={closeIntro}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Let's Get Started
        </button>
      </div>
    </div>
  );

  const TailorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-600" /> AI Resume Tailor
          </h2>
          <button onClick={() => setShowTailorModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {!tailoredData ? (
            <div className="space-y-4">
              <p className="text-gray-600">Paste the job description below. Our AI will analyze it against your resume and suggest improvements.</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Paste job description here..."
              />
              <button
                onClick={handleTailorResume}
                disabled={isTailoring}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex justify-center items-center gap-2 font-semibold"
              >
                {isTailoring ? <><Loader2 className="animate-spin" /> Analyzing...</> : 'Analyze & Tailor Resume'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="text-4xl font-bold text-purple-700">{tailoredData.matchScore}</div>
                <div>
                  <h3 className="font-bold text-purple-900">Match Score</h3>
                  <p className="text-sm text-purple-700">Based on skills and keywords analysis</p>
                </div>
              </div>

              {tailoredData.missingSkills && tailoredData.missingSkills.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="font-bold text-red-800 mb-2">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {tailoredData.missingSkills.map((skill, i) => (
                      <span key={i} className="bg-white text-red-600 px-2 py-1 rounded border border-red-200 text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {tailoredData.suggestedSummaryChanges && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-2">Suggested Summary</h3>
                  <p className="text-sm text-blue-900 bg-white p-3 rounded border border-blue-200">{tailoredData.suggestedSummaryChanges}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={applyTailoring}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Apply Suggestions
                </button>
                <button
                  onClick={() => setTailoredData(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'header', label: 'Header', icon: Layout },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: CheckCircle },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'certifications', label: 'Certs', icon: Sparkles },
    { id: 'custom', label: 'Custom', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">RB</div>
          <h1 className="text-xl font-bold text-gray-800">Resume Builder Pro</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTailorModal(true)} className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition font-medium text-sm">
            <Sparkles size={16} /> Tailor
          </button>
          <button onClick={() => setShowImportResume(true)} className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Import</button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <button onClick={exportToPDF} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium">
            <Download size={16} /> PDF
          </button>
          <button onClick={exportToWord} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
            <FileText size={16} /> Word
          </button>
        </div>
      </header>

      {/* Main Content - Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Editor */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 p-2 gap-1 bg-gray-50 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors \${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }\`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Form */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {activeTab === 'header' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Header Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={resumeData.header.name} onChange={(e) => updateField('header', 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                    <input type="text" value={resumeData.header.title} onChange={(e) => updateField('header', 'title', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={resumeData.header.email} onChange={(e) => updateField('header', 'email', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={resumeData.header.phone} onChange={(e) => updateField('header', 'phone', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={resumeData.header.location} onChange={(e) => updateField('header', 'location', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input type="text" value={resumeData.header.linkedin} onChange={(e) => updateField('header', 'linkedin', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Summary</h2>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => updateField('summary', null, e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a compelling summary..."
                />
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Experience</h2>
                  <button onClick={addExperience} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Plus size={18} /> Add Job
                  </button>
                </div>
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between mb-4">
                      <div className="font-semibold text-gray-700">Job Details</div>
                      <button onClick={() => deleteExperience(exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="p-2 border rounded" placeholder="Company" />
                      <input type="text" value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} className="p-2 border rounded" placeholder="Title" />
                      <input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="p-2 border rounded" placeholder="Start Date" />
                      <input type="text" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="p-2 border rounded" placeholder="End Date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Bullets</label>
                      {exp.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex gap-2">
                          <textarea value={bullet} onChange={(e) => updateBullet(exp.id, idx, e.target.value)} className="flex-1 p-2 border rounded text-sm" rows="2" />
                          <button onClick={() => deleteBullet(exp.id, idx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button onClick={() => addBullet(exp.id)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Bullet</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Skills</h2>
                  <button onClick={addSkill} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Plus size={18} /> Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {resumeData.skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={skill} onChange={(e) => updateSkill(idx, e.target.value)} className="flex-1 p-2 border rounded" />
                      <button onClick={() => deleteSkill(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
               <div className="space-y-6 max-w-2xl mx-auto">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-bold text-gray-800">Education</h2>
                   <button onClick={addEducation} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                     <Plus size={18} /> Add Education
                   </button>
                 </div>
                 {resumeData.education.map((edu) => (
                   <div key={edu.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-4">
                     <div className="flex justify-between mb-2">
                       <h3 className="font-semibold text-gray-700">Education Details</h3>
                       <button onClick={() => deleteEducation(edu.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="p-2 border rounded w-full" placeholder="Degree" />
                       <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="p-2 border rounded w-full" placeholder="Institution" />
                       <input type="text" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="p-2 border rounded w-full" placeholder="Start Date" />
                       <input type="text" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="p-2 border rounded w-full" placeholder="End Date" />
                     </div>
                   </div>
                 ))}
               </div>
             )}

             {activeTab === 'certifications' && (
               <div className="space-y-6 max-w-2xl mx-auto">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-bold text-gray-800">Certifications</h2>
                   <button onClick={addCertification} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                     <Plus size={18} /> Add Cert
                   </button>
                 </div>
                 <div className="space-y-2">
                   {resumeData.certifications.map((cert, idx) => (
                     <div key={idx} className="flex gap-2">
                       <input type="text" value={cert} onChange={(e) => updateCertification(idx, e.target.value)} className="flex-1 p-2 border rounded" placeholder="Certification Name - Issuer - Date" />
                       <button onClick={() => deleteCertification(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                     </div>
                   ))}
                 </div>
               </div>
             )}

            {activeTab === 'custom' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Custom Sections</h2>
                  <button onClick={addCustomSection} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Plus size={18} /> Add Section
                  </button>
                </div>
                {resumeData.customSections.map((section) => (
                  <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-4">
                    <div className="flex justify-between mb-3">
                      <input type="text" value={section.title} onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)} className="font-semibold border rounded p-1" placeholder="Section Title" />
                      <button onClick={() => deleteCustomSection(section.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <textarea value={item} onChange={(e) => updateCustomItem(section.id, idx, e.target.value)} className="flex-1 p-2 border rounded text-sm" rows="2" />
                          <button onClick={() => deleteCustomItem(section.id, idx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button onClick={() => addCustomItem(section.id)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Item</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Preview */}
        <div className="w-1/2 bg-gray-200 overflow-y-auto p-8 flex justify-center">
          <div className="scale-90 origin-top">
            {template === 'modern' ? <ModernTemplate /> : template === 'ats' ? <ATSTemplate /> : <ClassicTemplate />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showIntro && <IntroModal />}
      {showTailorModal && <TailorModal />}
      
      {showImportResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Import Resume</h2>
            {!analyzedData ? (
              <>
                <textarea
                  value={importedResumeText}
                  onChange={(e) => setImportedResumeText(e.target.value)}
                  className="w-full h-64 border rounded p-3 mb-4"
                  placeholder="Paste your existing resume text here..."
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowImportResume(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                  <button onClick={analyzeImportedResume} disabled={analyzingResume} className="bg-blue-600 text-white px-4 py-2 rounded">
                    {analyzingResume ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                 <div className="p-4 bg-green-50 text-green-700 rounded border border-green-200">
                    Analysis Complete! We found {analyzedData.experience?.length || 0} jobs and {analyzedData.skills?.length || 0} skills.
                 </div>
                 <div className="flex justify-end gap-3">
                   <button onClick={() => setAnalyzedData(null)} className="px-4 py-2 text-gray-600">Back</button>
                   <button onClick={applyResumeUpdates} className="bg-green-600 text-white px-4 py-2 rounded">Apply Changes</button>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{\`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; left: 0; top: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \`}</style>
    </div>
  );
};

export default ResumeBuilder;
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated ResumeBuilder.tsx');
