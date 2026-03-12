import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { setOnboardingComplete } from "../../state/onboardingStorage";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";
import { healthCheck } from "../../api/client";
import { ErrorView } from "../../components/ui/StateViews";

export function OnboardingScreen() {
  const [startupIdea, setStartupIdea] = React.useState("");
  const [targetCustomer, setTargetCustomer] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const verifyBackend = async () => {
    setApiError(null);
    try {
      await healthCheck();
    } catch {
      setApiError(
        "Backend is unreachable. You can still continue (mock mode), but set EXPO_PUBLIC_API_BASE_URL for live API."
      );
    }
  };

  React.useEffect(() => {
    verifyBackend();
  }, []);

  const onContinue = async () => {
    setLoading(true);
    try {
      // TODO: send onboarding to backend when endpoints exist.
      await setOnboardingComplete(true);
    } finally {
      setLoading(false);
    }
  };

  if (apiError) {
    // Show non-blocking error with retry; user can still proceed.
    return (
      <Screen>
        <ErrorView message={apiError} onRetry={verifyBackend} />
        <View style={{ height: 12 }} />
        <Button title="Continue anyway" onPress={() => setApiError(null)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: 14 }}>
        <Text style={Typography.h2}>Onboarding</Text>
        <Text style={styles.subtitle}>
          Answer 2 questions so your roadmap + simulations adapt to your context.
        </Text>

        <Card>
          <View style={{ gap: 12 }}>
            <TextField
              label="What are you building?"
              value={startupIdea}
              onChangeText={setStartupIdea}
              placeholder="e.g., AI-powered bookkeeping for freelancers"
              autoCapitalize="sentences"
            />
            <TextField
              label="Who is the target customer?"
              value={targetCustomer}
              onChangeText={setTargetCustomer}
              placeholder="e.g., US-based freelance designers"
              autoCapitalize="sentences"
            />
            <Button title="Enter dashboard" onPress={onContinue} loading={loading} />
          </View>
        </Card>

        <Text style={styles.note}>
          You’ll land in a three-panel dashboard: Roadmap (left), AI Chat (center), Metrics (right).
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: Colors.mutedText, fontWeight: "500" },
  note: { color: Colors.mutedText, fontSize: 12, textAlign: "center" },
});
