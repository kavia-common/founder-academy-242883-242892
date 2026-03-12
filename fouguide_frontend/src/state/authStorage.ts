import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "fouguide.token";
const USER_KEY = "fouguide.user";

export type StoredUser = { id: string; email: string; name?: string };

// PUBLIC_INTERFACE
export async function getSession(): Promise<{ token: string | null; user: StoredUser | null }> {
  /** Load persisted session. */
  const [token, userRaw] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);
  return { token, user: userRaw ? (JSON.parse(userRaw) as StoredUser) : null };
}

// PUBLIC_INTERFACE
export async function setSession(session: { token: string; user: StoredUser }): Promise<void> {
  /** Persist session. */
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, session.token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(session.user)),
  ]);
}

// PUBLIC_INTERFACE
export async function clearSession(): Promise<void> {
  /** Clear persisted session. */
  await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
}
