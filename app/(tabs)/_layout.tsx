import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#94a3b8",

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,

          height: 60,
          borderRadius: 18,

          backgroundColor: "#111827",

          borderTopWidth: 0,
          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="grocery-list"
        options={{
          title: "Groceries",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
