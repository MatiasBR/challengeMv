'use client';
import { useSearchParams } from 'next/navigation';

export default function Results() {
  const searchParams = useSearchParams();
  const response = searchParams.get('response') || 'No response received.';

  return (
    <div>
      <h1>Response</h1>
      <p>{response}</p>
    </div>
  );
}
