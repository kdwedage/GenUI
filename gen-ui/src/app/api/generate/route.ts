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
  });

  const message = completion.choices[0].message?.content;
  if (!message) {
    return new Response(JSON.stringify({ error: 'No response from model' }), { status: 500 });
  }

  const { ui, css } = JSON.parse(message);
  return new Response(JSON.stringify({ ui, css }), {
    headers: { 'Content-Type': 'application/json' },
  });
}