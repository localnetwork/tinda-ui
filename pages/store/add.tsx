import BaseApi from "@/lib/api/_base.api";
import persistentStore from "@/lib/store/persistentStore";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import errorService from "@/lib/services/errorService";
import Image from "next/image";

import siteConfig from "@/site.config";
import detectImageLightOrDark from "@/lib/services/imageService";

interface UploadResponse {
  data: Array<{
    media: {
      formats: string;
      id: string;
    };
  }>;
  results: Array<{
    media: any;
    formats: {
      large: string;
    };
  }>;
}
interface Account {
  user: any;
  profile: any;
}
import MediaUpload from "@/components/tinda-minimal/forms/MediaUpload";
export default function StoreAdd() {
  const account = persistentStore(
    (state) => state.account
  ) as unknown as Account;

  const { user, profile } = account;
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const [payload, setPayload] = useState({
    store_name: "",
    store_email: "",
    store_logo: "",
    store_phone: "",
    store_banner: "",
    store_slug: "",
  });

  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(null);
  const [storeBannerUrl, setStoreBannerUrl] = useState<string | null>(null);
  const [isBannerDark, setIsBannerDark] = useState<boolean>(false);

  const onChange = (
    data: SetStateAction<{
      store_name: string;
      store_email: string;
      store_logo: string;
      store_phone: string;
      store_banner: string;
      store_slug: string;
    }>
  ) => {
    setPayload({ ...payload, ...data });
  };

  // Replace the existing imageUpload function with this:
  const imageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "store_logo" | "store_banner"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("media", file);

    try {
      const res = await BaseApi.post<UploadResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/media`,
        formData
      );

      const mediaId = res?.data?.data?.[0]?.media?.id;

      const formats = JSON.parse(res?.data?.data?.[0]?.media?.formats);

      const imageUrl = formats?.large;

      setPayload((prev) => ({
        ...prev,
        [field]: mediaId,
      }));

      if (field == "store_logo") {
        console.log("imageUrl", imageUrl);
        setStoreLogoUrl(imageUrl);
      }
      if (field == "store_banner") {
        setStoreBannerUrl(imageUrl);
      }
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      toast.error(() => {
        return (
          <div>
            {error &&
            typeof error === "object" &&
            "data" in error &&
            Array.isArray((error as any).data?.errors) ? (
              (error as any).data.errors.map((err: any, index: number) => (
                <div key={index}>{err.message}</div>
              ))
            ) : (
              <div>Something went wrong!</div>
            )}
          </div>
        );
      });
      setPayload((prev) => ({
        ...prev,
        [field]: "",
      }));

      switch (field) {
        case "store_logo":
          setStoreLogoUrl("");
          break;
        case "store_banner":
          setIsBannerDark(false);
          setStoreBannerUrl("");
          break;
      }

      const input = document.getElementById(field) as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    }
  };
  const deleteImage = async (mediaId: string, field: string) => {
    try {
      setPayload((prev) => ({
        ...prev,
        [field]: "",
      }));

      switch (field) {
        case "store_logo":
          setStoreLogoUrl("");
          break;
        case "store_banner":
          setIsBannerDark(false);
          setStoreBannerUrl("");
          break;
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    }
  };

  console.log("isBannerDark", isBannerDark);

  const storeCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    toast.dismiss();
    e.preventDefault();
    try {
      const res = await BaseApi.post(
        process.env.NEXT_PUBLIC_API_URL + "/stores",
        payload
      );

      const currentStores = persistentStore.getState().stores || [];

      persistentStore.setState({
        stores: [...currentStores, res.data?.data],
      });
      toast.success("Store created successfully");
      router.push("/seller-center");
    } catch (error: any) {
      console.log("error", error);
      setErrors(error.data.errors);
      if (error.status === 422) {
        toast.error("There are errors in the form.");
      }
    }
  };

  useEffect(() => {
    const detectBannerLight = async () => {
      if (storeBannerUrl) {
        const isDark = await detectImageLightOrDark(
          (siteConfig.APIDOMAIN ?? "") + storeBannerUrl
        );
        setIsBannerDark(isDark === "dark");
      }
    };
    detectBannerLight();
  }, [storeBannerUrl]);

  return (
    <div className="min-h-[100vh] bg-[#f5f5f5] py-[30px]">
      <div className="container">
        <div className="bg-white rounded-[5px] p-[30px] shadow-md">
          <div className="progress grid grid-cols-3 mb-[30px] pb-[30px] border-b-[1px] border-[#f5f5f5]">
            <div className="font-bold relative flex flex-col items-center justify-center">
              <span className="circle p-[10px] z-[1] rounded-full bg-white">
                <span className="circle-inner w-[10px] h-[10px] block bg-secondary rounded-full"></span>
              </span>
              <span className="border-b-[2px] border-[#e5e5e5] translate-x-[50%] absolute top-[14px] w-[100%]" />
              Store Information
            </div>
            <div className="font-bold relative flex flex-col items-center justify-center">
              <span className="circle p-[10px] z-[1] rounded-full bg-white">
                <span className="circle-inner w-[10px] h-[10px] block bg-[#e5e5e5] rounded-full"></span>
              </span>
              <span className="border-b-[2px] border-[#e5e5e5] translate-x-[50%] absolute top-[14px] w-[100%]" />
              Business Information
            </div>
            <div className="font-bold relative flex flex-col items-center justify-center">
              <span className="circle p-[10px] z-[1] rounded-full bg-white">
                <span className="circle-inner w-[10px] h-[10px] block bg-[#e5e5e5] rounded-full"></span>
              </span>
              Submit
            </div>
          </div>

          <div>
            <form
              className="mx-auto"
              onSubmit={(e) => {
                storeCreate(e);
              }}
            >
              {/* STORE INFO */}
              <div>
                <h2 className=" text-secondary border-b font-bold text-[18px] pb-[10px] mb-[15px]">
                  <span className="text-red-500 mr-1">*</span>Store Information
                </h2>
                <div className="grid grid-cols-2">
                  {/* STORE FIELDS */}
                  <div className="grid col-span-1 gap-x-[20px] gap-y-[15px]">
                    <div className="flex gap-2">
                      <label
                        htmlFor="store_name"
                        className="whitespace-nowrap mt-1 w-[150px]"
                      >
                        <span className="text-red-500 mr-1 text-[12px]">*</span>
                        Store Name
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          name="store_name"
                          id="store_name"
                          maxLength={30}
                          className="w-full px-[10px] py-[5px] border-[1px] rounded-[5px]"
                          onChange={(e) =>
                            onChange({ ...payload, store_name: e.target.value })
                          }
                        />
                        {errorService(errors, "store_name") && (
                          <span className="block mt-1  text-red-500 text-sm w-full">
                            {errorService(errors, "store_name")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <label
                        htmlFor="store_slug"
                        className="whitespace-nowrap mt-1 w-[150px]"
                      >
                        <span className="text-red-500 mr-1 text-[12px]">*</span>
                        Store Slug
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          name="store_slug"
                          id="store_slug"
                          className="w-full px-[10px] py-[5px] border-[1px] rounded-[5px]"
                          maxLength={30}
                          onChange={(e) =>
                            onChange({
                              ...payload,
                              store_slug: e.target.value.replace(/\s+/g, "-"),
                            })
                          }
                        />

                        {errorService(errors, "store_slug") && (
                          <span className="block mt-1  text-red-500 text-sm w-full">
                            {errorService(errors, "store_slug")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <label
                        htmlFor="store_logo"
                        className="whitespace-nowrap mt-1 w-[150px]"
                      >
                        <span className="text-red-500 mr-1 text-[12px]">*</span>
                        Store Logo
                      </label>
                      <div className="w-full">
                        <MediaUpload
                          name="store_logo"
                          id="store_logo"
                          onChange={(e) => imageUpload(e, "store_logo")}
                          image={storeLogoUrl}
                          onDelete={() =>
                            deleteImage(payload.store_logo, "store_logo")
                          }
                        />
                        {errorService(errors, "store_logo") && (
                          <span className="block mt-1  text-red-500 text-sm w-full">
                            {errorService(errors, "store_logo")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <label
                        htmlFor="store_banner"
                        className="whitespace-nowrap mt-1 w-[150px]"
                      >
                        <span className="text-red-500 mr-1 text-[12px]">*</span>
                        Store Banner
                      </label>
                      <div className="w-full">
                        {/* <input
                          type="file"
                          name="store_banner"
                          id="store_banner"
                          className="w-full disabled px-[10px] py-[5px] border-[1px] rounded-[5px]"
                          onChange={(e) => imageUpload(e, "store_banner")}
                        /> */}
                        <MediaUpload
                          name="store_banner"
                          id="store_banner"
                          onChange={(e) => imageUpload(e, "store_banner")}
                          image={storeBannerUrl}
                          onDelete={() =>
                            deleteImage(payload.store_banner, "store_banner")
                          }
                        />
                        {errorService(errors, "store_banner") && (
                          <span className="block mt-1  text-red-500 text-sm w-full">
                            {errorService(errors, "store_banner")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <label
                        htmlFor="store_email"
                        className="whitespace-nowrap mt-1 w-[150px]"
                      >
                        <span className="text-red-500 mr-1 text-[12px]">*</span>
                        Store Email
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          name="store_email"
                          id="store_email"
                          className="w-full disabled px-[10px] py-[5px] border-[1px] rounded-[5px]"
                          onChange={(e) =>
                            onChange({
                              ...payload,
                              store_email: e.target.value,
                            })
                          }
                        />
                        {errorService(errors, "store_email") && (
                          <span className="block mt-1  text-red-500 text-sm w-full">
                            {errorService(errors, "store_email")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <label
                        htmlFor="store_email"
                        className="whitespace-nowrap mt-1 w-[150px]"
                      >
                        <span className="text-red-500 mr-1 text-[12px]">*</span>
                        Store Phone
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          name="store_phone"
                          id="store_phone"
                          className="w-full disabled px-[10px] py-[5px] border-[1px] rounded-[5px]"
                          onChange={(e) =>
                            onChange({
                              ...payload,
                              store_phone: e.target.value,
                            })
                          }
                        />
                        {errorService(errors, "store_phone") && (
                          <span className="block mt-1  text-red-500 text-sm w-full">
                            {errorService(errors, "store_phone")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* END STORE FIELDS */}

                  {/* STORE PREVIEW */}
                  <div className="px-5">
                    <div className="px-[20px] pb-[20px] border-[1px] border-[#ccc] rounded-[4px] overflow-hidden shadow-[0_0px_10px_#ccc]">
                      <div className="bg-[#EEEEEE] mx-[-20px] py-[10px] px-[20px] ">
                        <div className="flex gap-x-[15px] items-center">
                          <div className="flex gap-x-[5px] items-center">
                            <span className="block w-[15px] h-[15px] rounded-full bg-[#d86258]" />
                            <span className="block w-[15px] h-[15px] rounded-full bg-[#f0bd4e]" />
                            <span className="block w-[15px] h-[15px] rounded-full bg-[#50c341]" />
                          </div>
                          <div className="grow text-[12px] opacity-50 bg-[#fff] px-[10px] py-[5px] rounded-[5px] line-clamp-1 text-ellipsis overflow-hidden">
                            http://tinda.ph/
                            {payload?.store_slug
                              .replace(/\s+/g, "-")
                              .toLowerCase()}
                          </div>
                          <div className="flex flex-col space-y-[3px]">
                            <span className="block rounded-[5px] bg-[#999999] h-[3px] w-[20px]" />
                            <span className="block rounded-[5px] bg-[#999999] h-[3px] w-[20px]" />
                            <span className="block rounded-[5px] bg-[#999999] h-[3px] w-[20px]" />
                          </div>
                        </div>
                      </div>
                      <div className="py-[20px]">
                        <div
                          className="rounded-[5px] flex gap-x-[15px] bg-[#f5f5f5] p-[15px] bg-cover"
                          style={{
                            backgroundImage: `url(${siteConfig.APIDOMAIN}${storeBannerUrl})`,
                          }}
                        >
                          <div
                            className={`flex overflow-hidden items-center justify-center p-[10px] w-[100px] h-[100px] backdrop-blur-sm bg-opacity-50 rounded-full ${
                              isBannerDark ? "bg-[#fff]" : "bg-[#212121]"
                            }`}
                          >
                            {storeLogoUrl ? (
                              <Image
                                src={siteConfig.APIDOMAIN + storeLogoUrl}
                                width={100}
                                height={100}
                                alt="Hello"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="bg-[#333] text-[#969696] flex items-center justify-center rounded-full w-full h-full">
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
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div
                            className={`pt-[15px] w-[calc(100%-120px)] ${
                              isBannerDark ? "text-white" : "text-black"
                            }`}
                          >
                            <div className="font-bold mb-2 line-clamp text-ellipsis overflow-hidden">
                              {payload.store_name || "Your Store Name"}
                            </div>

                            <div className="opacity-80 text-[12px] grid gap-y-[5px] grid-cols-2">
                              <div className="flex items-center ">
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
                                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                  />
                                </svg>
                                105 followers
                              </div>
                              <div className="flex items-center">
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
                                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                                  />
                                </svg>
                                09123456789
                              </div>
                              <div className="flex items-center">
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
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                  />
                                </svg>
                                5.0
                              </div>
                              <div className="flex items-center">
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
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                                  />
                                </svg>
                                Joined: Just Now
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* END STORE PREVIEW */}
                </div>
              </div>
              {/* END STORE INFO */}

              <div className="flex justify-start">
                <button
                  type="submit"
                  className="bg-secondary text-white px-[20px] py-[10px] rounded-[5px] mt-[20px]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
