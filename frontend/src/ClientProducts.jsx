import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { animate, fadeInDown, fadeInUp } from "./components/animation/animate";
import { FaArrowLeft } from "react-icons/fa";

const ClientProducts = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategories] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(false);

  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/products");
      const data = response.data;
      setAllProduct(data);
      setProducts(data);
    } catch (error) {
      toast.error("Error fetching product data 😢");
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleCategoryChange = (e) => {
    setCategories(e.target.value);
    if (e.target.value === "") {
      setProducts(allProduct);
      return;
    }
    const filteredData = allProduct.filter(
      (item) => item.category === e.target.value,
    );
    setProducts(filteredData);
  };

  const handleViewClick = (item) => {
    setSelectedProduct(item);
    setViewProduct(true);
  };

  useEffect(() => {
    if (viewProduct) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [viewProduct]);

  return (
    <>
      <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 md:px-10 text-gray-200 font-bold text-4xl">
        {/* Header and filter */}
        <div
          className={`flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 ${animate} ${fadeInDown}`}
        >
          <h1 className="text-amber-600">Products</h1>

          <div className="flex items-center gap-4">
            <p className="text-xl font-semibold">Category: </p>
            <select
              className="border-2 border-slate-400 rounded-lg px-3 md:px-4 py-1 text-base md:text-lg text-gray-400 focus:ring-2 font-normal hover:outline-none"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              <option value="hat">Hat</option>
              <option value="keyrings">Keyrings</option>
              <option value="gloves">Gloves</option>
              <option value="half-gloves">Half Gloves</option>
              <option value="muffler">Muffler</option>
              <option value="neck-warmer">Neck Warmer</option>
              <option value="leg warmer">Leg Warmer</option>
              <option value="socks">Socks</option>
              <option value="headband">Headband</option>
              <option value="coaster">Coaster</option>
              <option value="summer items">Summer items</option>
              <option value="bag">Bag</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
          {products.map((item, index) => (
            <div
              key={index}
              className={`bg-[#1E1E1E] hover:bg-[#2D2D2D] border-2 border-[#2D2D2D] rounded-2xl p-5 flex flex-col gap-3 ${animate} ${fadeInUp}`}
            >
              <img
                src={
                  item.image
                    ? `http://localhost:5000/productImages/${item.image}`
                    : "https://img.freepik.com/free-photo/couple-making-heart-from-hands-sea-shore_23-2148019887.jpg?semt=ais_incoming&w=740&q=80"
                }
                alt={item.name}
                className="w-full h-56 md:h-64 lg:h-72 object-cover rounded-lg"
              />

              <div className="pt-3 flex flex-col gap-1">
                <p className="flex justify-between text-lg md:text-xl font-semibold">
                  <span>{item.name}</span>
                  <span>Rs. {item.price}</span>
                </p>
                <p className="text-gray-400 text-sm md:text-base">
                  {item.category}
                </p>
              </div>

              <button
                onClick={() => handleViewClick(item)}
                className="bg-gradient-to-r from-pink-600 via-amber-600 to-yellow-600 hover:via-pink-600 hover:to-pink-600 hover:cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg text-base md:text-lg mt-3"
              >
                View
              </button>
            </div>
          ))}
        </div>

        <ToastContainer
          className="text-lg font-semibold"
          position="bottom-right"
          autoClose={1000}
          theme="dark"
        />
      </div>

      {/* Modal */}
      {viewProduct && selectedProduct && (
        <div className="bg-black/85 fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
          <div
            className={`bg-[#121212] rounded-xl w-full max-w-4xl p-5 md:p-10 flex flex-col gap-5 md:gap-8 ${animate} ${fadeInDown}`}
          >
            {/* Close button */}
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => setViewProduct(false)}
                className="text-gray-200 hover:text-slate-800 bg-none hover:bg-gray-400 rounded-full p-2 text-xl flex items-center gap-2 hover:cursor-pointer transition-all duration-300"
              >
                <FaArrowLeft />
              </button>
              <h2 className="font-bold text-xl md:text-2xl text-amber-600 text-center flex-1">
                Product Details
              </h2>
              <span className="w-10"></span>
            </div>

            {/* Product details */}
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <img
                src={
                  selectedProduct.image
                    ? `http://localhost:5000/productImages/${selectedProduct.image}`
                    : "https://img.freepik.com/free-photo/couple-making-heart-from-hands-sea-shore_23-2148019887.jpg?semt=ais_incoming&w=740&q=80"
                }
                alt={selectedProduct.name}
                className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-lg"
              />
              <div className="flex flex-col justify-center gap-4 text-lg md:text-xl text-white w-full">
                <p className="font-semibold flex justify-between">
                  <span>{selectedProduct.name}</span>
                  <span>Rs. {selectedProduct.price}</span>
                </p>
                <p className="text-gray-300 text-base md:text-lg">
                  {selectedProduct.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientProducts;
