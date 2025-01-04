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
  // 檢查 token 是否存在
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("token")?.value;

  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} antialiased`}>
        <Navbar isAuthenticated={isAuthenticated} />
        {children}
      </body>
    </html>
  );
}
