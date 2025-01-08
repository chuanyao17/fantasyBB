import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/layout/Navbar'
import { cookies } from "next/headers";


const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Fantasy Basketball Assistant",
  description: "Your retro-styled fantasy basketball companion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 檢查 token 是否存在且有效
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  let isAuthenticated = false;
  
  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/yahoo/verify`, {
        headers: {
          Cookie: `token=${token}`,
        },
        cache: 'no-store'
      });
      isAuthenticated = res.ok;
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }

  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} antialiased`}>
        <Navbar isAuthenticated={isAuthenticated} />
        {children}
      </body>
    </html>
  );
}
