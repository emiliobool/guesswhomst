import { OpenAI } from "openai";

export async function onRequest({ request, env }) {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const { topic } = await request.json();

  const MODEL = env.OPENAI_MODEL || "gpt-3.5-turbo"
  const gptResponse = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable entity about ${topic}. When asked, you will provide the title of a random ${topic} and nothing else. The title doesn't have to be popular, it can be anything, be free to pic anything within the topic.`,
      },
      {
        role: "user",
        content: `Give me a random ${topic} title.`,
      },
    ],
    // functions: [
    //   {
    //     name: "reply",
    //     description: `Reply with a popular ${topic}`,
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         title: {
    //           type: "string",
    //         },
    //       },
    //       required: ["title"],
    //       additionalProperties: false,
    //     },
    //   },
    // ],
    // function_call: { name: "reply" },
    max_tokens: 60,
    temperature: 1,
  });

  // let response = gptResponse?.choices?.[0]?.message?.function_call?.arguments;
  let response = gptResponse?.choices?.[0]?.message?.content;

  console.log("response", response);

  return new Response(response);
}

