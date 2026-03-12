export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
};

export type AppTabsParamList = {
  Dashboard: undefined;
  Simulations: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  App: undefined;
  Simulation: { scenarioId?: string } | undefined;
};
