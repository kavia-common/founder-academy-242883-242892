import React from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type RoadmapItem = { id: string; title: string; status: "next" | "in_progress" | "done" };

const ROADMAP: RoadmapItem[] = [
  { id: "rm1", title: "Define ICP + Problem", status: "in_progress" },
  { id: "rm2", title: "Conduct 10 customer interviews", status: "next" },
  { id: "rm3", title: "Build MVP scope", status: "next" },
  { id: "rm4", title: "Pricing + GTM experiment", status: "next" },
];

function StatusPill(props: { status: RoadmapItem["status"] }) {
  const map = {
    done: { bg: "rgba(245,158,11,0.20)", text: Colors.text, label: "Done" },
    in_progress: { bg: "rgba(37,99,235,0.14)", text: Colors.primary, label: "In progress" },
    next: { bg: "rgba(17,24,39,0.06)", text: Colors.mutedText, label: "Next" },
  } as const;
  const s = map[props.status];
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <Text style={{ color: s.text, fontWeight: "800", fontSize: 12 }}>{s.label}</Text>
    </View>
  );
}

export function DashboardScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const width = Dimensions.get("window").width;
  const isWide = width >= 900;

  return (
    <Screen style={{ padding: 12 }} contentStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={Typography.h2}>Dashboard</Text>
          <Text style={styles.sub}>Roadmap + AI chat + live metrics.</Text>
        </View>
        <Button title="Run simulation" variant="secondary" onPress={() => nav.navigate("Simulation")} />
      </View>

      {isWide ? (
        <View style={styles.threePanel}>
          <View style={styles.panelLeft}>
            <RoadmapPanel />
          </View>
          <View style={styles.panelCenter}>
            <ChatPanel onOpenSimulation={() => nav.navigate("Simulation")} />
          </View>
          <View style={styles.panelRight}>
            <MetricsPanel />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
          <RoadmapPanel />
          <ChatPanel onOpenSimulation={() => nav.navigate("Simulation")} />
          <MetricsPanel />
        </ScrollView>
      )}
    </Screen>
  );
}

function RoadmapPanel() {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={Typography.h3}>Roadmap</Text>
      <Text style={styles.panelSub}>Your next milestones to reach Series A readiness.</Text>

      <View style={{ height: 10 }} />
      <View style={{ gap: 10 }}>
        {ROADMAP.map((it) => (
          <Pressable key={it.id} style={styles.roadmapItem}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", color: Colors.text }}>{it.title}</Text>
              <Text style={{ color: Colors.mutedText, marginTop: 4, fontSize: 12 }}>
                Tap to view lesson + checklist (coming soon).
              </Text>
            </View>
            <StatusPill status={it.status} />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

function ChatPanel(props: { onOpenSimulation: () => void }) {
  const [messages, setMessages] = React.useState<Array<{ id: string; role: "ai" | "user"; text: string }>>([
    {
      id: "m1",
      role: "ai",
      text: "Welcome. Tell me your startup idea in one sentence, and I’ll propose your next 3 execution steps.",
    },
  ]);

  const sendQuick = (text: string) => {
    const id = `m_${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id, role: "user", text },
      {
        id: `${id}_ai`,
        role: "ai",
        text: "Great. Next: define ICP, write an interview script, and schedule 10 calls. Want a simulation to practice an interview?",
      },
    ]);
  };

  return (
    <Card style={{ flex: 1 }}>
      <View style={styles.chatHeader}>
        <View style={{ flex: 1 }}>
          <Text style={Typography.h3}>AI Coach</Text>
          <Text style={styles.panelSub}>Conversational UI for guidance + prompts.</Text>
        </View>
        <Button title="Simulation" onPress={props.onOpenSimulation} />
      </View>

      <View style={{ height: 10 }} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === "user" ? styles.bubbleUser : styles.bubbleAi,
            ]}
          >
            <Text style={{ color: Colors.text, fontWeight: "600" }}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ height: 10 }} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button title="Pitch idea" variant="ghost" onPress={() => sendQuick("I’m building a product for freelancers to track expenses automatically.")} style={{ flex: 1 }} />
        <Button title="Ask next step" variant="ghost" onPress={() => sendQuick("What should I do this week to validate demand?")} style={{ flex: 1 }} />
      </View>
    </Card>
  );
}

function MetricsPanel() {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={Typography.h3}>Startup Status</Text>
      <Text style={styles.panelSub}>Real-time progress + key metrics (mock).</Text>

      <View style={{ height: 12 }} />

      <View style={{ gap: 10 }}>
        <MetricRow label="Stage" value="Pre-seed" />
        <MetricRow label="Interviews completed" value="2 / 10" highlight />
        <MetricRow label="Clarity score" value="67" />
        <MetricRow label="Momentum" value="Medium" highlight />
      </View>

      <View style={{ height: 12 }} />
      <Text style={{ color: Colors.mutedText, fontSize: 12 }}>
        This panel will reflect backend-driven progression + gamification once endpoints are available.
      </Text>
    </Card>
  );
}

function MetricRow(props: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.metricRow}>
      <Text style={{ color: Colors.mutedText, fontWeight: "700" }}>{props.label}</Text>
      <Text
        style={{
          color: props.highlight ? Colors.secondary : Colors.text,
          fontWeight: "900",
        }}
      >
        {props.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  sub: { color: Colors.mutedText, fontWeight: "500", marginTop: 4 },
  threePanel: { flex: 1, flexDirection: "row", gap: 12 },
  panelLeft: { flex: 0.9 },
  panelCenter: { flex: 1.3 },
  panelRight: { flex: 0.8 },

  panelSub: { color: Colors.mutedText, fontSize: 12, marginTop: 4 },
  roadmapItem: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "rgba(37,99,235,0.03)",
    alignItems: "center",
  },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  chatHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  bubble: { maxWidth: "92%", padding: 12, borderRadius: 14 },
  bubbleAi: { backgroundColor: "rgba(37,99,235,0.08)", alignSelf: "flex-start" },
  bubbleUser: { backgroundColor: "rgba(245,158,11,0.18)", alignSelf: "flex-end" },
  metricRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
