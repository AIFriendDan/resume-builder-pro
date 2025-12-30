import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobTitle, company, hiringManager, resumeSummary, experience, skills } = body;

    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'Job title and company are required.' }, { status: 400 });
    }

    const prompt = `Based on this resume information, generate a professional cover letter for the position of ${jobTitle} at ${company}${hiringManager ? ', addressed to ' + hiringManager : ''}.

Resume Summary: ${resumeSummary}

Recent Experience:
${experience}

Key Skills: ${skills}

Write a compelling cover letter that:
1. Opens with enthusiasm for the specific role
2. Highlights 2-3 relevant achievements from the resume
3. Connects my experience to the role requirements
4. Shows knowledge of the company (be generic if company is unknown)
5. Closes with a strong call to action
6. Keep it to 3-4 paragraphs, professional but conversational tone
7. Format it properly with date, addresses, greeting, and signature block

Return ONLY the cover letter text, no preamble or explanation.
`;

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a professional cover letter writer.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });

    const coverLetter = completion.choices[0]?.message?.content;

    return NextResponse.json({ content: coverLetter });

  } catch (error) {
    console.error('Cover letter error:', error);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}