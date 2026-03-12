import React from "react";
import { clearSession, getSession, setSession, StoredUser } from "./authStorage";

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
      setToken(session.token);
      setUser(session.user);
      setStatus(session.token ? "signedIn" : "signedOut");
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = React.useCallback(async (params: { email: string; password: string }) => {
    // Backend auth routes are not yet defined in OpenAPI; provide a deterministic mock session.
    // Replace this implementation when backend auth endpoints are available.
    const mockToken = `mock.${Date.now()}`;
    const mockUser: StoredUser = { id: "u_1", email: params.email, name: "Founder" };
    await setSession({ token: mockToken, user: mockUser });
    setToken(mockToken);
    setUser(mockUser);
    setStatus("signedIn");
  }, []);

  const signUp = React.useCallback(async (params: { email: string; password: string; name: string }) => {
    const mockToken = `mock.${Date.now()}`;
    const mockUser: StoredUser = { id: "u_1", email: params.email, name: params.name };
    await setSession({ token: mockToken, user: mockUser });
    setToken(mockToken);
    setUser(mockUser);
    setStatus("signedIn");
  }, []);

  const signOut = React.useCallback(async () => {
    await clearSession();
    setToken(null);
    setUser(null);
    setStatus("signedOut");
  }, []);

  const value: AuthContextValue = { status, token, user, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
