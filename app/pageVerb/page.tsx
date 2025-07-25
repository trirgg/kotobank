"use client";

import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { LockOpenIcon } from "@heroicons/react/24/outline";

const levels = Array.from({ length: 60 }, (_, i) => i + 1);

export default function DailyVerb() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 md:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">
          Daily Verb
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Select a deck level and start practicing!
        </p>
      </div>

      {/* Levels Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level) => {
          const isLocked = level > 60; // Update lock logic if needed
          return (
            <div
              key={level}
              className={`rounded-xl shadow p-5 flex items-center justify-between transition ${
                isLocked
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:shadow-lg hover:scale-[1.01]"
              }`}
              title={isLocked ? "Unlock this level" : `Go to Level ${level}`}
            >
              <div className="flex items-center gap-3">
                {isLocked ? (
                  <LockClosedIcon className="w-6 h-6 text-gray-400" />
                ) : (
                  <LockOpenIcon className="w-6 h-6 text-blue-600" />
                )}
                <span className="text-lg font-semibold sm:text-xl">
                  Level {level}
                </span>
              </div>

              {/* Action */}
              {isLocked ? (
                <span className="px-3 py-1 bg-gray-300 text-gray-600 rounded-lg text-xs sm:text-sm font-medium">
                  Locked
                </span>
              ) : (
                <Link
                  href={`/pageVerb/${level}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base shadow hover:bg-blue-700 transition"
                >
                  Start
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
