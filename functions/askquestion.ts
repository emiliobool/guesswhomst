import { OpenAI } from "openai";

export async function onRequest({ request, env }) {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const { question, topic, character, title } = await request.json();

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable entity about the ${title} ${topic} universe. You will be asked with a yes/no question for the character "${character}", and you must answer with yes, no or maybe and nothing else.`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    functions: [
      {
        name: "reply",
        description: `Reply with yes, no or maybe to the question about the character ${character} from ${title}`,
        parameters: {
          type: "object",
          properties: {
            reply: {
              type: "string",
              enum: ["yes", "no", "maybe"],
            },
          },
          required: ["reply"],
          additionalProperties: false,
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
