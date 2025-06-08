import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { description } = await req.json();

  const prompt = `You are an expert UI developer. Given the following description, return HTML with Tailwind CSS and a separate CSS-only version.

Description: ${description}

Return JSON with keys: ui (html string) and css (scss string).`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: 'json',
  });

  return new Response(JSON.stringify(completion.choices[0].message.content), {
    headers: { 'Content-Type': 'application/json' },
  });
}