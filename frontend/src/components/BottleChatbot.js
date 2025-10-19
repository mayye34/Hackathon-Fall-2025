import React, { useState } from 'react'; 
import './BottleChatbot.css'; 
import bottle from '../assets/bottle.png';

function BottleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Send to backend (you’ll create this endpoint later)
    const response = await fetch('https://your-api-endpoint/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
  };

  return (
    <>
      {/* Floating bottle button */}
      {/* <div className="bottle-button">
        <img src={bottle} alt="Bottle" />
        <button className="bottle-hotspot" onClick={toggleChat}></button>
      </div>  */}

      {/* <img 
        src={bottle}
        alt="bottle"
        onClick={toggleChat}
        className="bottle-button"
      /> */}
      
      <div className="bottle-button" onClick={toggleChat}>
        <img src={bottle} alt="bottle" />
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbox">
          <div className="chat-header">Ask MedCheck</div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default BottleChatbot;
