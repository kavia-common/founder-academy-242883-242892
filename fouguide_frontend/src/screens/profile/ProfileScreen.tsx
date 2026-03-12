import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";
import { useAuth } from "../../state/AuthContext";
import { API_BASE_URL } from "../../api/config";
import { healthCheck } from "../../api/client";

export function ProfileScreen() {
  const auth = useAuth();
  const [checking, setChecking] = React.useState(false);
  const [lastCheck, setLastCheck] = React.useState<string | null>(null);

  const onCheckBackend = async () => {
    setChecking(true);
    try {
      await healthCheck();
      setLastCheck("OK");
    } catch {
      setLastCheck("FAILED");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Screen>
      <Text style={Typography.h2}>Profile</Text>
      <Text style={styles.sub}>Account + diagnostics.</Text>

      <View style={{ height: 12 }} />

      <Card>
        <Text style={Typography.h3}>Account</Text>
        <View style={{ height: 10 }} />
        <Text style={styles.row}>Email: <Text style={styles.value}>{auth.user?.email ?? "-"}</Text></Text>
        <Text style={styles.row}>Name: <Text style={styles.value}>{auth.user?.name ?? "-"}</Text></Text>

        <View style={{ height: 14 }} />
        <Button title="Sign out" variant="danger" onPress={() => auth.signOut()} />
      </Card>

      <View style={{ height: 12 }} />

      <Card>
        <Text style={Typography.h3}>Backend</Text>
        <View style={{ height: 10 }} />
        <Text style={styles.row}>API Base URL: <Text style={styles.value}>{API_BASE_URL}</Text></Text>
        <Text style={styles.row}>Last check: <Text style={styles.value}>{lastCheck ?? "Never"}</Text></Text>
        <View style={{ height: 12 }} />
        <Button title="Check now" variant="ghost" onPress={onCheckBackend} loading={checking} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { color: Colors.mutedText, fontWeight: "500", marginTop: 6 },
  row: { color: Colors.mutedText, fontWeight: "700", marginTop: 8 },
  value: { color: Colors.text, fontWeight: "900" },
});
