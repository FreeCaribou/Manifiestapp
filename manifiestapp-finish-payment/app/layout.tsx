import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ManifiestApp Tickets Selling',
  description: 'Endpoint of selling ticket with Viva Wallet Qr Code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
