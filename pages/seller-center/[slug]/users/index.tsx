import BaseApi from "@/lib/api/_base.api";
import siteConfig from "@/site.config";
import { GetServerSidePropsContext } from "next";
import { setContext } from "@/lib/api/interceptor";
import SellerLayout from "@/components/tinda-minimal/modules/seller-center/SellerLayout";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <SellerLayout data={data}>
      <h1 className="text-2xl font-bold mt-[15px] mb-6">Users</h1>
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
