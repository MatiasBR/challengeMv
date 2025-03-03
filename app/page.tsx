'use client'; 

import { useState, useEffect, useRef } from 'react';
import styles from './styles/home.module.css'

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function Home() {
  const [query, setQuery] = useState(''); // Query state
  const [messages, setMessages] = useState<Message[]>([]); // Memory state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const chatContainerRef = useRef<HTMLDivElement>(null); // Reference to the placeholder

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!query.trim()) return; 

    setIsLoading(true); 
    setMessages((prev) => [...prev, { text: query, sender: 'user' }]); 
    setQuery(''); 

    try {
      const apiResponse = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),  
      });

      const data = await apiResponse.json(); 
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]); 
    } catch (error) {
      console.error('Error looking for the answer.', error);
      setMessages((prev) => [
        ...prev,
        { text: 'ERROR. Please, try again', sender: 'bot' },
      ]); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Make a Question!</h1>

      {/* Chat Area */}
      <div ref={chatContainerRef} className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            }`}
          >
            <div className={styles.messageContent}>
              {message.sender === 'bot' && <div className={styles.botIcon}>🤖</div>}
              <p className={styles.messageText}>{message.text}</p>
              {message.sender === 'user' && <div className={styles.userIcon}>👤</div>}
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            <div className={styles.messageContent}>
              <div className={styles.botIcon}>🤖</div>
              <p className={styles.messageText}>Writting...</p>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Write your question here..."
          className={styles.input}
          disabled={isLoading} 
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading} 
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}