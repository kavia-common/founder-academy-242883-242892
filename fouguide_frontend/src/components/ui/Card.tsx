import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius, Shadow } from "../../theme/tokens";

export function Card(props: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    ...Shadow.card,
  },
});
