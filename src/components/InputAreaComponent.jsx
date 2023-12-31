import React, { useEffect, useRef } from "react";

const InputAreaComponent = ({ onSendMessage, askDisabled, guessDisabled }) => {
  const [message, setMessage] = React.useState("");
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClick = () => {
      if (window.getSelection().toString() === "") {
        focusInput();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = () => {
      if (window.getSelection().toString() === "") {
        focusInput();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  useEffect(focusInput, []);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleAskSubmit = (event) => {
    if (askDisabled && guessDisabled) return;
    if (event.key && event.key !== "Enter") return;
    event.preventDefault();
    if (event.shiftKey) {
      onSendMessage(message, "guess");
    } else {
      onSendMessage(message, "ask");
    }
    setMessage("");
  };

  const handleGuessSubmit = (event) => {
    event.preventDefault();
    onSendMessage(message, "guess");
    setMessage("");
  };

  return (
    <div className="flex items-center justify-between px-0 pt-4 pb-0">
      <input
        ref={inputRef}
        type="text"
        value={message}
        disabled={askDisabled && guessDisabled}
        onChange={handleInputChange}
        onKeyDown={handleAskSubmit}
        className="flex-grow mr-4 p-2 rounded-lg border-gray-200"
        placeholder="Type your message here..."
      />
      <button
        onClick={handleAskSubmit}
        disabled={askDisabled}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 mr-2"
      >
        Ask
      </button>
      <button
        onClick={handleGuessSubmit}
        disabled={guessDisabled}
        className="bg-green-600 text-white rounded-lg px-4 py-2"
      >
        Guess
      </button>
    </div>
  );
};
export default InputAreaComponent;
