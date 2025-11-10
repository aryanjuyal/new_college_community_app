import React, { useState, useEffect, useRef } from 'react';
import { queryChatbot } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';

// --- Chatbot Icon (self-contained SVG) ---
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
  </svg>
);
// --- End Icons ---

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am the campus assistant. How can I help you today?' }
  ]);
  const messagesEndRef = useRef(null); // To auto-scroll

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // This function is defined in api.js
      const response = await queryChatbot(input);
      
      // The response from your local API
      const botReply = response.data.reply || 'Sorry, I am having trouble connecting.';
      const newBotMessage = { from: 'bot', text: botReply };
      setMessages(prev => [...prev, newBotMessage]);

    } catch (err) {
      console.error('Chatbot API error:', err);
      const msg = err.response?.data?.error || 'Failed to get a response from the bot.';
      setError(msg);
      // Add an error message to the chat
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I am unable to connect right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* The Chat Modal/Window */}
      {isOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <h3>Campus Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="chat-close-button">
              <CloseIcon />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <ErrorMessage message={error} />
            {/* This empty div is the target for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="chat-send-button" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}

      {/* The Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="chat-float-button">
        <ChatIcon />
      </button>
    </div>
  );
}

export default Chatbot;