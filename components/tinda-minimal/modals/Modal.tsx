import useModalStore from "@/lib/store/modalStore";
import { useEffect } from "react";
import AddUserStore from "./types/AddUserStore";
export default function Modal() {
  const closeModal = () => {
    useModalStore.setState({ modalInfo: {} });
  };

  const modalInfo = useModalStore((state) => state.modalInfo);

  const modalType = modalInfo.type;

  let modalContent = null;

  switch (modalType) {
    case "add-user-store":
      modalContent = <AddUserStore />;
      break;
    default:
      modalContent = null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[10001] bg-[#000] bg-opacity-50 flex items-center justify-center">
      <span
        className="overlay absolute top-0 left-0 w-full h-full"
        onClick={closeModal}
      />
      <div className="container !max-w-[860px] relative z-[100]">
        <button
          className="bg-secondary absolute top-[30px] right-[30px] text-white px-[8px] py-[5px] rounded-[5px]"
          onClick={closeModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="bg-white rounded-[5px] text-center p-[30px] shadow-md">
          <h1 className="text-left text-[20px] font-bold text-secondary underline mb-[15px]">
            {modalInfo?.title}
          </h1>
          <div className="modal-content">{modalContent}</div>
        </div>
      </div>
    </div>
  );
}
