import { Colors } from "./colors";

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
} as const;

export const Typography = {
  h1: { fontSize: 26, fontWeight: "800" as const, color: Colors.text },
  h2: { fontSize: 20, fontWeight: "700" as const, color: Colors.text },
  h3: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  body: { fontSize: 15, fontWeight: "500" as const, color: Colors.text },
  small: { fontSize: 13, fontWeight: "500" as const, color: Colors.mutedText },
} as const;

export const Shadow = {
  card: {
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
} as const;
