"use client";

import { useState } from "react";

type Kotoba = {
  kanji: string;
  kana: string;
  meaning: string;
  deck: string;
  level: string;
  description: string;
  type: string;
};

const jlptLevels = ["N1", "N2", "N3", "N4", "N5"];
const kotobaTypes = [
  "Kata kerja 動詞",
  "Kata sifat-i 形容詞",
  "Kata sifat-na 形容動詞",
  "Kata benda 名詞",
  "Kata keterangan 副詞",
  "Partikel 助詞",
  "Ekspresi 表現",
  "Konjungsi 接続詞",
  "Onomatope 擬音語・擬態語",
];

export default function BulkAddKotoba() {
  const [rawInput, setRawInput] = useState("");
  const [kotobaList, setKotobaList] = useState<Kotoba[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<number[]>([]);

  const handleParse = () => {
    if (!rawInput.trim()) return;

    const entries = rawInput
      .trim()
      .split(/(?:\r?\n\s*){2,}/)
      .filter((block) => block.trim() !== "")
      .map((block) => {
        const lines = block.trim().split(/\r?\n/);
        return {
          kanji: lines[0] || "",
          kana: lines[1] || "",
          meaning: lines[2] || "",
          deck: "",
          level: "N3",
          description: "",
          type: "",
        };
      });

    setKotobaList(entries);
    setErrors([]);
  };

  const updateCard = (index: number, field: keyof Kotoba, value: string) => {
    const updated = [...kotobaList];
    updated[index][field] = value;
    setKotobaList(updated);
  };

  const validate = (): boolean => {
    const errorIndexes: number[] = [];
    kotobaList.forEach((k, i) => {
      if (!k.kanji || !k.kana || !k.meaning || !k.deck || !k.level || !k.type) {
        errorIndexes.push(i);
      }
    });
    setErrors(errorIndexes);
    return errorIndexes.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const res = await fetch("/api/kotoba/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kotobaList),
    });

    if (res.ok) {
      setShowSuccessModal(true);
      setRawInput("");
      setKotobaList([]);
    } else {
      const error = await res.json();
      alert("Failed: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Bulk Add Kotoba</h1>

      <textarea
        className="w-full h-60 p-4 border rounded resize-y"
        placeholder={`Paste kotoba (e.g. format):\n食べる\nたべる\nto eat\n\n飲む\nのむ\nto drink`}
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
      />

      <button
        onClick={handleParse}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Parse
      </button>

      {kotobaList.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Review & Edit</h2>
          <div className="space-y-4">
            {kotobaList.map((card, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 shadow space-y-2 ${
                  errors.includes(idx) ? "border-red-400 bg-red-50" : "bg-white"
                }`}
              >
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    className="border p-2 rounded"
                    value={card.kanji}
                    onChange={(e) => updateCard(idx, "kanji", e.target.value)}
                    placeholder="Kanji"
                  />
                  <input
                    className="border p-2 rounded"
                    value={card.kana}
                    onChange={(e) => updateCard(idx, "kana", e.target.value)}
                    placeholder="Kana"
                  />
                  <input
                    className="border p-2 rounded"
                    value={card.meaning}
                    onChange={(e) => updateCard(idx, "meaning", e.target.value)}
                    placeholder="Meaning"
                  />
                  <input
                    className="border p-2 rounded"
                    value={card.deck}
                    onChange={(e) => updateCard(idx, "deck", e.target.value)}
                    placeholder="Deck"
                  />
                  <select
                    className="border p-2 rounded"
                    value={card.level}
                    onChange={(e) => updateCard(idx, "level", e.target.value)}
                  >
                    {jlptLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border p-2 rounded"
                    value={card.type}
                    onChange={(e) => updateCard(idx, "type", e.target.value)}
                  >
                    <option value="">-- Kategori Kata --</option>
                    {kotobaTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="w-full border p-2 rounded mt-2"
                  value={card.description}
                  onChange={(e) =>
                    updateCard(idx, "description", e.target.value)
                  }
                  placeholder="Description (optional)"
                  rows={2}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700"
          >
            Submit All
          </button>
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 max-w-sm w-full">
      <h3 className="text-2xl font-bold text-green-600">🎉 Success!</h3>
      <p className="text-gray-700">All kotoba have been submitted successfully.</p>
      <button
        onClick={() => setShowSuccessModal(false)}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
