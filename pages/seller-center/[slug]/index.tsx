import siteConfig from "@/site.config";
import { GetServerSidePropsContext } from "next";
import { setContext } from "@/lib/api/interceptor";
import SellerLayout from "@/components/tinda-minimal/modules/seller-center/SellerLayout";
import BaseApi from "@/lib/api/_base.api";
import { notFound } from "next/navigation";
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
  const stats = [
    { title: "Orders Today", value: "24", change: "+12%", icon: "📦" },
    { title: "Pending Orders", value: "8", change: "-2%", icon: "⏳" },
    { title: "Total Sales", value: "₱15,234", change: "+23%", icon: "💰" },
    { title: "Active Products", value: "156", change: "+5%", icon: "🏷️" },
  ];

  return (
    <SellerLayout data={data}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{stat.icon}</span>
                <span
                  className={`text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm mt-2">{stat.title}</h3>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium">
                      Order #{(1000000 + index).toString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      2 items • ₱1,234
                    </div>
                  </div>
                  <div className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Top Products</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div>
                      <p className="font-medium">Product Name</p>
                      <p className="text-sm text-gray-500">
                        23 orders this week
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">₱999</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
