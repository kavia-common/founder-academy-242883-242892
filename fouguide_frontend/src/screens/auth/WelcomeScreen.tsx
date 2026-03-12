import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { Screen } from "../../components/ui/Screen";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={Typography.h1}>FouGuide</Text>
        <Text style={styles.subtitle}>
          Ocean Professional. Modern founder training with roadmap, AI chat, and real-world simulations.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Sign in" onPress={() => navigation.navigate("SignIn")} />
        <Button title="Create account" variant="secondary" onPress={() => navigation.navigate("SignUp")} />
      </View>

      <Text style={styles.footer}>
        Tip: set EXPO_PUBLIC_API_BASE_URL to your backend to enable live checks.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: "center", gap: 12 },
  subtitle: { color: Colors.mutedText, fontSize: 15, lineHeight: 22, fontWeight: "500" },
  actions: { gap: 12 },
  footer: { marginTop: 14, color: Colors.mutedText, fontSize: 12, textAlign: "center" },
});
