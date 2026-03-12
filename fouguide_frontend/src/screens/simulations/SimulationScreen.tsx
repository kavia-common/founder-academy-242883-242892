import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type RouteParams = { scenarioId?: string };

export function SimulationScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;

  const title =
    params.scenarioId === "s2"
      ? "Investor Pitch Q&A"
      : params.scenarioId === "s3"
      ? "Pricing Negotiation"
      : "Customer Interview";

  const [turns, setTurns] = React.useState<Array<{ id: string; role: "ai" | "user"; text: string }>>([
    { id: "t1", role: "ai", text: `Simulation: ${title}. I'll play the counterpart. Start when ready.` },
  ]);

  const respond = (text: string) => {
    const id = `t_${Date.now()}`;
    setTurns((t) => [
      ...t,
      { id, role: "user", text },
      {
        id: `${id}_ai`,
        role: "ai",
        text: "Good. Follow up with: 'Can you walk me through the last time you faced that issue?' Then ask about current workaround.",
      },
    ]);
  };

  return (
    <Screen style={{ padding: 12 }} contentStyle={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Button title="Close" variant="ghost" onPress={() => nav.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={[Typography.h3, { textAlign: "center" }]}>{title}</Text>
          <Text style={styles.topSub}>Full-screen focus mode</Text>
        </View>
        <View style={{ width: 72 }} />
      </View>

      <Card style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 10 }}>
          {turns.map((t) => (
            <View key={t.id} style={[styles.bubble, t.role === "user" ? styles.user : styles.ai]}>
              <Text style={{ color: Colors.text, fontWeight: "600" }}>{t.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 10 }} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button title="Ask a question" variant="secondary" onPress={() => respond("Can you describe your current workflow?")} style={{ flex: 1 }} />
          <Button title="Probe pain" variant="primary" onPress={() => respond("What makes that painful or slow today?")} style={{ flex: 1 }} />
        </View>

        <View style={{ height: 10 }} />
        <Text style={{ color: Colors.mutedText, fontSize: 12 }}>
          This flow will be backed by AI microservices and saved to the backend once endpoints are implemented.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  topSub: { color: Colors.mutedText, fontSize: 12, textAlign: "center", marginTop: 2 },
  bubble: { maxWidth: "92%", padding: 12, borderRadius: 14 },
  ai: { backgroundColor: "rgba(37,99,235,0.08)", alignSelf: "flex-start" },
  user: { backgroundColor: "rgba(245,158,11,0.18)", alignSelf: "flex-end" },
});
