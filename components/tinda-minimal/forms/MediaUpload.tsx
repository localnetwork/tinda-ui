import siteConfig from "@/site.config";
import React from "react";

interface MediaUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  image: string;
  onDelete: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  id: string;
  name: string;
}
export default function MediaUpload({
  onChange,
  image,
  onDelete,
  id,
  name,
}: MediaUploadProps) {
  return (
    <div>
      {image ? (
        <div className="inline-block relative">
          <img
            src={siteConfig.APIDOMAIN + image}
            alt="Preview"
            className="mt-2 w-32 h-32 object-contain bg-black rounded-[5px]"
          />

          <div
            onClick={onDelete}
            className="absolute right-[5px] z-[1] top-[15px] bg-white p-1 rounded-[5px] cursor-pointer text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            name={name}
            id={id}
            accept="image/*"
            className="w-full cursor-pointer h-full opacity-0 z-[100] absolute top-0 left-0 disabled px-[10px] py-[5px] border-[1px] rounded-[5px]"
            onChange={onChange}
          />
          <label
            htmlFor={name}
            className="cursor-pointer rounded-[5px] flex flex-col gap-y-[5px] items-center justify-center border border-[#ddd] px-[15px] py-[10px]"
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
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <div className="flex gap-x-[5px]">
              Drag and Drop or{" "}
              <span className="text-secondary underline">Browse</span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
