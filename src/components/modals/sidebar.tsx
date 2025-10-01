import React from "react";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  headerHeight?: number;   // px — altura del header superior (default 64)
  widthOpen?: number;      // px — ancho cuando está abierta (default 260)
  items?: string[];        // preguntas recientes (placeholder)
};

const Sidebar: React.FC<Props> = ({
  isOpen,
  onToggle,
  headerHeight = 64,   
  widthOpen = 260,     
  items = ["Como invertir en el bac", "Como cocinar pasta alfredo", "Un gato se metio debajo de mi carro y no se como sacarlo"],
}) => {
  return (
    <>
      {/* Botón flotante cuando la barra está cerrada */}
      {!isOpen && (
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onToggle}
          className="fixed left-3 z-40 rounded-xl bg-neutral-900/80 text-white/90
                     ring-1 ring-white/10 hover:bg-neutral-900 hover:ring-white/20
                     backdrop-blur px-3 py-2 transition"
          style={{ top: headerHeight + 12 }}
        >
          {/* icono "hamburger" */}
          <svg width="20" height="20" viewBox="0 0 24 24" className="block">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className="fixed left-0 z-50 overflow-hidden bg-neutral-900/95 text-white/90
                   ring-1 ring-white/10 shadow-lg backdrop-blur transition-all"
        style={{
          top: headerHeight,                             
          height: `calc(100vh - ${headerHeight}px)`,
          width: isOpen ? widthOpen : 0,                 
        }}
        aria-hidden={!isOpen}
      >
        {/* Header de la barra */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          {/* Texto a la IZQUIERDA */}
          <span className="text-sm font-medium tracking-wide">Recent Questions</span>

          {/* Botón a la DERECHA para cerrar */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onToggle}
            className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5
                       bg-white/5 hover:bg-white/10 ring-1 ring-white/10 hover:ring-white/20 transition"
          >
            {/* icono cambia levemente al estar abierta */}
            <svg width="18" height="18" viewBox="0 0 24 24" className="block">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="h-full overflow-y-auto px-4 py-3 space-y-3">
          {items.map((q, i) => (
            <div
              key={i}
              className="rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 hover:ring-white/20
                         transition px-3 py-2 text-sm"
            >
              {q}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
