"use client"; // Needed if using Next.js 13+ (app router)
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
let memoryCache: Record<string, any> = {};






// --- Flashcard UI ---
const Flashcard = ({ cardData, isFlipped, onFlip, showRomaji }: any) => {
  if (!cardData) return null;
  return (
    <div className="scene w-full h-80 md:h-96">
      <div className={`card cursor-pointer ${isFlipped ? "is-flipped" : ""}`} onClick={onFlip}>
        {/* Front */}
        <div className="card__face card__face--front">
          <div className="text-center">
            <h2 className="japanese-text text-6xl md:text-7xl font-bold text-gray-900">{cardData.kanji}</h2>
            {showRomaji && <p className="text-gray-500 text-xl mt-2">{cardData.kana}</p>}
            <p className="mt-8 text-sm text-gray-400">Click or press Space to flip</p>
          </div>
        </div>
        {/* Back */}
        <div className="card__face card__face--back p-6">
          <div className="text-left w-full h-full overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{cardData.meaning}</h3>
                <p className="text-sm text-gray-600">{cardData.type}</p>
                <p className="text-sm text-gray-400">{cardData.level}</p>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">Description</h4>
                {/* place for description */}
                <p>{cardData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



// --- VerbFlashcards Component ---
export default function VerbFlashcards() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const params = useParams()
  const deck = params?.levelId as string
  useEffect(() => {
    const fetchData = async () => {
      if (memoryCache[deck]) {
        setCards(memoryCache[deck]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/kotoba?deck=${deck}`);
      const result = await res.json();

      memoryCache[deck] = result;
      setCards(result);
      setLoading(false);
    };

    fetchData();
  }, [deck]);




  // --- Navigation Handlers ---
  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    const calculateNextIndex = () => {
      if (shuffle) {
        return Math.floor(Math.random() * cards.length);
      }
      const delta = direction === 'next' ? 1 : -1;
      return (currentIndex + delta + cards.length) % cards.length; // Ensure positive index
    };
  
    const nextIndex = calculateNextIndex();
    setCurrentIndex(nextIndex);
  }, [shuffle, cards.length, currentIndex]); // Add currentIndex as a dependency


  const handleNext = useCallback(() => {
    const proceed = () => handleNavigation('next');

    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(proceed, 250);
    } else {
      proceed();
    }
  }, [isFlipped, handleNavigation]);

  const handlePrev = useCallback(() => {
    const proceed = () => {
      // Ensure positive index by adding cards.length
      const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
      setCurrentIndex(prevIndex);
      const proceed = () => handleNavigation('prev');
    };

    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(proceed, 250);
    } else {
      proceed();
    }
  }, [isFlipped, handleNavigation]);

  const currentCard = cards[currentIndex];

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight") handleNext();
      if (e.code === "ArrowLeft") handlePrev();
      if (e.code === "Space") setIsFlipped((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleNavigation]);

  // --- Render ---
      if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500 animate-pulse">Loading flashcards...</div>
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold py-8">
        Flashcard not found.
      </div>
    );
  }
  return (    
    <>
      <style>{`
        .japanese-text { font-family: 'Noto Sans JP', sans-serif; }
        .scene { perspective: 1000px; }
        .card { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s; }
        .card.is-flipped { transform: rotateY(180deg); }
        .card__face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .card__face--front { background-color: #ffffff; }
        .card__face--back { background-color: #f8fafc; transform: rotateY(180deg); }
      `}
      <style>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out forwards;
  }
`}</style>

      </style>

      <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">        
        <div className="w-full max-w-md mx-auto">          
          <div className="relative mb-8">
            {/* Settings Button in Top-Right */}
              <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="absolute right-0 top-0 text-gray-600 hover:text-gray-800 transition"
                  aria-label="Settings"
              >
                  ⚙
              </button>

              {/* Title & Subtitle */}
              <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 japanese-text">
                  日本語動詞カード
              </h1>
              <p className="text-center text-gray-600">Japanese Verb Flashcards</p>
          </div>

            <Flashcard cardData={currentCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} showRomaji={showRomaji} />

            {/* Progress Indicator & Bar - Hidden when Shuffle is ON */}
            {!shuffle && (
              <>
                <p className="text-center text-gray-500 mt-4">
                  {currentIndex + 1} / {cards.length}
                </p>
                <div className="w-full bg-gray-300 h-3 rounded-full mt-2 mb-6">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                  />
                </div>
              </>
            )}

            {/* Controls */}
            <div className="mt-6 flex justify-between">
              <button onClick={handlePrev} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">Previous</button>
              <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">Next</button>
            </div>

          {/* Shuffle Toggle */}
          <div className="mt-4 text-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={shuffle}
                onChange={() => setShuffle((s) => !s)}
              />
              <span
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${
                  shuffle ? "bg-green-500" : ""
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    shuffle ? "translate-x-6" : ""
                  }`}
                />
              </span>
              <span className="ml-3 text-gray-700">Shuffle Mode</span>
            </label>
          </div>

          {/* Settings Modal */}
          {isSettingsOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-80 transform transition-transform duration-300 animate-scale-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>

                {/* Romaji Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700">Show Romaji</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={showRomaji}
                    onChange={() => setShowRomaji((prev) => !prev)}
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={() => setIsSettingsOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
