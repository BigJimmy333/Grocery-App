import { Stack } from "expo-router";
import { HouseholdProvider } from "../src/household-context";

export default function RootLayout() {
  return (
    <HouseholdProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HouseholdProvider>
  );
}
