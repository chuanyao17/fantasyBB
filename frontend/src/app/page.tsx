import { Press_Start_2P } from 'next/font/google'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <main className="min-h-screen pixel-bg">
      <div className="font-[family-name:var(--font-press-start)] container mx-auto max-w-lg pt-20">
        <div className="pixel-box p-8 bg-slate-900/90">
          <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
            Fantasy Basketball Assistant
          </h1>
          
          <div className="menu-container">
            <button className="pixel-button w-full py-3 px-4 text-white hover:text-yellow-300">
              > Login with Yahoo
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
