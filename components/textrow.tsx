import { Text, TouchableOpacity } from "react-native";
import { styles } from "../app/grocery-list.styles";

export default function TextRow({
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
