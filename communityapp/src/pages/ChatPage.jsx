import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatMessages, sendChatMessage } from '../services/api';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function ChatPage() {
  const { userId } = useParams(); // This is the ID of the person we are chatting with
  const { user } = useAuth(); // This is our (the logged-in user's) ID
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null); // To auto-scroll to bottom

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch message history on component load
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getChatMessages(userId);
        setMessages(response.data.messages || response.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load messages.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [userId]);
  
  // NOTE: In a real app, you would use WebSockets.
  // We will use simple polling (checking every 3 seconds) as a placeholder.
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await getChatMessages(userId);
        setMessages(response.data.messages || response.data);
      } catch (err) {
        console.log('Polling for messages failed');
      }
    }, 3000); // Poll every 3 seconds
    
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await sendChatMessage(userId, newMessage);
      // Add new message to the list immediately
      setMessages([...messages, response.data.newMessage]);
      setNewMessage('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message.';
      setError(msg);
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        {/* You would fetch the other user's name here */}
        Chatting with User
      </div>
      
      {isLoading && <LoadingSpinner fullPage={false} />}
      <ErrorMessage message={error} />

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message-bubble ${msg.sender === user._id ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
        {/* This empty div is the target for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.g.value)}
        />
        <button type="submit" className="chat-send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;