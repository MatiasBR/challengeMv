'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
  
    setIsLoading(true);
  
    try {
      const apiResponse = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
  
      const data = await apiResponse.json();
      console.log('API Response:', data);
  
      if (data && data.answer) {
        router.push(`/results?response=${encodeURIComponent(data.answer)}`);
      } else {
        console.error('Invalid API response:', data);
        router.push(`/results?response=${encodeURIComponent('ERROR. Please, try again')}`);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      router.push(`/results?response=${encodeURIComponent('ERROR. Please, try again')}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ask a Question</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write your question here..."
          className={styles.input}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
