import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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