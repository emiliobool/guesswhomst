import { OpenAI } from "openai";

export async function onRequest({ request, env }) {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const { guess, topic, character, title } = await request.json();

  const MODEL = env.OPENAI_MODEL || "gpt-3.5-turbo"

  const gptResponse = await openai.chat.completions.create({
    model: `${MODEL}-0613`,
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable entity about the ${title} ${topic} universe. The user will mention a character, if it is the character "${character}" answer with true, otherwise false`,
      },
      {
        role: "user",
        content: guess,
      },
    ],
    functions: [
      {
        name: "reply",
        description: `Reply with true or false if the user character is ${character} from ${title}`,
        parameters: {
          type: "object",
          properties: {
            correct: {
              type: "boolean",
              enum: [true, false],
            },
          },
          required: ["correct"],
        },
      },
    ],
    function_call: { name: "reply" },
    max_tokens: 60,
    temperature: 0,
  });

  let response = gptResponse?.choices?.[0]?.message?.function_call?.arguments;

  console.log("response", response);

  return new Response(response);
}
