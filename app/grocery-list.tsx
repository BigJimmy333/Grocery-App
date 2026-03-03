import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Item = {
  id: string;
  name: string;
  checked: boolean;
};

export default function GroceryListScreen() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  function addItem() {
    const name = input.trim();
    if (!name) return;

    const newItem: Item = {
      id: Date.now().toString(),
      name,
      checked: false,
    };

    setItems([newItem, ...items]);
    setInput("");
  }

  function toggleItem(id: string) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  function deleteItem(id: string) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family Grocery List</Text>

      {/* Input Bar */}
      <View style={styles.inputRow}>
        <TextInputBar value={input} onChange={setInput} onAdd={addItem} />
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TextRow
              name={item.name}
              checked={item.checked}
              onToggle={() => toggleItem(item.id)}
              onDelete={() => deleteItem(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

/** Small local components (fine for now) **/
import { TextInput, TouchableOpacity } from "react-native";

function TextInputBar({
  value,
  onChange,
  onAdd,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Add ingredient..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onAdd}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addText}>Add</Text>
      </TouchableOpacity>
    </>
  );
}

function TextRow({
  name,
  checked,
  onToggle,
  onDelete,
}: {
  name: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <TouchableOpacity onPress={onToggle}>
        <Text style={[styles.itemText, checked && styles.checkedText]}>
          {name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  addText: {
    color: "white",
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  itemText: {
    color: "white",
    fontSize: 18,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  delete: {
    color: "#ff4444",
    fontSize: 18,
  },
});