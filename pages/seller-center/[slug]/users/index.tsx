import BaseApi from "@/lib/api/_base.api";
import siteConfig from "@/site.config";
import { GetServerSidePropsContext } from "next";
import { setContext } from "@/lib/api/interceptor";
import SellerLayout from "@/components/tinda-minimal/modules/seller-center/SellerLayout";
import { useEffect, useState } from "react";
import useModalStore from "@/lib/store/modalStore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  data: {
    id: any;
  }; // Replace 'any' with more specific type when data structure is known
}

export default function Page({ data }: PageProps) {
  const [users, setUsers] = useState([]);

  const { id } = data;

  const getUsers = async () => {
    try {
      const res = await BaseApi.get(
        `${siteConfig.APIURL}/seller-center/${id}/users`
      );

      setUsers(res.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const addUser = () => {
    useModalStore.setState({
      modalInfo: {
        isOpen: true,
        type: "add-user-store",
        data: {},
        title: "Add User",
        description: "Add a new user to your store.",
      },
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <SellerLayout data={data}>
      <h1 className="text-2xl font-bold mt-[15px] mb-6">Users</h1>
      <div
        onClick={addUser}
        className="inline-flex items-center gap-2 mb-4 cursor-pointer bg-[#F57224] px-[10px] py-[5px] rounded-[5px] text-white"
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
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
        Add user
      </div>
      <Table className="bg-white">
        <TableCaption>A list of users in your store.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item, index) => (
            <TableRow key={index} className="!py-2">
              <TableCell className="font-medium">
                {item.user.username}
              </TableCell>
              <TableCell>
                {item.profile.firstName} {item.profile.middleName}{" "}
                {item.profile.lastName}
              </TableCell>
              <TableCell>{item.user.email}</TableCell>
              <TableCell>
                {item.roles.map((role, index) => (
                  <span
                    key={index}
                    className="bg-[#ccc] text-[12px] text-[#333] px-2 py-1 rounded-full mr-2"
                  >
                    {role.name.replace("_", " ")}
                  </span>
                ))}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SellerLayout>
  );
}
