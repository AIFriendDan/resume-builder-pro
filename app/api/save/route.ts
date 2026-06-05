import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 });
    }

    const resume = await prisma.resume.create({
      data: { title, content },
    });

    return NextResponse.json({ id: resume.id });
  } catch (err) {
    console.error("Save error:", err);
    return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
  }
}
