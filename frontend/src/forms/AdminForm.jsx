import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingAnimation from "../components/animation/LoadingAnimation";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

export default function AdminForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address 😢");
      return;
    }

    try {
      if (!email || !password) {
        toast.error("Email and password are mandatory.");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/admin/add-admin",
        {
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message + " 😊");
      setEmail("");
      setPassword("");

      setLoading(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed 😢";

      toast.error(msg);
      console.log(err);
    }
  };

  const validateEmail = (e) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(e);
  };

  return (
    <div className="flex items-center justify-center h-full border-2 border-gray-400 rounded-xl bg-[#121212]">
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add admin</h2>

        <hr className="mb-5" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {email && !validateEmail(email) && (
          <span className="text-red-500 text-sm">Invalid email address</span>
        )}

        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <span
            className="absolute right-2 top-3"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaRegEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full text-center bg-amber-300 text-black py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? <LoadingAnimation /> : "Add Admin"}
        </button>
      </form>
      <ToastContainer
        className="text-lg font-semibold"
        position="bottom-right"
        autoClose={800}
        theme="dark"
      />
    </div>
  );
}
