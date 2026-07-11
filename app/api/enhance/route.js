import { NextResponse } from "next/server";
import { anthropic, HAIKU_MODEL, firstText } from "../../../lib/anthropic";

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

    const message = await anthropic.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 256,
      system: "You are an expert resume writer.",
      messages: [{ role: "user", content: prompt }],
    });

    const enhancedText = firstText(message.content).trim();

    return NextResponse.json({ output: enhancedText });

  } catch (error) {
    console.error("Enhance error:", error);
    return NextResponse.json(
      { error: "Failed to enhance text" },
      { status: 500 }
    );
  }
}
