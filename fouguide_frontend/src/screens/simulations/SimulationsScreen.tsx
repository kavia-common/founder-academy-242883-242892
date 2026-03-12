import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

const SCENARIOS = [
  { id: "s1", title: "Customer Interview", desc: "Practice discovery questions and avoid leading the witness." },
  { id: "s2", title: "Investor Pitch Q&A", desc: "Handle pressure questions: traction, moat, and GTM." },
  { id: "s3", title: "Pricing Negotiation", desc: "Anchor pricing, learn concessions, protect value." },
];

export function SimulationsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <Text style={Typography.h2}>Simulations</Text>
      <Text style={styles.sub}>High-signal practice in realistic startup scenarios.</Text>

      <View style={{ height: 12 }} />

      <View style={{ gap: 12 }}>
        {SCENARIOS.map((s) => (
          <Card key={s.id}>
            <Text style={Typography.h3}>{s.title}</Text>
            <Text style={styles.desc}>{s.desc}</Text>
            <View style={{ height: 12 }} />
            <Button title="Start" onPress={() => nav.navigate("Simulation", { scenarioId: s.id })} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { color: Colors.mutedText, fontWeight: "500", marginTop: 6 },
  desc: { color: Colors.mutedText, marginTop: 6, lineHeight: 20 },
});
