import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../src/firebase";

export default function Index() {
  const [uid, setUid] = useState<string | null>(null);
  const [status, setStatus] = useState("Starting…");
  const [lastPing, setLastPing] = useState<string>("(none)");

  // 1) Ensure anonymous auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          setStatus("Signing in anonymously…");
          const cred = await signInAnonymously(auth);
          setUid(cred.user.uid);
          return;
        }
        setUid(u.uid);
        setStatus("Signed in ✅");
      } catch (e: any) {
        Alert.alert("Auth error", e?.message ?? "Unknown auth error");
        setStatus("Auth failed ❌");
      }
    });

    return () => unsub();
  }, []);

  // 2) Realtime listen to a test doc
  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "debug", uid);
    setStatus("Listening to Firestore…");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setLastPing("(doc not created yet)");
          return;
        }
        const data: any = snap.data();
        setLastPing(data?.pingAt?.toDate?.()?.toLocaleString?.() ?? "updated");
        setStatus("Firestore connected ✅");
      },
      (err) => {
        Alert.alert("Firestore error", err.message);
        setStatus("Firestore failed ❌");
      },
    );

    return () => unsub();
  }, [uid]);

  async function sendPing() {
    if (!uid) return;
    try {
      await setDoc(
        doc(db, "debug", uid),
        { pingAt: serverTimestamp() },
        { merge: true },
      );
    } catch (e: any) {
      Alert.alert("Write failed", e?.message ?? "Unknown error");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      <Text style={styles.line}>UID: {uid ?? "…"}</Text>
      <Text style={styles.line}>Status: {status}</Text>
      <Text style={styles.line}>Last ping: {lastPing}</Text>

      <TouchableOpacity style={styles.button} onPress={sendPing}>
        <Text style={styles.buttonText}>Write test (ping)</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        If this works, you’ll see “Firestore connected ✅” and the last ping
        time update instantly.
      </Text>
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
  title: { color: "white", fontSize: 24, fontWeight: "800", marginBottom: 16 },
  line: { color: "#ddd", fontSize: 16, marginBottom: 8 },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "800" },
  hint: { color: "#777", marginTop: 18, lineHeight: 20 },
});
