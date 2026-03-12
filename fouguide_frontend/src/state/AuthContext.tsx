import React from "react";
import { clearSession, getSession, setSession, StoredUser } from "./authStorage";
import { getMe, login, logout, register } from "../api/fouguideApi";

type AuthStatus = "loading" | "signedOut" | "signedIn";

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  user: StoredUser | null;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; name: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  /** Access auth state and actions. */
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<StoredUser | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await getSession();
      if (!mounted) return;

      // If we have a token but no profile (or stale profile), best-effort refresh.
      if (session.token) {
        try {
          const me = await getMe({ token: session.token });
          const stored: StoredUser = {
            id: me.id,
            email: me.email,
            name: me.display_name,
          };
          await setSession({ token: session.token, user: stored });
          setToken(session.token);
          setUser(stored);
          setStatus("signedIn");
          return;
        } catch {
          // Token might be invalid (in-memory backend reset). Clear local session.
          await clearSession();
        }
      }

      setToken(null);
      setUser(null);
      setStatus("signedOut");
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = React.useCallback(async (params: { email: string; password: string }) => {
    const res = await login({ email: params.email, password: params.password });
    const me = await getMe({ token: res.access_token });

    const stored: StoredUser = {
      id: me.id,
      email: me.email,
      name: me.display_name,
    };

    await setSession({ token: res.access_token, user: stored });
    setToken(res.access_token);
    setUser(stored);
    setStatus("signedIn");
  }, []);

  const signUp = React.useCallback(async (params: { email: string; password: string; name: string }) => {
    const res = await register({
      email: params.email,
      password: params.password,
      display_name: params.name,
    });
    const me = await getMe({ token: res.access_token });

    const stored: StoredUser = {
      id: me.id,
      email: me.email,
      name: me.display_name,
    };

    await setSession({ token: res.access_token, user: stored });
    setToken(res.access_token);
    setUser(stored);
    setStatus("signedIn");
  }, []);

  const signOut = React.useCallback(async () => {
    // Best-effort backend logout; always clear local session.
    try {
      await logout({ token });
    } catch {
      // ignore
    }

    await clearSession();
    setToken(null);
    setUser(null);
    setStatus("signedOut");
  }, [token]);

  const value: AuthContextValue = { status, token, user, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
