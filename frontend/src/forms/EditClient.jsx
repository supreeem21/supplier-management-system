import React, { useReducer } from "react";
import { animate, fadeInDown } from "../components/animation/animate";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "country":
      return { ...state, address: { ...state.address, country: action.payload } };
    case "stateName":
      return { ...state, address: { ...state.address, state: action.payload } };
    case "city":
      return { ...state, address: { ...state.address, city: action.payload } };
    case "district":
      return { ...state, address: { ...state.address, district: action.payload } };
    case "postal_code":
      return { ...state, address: { ...state.address, postal_code: action.payload } };
    case "house_no":
      return { ...state, address: { ...state.address, house_no: action.payload } };
    case "phone":
      return { ...state, phone: action.payload };
    default:
      return state;
  }
};


const EditClient = ({ _id, name, address, email, phone, closeModal }) => {
  const clientId = _id;
  const [clientData, dispatch] = useReducer(reducer, {
    name,
    email,
    phone,
    address: {
      country: address?.country || "",
      state: address?.state || "",
      city: address?.city || "",
      district: address?.district || "",
      postal_code: address?.postal_code || "",
      house_no: address?.house_no || "",
    },
  });

  const token = localStorage.getItem("token");

  const handleEditClient = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/admin/edit-client/${clientId}`, clientData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message, {
        onClose: () => {
          closeModal(false);
        },
      });
    } catch (error) {
      toast.error("Error editing client data 😢");
      console.log("Error editing client data", error);
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
          <h2 className="font-bold text-xl md:text-2xl text-amber-600">Edit Client Details</h2>
          <span></span>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4 text-base md:text-md" onSubmit={handleEditClient}>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-amber-600 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={clientData.name}
              onChange={(e) => dispatch({ type: "name", payload: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
            {[
              { label: "Country", type: "country", value: clientData.address.country },
              { label: "State", type: "stateName", value: clientData.address.state },
              { label: "City", type: "city", value: clientData.address.city },
              { label: "District", type: "district", value: clientData.address.district },
              { label: "Postal Code", type: "postal_code", value: clientData.address.postal_code },
              { label: "House No", type: "house_no", value: clientData.address.house_no },
            ].map((field) => (
              <div key={field.type} className="flex flex-col w-full md:w-[48%] gap-1">
                <label className="text-amber-600 font-semibold">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => dispatch({ type: field.type, payload: e.target.value })}
                  className="border-2 border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-amber-600 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={clientData.email}
              onChange={(e) => dispatch({ type: "email", payload: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-amber-600 font-semibold">
              Phone number
            </label>
            <input
              type="text"
              id="phone"
              value={clientData.phone}
              onChange={(e) => dispatch({ type: "phone", payload: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-pink-600 via-amber-600 to-yellow-600 hover:via-pink-600 hover:to-pink-600 transition-all duration-300 px-5 py-2 rounded-lg font-semibold text-lg hover:cursor-pointer"
            >
              Update Client
            </button>
          </div>
        </form>
      </div>

      
    </div>
  );
};

export default EditClient;