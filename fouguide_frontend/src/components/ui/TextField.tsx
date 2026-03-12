import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/tokens";

export function TextField(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  error?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={Colors.mutedText}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.autoCapitalize ?? "none"}
        keyboardType={props.keyboardType ?? "default"}
        style={[styles.input, props.error ? styles.inputError : null]}
      />
      {!!props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontSize: 13, fontWeight: "700", color: Colors.text },
  input: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    color: Colors.text,
  },
  inputError: { borderColor: Colors.error },
  error: { color: Colors.error, fontSize: 12, fontWeight: "600" },
});
