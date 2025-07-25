import VerbFlashcards from "@/app/_components/VerbFlashcards";

export default function FlashcardLevel({ params }: { params: { level: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Flashcards - Level {params.level}
      </h1>
      <VerbFlashcards />
    </div>
  );
}
