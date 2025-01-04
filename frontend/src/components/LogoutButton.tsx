'use client'

export default function LogoutButton() {

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/yahoo/logout`, {
      credentials: 'include'
    })
    window.location.href = '/'
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