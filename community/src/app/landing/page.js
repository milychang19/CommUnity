// src/app/pages/landing.js
'use client';  // This makes it a client-side component

import React from 'react';
import Link from 'next/link';  // Using Link for navigation

export default function LandingPage() {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to CommUnity</h1>
      <p className="text-xl sm:text-2xl max-w-2xl mx-auto mb-8 text-center">
        CommUnity is a platform designed to empower marginalized communities by amplifying their voices.
        Share your struggles, suggestions, and ideas to create a positive impact in the community and beyond.
      </p>

      {/* Button to navigate to the form page */}
      <Link href="/form">
        <button className="px-8 py-3 bg-white text-black font-semibold text-lg rounded-full shadow-lg hover:bg-gray-300 transition duration-300">
          Share Your Voice
        </button>
      </Link>
    </div>
  );
}
