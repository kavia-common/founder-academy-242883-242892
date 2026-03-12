import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Button } from "./Button";

export function LoadingView(props: { title?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator />
      <Text style={styles.text}>{props.title ?? "Loading..."}</Text>
    </View>
  );
}

export function ErrorView(props: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={[styles.text, styles.title]}>{props.title ?? "Something went wrong"}</Text>
      <Text style={styles.text}>{props.message}</Text>
      {props.onRetry ? (
        <View style={{ height: 14 }} />
      ) : null}
      {props.onRetry ? <Button title="Retry" onPress={props.onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 16 },
  text: { color: Colors.mutedText, textAlign: "center" },
  title: { color: Colors.text, fontWeight: "800" },
});
