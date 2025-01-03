"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-900/90 border-b-2 border-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-[family-name:var(--font-press-start)] ${
                pathname === '/' ? 'text-yellow-300' : 'text-white hover:text-yellow-300'
              } pixel-text text-sm`}
            >
              HOME
            </Link>
            <div className="font-[family-name:var(--font-press-start)] hidden md:flex space-x-8">
              <Link 
                href="/dashboard/matchups" 
                className={`${
                  pathname === '/dashboard/matchups' ? 'text-yellow-300' : 'text-white hover:text-yellow-300'
                } pixel-text text-sm`}
              >
                > Matchups
              </Link>
              <Link 
                href="/dashboard/roster" 
                className={`${
                  pathname === '/dashboard/roster' ? 'text-yellow-300' : 'text-white hover:text-yellow-300'
                } pixel-text text-sm`}
              >
                > Roster
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
} 