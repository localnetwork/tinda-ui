import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ModalStore {
  modalInfo: {};
  setModalInfo: (info: {}) => void;
}

const useModalStore = create<ModalStore>()(
  devtools((set) => ({
    modalInfo: {},
  }))
);

export default useModalStore;
