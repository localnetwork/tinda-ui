import BaseApi from "@/lib/api/_base.api";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/v1/login", {
        email,
        password,
      });

      console.log("res", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow"
      >
        <h2 className="text-3xl font-bold text-center">Sign in</h2>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
