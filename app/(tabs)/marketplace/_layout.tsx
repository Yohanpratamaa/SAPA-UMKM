import { Stack } from "expo-router";

export default function MarketplaceLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Marketplace Digital",
        }}
      />
    </Stack>
  );
}
