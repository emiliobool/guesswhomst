import React from 'react';

const MessageComponent = ({ message }) => {
  return (
    <div className="message">
      <p>{message}</p>
    </div>
  );
};

export default MessageComponent;
