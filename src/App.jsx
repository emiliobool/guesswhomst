import React, { useState, useEffect, useImperativeHandle } from "react";
import "./App.css";
import InputAreaComponent from "./components/InputAreaComponent";
import useStageTransition from "./hooks/useStageTransition";

function App() {
  const { stage, character, topic, title, messages, guess, ask } =
    useStageTransition();


  // Function to handle sending message
  const handleSendMessage = async (message, type) => {
    if (type === "ask") {
      ask(message);
    } else if (type === "guess") {
      guess(message);
    }
  };

  const chatEndRef = React.useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full p-4 flex flex-col mx-auto max-w-2xl">
      <header className="pb-4">
        <h1 className="text-3xl font-bold text-left">
          🤖 Guess Whomst Bot {topic && `(Topic: ${topic})`}
        </h1>
      </header>
      <div className="chat-window bg-white rounded-lg shadow-md w-full flex-grow overflow-y-auto">
        <div className="messages overflow-y-auto h-full w-full p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat chat-${
                message.sender === "Bot" ? "end" : "start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-15 rounded-full text-6xl">
                  {message.sender === "Bot" ? "🤖" : "👤"}
                </div>
              </div>
              <div className="chat-header font-bold text-lg">
                {message.sender}
              </div>
              <div
                className={`chat-bubble chat-bubble-${
                  message.sender === "Bot" ? "primary" : message.guess ? "secondary": ""
                } text-lg`}
              >
                {typeof message.text === "function"
                  ? message.text({ stage, topic, title, character, messages })
                  : message.text}
              </div>

              <div className="chat-footer">
                <time className="text-xs">
                  {message.time.toLocaleTimeString()}
                </time>
              </div>
            </div>
          ))}

          <div className="chat chat-start hidden chat-bubble-primary"></div>
          <div className="chat chat-end hidden chat-bubble-secondary"></div>

          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="input-area w-full">
        <InputAreaComponent
          askDisabled={stage === "guessStage" || stage === "gameEnded"}
          guessDisabled={
            stage === "start" ||
            stage === "topicSelection" ||
            stage === "gameEnded"
          }
          onSendMessage={handleSendMessage}
          className="mt-4"
        />
      </div>
    </div>
  );
}
export default App;
