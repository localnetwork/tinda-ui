import BaseApi from "@/lib/api/_base.api";
import { useEffect, useState } from "react";
export default function AddUserStore() {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await BaseApi.get(
        process.env.NEXT_PUBLIC_API_URL + "/users"
      );

      console.log("response", response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <form>
      <div>Selected User:</div>
    </form>
  );
}
