import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const HAIKU_MODEL = 'claude-haiku-4-5';

export function firstText(content: Anthropic.ContentBlock[]): string {
  const block = content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  if (!block) throw new Error('No text content in Claude response');
  return block.text;
}
