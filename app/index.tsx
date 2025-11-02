import { Redirect } from "expo-router";

export default function Index() {
  // Redirect langsung ke intro untuk testing
  return <Redirect href="/intro" />;
}
