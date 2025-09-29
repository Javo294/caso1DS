// src/pages/CoachApp.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AskComposer from "../../components/TextArea/AskComposer";
import avatarImg from "../../assets/images/perfil.png";

const namespace = "https://20minCoachs.app/roles";

const CoachApp: React.FC = () => {
  const { isAuthenticated, logout, isLoading, user } = useAuth0();

  const roles: string[] = (user?.[namespace] as string[]) || [];
  const isPremium = roles.includes("premium-user");
  const hasBasic = roles.includes("basic-user");

  // Dropdown del avatar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Cerrar con clic fuera o con tecla Esc
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isMenuOpen]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#101010" }}>
      {/* Barra superior camuflada */}
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Izquierda: vacío (el saludo va en el body para poder centrarlo) */}
          <div />

          {/* Derecha: avatar que abre menú */}
          <div className="relative flex items-center">
            {isLoading ? (
              <div className="w-24 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : !isAuthenticated ? (
              <span className="text-white/80 text-sm">
                Inicia sesión para continuar
              </span>
            ) : (
              <>
                {/* 👇 AQUÍ CAMBIAS EL TAMAÑO DEL AVATAR:
                      - Usa w-10 h-10, w-12 h-12, etc.
                      - O exacto: w-[44px] h-[44px]
                */}
                <button
                  ref={btnRef}
                  type="button"
                  aria-label="Abrir menú de perfil"
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="inline-flex items-center justify-center rounded-full overflow-hidden 
                             w-10 h-10 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <img
                    src={avatarImg /* o "/images/perfil.png" si usas public/ */}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Dropdown */}
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-12 w-48 rounded-xl bg-neutral-900/90 text-white/90 
                               ring-1 ring-white/10 shadow-lg backdrop-blur-md p-1"
                  >
                    <div className="px-3 py-2 text-xs text-white/60">
                      {user?.name ?? user?.email ?? "Usuario"}
                    </div>
                    <button
                      role="menuitem"
                      onClick={() =>
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        })
                      }
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 👇 AQUÍ CONTROLAS CUÁN TAN ABAJO QUEDA EL SALUDO:
              - Cambia mt-12 por mt-16 / mt-20 / mt-[72px], etc.
              - Centrado con text-center (puedes cambiar a text-left/right) */}
        {isAuthenticated && !isLoading && (
          <div className="mt-12 text-center">
            {/* 👇 Tamaño/tipo de fuente del saludo:
                  - Cambia text-3xl md:text-4xl, o usa text-2xl si quieres más pequeño */}
            <h1 className="text-white text-3xl md:text-4xl font-medium tracking-tight"> <strong > Hi {user?.name ?? user?.email ?? "User"} </strong> </h1>


            {/* Texto indicador del modo (solo como placeholder) */}
            {isPremium && (
              <p className="mt-4 text-white/80 text-sm">Modo Premium activo</p>
            )}
            {!isPremium && hasBasic && (
              <p className="mt-4 text-white/80 text-sm">Modo Básico activo</p>
            )}
            {!isPremium && !hasBasic && (
              <p className="mt-4 text-white/80 text-sm">Sin rol asignado</p>
            )}
          </div>
        )}

        <AskComposer />

        <div className="py-10">{/* … */}</div>
      </section>
    </main>
  );
};

export default CoachApp;
