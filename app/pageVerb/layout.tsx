// app/pageVerb/layout.tsx
import Link from "next/link";
import React from "react";

export default function PageVerbLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </nav>
      <div className="bg-white p-6 rounded shadow">{children}</div>
    </div>
  );
}
