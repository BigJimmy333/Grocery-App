import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth, db } from "../src/firebase";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function Index() {
  const [uid, setUid] = useState<string | null>(null);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  const [joinCode, setJoinCode] = useState("");
  const [input, setInput] = useState("");

  const [items, setItems] = useState<any[]>([]);

  // Ensure user exists
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        const cred = await signInAnonymously(auth);
        setUid(cred.user.uid);
        return;
      }

      setUid(u.uid);

      const userDoc = await getDoc(doc(db, "users", u.uid));

      if (userDoc.exists()) {
        setHouseholdId(userDoc.data().householdId);
      } else {
        await setDoc(doc(db, "users", u.uid), {
          householdId: null,
        });
      }
    });

    return () => unsub();
  }, []);

  // Listen to grocery list
  useEffect(() => {
    if (!householdId) return;

    const q = query(collection(db, "households", householdId, "items"));

    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    });

    return () => unsub();
  }, [householdId]);

  async function createHousehold() {
    if (!uid) return;

    const ref = await addDoc(collection(db, "households"), {
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "users", uid), {
      householdId: ref.id,
    });

    setHouseholdId(ref.id);

    alert(`Share this code with family:\n\n${ref.id}`);
  }

  async function joinHousehold() {
    if (!uid) return;

    await updateDoc(doc(db, "users", uid), {
      householdId: joinCode,
    });

    setHouseholdId(joinCode);
  }

  async function addItem() {
    if (!householdId || !input.trim()) return;

    await addDoc(collection(db, "households", householdId, "items"), {
      name: input,
      checked: false,
      createdAt: serverTimestamp(),
    });

    setInput("");
  }

  async function toggleItem(item: any) {
    await updateDoc(doc(db, "households", householdId!, "items", item.id), {
      checked: !item.checked,
    });
  }

  async function deleteItem(item: any) {
    await deleteDoc(doc(db, "households", householdId!, "items", item.id));
  }

  // Create or Join screen
  if (!householdId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Family Grocery</Text>

        <TouchableOpacity style={styles.button} onPress={createHousehold}>
          <Text style={styles.buttonText}>Create Household</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter household code"
          placeholderTextColor="#999"
          value={joinCode}
          onChangeText={setJoinCode}
        />

        <TouchableOpacity style={styles.button} onPress={joinHousehold}>
          <Text style={styles.buttonText}>Join Household</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Grocery list
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Add ingredient..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity style={styles.add} onPress={addItem}>
          <Text style={{ color: "white" }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => toggleItem(item)}
            >
              <Text
                style={[
                  styles.item,
                  item.checked && {
                    textDecorationLine: "line-through",
                    color: "#777",
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteItem(item)}>
              <Text style={{ color: "red" }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  inputFlex: {
    flex: 1,
    backgroundColor: "#222",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },

  add: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },

  item: {
    color: "white",
    fontSize: 18,
  },
});
