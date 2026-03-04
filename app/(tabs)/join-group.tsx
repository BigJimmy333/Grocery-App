import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useHousehold } from "../../src/household-context";

function makeGroupCode() {
  // short, shareable code like: "grp-8f3a2c"
  return Math.random().toString(36).substring(2, 6);
}

export default function JoinGroupScreen() {
  const { householdId, setHouseholdId, loading } = useHousehold();
  const [code, setCode] = useState("");

  if (loading) return null;

  async function join() {
    const clean = code.trim();
    if (!clean) return;
    await setHouseholdId(clean);
    Alert.alert("Joined", `Now using group:\n\n${clean}`);
    setCode("");
  }

  async function createGroup() {
    const newCode = makeGroupCode();
    await setHouseholdId(newCode);
    Alert.alert("Group created", `Share this code:\n\n${newCode}`);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        paddingTop: 70,
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 26,
          fontWeight: "800",
          marginBottom: 12,
        }}
      >
        Group
      </Text>

      <Text style={{ color: "#94a3b8", marginBottom: 8 }}>
        Your current code:
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 18,
        }}
      >
        {householdId}
      </Text>

      {/* Create Group */}
      <TouchableOpacity
        onPress={createGroup}
        style={{
          backgroundColor: "#22c55e",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>
          Create New Group
        </Text>
      </TouchableOpacity>

      {/* Join Group */}
      <Text style={{ color: "#94a3b8", marginBottom: 8 }}>
        Join with a code:
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
        placeholder="Paste group code"
        placeholderTextColor="#64748b"
        style={{
          backgroundColor: "#222",
          color: "white",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <TouchableOpacity
        onPress={join}
        style={{
          backgroundColor: "#2b2f3a",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>Join Group</Text>
      </TouchableOpacity>

      <Text style={{ color: "#64748b", marginTop: 18 }}>
        Create makes a new code, join switches to an existing code.
      </Text>
    </View>
  );
}
