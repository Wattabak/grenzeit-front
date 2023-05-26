import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grenzeit',
  description: 'Borders in time',
  authors: [{name: "Vlad Tabakov", url: "https://github.com/Wattabak"}]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
