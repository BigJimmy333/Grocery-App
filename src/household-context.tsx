//This page acts as a auth context page which will paste the
//code of the user to all the pages that need it
//Without it, each screen would have its own separate value,
//and they wouldn’t stay in sync.

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Ctx = {
  householdId: string;
  setHouseholdId: (id: string) => Promise<void>;
  loading: boolean;
};

const HouseholdContext = createContext<Ctx | null>(null);

const KEY = "householdId";

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const [householdId, setHouseholdIdState] = useState<string>("family-list"); // default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved) setHouseholdIdState(saved);
      setLoading(false);
    })();
  }, []);

  async function setHouseholdId(id: string) {
    const clean = id.trim();
    if (!clean) return;
    await AsyncStorage.setItem(KEY, clean);
    setHouseholdIdState(clean);
  }

  const value = useMemo(
    () => ({ householdId, setHouseholdId, loading }),
    [householdId, loading],
  );

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext);
  if (!ctx)
    throw new Error("useHousehold must be used within HouseholdProvider");
  return ctx;
}
