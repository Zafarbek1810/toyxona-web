import { mediaUrl } from "../lib/api/client";

export function isImageIcon(value?: string | null): boolean {
  if (!value) return false;
  return (
    value.startsWith("http") ||
    value.startsWith("blob:") ||
    value.startsWith("data:") ||
    value.startsWith("/") ||
    /\.(png|jpe?g|webp|svg|gif)(\?|$)/i.test(value)
  );
}

export default function CategoryGlyph({
  icon,
  className = "w-full h-full object-cover",
}: {
  icon?: string | null;
  className?: string;
}) {
  if (icon && isImageIcon(icon)) {
    return <img src={mediaUrl(icon) || icon} alt="" className={className} />;
  }
  return <>{icon || "📦"}</>;
}
