import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const namespace = "https://20minCoachs.app/roles";

const CoachApp: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  // Leer roles directamente del claim namespaced
  const roles: string[] = (user?.[namespace] as string[]) || [];
  const isPremium = roles.includes("premium-user");
  const hasBasic = roles.includes("basic-user");

  console.log("CoachApp → roles:", roles);

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-funnel font-medium tracking-tight text-neutral-900">
          20minsCoach
        </h1>

        {isLoading && (
          <div className="mx-auto w-full max-w-sm h-12 rounded-full bg-neutral-200/70 animate-pulse" />
        )}

        {!isLoading && !isAuthenticated && (
          <p className="text-neutral-700">
            Inicia sesión para ver tu estado de suscripción.
          </p>
        )}

        {!isLoading && isAuthenticated && (
          <div className="space-y-2">
            <p className="text-neutral-800">
              Hola, <span className="font-semibold">{user?.name ?? user?.email ?? "usuario"}</span>
            </p>

            {isPremium ? (
              <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white
                bg-[linear-gradient(90deg,rgba(1,42,81,0.93)_5%,rgba(1,25,81,0.96)_19%,rgba(1,12,81,0.98)_43%,rgba(43,1,93,1)_68%,rgba(131,3,118,0.97)_100%)]
                shadow-md">
                Eres <strong className="ml-1">Premium</strong>
              </span>
            ) : hasBasic ? (
              <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-neutral-800 bg-neutral-200 shadow-sm">
                No eres Premium (rol Básico)
              </span>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-neutral-800 bg-amber-100 shadow-sm">
                Sin rol asignado
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CoachApp;
