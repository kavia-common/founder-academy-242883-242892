import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "fouguide.onboarding.complete";

// PUBLIC_INTERFACE
export async function isOnboardingComplete(): Promise<boolean> {
  /** Whether onboarding is completed. */
  const v = await AsyncStorage.getItem(KEY);
  return v === "1";
}

// PUBLIC_INTERFACE
export async function setOnboardingComplete(complete: boolean): Promise<void> {
  /** Persist onboarding completion. */
  await AsyncStorage.setItem(KEY, complete ? "1" : "0");
}
