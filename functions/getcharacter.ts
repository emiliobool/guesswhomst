import { OpenAI } from "openai";

export async function onRequest({ request, env }) {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const { topic  } = await request.json();
  const MODEL = env.OPENAI_MODEL || "gpt-3.5-turbo"
  const gptResponse = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable entity about the ${topic} universe. When asked, you will provide the name of a single character from this universe and nothing else.`,
      },
      {
        role: "user",
        content: `Please tell me a random character from the ${topic} universe.`,
      },
    ],
    max_tokens: 60,
    temperature: 1
  });

  const character = gptResponse.choices[0]?.message?.content?.trim();
  if (!character) {
    throw new Error("No character found");
  }
  return new Response(character);
}
