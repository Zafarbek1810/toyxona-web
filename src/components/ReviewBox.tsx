import { useEffect, useState } from "react";
import { ApiClientError } from "../lib/api/client";
import { weddingApi } from "../lib/api/wedding";
import type { Review } from "../lib/wedding/types";

function Stars({ value, onChange }: { value: number; onChange?: (next: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-lg ${star <= value ? "text-[#F59E0B]" : "text-gray-300"}`}
          aria-label={`${star} yulduz`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewBox({
  target,
  targetId,
  seedRating,
  seedCount,
}: {
  target: Review["target"];
  targetId: number;
  seedRating: number;
  seedCount: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const reload = () => weddingApi.reviews(target, targetId).then(setReviews).catch(() => setReviews([]));

  useEffect(() => {
    void reload();
  }, [target, targetId]);

  const count = reviews.length || seedCount;
  const average = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : seedRating;

  const submit = async () => {
    if (!name.trim() || !text.trim()) {
      setError("Ism va fikrni kiriting");
      return;
    }
    try {
      await weddingApi.addReview({
        target,
        targetId,
        name: name.trim(),
        rating,
        text: text.trim(),
      });
      setName("");
      setText("");
      setRating(5);
      setError("");
      await reload();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Sharh yuborilmadi");
    }
  };

  return (
    <section className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-sans)" }}>Sharhlar va baholar</h2>
      <p className="text-sm text-gray-500 mb-4">{average.toFixed(1)} · {count} ta sharh</p>
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ismingiz" className="rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Bahoyingiz</span>
          <Stars value={rating} onChange={setRating} />
        </div>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Fikringiz" rows={3} className="md:col-span-2 rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
      </div>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <button type="button" onClick={() => { void submit(); }} className="rounded-xl bg-[#00A86B] hover:bg-[#008F5A] text-white text-sm font-semibold px-5 py-2.5">
        Yuborish
      </button>
      <div className="mt-5 space-y-3">
        {reviews.length === 0 && <p className="text-sm text-gray-400">Hozircha yangi sharh yo&apos;q. Birinchi bo&apos;lib sharh qoldiring.</p>}
        {reviews.map((review) => (
          <div key={review.id} className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{review.name}</p>
              <Stars value={review.rating} />
            </div>
            <p className="text-sm text-gray-600 mt-1">{review.text}</p>
            {review.reply && <p className="text-sm text-[#008F5A] mt-2">Javob: {review.reply}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
