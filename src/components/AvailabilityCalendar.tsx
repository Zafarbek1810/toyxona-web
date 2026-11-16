import { useMemo, useState } from "react";
import { isPastDate, toIsoDate } from "../lib/wedding/catalog";

const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function monthLabel(year: number, month: number) {
  return `${String(month + 1).padStart(2, "0")}.${year}`;
}

export default function AvailabilityCalendar({
  selected,
  onSelect,
  load,
  legend,
}: {
  selected?: string;
  onSelect?: (iso: string) => void;
  load: (iso: string) => 0 | 1 | 2 | 3;
  legend: "venue" | "specialist";
}) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const items: Array<{ iso?: string; day?: number }> = Array.from({ length: offset }, () => ({}));
    for (let day = 1; day <= days; day += 1) {
      items.push({ day, iso: toIsoDate(new Date(cursor.year, cursor.month, day)) });
    }
    return items;
  }, [cursor]);

  const tone = (level: 0 | 1 | 2 | 3, iso: string) => {
    if (selected === iso) return "bg-[#00A86B] text-white";
    if (isPastDate(iso)) return "text-gray-300";
    if (legend === "specialist") {
      return level >= 2 ? "bg-red-500 text-white" : "bg-[#E8F8F1] text-[#008F5A]";
    }
    if (level >= 3) return "bg-red-500 text-white";
    if (level === 2) return "bg-orange-400 text-white";
    if (level === 1) return "bg-amber-200 text-amber-900";
    return "bg-white text-gray-800 hover:bg-[#E8F8F1]";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))} className="w-8 h-8 rounded-lg border text-gray-600" style={{ borderColor: "var(--border)" }} aria-label="Oldingi oy">
          ‹
        </button>
        <p className="font-bold text-gray-900">{monthLabel(cursor.year, cursor.month)}</p>
        <button type="button" onClick={() => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))} className="w-8 h-8 rounded-lg border text-gray-600" style={{ borderColor: "var(--border)" }} aria-label="Keyingi oy">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-400 mb-1">
        {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell.iso || !cell.day) return <span key={`e-${index}`} />;
          const level = load(cell.iso);
          const disabled = isPastDate(cell.iso) || (legend === "venue" ? level >= 3 : level >= 2);
          return (
            <button
              key={cell.iso}
              type="button"
              disabled={disabled || !onSelect}
              onClick={() => onSelect?.(cell.iso!)}
              className={`h-9 rounded-lg text-sm font-medium border border-transparent ${tone(level, cell.iso)} disabled:cursor-not-allowed`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-gray-500">
        {legend === "venue" ? (
          <>
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500 mr-1" />To&apos;liq band</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-400 mr-1" />2 seans band</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-200 mr-1" />1 seans band</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-[#E8F8F1] border border-[#00A86B] mr-1" />Bo&apos;sh</span>
          </>
        ) : (
          <>
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500 mr-1" />Band</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-[#E8F8F1] mr-1" />Bo&apos;sh</span>
          </>
        )}
      </div>
    </div>
  );
}
