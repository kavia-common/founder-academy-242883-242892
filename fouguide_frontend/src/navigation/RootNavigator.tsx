import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, AuthStackParamList, AppTabsParamList } from "./types";
import { useAuth } from "../state/AuthContext";
import { isOnboardingComplete } from "../state/onboardingStorage";
import { LoadingView } from "../components/ui/StateViews";
import { Colors } from "../theme/colors";

import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";

import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { SimulationsScreen } from "../screens/simulations/SimulationsScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { SimulationScreen } from "../screens/simulations/SimulationScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tabs = createBottomTabNavigator<AppTabsParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

function AppTabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedText,
        tabBarStyle: { borderTopColor: Colors.border },
      }}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Simulations" component={SimulationsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

// PUBLIC_INTERFACE
export function RootNavigator() {
  /** Root navigation deciding between auth, onboarding, and app flows. */
  const auth = useAuth();
  const [onboardingDone, setOnboardingDone] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const done = await isOnboardingComplete();
      if (!mounted) return;
      setOnboardingDone(done);
    })();
    return () => {
      mounted = false;
    };
  }, [auth.status]);

  if (auth.status === "loading" || onboardingDone === null) {
    return <LoadingView title="Preparing FouGuide..." />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {auth.status === "signedOut" ? (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} options={{ headerShown: false }} />
        ) : onboardingDone ? (
          <>
            <RootStack.Screen name="App" component={AppTabsNavigator} options={{ headerShown: false }} />
            <RootStack.Screen
              name="Simulation"
              component={SimulationScreen}
              options={{ headerShown: false, presentation: "modal" }}
            />
          </>
        ) : (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
