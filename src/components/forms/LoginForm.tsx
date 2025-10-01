import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const namespace = "https://20minCoachs.app/roles";

const LoginForm: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  const roles: string[] = (user?.[namespace] as string[]) || [];
  console.log("LoginForm → roles:", roles, "user:", user);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="h-12 rounded-full bg-neutral-200/70 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {

    return (
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          className="
          w-full inline-flex items-center justify-center 
          rounded-full px-6 py-3 text-base font-semibold text-white 
          shadow-lg transition hover:shadow-xl hover:opacity-95 active:opacity-90
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 ring-offset-neutral-100
          bg-[linear-gradient(90deg,rgba(1,42,81,0.93)_5%,rgba(1,25,81,0.96)_19%,rgba(1,12,81,0.98)_43%,rgba(43,1,93,1)_68%,rgba(131,3,118,0.97)_100%)]"
          onClick={() =>
            loginWithRedirect({
              authorizationParams: { 
                prompt: "login", 
                redirect_uri : `${window.location.origin}/app`
              },
            })
          }
        >
          Sign up 
        </button>
      </div>
    );
  }
  
  const displayName = user?.name || user?.nickname || user?.email || "User";
  const roleLabel = roles.includes("premium-user")
    ? "Premium"
    : roles.includes("basic-user")
    ? "Basic"
    : "Sin rol";

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div className="space-y-1 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Hi, {displayName}
        </h2>
        <p className="text-neutral-600">Rol: {roleLabel}</p>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white/80 px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 ring-offset-neutral-100"
          onClick={() =>
            logout({
              logoutParams: { returnTo: window.location.origin },
            })
          }
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
