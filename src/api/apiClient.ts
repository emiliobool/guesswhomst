
type AskQuestionResponse = {
  reply: string;
};

export async function askQuestion(question, character, topic, title): Promise<string> {
  const response = await fetch("/askquestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, character, topic, title }),
  });

  const data = await response.json() as AskQuestionResponse;
  return data.reply
}

type GetTittleResponse = string

export async function getTitle(topic): Promise<string> {
  const response = await fetch("/gettitle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  const data = await response.text() as GetTittleResponse;
  return data
}

type GuessCharacterResponse = {
  correct: boolean;
};

export async function guessCharacter(guess, character, topic, title): Promise<boolean> {
  const response = await fetch("/guesscharacter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ guess, character, topic, title }),
  });

  const data = await response.json() as GuessCharacterResponse;
  return data.correct
}
type GetCharacterResponse = string

export async function getCharacter(topic, title): Promise<string> {
  const response = await fetch("/getcharacter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, title }),
  });
  const data = await response.text() as GetCharacterResponse;
  return data
}
