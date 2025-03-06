'use client';
import { useSearchParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import styles from '../styles/results.module.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function Results() {
  const searchParams = useSearchParams();
  const response = searchParams.get('response') || 'No response received.';

  return (
    <div className={`${styles.container} ${inter.className}`}>
      <div className={styles.card}>
        <h1 className={styles.title}>Answer</h1>
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
