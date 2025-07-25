// app/pageVerb/layout.tsx
import Link from "next/link";
import React from "react";

export default function pageAddKotoba({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 p-2 ">
      <div className="flex justify-between">

      <nav className="mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </nav>
      <nav className="mb-6">
        <Link href="/kotobaBulkUploader" className="text-blue-600 font-semibold hover:underline">
          go to add bulk kotoba
        </Link>
      </nav>
      </div>
      <div className=" rounded shadow">{children}</div>
    </div>
  );
}
