// app/components/LoginButton.tsx
"use client"; // 一定要放在檔案最上方

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/yahoo/login`;
  };

  return (
    <button
      onClick={handleLogin}
      className="pixel-button w-full py-3 px-4 text-white hover:text-yellow-300"
    >
      > Login with Yahoo
    </button>
  );
}
