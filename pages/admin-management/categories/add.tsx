import MediaUpload from "@/components/tinda-minimal/forms/MediaUpload";
import BaseApi from "@/lib/api/_base.api";
import { SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

import errorService from "@/lib/services/errorService";
import { useRouter } from "next/router";

interface UploadResponse {
  data: Array<{
    image: {
      formats: string;
      id: string;
    };
  }>;
  results: Array<{
    image: object;
    formats: {
      large: string;
    };
  }>;
}

export default function Page() {
  const [payload, setPayload] = useState({
    image: "",
    name: "",
  });
  const [errors, setErrors] = useState<object>({});
  const router = useRouter();

  const [mediaUrl, setMediaUrl] = useState("");

  const onChange = (
    data: SetStateAction<{
      name: string;
      image: string;
    }>
  ) => {
    setPayload({ ...payload, ...data });
  };

  const imageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image"
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

      if (field == "image") {
        setMediaUrl(imageUrl);
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

      setMediaUrl("");

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

      setMediaUrl("");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await BaseApi.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        payload
      );
      toast.success("Category added successfully");
      router.push("/admin-management/categories");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
      setErrors(error?.data?.errors);
    }
  };
  return (
    <div className="bg-[#f5f5f5] p-[30px] min-h-[100vh]">
      <div className="container">
        <div className="bg-white rounded-[5px] p-[30px] shadow-md">
          <h1 className="text-left text-[20px] font-bold text-secondary underline mb-[15px]">
            Add Category
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-[15px]">
              <label className="whitespace-nowrap mt-1 w-[150px]">
                <span className="text-red-500 mr-1 text-[12px]">*</span>
                Name
              </label>
              <input
                type="text"
                name="name"
                onChange={(e) =>
                  onChange({
                    ...payload,
                    name: e.target.value,
                  })
                }
                className="w-full px-[10px] py-[5px] border-[1px] rounded-[5px]"
              />
              <span className="block mt-1 text-red-500 text-sm w-full">
                {errorService(errors, "name")}
              </span>
            </div>
            <div className="mb-[15px]">
              <label>
                <span className="text-red-500 mr-1 text-[12px]">*</span>
                Image
              </label>
              <MediaUpload
                name="image"
                id="image"
                onChange={(e) => imageUpload(e, "image")}
                image={mediaUrl}
                onDelete={() => deleteImage(payload.media, "a")}
              />

              <span className="block mt-1  text-red-500 text-sm w-full">
                {errorService(errors, "image")}
              </span>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
