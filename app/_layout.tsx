import { Stack } from "expo-router";
import { AuthProvider } from "../contexts";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen
          name="profile/create"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/edit"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/detail"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/[id]/index"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/[id]/edit"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
