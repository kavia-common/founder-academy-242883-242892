import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/tokens";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<
  Variant,
  { container: ViewStyle; textColor: string }
> = {
  primary: { container: { backgroundColor: Colors.primary }, textColor: "#fff" },
  secondary: {
    container: { backgroundColor: Colors.secondary },
    textColor: "#111827",
  },
  danger: { container: { backgroundColor: Colors.error }, textColor: "#fff" },
  ghost: {
    container: { backgroundColor: "transparent", borderWidth: 1, borderColor: Colors.border },
    textColor: Colors.text,
  },
};

export function Button(props: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const variant = props.variant ?? "primary";
  const v = variantStyles[variant];
  const disabled = props.disabled || props.loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        v.container,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        props.style,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={v.textColor} />
      ) : (
        <Text style={[styles.text, { color: v.textColor }]}>{props.title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: { fontSize: 15, fontWeight: "700" },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.55 },
});
