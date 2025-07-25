import VerbFlashcards from "@/app/_components/VerbFlashcards";

export default function FlashcardLevel() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Flashcards - Level
      </h1>
      <VerbFlashcards />
    </div>
  );
}
