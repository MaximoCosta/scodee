import { useEffect, useRef } from "react";

export function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  threshold = 0.2,
  children,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.setTimeout(() => {
            el.classList.add("show");
          }, delay);
          observer.unobserve(el);
        });
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
