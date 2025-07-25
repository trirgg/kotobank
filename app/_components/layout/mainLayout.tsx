import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">日本語カード</h1>
          <nav>
            <ul className="flex gap-4 text-gray-600">
              <li><a href="/" className="hover:text-blue-600">Home</a></li>
              <li><a href="/about" className="hover:text-blue-600">About</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Japanese Flashcards - All rights reserved.
      </footer>
    </div>
  );
}
