import React, { useState, useEffect, useCallback } from "react";
import * as api from "../api/apiClient";

type Message = {
  text:
    | string
    | React.ReactNode
    | ((params: {
        stage: string;
        character: string;
        messages: Message[];
        topic: string;
      }) => React.ReactNode);
  sender: "Bot" | "You";
  time: Date;
};

type Stage =
  | "start"
  | "topicSelection"
  | "characterGeneration"
  | "questionStage"
  | "guessStage"
  | "gameEnded";

function botMessage(text): Message {
  return {
    text,
    sender: "Bot",
    time: new Date(),
  };
}

const topics = ["Movies", "TV", "Video Games", "Books", "Anime"];

const useStageTransition = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize state for game stage
  const [stage, setStage] = useState<Stage>("start");
  const [character, setCharacter] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  // const [title, setTitle] = useState<string>("");

  const addMessage = useCallback(
    (message: Message) =>
      setMessages((prevMessages) => [...prevMessages, message]),
    []
  );

  const resetGame = () => {
    setMessages([]);
    setCharacter("");
    setTopic("");
    // setTitle("");
    setStage("start");
  };

  const getCharacter = useCallback(async () => {
    // const title = await api.getTitle(topic);
    // setTitle(title);

    const name = await api.getCharacter(topic);
    setCharacter(name);
    addMessage({
      text: <>I'm thinking of a character in the  <strong className="text-white">{topic}</strong> category.<br /> 
      <strong className="text-yellow-500">Your goal</strong> is to guess whomst character it is in as few questions as possible, 
      and when you are ready you can press <strong className="text-green-600">guess</strong> to send your answer, 
      but if you get it wrong you <strong className="text-red-500">lose</strong>! 
      You can't ask more than <strong className="text-blue-500">20 questions</strong> either. <br />
      And I'll only answer with <strong className="text-white">yes</strong>, <strong className="text-white">no</strong> or <strong className="text-white">maybe</strong>. 
      <br />
      <strong className="font-italic">Start asking questions!</strong></>,
      sender: "Bot",
      time: new Date(),
    });
    setStage("questionStage");
  }, [topic]);

  // Call handleStageTransition whenever the stage or messages state changes
  useEffect(() => {
    if (stage === "start") {
      setMessages([
        {
          text: 
              <>
                Please send a message with a movie, show, videogame or anime where you want to try to guess a character.
              </>
          ,
          sender: "Bot",
          time: new Date(),
        },
      ]);
      setStage("topicSelection");
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "topicSelection") {
      if (topic) {
        setStage("characterGeneration");
        getCharacter();
      }
    }
  }, [topic]);

  function addQuestionsOverMessage() {
    addMessage({
      text: `You've asked 20 questions. Now, you can only guess. Write your name and press Guess.`,
      sender: "Bot",
      time: new Date(),
    });
  }

  function gameEndedMessage() {
    addMessage({
      text: (
        <>
          The game has ended, Click <strong>Start</strong> to start a new game.
          <div>
            <button className="btn btn-secondary" onClick={resetGame}>
              Start Game
            </button>
          </div>
        </>
      ),
      sender: "Bot",
      time: new Date(),
    });
  }
  useEffect(() => {
    if (stage === "questionStage" && messages.length > 20) {
      addQuestionsOverMessage();
      setStage("guessStage");
    }
  }, [messages]);

  const guess = useCallback(
    async (message: string) => {
      addMessage({ text: message, sender: "You", time: new Date() });

      // Make an API call to get a reply
      const correct = await api.guessCharacter(
        message,
        character,
        topic,
      );
      // Add the reply to the messages array
      addMessage({
        text: correct ? (
          <>
            <strong>YOU WIN!</strong> the character was{" "}
            <strong>{character}</strong> from <strong>{topic}</strong>!
          </>
        ) : (
          <>
            <strong>YOU LOST</strong>, the character was{" "}
            <strong>{character}</strong> from <strong>{topic}</strong>
          </>
        ),
        sender: "Bot",
        time: new Date(),
      });

      setStage("gameEnded");
      gameEndedMessage();
    },
    [character, topi, ]
  );

  const ask = useCallback(
    async (message: string) => {
      addMessage({ text: message, sender: "You", time: new Date() });
      console.log("ask", message, stage);
      // if topicSelection Stage, then pick topic
      if (stage === "topicSelection") {
        // const title = await api.getTitle(message);
        setTopic(message);
        // setTitle(title);
      } else if (stage === "questionStage") {
        console.log("askQuestion", message, character, topic);
        const reply = await api.askQuestion(message, character, topic );
        // Add the reply to the messages array
        addMessage(botMessage(reply));
      } else if (stage === "guessStage") {
        // can't ask questions anymore, need to guess
        addQuestionsOverMessage();
      } else if (stage === "gameEnded") {
        gameEndedMessage();
      }
    },
    [stage, character, topic]
  );

  return {
    stage,
    setStage,
    character,
    topic,
    messages,
    guess,
    ask,
    setTopic,
    // title,
  };
};

export default useStageTransition;
