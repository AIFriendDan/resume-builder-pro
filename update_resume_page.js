const fs = require('fs');

const filePath = 'C:\\Users\\danra\\Documents\\Project_Workspace\\aifrienddan.com\\app\\resume\\page.tsx';

const newContent = `"use client";

import ResumeBuilder from "../../components/ResumeBuilder";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeBuilder />
    </div>
  );
}
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated app/resume/page.tsx');
