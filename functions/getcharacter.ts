import { OpenAI } from "openai";

export async function onRequest({ request, env }) {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const { topic, title } = await request.json();

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable entity about the ${title} ${topic} universe. When asked, you will provide the name of a single character from this universe and nothing else.`,
      },
      {
        role: "user",
        content: `Please tell me a random character from the ${title} universe.`,
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
