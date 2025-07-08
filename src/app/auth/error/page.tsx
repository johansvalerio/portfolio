'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    console.error('Authentication error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-4">
          {error === 'OAuthCallback' 
            ? 'There was an error during authentication. Please try again.'
            : 'An unexpected error occurred. Please try again later.'}
        </p>
        <p className="text-sm text-gray-500">
          Error code: {error || 'unknown'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
