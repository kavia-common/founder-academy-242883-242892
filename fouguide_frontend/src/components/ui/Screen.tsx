import React from "react";
import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";

export function Screen(props: {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, props.style]}>
        <View style={props.contentStyle}>{props.children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 16 },
});
