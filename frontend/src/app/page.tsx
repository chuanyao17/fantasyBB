"use client"

import { Press_Start_2P } from 'next/font/google'
import { useState, useEffect } from 'react'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    fetch('https://localhost:8000/auth/yahoo/verify', {
      credentials: 'include'
    })
    .then(res => {
      setIsAuthenticated(res.ok)
    })
  }, [])

  const handleLogin = () => {
    window.location.href = 'https://localhost:8000/auth/yahoo/login'
  }

  return (
    <main className="min-h-screen pixel-bg">
      <div className="font-[family-name:var(--font-press-start)] container mx-auto max-w-lg pt-20">
        <div className="pixel-box p-8 bg-slate-900/90">
          <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
            Fantasy Basketball Assistant
          </h1>
          
          <div className="menu-container">
            {!isAuthenticated ? (
              <button onClick={handleLogin} className="pixel-button w-full py-3 px-4 text-white hover:text-yellow-300">
                > Login with Yahoo
              </button>
            ) : (
              <div className="text-white text-center">
                Welcome back!
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
