import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { styles } from "./grocery-list.styles";

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

