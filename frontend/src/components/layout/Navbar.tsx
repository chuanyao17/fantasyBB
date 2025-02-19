"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
}

const menuItems = [
  { name: "Matchups", path: "/dashboard/matchups", requiresAuth: true },
  { name: "Demo", path: "/demo", requiresAuth: false }
];

export default function Navbar({ isAuthenticated }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900/90 border-b-2 border-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 左側：品牌 & HOME Link */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-[family-name:var(--font-press-start)] ${
                pathname === '/' ? 'text-yellow-300' : 'text-white hover:text-yellow-300'
              } pixel-text text-sm`}
            >
              HOME
            </Link>

            {/* 桌面版選單 (md 以上顯示) */}
            <div className="hidden md:flex space-x-8">
              {menuItems.map(({ name, path, requiresAuth }) => (
                <Link 
                  key={path}
                  href={path} 
                  className={`font-[family-name:var(--font-press-start)] pixel-text text-sm ${
                    !isAuthenticated && requiresAuth
                      ? 'text-gray-500 cursor-not-allowed pointer-events-none' 
                      : pathname === path
                        ? 'text-yellow-300'
                        : 'text-white hover:text-yellow-300'
                  }`}
                >
                  {'>'} {name}
                </Link>
              ))}
            </div>
          </div>

          {/* 右側：漢堡選單 (手機版) */}
          <button
            className="md:hidden ml-4 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* 桌面版的 LogoutButton */}
          {isAuthenticated && <div className="hidden md:block"><LogoutButton /></div>}
        </div>
      </div>

      {/* 手機版選單 */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/90 border-t border-white absolute w-full left-0 top-16 p-4 z-50">
          <div className="flex flex-col space-y-4">
            {menuItems.map(({ name, path, requiresAuth }) => (
              <Link 
                key={path}
                href={path} 
                className={`font-[family-name:var(--font-press-start)] pixel-text text-sm ${
                  !isAuthenticated && requiresAuth
                    ? 'text-gray-500 cursor-not-allowed pointer-events-none' 
                    : pathname === path
                      ? 'text-yellow-300'
                      : 'text-white hover:text-yellow-300'
                }`}
                onClick={() => setIsMenuOpen(false)} // 點擊後關閉選單
              >
                {'>'} {name}
              </Link>
            ))}

            {/* 手機版 LogoutButton */}
            {isAuthenticated && (
              <div className="font-[family-name:var(--font-press-start)] pixel-text text-sm text-white hover:text-yellow-300">
                {'>'} <LogoutButton />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
