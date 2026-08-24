import { useEffect, useState } from "react";

export function Typewriter({ text, speed = 90, startDelay = 800 }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return undefined;
    }

    let index = 0;
    let intervalId;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setShown(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return <span className="hero-title-text">{shown}</span>;
}
