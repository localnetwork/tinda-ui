import StoreCard from "@/components/tinda-minimal/modules/store/seller-center/StoreCard";
import persistentStore from "@/lib/store/persistentStore";
import siteConfig from "@/site.config";
import Image from "next/image";
import Link from "next/link";
import { Key } from "react";

interface Stores {
  map(
    arg0: (
      item: object,
      index: Key | null | undefined
    ) => import("react").JSX.Element
  ): import("react").ReactNode;
  length: number;
}
export default function SellerCenter() {
  const stores = persistentStore((state) => state.stores) as unknown as Stores;

  return (
    <div className="bg-[#f5f5f5] p-[30px] min-h-[100vh]">
      <div className="container">
        <div className="bg-white rounded-[5px] text-center p-[30px] shadow-md">
          <h1 className="text-left text-[20px] font-bold text-secondary underline mb-[15px]">
            Seller Center
          </h1>
          {stores?.length > 0 ? (
            <div>
              <div className="text-left">
                <Link
                  className="bg-secondary text-white px-[15px] py-[8px] rounded-[5px] inline-flex items-center"
                  href="/store/add"
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 py-[15px] gap-[15px]">
                {stores?.map((item: any, index: Key | null | undefined) => {
                  let storeLogo;
                  let storeBanner;
                  if (item?.storeLogo?.formats) {
                    storeLogo = JSON.parse(item?.storeLogo?.formats);
                  }

                  if (item?.storeBanner?.formats) {
                    storeBanner = JSON.parse(item?.storeBanner?.formats);
                  }

                  return (
                    <div key={index} className="">
                      <StoreCard
                        store_name={item?.storeName}
                        store_slug={item?.storeSlug}
                        store_banner={
                          siteConfig.APIDOMAIN + storeBanner?.medium
                        }
                        store_logo={siteConfig.APIDOMAIN + storeLogo?.thumbnail}
                        uuid={item?.uuid}
                        store_phone={item?.storePhone}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <Image
                src="/assets/seller-portal.png"
                width={200}
                height={200}
                alt="Seller Center"
                className="inline-block mx-auto"
              />
              <h1 className="text-primary text-[20px] mt-[30px]">
                Welcome to Tinda!
              </h1>

              <p className="text-[14px] mt-[10px] text-[#797979]">
                To get started, register as a seller by providing the <br />{" "}
                necessary information.
              </p>

              <div className="mt-[30px]">
                <Link
                  className="bg-secondary text-white px-[15px] py-[8px] rounded-[5px] inline-block"
                  href="/store/add"
                >
                  Create your first store
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
