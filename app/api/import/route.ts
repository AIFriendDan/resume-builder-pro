import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body; 

    if (!text) {
      return NextResponse.json({ error: 'Resume text is required.' }, { status: 400 });
    }

    const prompt = `Analyze this resume text and extract the structured data.
    
    RESUME TEXT:
    ${text}
    
    Return ONLY a JSON object with this exact structure:
    {
      "title": "Professional Title",
      "summary": "Professional Summary",
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        {
          "company": "Company Name",
          "title": "Job Title",
          "startDate": "Start Date",
          "endDate": "End Date",
          "bullets": ["Achievement 1", "Achievement 2"]
        }
      ],
      "education": [
        {
           "degree": "Degree Name",
           "institution": "Institution Name",
           "startDate": "Start Date",
           "endDate": "End Date"
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a precise resume parser. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    const parsedData = JSON.parse(content || '{}');

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
  }
}