import { useReducer } from "react";
import { toast, ToastContainer } from "react-toastify";
import { animate, fadeInUp } from "../components/animation/animate";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return {
        ...state,
        name: action.payload,
      };
    case "email":
      return {
        ...state,
        email: action.payload,
      };
    case "country":
      return {
        ...state,
        address: {
          ...state.address,
          country: action.payload,
        },
      };
    case "stateName":
      return {
        ...state,
        address: {
          ...state.address,
          state: action.payload,
        },
      };
    case "city":
      return {
        ...state,
        address: {
          ...state.address,
          city: action.payload,
        },
      };
    case "district":
      return {
        ...state,
        address: {
          ...state.address,
          district: action.payload,
        },
      };
    case "postal_code":
      return {
        ...state,
        address: {
          ...state.address,

          postal_code: action.payload,
        },
      };
    case "house_no":
      return {
        ...state,
        address: {
          ...state.address,
          house_no: action.payload,
        },
      };
    case "phone":
      return {
        ...state,
        phone: action.payload,
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  name: "",
  email: "",
  address: {
    country: "",
    state: "",
    city: "",
    district: "",
    postal_code: "",
    house_no: "",
  },
  phone: "",
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const ClientForm = () => {
  const [clientData, dispatch] = useReducer(reducer, initialState);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(clientData.email)) {
      toast.error("Please enter a valid email address 😢");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/add-client",
        clientData,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const message = res.data.message;
      toast.success(message + " 😊");
      console.log("✅ Client added:", res.data);

      dispatch({ type: "reset" });
    } catch (error) {
      toast.error("Error adding client data 😢");
      console.log("Error adding client data", error);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 p-6 w-full max-w-md rounded-2xl mt-5 bg-[#1E1E1E] hover:bg-[#2D2D2D] border-[#2D2D2D] border-2 focus:border-gray-600 shadow-md text-lg font-normal`}
        method="post"
      >
        <h1 className="text-2xl font-semibold text-center">Add Client</h1>
        <hr />
        <div className="flex items-center justify-between">
          Name:
          <input
            type="text"
            name="clientName"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
            value={clientData.name}
            onChange={(e) => {
              dispatch({ type: "name", payload: e.target.value });
            }}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          Email:
          <input
            type="email"
            name="clientName"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
            value={clientData.email}
            onChange={(e) => {
              dispatch({ type: "email", payload: e.target.value });
            }}
          />
        </div>
        {clientData.email && !validateEmail(clientData.email) && (
          <span className="text-red-500 text-sm">Invalid email address</span>
        )}
        Address
        <div className=" flex flex-col gap-2 px-3">
          <div className="flex items-center gap-2 justify-between">
            Country:
            <input
              type="text"
              name="clientCountry"
              className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
              value={clientData.address.country}
              onChange={(e) => {
                dispatch({ type: "country", payload: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            State:
            <input
              type="text"
              name="clientAddress"
              className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
              value={clientData.address.state}
              onChange={(e) => {
                dispatch({ type: "stateName", payload: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            City:
            <input
              type="text"
              name="clientAddress"
              className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
              value={clientData.address.city}
              onChange={(e) => {
                dispatch({ type: "city", payload: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            District:
            <input
              type="text"
              name="clientAddress"
              className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
              value={clientData.address.district}
              onChange={(e) => {
                dispatch({ type: "district", payload: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            Postal Code:
            <input
              type="text"
              name="clientAddress"
              className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
              value={clientData.address.postal_code}
              onChange={(e) => {
                dispatch({ type: "postal_code", payload: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            House number:
            <input
              type="text"
              name="clientAddress"
              className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
              value={clientData.address.house_no}
              onChange={(e) => {
                dispatch({ type: "house_no", payload: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          Phone number:
          <input
            type="text"
            name="clientPhone"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
            value={clientData.phone}
            onChange={(e) => {
              dispatch({ type: "phone", payload: e.target.value });
            }}
          />
        </div>
        <button
          type="submit"
          className="text-black bg-amber-300 rounded-lg py-2 font-bold hover:cursor-pointer"
        >
          Add Client
        </button>
      </form>
      <ToastContainer
        className="text-lg font-semibold"
        position="bottom-right"
        autoClose={1000}
        theme="dark"
      />
    </>
  );
};

export default ClientForm;
