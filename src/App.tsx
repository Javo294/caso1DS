import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginForm from "./components/forms/LoginForm";

const namespace = "https://20minCoachs.app/roles";

function App() {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setRoles([]);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const claims = await getIdTokenClaims();
        const tokenRoles: string[] = claims?.[namespace] || [];

        console.log("Roles recibidos desde claims:", tokenRoles);

        if (mounted) setRoles(tokenRoles);
      } catch (err) {
        console.error("Error al obtener claims:", err);
        if (mounted) setRoles([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, getIdTokenClaims]);

  const isPremium = roles.includes("premium-user");
  const isBasic = roles.includes("basic-user");

  return (
    <main className="min-h-screen flex">
      {/* Panel izquierdo (oscuro) */}
      <section className="hidden md:block basis-7/12 bg-neutral-900" />

      {/* Panel derecho (claro) */}
      <section className="basis-full md:basis-5/12 bg-neutral-100 flex items-center justify-center p-8">
        <div className="w-full max-w-lg mx-auto text-center space-y-10">
          {/* Título y subtítulo del mock */}
          <header className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-funnel font-medium tracking-tight text-neutral-900">
              20minsCoach
            </h1>
            <p className="text-neutral-700">
              get a fast solution for yours problems
            </p>
          </header>

          {/* Aquí vive el LoginForm */}
          <LoginForm />

          {/* Bloque informativo según rol (cuando ya está autenticado) */}
          {!isLoading && isAuthenticated && (
            <div className="space-y-4">
              <div className="h-px bg-neutral-300/70" />
              <h3 className="font-semibold text-neutral-800">
                Contenido disponible para ti:
              </h3>
              {isPremium && (
                <p className="text-neutral-700">
                  🔓 Acceso completo a todas las funciones premium.
                </p>
              )}
              {isBasic && (
                <p className="text-neutral-700">
                  🔒 Acceso limitado. Algunas funciones están restringidas.
                </p>
              )}
              {!isPremium && !isBasic && (
                <p className="text-neutral-700">
                  ⚠️ No tienes un rol asignado. Contacta al administrador.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
