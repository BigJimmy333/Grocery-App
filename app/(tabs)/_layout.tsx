import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="grocery-list"
        options={{
          title: "Groceries",
        }}
      />
    </Tabs>
  );
}
