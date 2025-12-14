import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { resume_text, job_description_text } = body;

    // Step 1: hard guard to ensure both artifacts are provided
    if (!resume_text || !job_description_text) {
      return NextResponse.json(
        {
          error:
            "Both resume_text and job_description_text are required."
        },
        { status: 400 }
      );
    }

    // Step 2: build comparative prompt that powers the tailoring request
    const prompt = `
You are an ATS-aware resume optimization assistant.

JOB DESCRIPTION:
${job_description_text}

CURRENT RESUME:
${resume_text}

TASK:
- Extract key skills, responsibilities, and keywords from the job description
- Compare them against the resume
- Rewrite the resume to better align with the job description
- Do NOT invent experience
- Preserve truthful content
- Optimize for ATS readability
- Return ONLY the optimized resume text
`;

    // Step 3: call OpenAI to transform the resume
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You optimize resumes accurately." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const optimizedResume =
      completion.choices[0]?.message?.content;

    // Step 4: validate response before returning
    if (!optimizedResume) {
      throw new Error("No optimized resume returned.");
    }

    return NextResponse.json({
      optimized_resume: optimizedResume
    });
  } catch (error) {
    console.error("Tailor error:", error);

    return NextResponse.json(
      {
        error: "Failed to tailor resume"
      },
      { status: 500 }
    );
  }
}
