import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { styles } from "./grocery-list.styles";

//defines what a grocery item is
type Item = {
  id: string;
  name: string;
  checked: boolean;
};

export default function GroceryListScreen() {
  //What is typed in the search box
  const [input, setInput] = useState("");
  //Stores the grocery item from the search box into an array
  const [items, setItems] = useState<Item[]>([]);

  //Trim will remove spaces and prevents adding empty items
  function addItem() {
    const name = input.trim();
    if (!name) return;

    //Creates a new grocery item
    //Date.now() gives a unique timestamp ID
    const newItem: Item = {
      id: Date.now().toString(),
      name,
      checked: false,
    };

    //Adds the new item to the top of the list.
    //...items spreads existing items.
    setItems([newItem, ...items]);
    //Clears the input field
    setInput("");
  }

  //This will loop through each item in the array to find the ID of the ingredient
  //If the item is unchecked it will create a new checked object and vice versa
  function toggleItem(id: string) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  //Removes the ID of the item that matches
  //Filter returns a new array excluding that item
  function deleteItem(id: string) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <View style={styles.container}>
      {/* Title */}
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

//Display function for search bar
//From the search bar (<TextInputBar />) pass these props
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

//Display function for ingredients
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
