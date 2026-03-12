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
import { useAuth } from "../../state/AuthContext";
import { addTurn, createSession, endSession, getMe, getProgress, leaderboard, listMyBadges } from "../../api/fouguideApi";

type RouteParams = { scenarioId?: string };

export function SimulationScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const auth = useAuth();

  const title =
    params.scenarioId === "s2"
      ? "Investor Pitch Q&A"
      : params.scenarioId === "s3"
      ? "Pricing Negotiation"
      : "Customer Interview";

  const [turns, setTurns] = React.useState<Array<{ id: string; role: "ai" | "user"; text: string }>>([
    { id: "t1", role: "ai", text: `Simulation: ${title}. I'll play the counterpart. Start when ready.` },
  ]);

  const [smokeLoading, setSmokeLoading] = React.useState(false);
  const [smokeLog, setSmokeLog] = React.useState<string[]>([]);

  const pushLog = (line: string) => setSmokeLog((l) => [`${new Date().toISOString()}  ${line}`, ...l].slice(0, 40));

  const runSmokeFlow = async () => {
    if (!auth.token) {
      pushLog("ERROR: Not signed in (missing token).");
      return;
    }
    setSmokeLoading(true);
    try {
      pushLog("Starting smoke flow...");

      const me = await getMe({ token: auth.token });
      pushLog(`✓ /users/me (display_name=${me.display_name}, xp=${me.xp ?? 0}, level=${me.level ?? 1})`);

      const sess = await createSession({
        token: auth.token,
        type: "simulation",
        title: "E2E Smoke Simulation",
        scenario: "Customer interview about workflow pain points",
      });
      pushLog(`✓ /sessions (id=${sess.id}, status=${sess.status ?? "active"})`);

      const t = await addTurn({
        token: auth.token,
        sessionId: sess.id,
        role: "user",
        content: "Can you walk me through the last time you faced this issue?",
      });
      pushLog(`✓ /sessions/{id}/turns (turnId=${t.id})`);

      const ended = await endSession({ token: auth.token, sessionId: sess.id });
      pushLog(`✓ /sessions/{id}/end (xp_awarded=${ended.xp_awarded}, badges_awarded=${ended.badges_awarded?.length ?? 0})`);

      const progress = await getProgress({ token: auth.token });
      pushLog(`✓ /progress (roadmap_id=${progress.roadmap_id}, lessons=${progress.lessons?.length ?? 0})`);

      const myBadges = await listMyBadges({ token: auth.token });
      pushLog(`✓ /gamification/me/badges (count=${myBadges.length})`);

      const lb = await leaderboard({ limit: 5 });
      pushLog(`✓ /gamification/leaderboard (top=${lb.length})`);

      pushLog("Smoke flow complete.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      pushLog(`ERROR: ${msg}`);
    } finally {
      setSmokeLoading(false);
    }
  };

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

      <View style={{ flex: 1, gap: 12 }}>
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
            <Button
              title="Ask a question"
              variant="secondary"
              onPress={() => respond("Can you describe your current workflow?")}
              style={{ flex: 1 }}
            />
            <Button
              title="Probe pain"
              variant="primary"
              onPress={() => respond("What makes that painful or slow today?")}
              style={{ flex: 1 }}
            />
          </View>

          <View style={{ height: 10 }} />
          <Text style={{ color: Colors.mutedText, fontSize: 12 }}>
            Below is a live backend smoke-flow runner to verify API integration end-to-end.
          </Text>
        </Card>

        <Card>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "900", color: Colors.text }}>Live backend smoke flow</Text>
                <Text style={{ color: Colors.mutedText, fontSize: 12 }}>
                  Runs: me → create session → add turn → end session → progress → my badges → leaderboard
                </Text>
              </View>
              <Button title="Run" onPress={runSmokeFlow} loading={smokeLoading} />
            </View>

            {!!auth.token ? (
              <Text style={{ color: Colors.mutedText, fontSize: 12 }}>Auth token present.</Text>
            ) : (
              <Text style={{ color: Colors.error, fontSize: 12, fontWeight: "700" }}>
                Not signed in (token missing). Go back and sign in/up first.
              </Text>
            )}

            <View style={{ borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 }}>
              <ScrollView style={{ maxHeight: 140 }}>
                {smokeLog.length === 0 ? (
                  <Text style={{ color: Colors.mutedText, fontSize: 12 }}>No logs yet.</Text>
                ) : (
                  smokeLog.map((l, idx) => (
                    <Text key={`${l}_${idx}`} style={{ color: Colors.text, fontSize: 12, marginBottom: 4 }}>
                      {l}
                    </Text>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Card>
      </View>
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
