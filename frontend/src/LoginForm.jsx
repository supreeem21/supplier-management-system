import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEyeSlash, FaRegEye, FaArrowLeft } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (e) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address 😢");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/admin/login", {
        email,
        password,
      });

      if (res.data.status === "Failed") {
        return toast.error(res.data.message);
      }

      // success login
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed 😢";

      toast.error(msg);
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded shadow-md w-full max-w-md bg-[#121212] border-2 border-gray-700 text-gray-300"
      >
        <h2 className="text-2xl font-bold text-center flex items-center justify-center mb-5">
          Patan Handcraft
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-700 rounded"
        />
        {email && !validateEmail(email) && (
          <span className="text-red-500 text-sm">Invalid email address</span>
        )}

        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            id="passwordInput"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-700 rounded"
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer"
        >
          Login
        </button>
        {/* go back button */}
        <button
          className="text-md hover:cursor-pointer w-full flex items-center justify-center gap-2 border-gray-600 bg-gray-800 py-2 rounded-md mt-2 hover:bg-gray-900 transition-all duration-200"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft className="text-sm"/> Go Back
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
