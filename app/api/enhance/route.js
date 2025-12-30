import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, role, company } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    const prompt = `
    Enhance this resume bullet point using the STAR method (Situation, Task, Action, Result).
    Make it impactful, quantitative if possible, and professional.
    Keep it under 200 characters.

    Bullet: "${text}"
    Role: ${role || "N/A"}
    Company: ${company || "N/A"}

    Return ONLY the enhanced bullet text string. No quotes, no explanation.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert resume writer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const enhancedText = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ output: enhancedText });

  } catch (error) {
    console.error("Enhance error:", error);
    return NextResponse.json(
      { error: "Failed to enhance text" },
      { status: 500 }
    );
  }
}
