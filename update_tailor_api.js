const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\danra\\Documents\\Project_Workspace\\aifrienddan.com\\app\\api\\tailor\\route.ts';

const newContent = `import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function POST(req) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    const body = await req.json();
    const { jobDescription, resume } = body;

    if (!jobDescription || !resume) {
      return NextResponse.json({ error: 'Both jobDescription and resume are required.' }, { status: 400 });
    }

    const prompt = \`Analyze the following job description and resume.
    
    JOB DESCRIPTION:
    \${jobDescription}
    
    RESUME:
    \${JSON.stringify(resume, null, 2)}
    
    Return ONLY a JSON object (no markdown, no other text) with this exact structure:
    {
      "matchScore": "A percentage string (e.g., '85%')",
      "skillsToHighlight": ["skill1", "skill2"],
      "missingSkills": ["skill1", "skill2"],
      "suggestedSummaryChanges": "A string paragraph suggesting changes to the summary.",
      "bulletPointFocus": ["suggestion1", "suggestion2"],
      "keywordsToAdd": ["keyword1", "keyword2"]
    }
    \`;

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are an expert ATS resume consultant. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from AI model');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Tailor error:', error);
    return NextResponse.json({ error: 'Failed to tailor resume: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated tailor route');
