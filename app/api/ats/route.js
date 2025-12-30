export async function POST(req) {
  const { resume } = await req.json();

  // We can compute ATS score manually (faster + free)
  const score = 70; // placeholder

  return Response.json({ score });
}
