import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center py-16 sm:py-20 px-6 rounded-[3rem] max-w-2xl w-full border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl">
        <h1 className="text-8xl sm:text-9xl font-black text-white/10">404</h1>
        <h2 className="text-2xl font-bold text-white mt-4 uppercase tracking-tighter">Page Not Found</h2>
        <p className="text-slate-400 mt-2 mb-8">The interview module you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound