import BaseApi from "@/lib/api/_base.api";
import siteConfig from "@/site.config";
import { GetServerSidePropsContext } from "next";
import { setContext } from "@/lib/api/interceptor";
import SellerLayout from "@/components/tinda-minimal/modules/seller-center/SellerLayout";
export const getServerSideProps = async ({
  params,
  req,
  res,
}: GetServerSidePropsContext) => {
  setContext({
    req,
    res,
    query: {},
    resolvedUrl: "",
  });
  // Fetch data from external API
  const uuid = params?.slug || "";

  try {
    const response = await BaseApi.get(
      `${siteConfig.APIURL}/seller-center/${uuid}`
    );

    return {
      props: {
        data: response?.data,
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      notFound: true,
    };
  }
};

interface PageProps {
  data: object; // Replace 'any' with more specific type when data structure is known
}

export default function Page({ data }: PageProps) {
  const staticSuggestions = [
    {
      id: "product-images",
      name: "Add at least 3 images",
    },
    {
      id: "product-name",
      name: "Add characters for name to 25~100",
    },
    {
      id: "product-description",
      name: "Add at least 100 characters or 1 image for description",
    },
  ];

  return (
    <SellerLayout data={data}>
      <div className="grid mt-[15px] gap-[15px] grid-cols-4">
        <div className="col-span-1 bg-white p-[15px] border-t-[5px] border-[#2673dd] rounded-[5px]">
          <div className="bg-[#E5EEFB] p-[20px] mx-[-15px] mt-[-15px] font-bold">
            Filling Suggestion
          </div>
          {staticSuggestions?.map((item, index) => (
            <div
              className="px-[15px] py-[15px] hover:bg-[#f3f3f3] text-[13px] flex gap-x-[5px] mx-[-15px]"
              key={index}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className="min-w-[20px] h-[20px]"
              >
                <path
                  fill="#e5e5e5"
                  fill-rule="evenodd"
                  d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M11.1464466,5.92870864 L7.097234,9.97792125 L4.85355339,7.73424065 C4.65829124,7.5389785 4.34170876,7.5389785 4.14644661,7.73424065 C3.95118446,7.92950279 3.95118446,8.24608528 4.14644661,8.44134743 L6.7436806,11.0385814 C6.93894275,11.2338436 7.25552524,11.2338436 7.45078739,11.0385814 L11.8535534,6.63581542 C12.0488155,6.44055327 12.0488155,6.12397078 11.8535534,5.92870864 C11.6582912,5.73344649 11.3417088,5.73344649 11.1464466,5.92870864 Z"
                ></path>
              </svg>
              {item?.name}
            </div>
          ))}
        </div>
        <div className="col-span-2">
          <div className="bg-white p-4 mb-[15px] rounded-[5px]">
            <div className="flex gap-x-[15px]">
              <div>Basic Information</div>
              <div>Sales Information</div>
              <div>Shipping</div>
              <div>Others</div>
            </div>
          </div>
          <div className=" bg-white p-4 rounded-[5px] mb-[15px]">
            <h2 className="font-bold text-[20px] mb-[15px]">
              Basic information
            </h2>

            <div>
              <h3 className="text-[14px]">Product Images</h3>
              <div>
                <label className="text-[12px]">
                  <span className="text-secondary">*</span>
                  1:1 Image
                </label>
                <div className="relative">
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer w-full flex justify-center items-center flex-col py-[15px] min-h-[50px] rounded-[5px] border border-dashed"
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
                  <input
                    name="product-images"
                    type="file"
                    multiple
                    className="absolute cursor-pointer top-0 left-0 w-full h-full opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-white p-4 rounded-[5px] mb-[15px]">
            <h2 className="font-bold text-[20px]">Sales Information</h2>
          </div>
          <div className=" bg-white p-4 rounded-[5px] mb-[15px]">
            <h2 className="font-bold text-[20px]">Shipping</h2>
          </div>
          <div className=" bg-white p-4 rounded-[5px] mb-[15px]">
            <h2 className="font-bold text-[20px]">Others</h2>
          </div>
        </div>
        <div className="col-span-1 bg-white p-4 rounded-[5px]"></div>
      </div>
    </SellerLayout>
  );
}
