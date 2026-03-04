import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Family Grocery
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/grocery-list")}
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>
          Open Grocery List
        </Text>
      </TouchableOpacity>
    </View>
  );
}
