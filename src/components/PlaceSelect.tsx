import type { CSSProperties } from "react";
import { DISTRICTS, REGIONS } from "../lib/wedding/districts";

export default function PlaceSelect({
  region,
  district,
  onChange,
  className,
  style,
  allowAll = true,
}: {
  region?: string;
  district?: string;
  onChange: (next: { region?: string; district?: string }) => void;
  className?: string;
  style?: CSSProperties;
  allowAll?: boolean;
}) {
  const districts = region ? DISTRICTS[region] || [] : [];
  const selectClass = `w-full ${className || ""}`;

  return (
    <>
      <label className="block">
        <span className="text-xs font-semibold text-gray-500">Viloyat</span>
        <select
          value={region || ""}
          onChange={(event) => onChange({ region: event.target.value || undefined, district: undefined })}
          className={selectClass}
          style={style}
        >
          {allowAll && <option value="">Barcha viloyatlar</option>}
          {REGIONS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-gray-500">Tuman</span>
        <select
          value={district || ""}
          disabled={!region}
          onChange={(event) => onChange({ region, district: event.target.value || undefined })}
          className={selectClass}
          style={style}
        >
          <option value="">{region ? "Barcha tumanlar" : "Avval viloyatni tanlang"}</option>
          {districts.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </label>
    </>
  );
}
