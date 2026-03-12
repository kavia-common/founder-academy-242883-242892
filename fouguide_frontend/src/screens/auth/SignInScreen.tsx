import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/tokens";
import { useAuth } from "../../state/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const auth = useAuth();
  const [email, setEmail] = React.useState("founder@example.com");
  const [password, setPassword] = React.useState("password");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await auth.signIn({ email, password });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={Typography.h2}>Welcome back</Text>
        <Text style={styles.subtitle}>Pick up where you left off in your founder journey.</Text>

        <View style={{ height: 14 }} />

        <Card>
          <View style={{ gap: 12 }}>
            <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Button title="Sign in" onPress={onSubmit} loading={loading} />
            <Button
              title="Need an account? Sign up"
              variant="ghost"
              onPress={() => navigation.navigate("SignUp")}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: 6, color: Colors.mutedText, fontWeight: "500" },
  error: { color: Colors.error, fontWeight: "700" },
});
