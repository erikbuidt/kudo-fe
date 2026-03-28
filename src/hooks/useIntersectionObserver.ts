import { useEffect, useRef } from 'react';

export function useIntersectionObserver({
  root = null,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}: {
  root?: HTMLElement | null;
  onIntersect: () => void;
  threshold?: number | number[];
  rootMargin?: string;
  enabled?: boolean;
}) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const el = targetRef.current;
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [enabled, onIntersect, root, rootMargin, threshold]);

  return targetRef;
}
