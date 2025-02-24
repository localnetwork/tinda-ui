import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PersistentStore {
  locale: string;
  account: string;
  setLocale?: (locale: string) => void;
}

const initialState: Omit<PersistentStore, "setLocale"> = {
  locale: "",
  account: "",
};

const storeHandler = (set: any) => ({
  ...initialState,
});

const persistentStore = create<PersistentStore>()(
  devtools(
    persist(storeHandler, {
      name: "persistent",
    })
  )
);

export default persistentStore;
