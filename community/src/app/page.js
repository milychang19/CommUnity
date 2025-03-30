'use client'; // This marks the component as a client-side component
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the landing page immediately after the component is mounted
    router.replace('/landing');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
    </div>
  );
}
