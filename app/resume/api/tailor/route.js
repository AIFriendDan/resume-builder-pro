export async function POST(req) {
  const { jobDescription, resume } = await req.json();

  const prompt = `
  Analyze job description and resume. Return ONLY JSON:
  {
    "matchScore": "X%",
    "skillsToHighlight": [],
    "missingSkills": [],
    "suggestedSummaryChanges": "",
    "bulletPointFocus": [],
    "keywordsToAdd": []
  }

  JOB:
  ${jobDescription}

  RESUME:
  ${JSON.stringify(resume, null, 2)}
  `;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await r.json();
  const textBlock = data.content?.find((c) => c.type === "text")?.text;

  return Response.json(JSON.parse(textBlock));
}
