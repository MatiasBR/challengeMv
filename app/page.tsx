'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import styles from './styles/home.module.css';

// Configure the Inter font with specific subsets and weights.
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

// Define the Home component as the default export.
export default function Home() {
  // Set up state variables for managing the query input and loading state.
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Function to handle form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If the query is empty or contains only whitespace, return early.
    if (!query.trim()) return;

    // Set the loading state to true while the API request is being processed.
    setIsLoading(true);

    try {
      // Make a POST request to the '/api/ask' endpoint with the query as the request body.
      const apiResponse = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      // Check if the API response is successful.
      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      // Parse the JSON response from the API.
      const data = await apiResponse.json();

      // Log the API response to the console for debugging purposes.
      console.log('API Response:', data);

      // Validate the API response and navigate to the results page.
      if (data && typeof data === 'object' && data.answer && typeof data.answer === 'string') {
        // Construct the URL with query parameters manually
        const searchParams = new URLSearchParams({ response: data.answer });
        router.push(`/results?${searchParams.toString()}`);
      } else {
        throw new Error('Invalid API response: Missing or invalid answer');
      }
    } catch (error) {
      // Log any errors that occur during the API request and navigate to the results page with an error message.
      console.error('Error fetching response:', error);
      const searchParams = new URLSearchParams({ response: 'Error. Please, try again' });
      router.push(`/results?${searchParams.toString()}`);
    } finally {
      // Set the loading state back to false after the API request is complete.
      setIsLoading(false);
    }
  };

  // Return the JSX for rendering the home page.
  return (
    <div className={`${styles.container} ${inter.className}`}>
      {/* Container for the card with the form */}
      <div className={styles.card}>
        {/* Title of the form */}
        <h1 className={styles.title}>Ask a Question</h1>
        {/* Form for submitting the query */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Input field for entering the query */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Write your question here..."
            className={styles.input}
            disabled={isLoading}
          />
          {/* Submit button for the form */}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}