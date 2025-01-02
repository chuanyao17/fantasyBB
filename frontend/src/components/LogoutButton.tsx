'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/yahoo/logout`, {
      credentials: 'include'
    })
    router.refresh()  // 重新整理頁面以更新狀態
  }

  return (
    <button
      onClick={handleLogout}
      className="font-[family-name:var(--font-press-start)] text-white hover:text-yellow-300 pixel-text text-sm"
    >
      Logout
    </button>
  )
} 