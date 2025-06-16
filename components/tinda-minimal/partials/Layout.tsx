import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import useSWR from "swr";
import BaseApi from "@/lib/api/_base.api";
import persistentStore from "@/lib/store/persistentStore";
import useModalStore from "@/lib/store/modalStore";
import Modal from "../modals/Modal";
export default function Layout({ children }: { children: ReactNode }) {
  const {
    data: isProfile,
    error,
    isValidating,
  } = BaseApi.swr(process.env.NEXT_PUBLIC_API_URL + "/profile", {
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
  });

  const modalInfo = useModalStore((state) => state.modalInfo);

  useEffect(() => {
    if (isProfile?.data) {
      const accData = {
        user: isProfile.data.user,
        profile: isProfile.data.profile,
      };

      persistentStore.setState({
        account: accData,
        stores: isProfile.data.stores,
      });
    }
  }, [isProfile?.data]);

  console.log("modalInfo", modalInfo);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">{children}</main>
      <Footer />

      {modalInfo.isOpen && <Modal />}
    </div>
  );
}
