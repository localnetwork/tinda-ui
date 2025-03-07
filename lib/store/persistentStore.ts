import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PersistentStore {
  locale: string;
  account: string;
  setLocale?: (locale: string) => void;
  stores: Array<object>;
}

const initialState: Omit<PersistentStore, "setLocale"> = {
  locale: "",
  account: "",
  stores: [],
};

const storeHandler = () => ({
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
