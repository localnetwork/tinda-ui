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
  return <SellerLayout data={data}>Yoyoyoyoyo</SellerLayout>;
}
