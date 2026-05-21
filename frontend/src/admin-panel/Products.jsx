// Products.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { animate, fadeInDown, fadeInUp } from "../components/animation/animate";
import { FaArrowLeft } from "react-icons/fa";
import EditProduct from "../forms/EditProduct";
import AlertDialog from "../components/AlertDialog";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";

const Products = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategories] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(false);
  const [productDetails, setProductDetails] = useState(false);
  const [editProduct, setEditProduct] = useState({});
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const tableRef = useRef(null);

  // get Products
  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },);
      const data = response.data;
      setAllProduct(data);
      setProducts(data);
    } catch (error) {
      toast.error("Error fetching product data 😢");
      console.log("Error fetching product data", error);
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

  const handleEditProduct = (item) => {
    setProductDetails(true);
    setEditProduct(item);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/admin/delete-product/${productToDelete._id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(response.data.message);
      setShowAlertDialog(false);
      getProducts();
    } catch (error) {
      console.error("Not deleted");
    }
  };

  useEffect(() => {
    if (viewProduct || productDetails) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    getProducts();
  }, [viewProduct, productDetails, products]);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "patan-handcraft",
    sheet: "all_products",
  });

  return (
    <>
      <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 sm:px-10 text-gray-200 font-bold">
        {/* Header and Filter */}
        <div
          className={`flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 ${animate} ${fadeInDown}`}
        >
          <h1 className="text-3xl sm:text-4xl text-amber-600">Products</h1>
          <div className="flex items-center gap-4">
            <p className="text-lg sm:text-xl font-semibold">Category: </p>
            <select
              className="border-2 border-slate-400 rounded-lg px-2 sm:px-4 py-1 text-sm sm:text-lg text-gray-400 focus:ring-2 font-normal hover:outline-none"
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
            <button
              className="bg-green-700 px-3 py-1 rounded-sm hover:cursor-pointer hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
              onClick={onDownload}
            >
               <RiFileExcel2Fill/>Export
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1  gap-4 mt-5">
          {products.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-center gap-10  p-4 bg-[#1E1E1E] hover:bg-[#2D2D2D] border-[#2D2D2D] border-2 rounded-2xl ${animate} ${fadeInUp}`}
            >
              {/* Image */}
              <img
                src={
                  item.image
                    ? `http://localhost:5000/productImages/${item.image}`
                    : "https://img.freepik.com/free-photo/couple-making-heart-from-hands-sea-shore_23-2148019887.jpg?semt=ais_incoming&w=740&q=80"
                }
                alt={item.name}
                className="w-full sm:w-32 h-64 sm:h-32 rounded-lg object-cover cursor-pointer"
                onClick={() => handleViewClick(item)}
              />

              {/* product Info */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <div className="flex flex-col">
                    <span className="text-xl">
                      <span className="text-gray-400"></span>
                      {item.name}
                    </span>
                    <span className="text-gray-400">{item.category}</span>
                  </div>
                  <span className="px-10">{item.description}</span>
                  <span>Rs. {item.price}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-2 text-base">
                <button
                  className="bg-blue-500 px-5 py-2 rounded-sm hover:cursor-pointer hover:bg-blue-700 transition-all duration-200"
                  onClick={() => handleEditProduct(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-3 py-2 rounded-sm hover:cursor-pointer hover:bg-red-700 transition-all duration-200"
                  onClick={() => {
                    setProductToDelete(item);
                    setShowAlertDialog(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {/* all products table for exporting the data */}
          <table className="absolute -left-[9999px]" ref={tableRef}>
            <thead>
              <tr>
                <th>Name</th>
              <th>category</th>
              <th>Description</th>
              <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {allProduct.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAlertDialog && (
          <AlertDialog
            onConfirm={handleDeleteProduct}
            onCancel={() => setShowAlertDialog(false)}
          />
        )}
        {/* Toast */}
        <ToastContainer
          className="text-lg font-semibold"
          position="bottom-right"
          autoClose={800}
          theme="dark"
        />
      </div>

      {/* View Product Modal */}
      {viewProduct && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center overflow-auto p-4 z-50">
          <div
            className={`bg-[#121212] w-full max-w-3xl rounded-xl py-6 px-10  flex flex-col gap-6 ${animate} ${fadeInDown}`}
          >
            <div className="flex justify-between items-center w-full mb-4 md:mb-0">
              <button
                onClick={() => setViewProduct(false)}
                className="text-gray-200 hover:text-white text-2xl p-2 rounded-full hover:bg-gray-700 transition"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-amber-500 text-center flex-1">
                Product Details
              </h2>
              <span className="w-8"></span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 w-full items-center">
              <img
                src={
                  selectedProduct.image
                    ? `http://localhost:5000/productImages/${selectedProduct.image}`
                    : "https://img.freepik.com/free-photo/couple-making-heart-from-hands-sea-shore_23-2148019887.jpg?semt=ais_incoming&w=740&q=80"
                }
                alt={selectedProduct.name}
                className="w-full md:w-64 h-64 rounded-lg object-cover"
              />
              <div className="flex-1 text-lg md:text-xl font-semibold text-white">
                <p className="mb-2 flex justify-between">
                  <span>{selectedProduct.name}</span>
                  <span>Rs. {selectedProduct.price}</span>
                </p>
                <p className="text-gray-400">{selectedProduct.category}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {productDetails && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center overflow-auto p-4 z-50">
          <EditProduct
            id={editProduct._id}
            name={editProduct.name}
            category={editProduct.category}
            price={editProduct.price}
            description={editProduct.description}
            image={editProduct.image}
            closeModal={() => {
              setProductDetails();
              getProducts();
            }}
          />
        </div>
      )}
    </>
  );
};

export default Products;
