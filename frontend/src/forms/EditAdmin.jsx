import React, { useReducer } from "react";
import { animate, fadeInDown } from "../components/animation/animate";
import { FaArrowLeft, FaRegEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return {
        ...state,
        address: { ...state.address, country: action.payload },
      };
    default:
      return state;
  }
};

const EditAdmin = ({ _id, email, password, closeModal }) => {
  const adminId = _id;
  const [adminData, dispatch] = useReducer(reducer, {
    email,
    password,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const token = localStorage.getItem("token");

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/edit-admin/${adminId}`,
        adminData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message, {
        onClose: () => {
          closeModal(false);
        },
      });
    } catch (error) {
      toast.error("Error editing admin data 😢");
      console.log("Error editing admin data", error);
    }
  };

  return (
    <div className="bg-black/85 h-full overflow-y-scroll w-full fixed top-0 left-0 flex items-center justify-center p-5 md:p-10">
      <div
        className={`bg-[#121212] rounded-xl w-full max-w-3xl px-5 md:px-10 py-8 flex flex-col gap-6 ${animate} ${fadeInDown}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            className="text-gray-200 hover:text-slate-800 bg-none hover:bg-gray-400 rounded-full p-2 text-xl flex items-center gap-2 hover:cursor-pointer transition-all duration-300"
            onClick={() => closeModal(false)}
          >
            <FaArrowLeft />
          </button>
          <h2 className="font-bold text-xl md:text-2xl text-amber-600">
            Edit Admin Details
          </h2>
          <span></span>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4 text-base md:text-md"
          onSubmit={handleEditAdmin}
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-amber-600 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={adminData.email}
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-amber-600 font-semibold">
              Password
            </label>
            <div className="relative ">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                value={adminData.password}
                onChange={(e) =>
                  dispatch({ type: "password", payload: e.target.value })
                }
                className="w-full flex-2 border-2 border-gray-300 rounded-md px-3 py-2"
              />
              <span className="absolute top-3 right-3" onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}>
                {isPasswordVisible ? <FaRegEye /> : <FaEyeSlash/>}
              </span>
            </div>
          </div>
          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-pink-600 via-amber-600 to-yellow-600 hover:via-pink-600 hover:to-pink-600 transition-all duration-300 px-5 py-2 rounded-lg font-semibold text-lg hover:cursor-pointer"
            >
              Update Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
