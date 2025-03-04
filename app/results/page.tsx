'use client';
import { useSearchParams } from 'next/navigation';
import styles from '../styles/results.module.css';

export default function Results() {
  const searchParams = useSearchParams();
  const response = searchParams.get('response') || 'No response received.';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Answer</h1>
      <div className={styles.responseBox}>
        <p>{response}</p>
      </div>
    </div>
  );
}
