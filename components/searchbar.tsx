import { Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../app/grocery-list.styles";

export default function SearchBar({
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
