// Home.jsx
import { animate, fadeInDown } from "../components/animation/animate";
import { Chart as ChartJS } from "chart.js/auto";

// forms
import ProductForm from "../forms/ProductForm";
import OrderForm from "../forms/OrderForm";
import ClientForm from "../forms/ClientForm";
import RegisterForm from "../forms/AdminForm";
import { ToastContainer, toast } from "react-toastify";
import DoughnutChart from "../components/charts/DoughnutChart";

// hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LineChart from "../components/charts/LineChart";

const Home = () => {
  const [form, setForm] = useState("");
  const [numberOfTerms, setNumberOfTerms] = useState({});

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleFormValueChange = (e) => setForm(e.target.value);

  const getNumberOfClients = async () => {
    try {
      if (!token) {
        toast.error("Not logged in");
        return;
      }

      const response = await axios.get("http://localhost:5000/admin/numbers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNumberOfTerms(response.data);
    } catch (error) {
      toast.error("Error fetching data 😢");
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    getNumberOfClients();
  }, []);

  return (
    <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 sm:px-10 text-white font-bold">
      {/* Header */}
      <div
        className={`${animate} ${fadeInDown} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-amber-600">
          Dashboard
        </h1>
        <select
          className="border-2 border-slate-400 rounded-sm px-2 sm:px-4 py-1 text-base sm:text-lg text-gray-500 font-normal hover:outline-none w-full sm:w-48"
          value={form}
          onChange={handleFormValueChange}
        >
          <option value="" disabled hidden>
            + Add
          </option>
          <option value="" className="bg-[#121212]">
            None
          </option>
          <option value="order" className="bg-[#121212]">
            Order
          </option>
          <option value="product" className="bg-[#121212]">
            Product
          </option>
          <option value="client" className="bg-[#121212]">
            Client
          </option>
          <option value="register" className="bg-[#121212]">
            Admin
          </option>
        </select>
      </div>

      {/* Info cards */}
      <div className="flex flex-wrap gap-4 mt-5">
        {/* Clients Card */}
        <div
          className="flex-1 min-w-[200px] border-gray-500 border-2 px-5 py-3 rounded-lg hover:bg-gray-900 hover:cursor-pointer"
          onClick={() => navigate("/admin/clients")}
        >
          <h6 className="text-lg sm:text-xl text-amber-500">Clients</h6>
          <p className="text-sm sm:text-base">
            Number of clients
            <span className="ml-2 sm:ml-4 text-green-400 text-lg sm:text-xl">
              {numberOfTerms.clients || 0}
            </span>
          </p>
        </div>

        {/* Products Card */}
        <div
          className="flex-1 min-w-[200px] border-gray-500 border-2 px-5 py-3 rounded-lg hover:bg-gray-900 hover:cursor-pointer"
          onClick={() => navigate("/admin/products")}
        >
          <h6 className="text-lg sm:text-xl text-amber-500">Products</h6>
          <p className="text-sm sm:text-base">
            Number of products
            <span className="ml-2 sm:ml-4 text-green-400 text-lg sm:text-xl">
              {numberOfTerms.products || 0}
            </span>
          </p>
        </div>

        {/* Orders Card */}
        <div
          className="flex-1 min-w-[200px] border-gray-500 border-2 px-5 py-3 rounded-lg hover:bg-gray-900 hover:cursor-pointer"
          onClick={() => navigate("/admin/order")}
        >
          <h6 className="text-lg sm:text-xl text-amber-500">Orders</h6>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
            <p className="text-sm sm:text-base">
              Pending:{" "}
              <span className="text-lg sm:text-xl text-red-500">
                {numberOfTerms.pending || 0}
              </span>
            </p>
            <p className="text-sm sm:text-base">
              Completed:{" "}
              <span className="text-lg sm:text-xl text-green-400">
                {numberOfTerms.completed || 0}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Form / Charts Section */}
      <div
        className={`flex flex-col  justify-center mt-10 ${animate} w-full items-center`}
      >
        {/* Dashboard */}
        {form === "" && (
          <div className="w-full mt-5 flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex-1 w-full h-64 sm:h-80">
              <LineChart />
            </div>
            <div className="flex-1 w-full h-64 sm:h-80">
              <DoughnutChart />
            </div>
          </div>
        )}

        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2  flex items-center justify-center">
          {form === "order" && <OrderForm />}
          {form === "product" && <ProductForm />}
          {form === "client" && <ClientForm />}
          {form === "register" && <RegisterForm />}
        </div>
      </div>

      <ToastContainer
        className="text-lg font-semibold"
        position="bottom-right"
        autoClose={2000}
        theme="dark"
      />
    </div>
  );
};

export default Home;
