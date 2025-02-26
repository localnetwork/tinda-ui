import persistentStore from "@/lib/store/persistentStore";
import Image from "next/image";
import Link from "next/link";

interface Account {
  user: any;
  profile: any;
}

export default function Header() {
  const account = persistentStore(
    (state) => state.account
  ) as unknown as Account;

  const { user, profile } = account;
  const profilePictureFormats =
    typeof profile?.profile_picture?.formats === "string"
      ? JSON.parse(profile.profile_picture.formats)
      : profile?.profile_picture?.formats;

  return (
    <header className="sticky top-0 z-[1000]">
      <div className="py-1 bg-secondary text-[12px] text-white">
        <div className="container">
          <div className="flex justify-between">
            <div>
              <div>Follow us:</div>
            </div>
            <div>
              <Link href="/seller-center" className="hover:underline">
                Sell on Tinda
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-[1px] border-[#fef0f0] bg-white py-[10px]">
        <div className="flex justify-between container items-center">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              width={100}
              height={50}
              alt="Tinda App"
            />
          </Link>
          <div className="max-w-[700px] flex items-center gap-x-[20px] w-full">
            <form className="relative w-full">
              <input
                type="text"
                name="search"
                className="bg-[#f4f4f4] px-[20px] py-[15px] outline-none w-full rounded-[5px]"
                placeholder="Search on Tinda"
              />
              <button
                type="submit"
                className="bg-secondary py-[10px] absolute right-0 top-0 h-full rounded-r-[5px] px-[15px] text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </form>
            <div className="relative">
              <span className="bg-secondary text-white rounded-full p-[5px] absolute text-[12px] w-[20px] h-[20px] flex items-center justify-center top-[-5px] right-[-5px]">
                0
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[40px] h-[40px] cursor-pointer text-primary"
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
            </div>
          </div>
          {profile ? (
            <div className="flex gap-x-[15px] items-center text-primary">
              <Image
                src={
                  process.env.NEXT_PUBLIC_API_DOMAIN +
                  profilePictureFormats?.small
                }
                width={150}
                height={150}
                className="w-[50px] cursor-pointer border-secondary border-[2px] p-[2px] h-[50px] rounded-full object-cover"
                alt="Hello World"
              />
            </div>
          ) : (
            <div className="border-secondary border-[2px] cursor-pointer flex items-center justify-center p-[2px] rounded-full w-[50px] h-[50px] ]">
              <div className="bg-[#f4f4f4] rounded-full flex items-center justify-center w-full h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#9c8888"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
