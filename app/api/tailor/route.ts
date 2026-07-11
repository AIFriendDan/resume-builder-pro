import { NextResponse } from 'next/server';
import { anthropic, HAIKU_MODEL, firstText } from '../../../lib/anthropic';

const TAILOR_SCHEMA = {
  type: 'object',
  properties: {
    current_analysis: {
      type: 'object',
      properties: {
        match_score: { type: 'integer' },
        impact_score: { type: 'integer' },
        missing_keywords: { type: 'array', items: { type: 'string' } },
        fluff_factor: { type: 'string', enum: ['High', 'Medium', 'Low'] },
        executive_summary: { type: 'string' },
      },
      required: ['match_score', 'impact_score', 'missing_keywords', 'fluff_factor', 'executive_summary'],
      additionalProperties: false,
    },
    tailored_content: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        suggested_bullet_improvements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              original: { type: 'string' },
              improved: { type: 'string' },
            },
            required: ['original', 'improved'],
            additionalProperties: false,
          },
        },
      },
      required: ['summary', 'suggested_bullet_improvements'],
      additionalProperties: false,
    },
    projected_analysis: {
      type: 'object',
      properties: {
        match_score: { type: 'integer' },
        impact_score: { type: 'integer' },
      },
      required: ['match_score', 'impact_score'],
      additionalProperties: false,
    },
  },
  required: ['current_analysis', 'tailored_content', 'projected_analysis'],
  additionalProperties: false,
};

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    const body = await req.json();
    const { jobDescription, resume } = body;

    console.log("Tailor Request Received (Claude)");
    console.log("JD Length:", jobDescription?.length);
    const resumeString = JSON.stringify(resume, null, 2);
    console.log("Resume Length:", resumeString.length);

    if (!jobDescription || !resume) {
      return NextResponse.json({ error: 'Both jobDescription and resume are required.' }, { status: 400 });
    }

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

    IMPORTANT:
    - "match_score" and "impact_score" must be integers between 0 and 100.
    - "fluff_factor" must be one of: "High", "Medium", "Low".
    `;

    const message = await anthropic.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 4096,
      system: 'You are an expert ATS resume consultant. You MUST return valid JSON matching the requested structure.',
      messages: [{ role: 'user', content: prompt }],
      output_config: { format: { type: 'json_schema', schema: TAILOR_SCHEMA } },
    });

    const content = firstText(message.content);
    console.log("Claude Raw Response:", content);

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
    return NextResponse.json({ error: 'Failed to tailor resume: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
