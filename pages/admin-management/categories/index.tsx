import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-[#f5f5f5] p-[30px] min-h-[100vh]">
      <div className="container">
        <div className="bg-white rounded-[5px] text-center p-[30px] shadow-md">
          <h1 className="text-left text-[20px] font-bold text-secondary underline mb-[15px]">
            Categories
          </h1>
          <div className="text-left">
            <Link
              className="bg-secondary text-white px-[15px] py-[8px] rounded-[5px] inline-flex items-center"
              href="/admin-management/categories/add"
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
