'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function InputPage() {
  const [form, setForm] = useState({
    kanji: '',
    kana: '',
    meaning: '',
    level: 'N3',
    description: '',
    type: '',
    deck: ''
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({
    show: false,
    success: true,
    message: '',
  });

  const showStatusModal = (success: boolean, message: string) => {
    setStatusModal({ show: true, success, message });

    setTimeout(() => {
      setStatusModal((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/kotoba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      setLoading(false);
      setShowConfirm(false);

      if (res.ok) {
        showStatusModal(true, 'Data berhasil disimpan ke database.');
        setForm({
          kanji: '',
          kana: '',
          meaning: '',
          level: 'N3',
          description: '',
          type: '',
          deck: '',
        });
      } else {
        showStatusModal(false, result.message || 'Gagal menyimpan data.');
      }
    } catch (error: any) {
      setLoading(false);
      showStatusModal(false, error.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Add New Kotoba</h2>

      <input
        name="kanji"
        value={form.kanji}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
        placeholder="Kanji (必須)"
      />
      <input
        name="deck"
        value={form.deck}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Deck Name"
      />

      <input
        name="kana"
        value={form.kana}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
        placeholder="Kana (ふりがな)"
      />

      <input
        name="meaning"
        value={form.meaning}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
        placeholder="Meaning"
      />

      <select
        name="level"
        value={form.level}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        {['N5', 'N4', 'N3', 'N2', 'N1'].map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <select
        id="type"
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">-- Kategori Kata --</option>
        <option value="Kata kerja 動詞">Kata kerja (動詞)</option>
        <option value="Kata sifat-i 形容詞">Kata sifat-i (形容詞)</option>
        <option value="Kata sifat-na 形容動詞">Kata sifat-na (形容動詞)</option>
        <option value="Kata benda 名詞">Kata benda (名詞)</option>
        <option value="Kata keterangan 副詞">Kata keterangan (副詞)</option>
        <option value="Partikel 助詞">Partikel (助詞)</option>
        <option value="Ekspresi 表現">Ekspresi / Frasa (表現)</option>
        <option value="Konjungsi 接続詞">Konjungsi (接続詞)</option>
        <option value="Onomatope 擬音語・擬態語">Onomatope (擬音語・擬態語)</option>
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded h-24"
        placeholder="Description (optional)"
      />

      <button
        onClick={() => setShowConfirm(true)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Confirm & Submit
      </button>

      {/* ✅ Status Modal */}
      {statusModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div
            className={`bg-white/80 backdrop-blur-md rounded-xl shadow-xl max-w-sm w-full p-6 text-center border-t-4 ${
              statusModal.success ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="flex justify-center mb-3">
              {statusModal.success ? (
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              ) : (
                <XCircleIcon className="h-12 w-12 text-red-500" />
              )}
            </div>
            <h2
              className={`text-xl font-semibold mb-2 ${
                statusModal.success ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {statusModal.success ? 'Berhasil!' : 'Gagal!'}
            </h2>
            <p className="text-gray-800 mb-4">{statusModal.message}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              onClick={() => setStatusModal((prev) => ({ ...prev, show: false }))}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ✅ Confirm Modal */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 shadow-xl transition-all scale-100">
            <Dialog.Title className="text-xl font-bold text-center text-gray-800">
              Confirm Kotoba
            </Dialog.Title>
            <div className="text-center">
              <div className="text-4xl font-bold">{form.kanji}</div>
              <div className="text-lg text-gray-500 -mt-1">{form.kana}</div>
              <div className="mt-2 text-gray-700 italic">{form.meaning}</div>
              {form.description && (
                <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                  {form.description}
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
