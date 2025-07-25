// app/pageVerb/layout.tsx
import Link from "next/link";
import React from "react";

export default function PageVerbLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-2 pb-2">
      <nav className="mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </nav>
      <div className="bg-white  rounded shadow">{children}</div>
    </div>
  );
}
