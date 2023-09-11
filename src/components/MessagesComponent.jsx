import React from 'react';
import MessageComponent from './MessageComponent';

const MessagesComponent = ({ messages }) => {
  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <MessageComponent key={index} message={message} />
      ))}
    </div>
  );
};

export default MessagesComponent;
