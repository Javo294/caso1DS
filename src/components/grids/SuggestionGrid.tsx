import React from "react";

export type SuggestionItem = {
  id: string;
  label: string;
  iconSrc: string;       // Ruta del icono del grid
  target?: string;       // Futura ruta para funcionamiento (no se esta usando aun porque esto es un cascaron)
  disabled?: boolean;
};

interface Props {
  title?: string;
  items: SuggestionItem[];
  onSelect?: (item: SuggestionItem) => void; // opcional para futuro
}

const SuggestionsGrid: React.FC<Props> = ({ title = "Suggestions", items, onSelect }) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <h2
        className="
          text-white text-2xl md:text-4xl font-medium tracking-tight text-center mb-8 "
      >
        {title}
      </h2>

      {/* Grid*/}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((it) => {
          const isDisabled = !!it.disabled;
          return (
            <button
              key={it.id}
              type="button"
              aria-label={it.label}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect?.(it)}
              className={`
                group relative w-full overflow-hidden rounded-2xl
                bg-white/85 text-neutral-900 shadow-md
                transition-colors duration-200
                ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-white/75 active:bg-white/70 hover:shadow-lg focus-visible:outline-none"}
                focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900
                `}
            >
              <div className="flex flex-col items-center justify-center px-6 py-5 min-h-[120px]">
                <img
                  src={it.iconSrc}
                  alt={it.label}
                  className="w-12 h-12 object-contain mb-3 pointer-events-none select-none"
                />
                <span className="text-sm md:text-base font-medium text-neutral-800">{it.label}</span>
              </div>
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition
                  ring-1 ring-black/0 group-hover:ring-white/15 rounded-2xl
                "
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SuggestionsGrid;
