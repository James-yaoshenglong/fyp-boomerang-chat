import './App.css';
import React, { useState } from "react";
import { Input } from 'react-chat-elements';
import ChatWindow from './ChatWindow.js';
import "react-chat-elements/dist/main.css";

function App() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (text) => {
    const newMessage = {
      position: "right",
      type: "text",
      text: text,
      date: new Date(),
    };

    setMessages((prevState) => [...prevState, newMessage]);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <ChatWindow
        messages={messages}
        renderMessageContent={(message) => message.text}
      />
    </div>
  );
}

export default App;
