import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { styles } from "./grocery-list.styles";

//Seperate components
import Searchbar from "../../components/searchbar";
import Textrow from "../../components/textrow";
import { useHousehold } from "../../src/household-context";

//Firebase only stores collections (folders) and documents (file)
//The structure for this application is
//-database
//  -code (house)
//      -list of groceries
//          -items (milk)

//All firebase imports
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../src/firebase";

//What defines an item
type Item = {
  id: string;
  name: string;
  checked: boolean;
};

export default function GroceryListScreen() {
  //Code to join a group
  const { householdId, loading } = useHousehold();
  if (loading) return null;

  //What is typed in the search box
  const [input, setInput] = useState("");
  //Stores the grocery item from the search box into an array
  const [items, setItems] = useState<Item[]>([]);

  //A query is how you filter data
  //This will filter items by newest first
  useEffect(() => {
    const q = query(
      collection(db, "households", householdId, "items"),
      orderBy("createdAt", "desc"),
    );

    //enables synchronization

    //onSnapshot means Listen to this Firestore query and run this function whenever the data changes.
    //snap means snapshop which is just a picture of the query at that moment
    //example is milk and eggs
    const unsub = onSnapshot(q, (snap) => {
      setItems(
        //This is an array of the ingredients stored which converts the firebase documents into JS
        snap.docs.map((d) => ({
          //Firebase stores the document ID seperately, this is used so react can use it as a key
          id: d.id,
          //d.data will return everything that defines an item (name, checked)
          //setItems rerenders the state and list
          ...(d.data() as Omit<Item, "id">),
        })),
      );
    });

    //This tells firebase to stop listening once completed
    return () => unsub();
    //If someone joins a new group it will look for changes in the new group
    //Otherwise it still look for changes in the previous one
  }, [householdId]);

  //Trim will remove spaces and prevents adding empty items
  async function addItem() {
    const name = input.trim();
    if (!name) return;

    //This creates a new item inside the grocery list
    await addDoc(collection(db, "households", householdId, "items"), {
      name,
      checked: false,
      createdAt: serverTimestamp(),
    });
    //Resets the search bar
    setInput("");
  }

  //Crosses out item from grocery list
  async function toggleItem(item: Item) {
    await updateDoc(doc(db, "households", householdId, "items", item.id), {
      checked: !item.checked,
    });
  }

  //deletes item from the grocery list
  async function deleteItem(item: Item) {
    await deleteDoc(doc(db, "households", householdId, "items", item.id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family Grocery List</Text>

      <View style={styles.inputRow}>
        <Searchbar value={input} onChange={setInput} onAdd={addItem} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Textrow
              name={item.name}
              checked={item.checked}
              onToggle={() => toggleItem(item)}
              onDelete={() => deleteItem(item)}
            />
          </View>
        )}
      />
    </View>
  );
}
