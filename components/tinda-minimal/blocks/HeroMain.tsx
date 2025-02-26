import MainSlider from "../reusables/MainSlider";
export default function HeroMain() {
  return (
    <div className="bg-[#F5F5F5] py-[10px]">
      <div className="container">
        <div className="flex flex-wrap mx-[-5px]">
          <div className="w-full max-w-[80%] px-[5px]">
            <MainSlider />
          </div>
          <div className="w-full max-w-[20%] px-[5px] flex flex-col space-y-2">
            <div className="bg-[#fff] min-h-[50px] items-center shadow-sm flex flex-col text-black rounded-[5px] p-[10px]">
              <div className="flex gap-x-[5px] items-center w-full">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[35px] text-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                    />
                  </svg>
                </div>
                <div className="text-[#333]">
                  Tinda Mall
                  <div className="text-[10px] text-[#9c9c9c]">
                    Shop with authentic products.
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#fff] min-h-[50px] items-center shadow-sm flex flex-col text-black rounded-[5px] p-[10px]">
              <div className="flex gap-x-[5px] items-center w-full">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[35px] text-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                </div>
                <div className="text-[#333]">
                  Vouchers
                  <div className="text-[10px] text-[#9c9c9c]">
                    Collect and redeem!
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#fff] min-h-[50px] items-center shadow-sm flex flex-col text-black rounded-[5px] p-[10px]">
              <div className="flex gap-x-[5px] items-center w-full">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[35px] text-secondary"
                  >
                    <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z" />
                    <path
                      fillRule="evenodd"
                      d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-[#333]">
                  Tinda Mall
                  <div className="text-[10px] text-[#9c9c9c]">
                    Shop with authentic products.
                  </div>
                </div>
              </div>
            </div>

            <div className="py-[10px] uppercase hover:bg-[#ffc4a1] hover:text-primary select-none cursor-pointer grow px-[20px] bg-secondary flex items-center justify-center rounded-[5px] text-white">
              View All
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
