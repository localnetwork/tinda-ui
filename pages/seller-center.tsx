import Image from "next/image";
import Link from "next/link";

export default function SellerCenter() {
  return (
    <div className="bg-[#f5f5f5] p-[30px] min-h-[100vh]">
      <div className="container">
        <div className="bg-white rounded-[5px] text-center p-[30px] shadow-md">
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
              Start Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
