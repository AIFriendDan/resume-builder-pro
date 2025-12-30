import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    const body = await req.json();
    const { jobDescription, resume } = body;

    console.log("Tailor Request Received (Groq)");
    // Increased logging for debugging
    console.log("JD Length:", jobDescription?.length);
    const resumeString = JSON.stringify(resume, null, 2);
    console.log("Resume Length:", resumeString.length);

    if (!jobDescription || !resume) {
      return NextResponse.json({ error: 'Both jobDescription and resume are required.' }, { status: 400 });
    }

    // Increased context limit to prevent cutting off skills
    const TRUNCATE_LIMIT = 20000;

    const prompt = `
    You are an expert ATS (Applicant Tracking System) and Recruiter.
    Analyze the following resume against the job description.

    JOB DESCRIPTION:
    ${jobDescription.substring(0, TRUNCATE_LIMIT)}

    RESUME:
    ${resumeString.substring(0, TRUNCATE_LIMIT)}

    Perform three tasks:
    1. ANALYZE the current resume against the JD.
    2. TAILOR the resume (rewrite the summary and provide specific bullet point improvements) to maximize the Match Score and Impact Score.
    3. PREDICT the scores of the tailored resume.

    CRITICAL INSTRUCTIONS FOR "missing_keywords":
    - Identify ALL critical HARD SKILLS and TECHNOLOGIES from the JD that are completely absent from the Resume.
    - Be EXHAUSTIVE: If the JD mentions 10 required skills and the resume is missing 5, list ALL 5.
    - Do NOT list keywords that are already present in the Resume (check for case variations, e.g., "React" vs "react.js").
    - Do NOT list soft skills like "leadership" or "communication" as missing keywords. Focus on technical/hard skills.
    - If the resume already has the skill, do NOT suggest it.

    Return ONLY a JSON object with this exact structure (do not include markdown formatting or explanations):
    {
      "current_analysis": {
        "match_score": 50,
        "impact_score": 50,
        "missing_keywords": ["keyword1", "keyword2"],
        "fluff_factor": "Medium",
        "executive_summary": "One sentence hard-hitting critique"
      },
      "tailored_content": {
        "summary": "The rewritten, high-impact professional summary",
        "suggested_bullet_improvements": [
          {
            "original": "Original bullet text",
            "improved": "Rewritten bullet with metrics and keywords"
          }
        ]
      },
      "projected_analysis": {
        "match_score": 85,
        "impact_score": 85
      }
    }

    IMPORTANT:
    - "match_score" and "impact_score" must be integers between 0 and 100.
    - "fluff_factor" must be one of: "High", "Medium", "Low".
    - "executive_summary" must be a string.
    - Ensure all keys are lowercase as shown in the example.
    `;

    const completion = await openai.chat.completions.create({
      // Upgraded model for better reasoning
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { role: 'system', content: 'You are an expert ATS resume consultant. You MUST return valid JSON matching the requested structure.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1, // Lower temperature for more deterministic results
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    console.log("Groq Raw Response:", content);
    
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Tailor error:', error);
    // Fallback to smaller model if 70b fails (e.g. rate limits)
    if (error.status === 404 || error.status === 400 || error.code === 'model_not_found') {
        console.log("Fallback to 8b model due to error");
        // ... (We could implement retry logic here, but for now just error out to see the issue)
    }
    return NextResponse.json({ error: 'Failed to tailor resume: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
