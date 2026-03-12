export const Colors = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",

  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",

  mutedText: "#6B7280",
  border: "#E5E7EB",

  // Overlays
  shadow: "rgba(17, 24, 39, 0.10)",
} as const;

export type AppColors = typeof Colors;
