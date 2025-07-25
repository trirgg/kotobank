// app/layout.jsx
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

// Setup Google Fonts with next/font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
});

export const metadata = {
  title: 'Kotoba Flashcards',
  description: 'Learn Japanese vocabulary with interactive flashcards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansJP.variable} bg-gray-100`}>
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}
