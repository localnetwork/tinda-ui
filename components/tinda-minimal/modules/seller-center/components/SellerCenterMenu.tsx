import siteConfig from "@/site.config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface SellerCenterMenuProps {
  uuid: string;
  data: any;
}
export default function SellerCenterMenu({
  uuid,
  data,
}: SellerCenterMenuProps) {
  const router = useRouter();

  const { storeLogo, storeName } = data;

  const menu = [
    {
      title: "Dashboard",
      path: "/",
      type: "link",
    },
    {
      title: "Order",
      type: "parent",
      children: [
        {
          title: "My Orders",
          path: "/sale",
        },
        {
          title: "Mass Ship",
          path: "/sale/mass/ship",
        },
        {
          title: "Return/Refund Cancel",
          path: "/sale/returnrefundcancel",
        },
        {
          title: "Shipping Setting",
          path: "/sale/shipping-setting",
        },
      ],
    },
    {
      title: "Product",
      type: "parent",
      children: [
        {
          title: "My Products",
          path: "/product",
        },
        {
          title: "Add New Product",
          path: "/product/add",
        },
      ],
    },
    {
      title: "Users",
      type: "parent",
      children: [
        {
          title: "My Users",
          path: "/users",
        },
      ],
    },
  ];

  return (
    <div className="flex absolute h-full left-0 gap-y-[10px] flex-col max-w-[200px] w-full bg-white p-4">
      <div className="border-b flex items-center  pb-[15px] mb-[20px] mx-[-15px] px-[15px]">
        <div className="bg-[#919191] p-[2px] inline-block rounded-full overflow-hidden">
          <Image
            src={siteConfig.APIDOMAIN + JSON.parse(storeLogo?.formats)?.large}
            width={50}
            height={50}
            alt={storeName}
            className="w-[30px] h-[30px] rounded-full object-cover"
          />
        </div>
        <p className="text-[12px] ml-1 text-[#919191]">{data?.storeName}</p>
      </div>

      {menu.map((item, index) => {
        return (
          <div key={index}>
            {item?.type === "parent" ? (
              <div>
                <div>{item?.title}</div>
                <div className="flex pl-1 pt-[5px] text-[12px] flex-col">
                  {item?.children?.map((child: any, index: any) => (
                    <Link
                      key={index}
                      href={`/seller-center/${uuid}${child?.path}`}
                      className={`${
                        router.asPath ===
                        `/seller-center/${uuid}${child?.path?.replace(
                          /\/+$/,
                          ""
                        )}`
                          ? "text-secondary"
                          : "hover:underline"
                      }`}
                    >
                      {child?.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={`/seller-center/${uuid}${item?.path}`}
                className={`${
                  router.asPath ===
                  `/seller-center/${uuid}${item?.path?.replace(/\/+$/, "")}`
                    ? "text-secondary"
                    : "hover:underline"
                }`}
              >
                {item?.title}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
