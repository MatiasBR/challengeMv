'use client'; 
import { useSearchParams } from 'next/navigation'; 
import { Inter } from 'next/font/google'; 
import styles from '../styles/results.module.css'; 

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] }); 

// Define the Results component as the default export.
export default function Results() { 
  const searchParams = useSearchParams(); 
  const response = searchParams.get('response') || 'No response received.'; 

  // Return the JSX for rendering the results page.
  return (
    <div className={`${styles.container} ${inter.className}`}> 
      {/* Container for the card with the answer */}
      <div className={styles.card}> 
        {/* Title of the answer */}
        <h1 className={styles.title}>Answer</h1> 
        {/* Box to display the response */}
        <div className={styles.responseBox}> 
          <p>{response}</p> 
        </div>
        <button className={styles.button} onClick={() => window.history.back()}> 
          Go Back
        </button>
      </div>
    </div>
  );
}

