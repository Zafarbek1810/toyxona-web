import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const watchers = new Set<() => void>();
let listening = false;

function ensureScrollWatch() {
  if (listening) return;
  listening = true;
  const tick = () => watchers.forEach((fn) => fn());
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
}

function watchReveal(fn: () => void) {
  watchers.add(fn);
  ensureScrollWatch();
  return () => watchers.delete(fn);
}

function shouldOpen(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const viewH = window.innerHeight || 1;
  if (rect.bottom <= 0 || rect.top >= viewH) return false;
  if (rect.top < viewH * 0.88 && rect.bottom > Math.min(72, viewH * 0.12)) return true;
  if (rect.top >= 0 && rect.bottom <= viewH) return true;
  const atPageEnd = window.scrollY + viewH >= document.documentElement.scrollHeight - 8;
  return atPageEnd && rect.top < viewH;
}

export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      setSettled(true);
      return;
    }

    let stop = () => {};

    const arm = () => {
      const open = () => {
        if (!shouldOpen(node)) return;
        setShown(true);
        stop();
      };
      stop = watchReveal(open);
      open();
    };

    const root = document.documentElement;
    if (!root.classList.contains("is-booting")) {
      arm();
      return () => stop();
    }

    const bootWatcher = new MutationObserver(() => {
      if (root.classList.contains("is-booting")) return;
      bootWatcher.disconnect();
      arm();
    });
    bootWatcher.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      bootWatcher.disconnect();
      stop();
    };
  }, []);

  const finish = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    setSettled(true);
  };

  return (
    <div
      ref={ref}
      className={["reveal", shown ? "is-in" : "", settled ? "is-settled" : "", className].filter(Boolean).join(" ")}
      style={{ animationDelay: `${delay}ms` }}
      onAnimationEnd={finish}
    >
      {children}
    </div>
  );
}
