import { NextResponse } from 'next/server';
import { anthropic, HAIKU_MODEL, firstText } from '../../../lib/anthropic';

const IMPORT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    skills: { type: 'array', items: { type: 'string' } },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          title: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
        required: ['company', 'title', 'startDate', 'endDate', 'bullets'],
        additionalProperties: false,
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
        },
        required: ['degree', 'institution', 'startDate', 'endDate'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'summary', 'skills', 'experience', 'education'],
  additionalProperties: false,
};

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
    `;

    const message = await anthropic.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 4096,
      system: 'You are a precise resume parser.',
      messages: [{ role: 'user', content: prompt }],
      output_config: { format: { type: 'json_schema', schema: IMPORT_SCHEMA } },
    });

    const parsedData = JSON.parse(firstText(message.content));

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
  }
}
