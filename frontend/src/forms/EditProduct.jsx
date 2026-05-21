import { useState } from "react";
import { animate, fadeInDown } from "../components/animation/animate";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const EditProduct = ({ id, name, price, category, description, image, closeModal }) => {
  const [productName, setProductName] = useState(name);
  const [productPrice, setProductPrice] = useState(price);
  const [productCategory, setProductCategory] = useState(category);
  const [productDescription, setProductDescription] = useState(description);
  const [productImage, setProductImage] = useState(image);

  const token = localStorage.getItem("token");

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("category", productCategory);
    formData.append("description", productDescription);
    if (productImage instanceof File) {
      formData.append("image", productImage);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/admin/edit-product/${id}`,
        formData,
        {
          headers: {
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
      toast.error("Error editing product data 😢");
      console.log(error);
    }
  };

  return (
    <div className="bg-black/85 fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
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
          <h2 className="font-bold text-xl md:text-2xl text-amber-600 text-center flex-1">
            Edit Product Details
          </h2>
          <span className="w-10"></span>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4 text-base md:text-lg text-gray-300 font-semibold"
          onSubmit={handleEditProduct}
        >
          {/* Image Preview */}
          {productImage && !(productImage instanceof File) && (
            <img
              src={`http://localhost:5000/productImages/${productImage}`}
              alt="Current Product"
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg mx-auto"
            />
          )}
          <div>
            <input
              type="file"
              name="productImage"
              accept=".jpeg, .png, .jpg"
              className="file:bg-blue-500 file:px-3 file:py-2 file:ml-2 file:text-white hover:cursor-pointer file:rounded-lg w-full"
              onChange={(e) => {
                if (e.target.files[0]) setProductImage(e.target.files[0]);
              }}
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-amber-500 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label htmlFor="price" className="text-amber-500 font-semibold">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-amber-500 font-semibold">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-amber-500 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-pink-600 via-amber-600 to-yellow-600 hover:via-pink-600 hover:to-pink-600 transition-all duration-300 px-5 py-2 rounded-lg font-semibold text-lg hover:cursor-pointer"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
