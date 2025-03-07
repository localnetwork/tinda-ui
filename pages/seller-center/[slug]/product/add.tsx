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
      props: {
        data: null,
      },
    };
  }
};

interface PageProps {
  data: object; // Replace 'any' with more specific type when data structure is known
}

export default function Page({ data }: PageProps) {
  return (
    <SellerLayout data={data}>
      <div className="grid mt-[15px] gap-[15px] grid-cols-4">
        <div className="col-span-1 bg-white p-[15px] border-t-[5px] border-[#2673dd] rounded-[5px]">
          <div className="bg-[#E5EEFB] p-[20px] mx-[-15px] mt-[-15px] font-bold">
            Filling Suggestion
          </div>
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
          <div className=" bg-white p-4 rounded-[5px] ">
            <h2 className="font-bold text-[20px]">Basic information</h2>
          </div>
        </div>
        <div className="col-span-1 bg-white p-4 rounded-[5px]"></div>
      </div>
    </SellerLayout>
  );
}
