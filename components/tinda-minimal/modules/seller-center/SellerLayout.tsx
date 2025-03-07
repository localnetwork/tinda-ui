import SellerCenterBreadcrumbs from "./components/SellerCenterBreadcrumbs";
import SellerCenterMenu from "./components/SellerCenterMenu";

interface SellerLayoutProps {
  data: any;
  children: React.ReactNode;
}

export default function SellerLayout({ data, children }: SellerLayoutProps) {
  return (
    <div className="bg-[#F6F6F6] relative flex flex-wrap min-h-[90vh]">
      <SellerCenterMenu data={data} uuid={data?.uuid} />
      <div className="p-4 ml-[200px] w-full">
        <SellerCenterBreadcrumbs data={data} />
        <div>{children}</div>
      </div>
    </div>
  );
}
