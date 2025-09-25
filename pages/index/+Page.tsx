import { Counter } from "./Counter.js";
import { useState, useEffect } from "react";
export default function Page() {
  const [counter, setCounter] = useState(59);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  return (
    <>
      <div className="avatar">
        <div className="w-24 rounded">
          <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
        </div>
      </div>
      {/* For TSX uncomment the commented types below */}
      <span className="countdown">
        <span style={{"--value": counter} as React.CSSProperties } aria-live="polite" aria-label={String(counter)}></span>
      </span>
      <h1 className={"font-bold text-3xl pb-4 cursor-pointer btn-accent"}>My Vaaike app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
