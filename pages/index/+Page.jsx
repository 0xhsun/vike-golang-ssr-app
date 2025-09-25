import { Counter } from "./Counter.jsx";
import { useState, useEffect } from "react";
import { useData } from "vike-react/useData";

export default function Page() {
  const [counter, setCounter] = useState(59);
  const apiData = useData(); // Get data from +data.js
  const [displayData, setDisplayData] = useState(false);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  function handleTestAPI() {
    // Toggle display of the data that was already loaded by +data.js
    setDisplayData(!displayData);
  }


  return (
    <>
      <div className="avatar">
        <div className="w-24 rounded">
          <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
        </div>
      </div>
      <span className="countdown">
        <span style={{"--value": counter}} aria-live="polite" aria-label={String(counter)}></span>
      </span>
      <button className="btn btn-primary" onClick={handleTestAPI}>
        {displayData ? 'Hide API Data' : 'Show API Data'}
      </button>
      {displayData && apiData && (
        <div className="mt-4 p-4 bg-base-200 rounded">
          <p><strong>API Response:</strong> {JSON.stringify(apiData)}</p>
        </div>
      )}
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
