"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface LevelProgress {
  level: number;
  completed: boolean;
  score: number;
  openedAt?: number;
  completedAt?: number;
}

interface DeckProgressState {
  onboardingSeen: boolean;
  highestUnlocked: number; // Highest unlocked level (1 initially)
  levels: Record<number, LevelProgress>;
  version: number;
}

interface DeckProgressContextProps {
  state: DeckProgressState;
  isHydrated: boolean;
  markLevelOpened: (level: number) => void;
  markLevelCompleted: (level: number, score: number) => void;
  resetProgress: () => void;
}

const defaultState: DeckProgressState = {
  onboardingSeen: false,
  highestUnlocked: 1,
  levels: {
    1: {
        level: 1,
        completed: false,
        score: 0,
        openedAt: Date.now(),
      },
  },
  version: 1,
};

const DeckProgressContext = createContext<DeckProgressContextProps | undefined>(undefined);

export const DeckProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<DeckProgressState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // --- Load from localStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem("deck-progress");
      if (data) {
        setState(JSON.parse(data));
      }
    } catch (err) {
      console.warn("Failed to load deck-progress:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // --- Save to localStorage when state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("deck-progress", JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // --- Mark a level as opened
  const markLevelOpened = useCallback((level: number) => {
    setState((prev) => {
      const updatedLevels = { ...prev.levels };
  
      if (!updatedLevels[1]) {
        updatedLevels[1] = {
          level: 1,
          completed: false,
          score: 0,
          openedAt: Date.now(),
        };
      }
  
      if (!updatedLevels[level]) {
        updatedLevels[level] = {
          level,
          completed: false,
          score: 0,
          openedAt: Date.now(),
        };
      }
  
      return { ...prev, levels: updatedLevels };
    });
  }, []);

  // --- Mark a level as completed & unlock next
  const markLevelCompleted = useCallback((level: number, score: number) => {
    setState((prev) => {
      const updatedLevels = { ...prev.levels };
      const currentLevel = updatedLevels[level] || {
        level,
        completed: false,
        score: 0,
        openedAt: Date.now(),
      };

      currentLevel.completed = score >= 80;
      currentLevel.score = score;
      currentLevel.completedAt = Date.now();
      updatedLevels[level] = currentLevel;

      // Unlock next level if score >= 80
      const newHighest = score >= 80 ? Math.max(prev.highestUnlocked, level + 1) : prev.highestUnlocked;

      return {
        ...prev,
        highestUnlocked: newHighest,
        levels: updatedLevels,
      };
    });
  }, []);

  // --- Reset all progress
  const resetProgress = useCallback(() => {
    localStorage.removeItem("deck-progress");
    setState(defaultState);
  }, []);

  return (
    <DeckProgressContext.Provider
      value={{
        state,
        isHydrated,
        markLevelOpened,
        markLevelCompleted,
        resetProgress,
      }}
    >
      {children}
    </DeckProgressContext.Provider>
  );
};

export const useDeckProgress = () => {
  const ctx = useContext(DeckProgressContext);
  if (!ctx) {
    throw new Error("useDeckProgress must be used within DeckProgressProvider");
  }
  return ctx;
};
