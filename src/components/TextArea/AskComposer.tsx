
import React, { useEffect, useRef, useState } from "react";

const GRADIENT =
  "linear-gradient(90deg,rgba(1,42,81,0.93) 5%,rgba(1,25,81,0.96) 19%,rgba(1,12,81,0.98) 43%,rgba(43,1,93,1) 68%,rgba(131,3,118,0.97) 100%)";

export default function AskComposer() {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  // ⚙️ Configurables
  const MIN_HEIGHT = 56;   // altura base (px)  
  const MAX_HEIGHT = 200;  // altura máxima (px) 
  const WIDTH_CL = "w-full sm:w-[720px]"; // ancho del input

  const autoResize = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px"; // reset
    const next = Math.max(MIN_HEIGHT, Math.min(ta.scrollHeight, MAX_HEIGHT));
    ta.style.height = `${next}px`;
    ta.style.overflowY = ta.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <form
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${WIDTH_CL}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className="rounded-[28px] p-[2px] shadow-lg"
          style={{ backgroundImage: GRADIENT }}
        >
          <div className="rounded-[26px] bg-white/90 backdrop-blur-sm">
            <label htmlFor="ask-input" className="sr-only">
              Ask me something
            </label>

            <textarea
              id="ask-input"
              ref={taRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onInput={autoResize}
              placeholder="Ask me something"
              className="block w-full resize-none rounded-[26px] bg-transparent
                         px-6 py-4 text-neutral-900 placeholder-[#b183d9]
                         focus:outline-none focus:ring-0"
              style={{ height: MIN_HEIGHT }}
            />
            <button type="submit" className="sr-only">
              Enviar
            </button>
          </div>
        </div>
      </form>

    <div className="h-40" /></div>
  );
}
