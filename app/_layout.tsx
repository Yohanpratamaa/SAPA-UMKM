import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="profile/create"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Tambah Profil UMKM",
        }}
      />
    </Stack>
  );
}
