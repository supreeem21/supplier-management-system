import { useState, useReducer } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import LoadingAnimation from "../components/animation/LoadingAnimation";

// handle image data
function reducer(state, action) {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "category":
      return { ...state, category: action.payload };
    case "price":
      return { ...state, price: action.payload };
    case "description":
      return { ...state, description: action.payload };
    case "reset":
      return initialState;
    default:
      console.log("Nothing changed");
      return state;
  }
}

const initialState = {
  name: "",
  category: "",
  price: 0,
  description: ""
};

const ProductForm = () => {
  const [image, setImage] = useState(null);
  const [imageData, dispatch] = useReducer(reducer, initialState);

  const [loadingAI, setLoadingAI] = useState(false);

  const token = localStorage.getItem("token");

  const generateDescription = async () => {
    if (!imageData.name || !imageData.category) {
      toast.error("Enter name and category first 😢");
      return;
    }

    setLoadingAI(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/generate-description",
        {
          name: imageData.name,
          category: imageData.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch({
        type: "description",
        payload: res.data.description,
      });
      toast.success("Description generated 😊");
    } catch (error) {
      toast.error("AI generation failed 😢");
      console.log(error);
    }

    setLoadingAI(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productImage", image);
    formData.append("productName", imageData.name);
    formData.append("productCategory", imageData.category);
    formData.append("productPrice", imageData.price);
    formData.append("productDescription", imageData.description);

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/upload-product-details",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const message = res.data.message;
      toast.success(message + " 😊");
      console.log("✅ Upload success:", res.data);

    } catch (error) {
      toast.error("Error adding product data 😢");
      console.log("Error adding product data", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 p-6 w-full max-w-md rounded-2xl mt-5 bg-[#1E1E1E] hover:bg-[#2D2D2D] border-[#2D2D2D] border-2 focus:border-gray-600 shadow-md text-lg font-normal `}
        method="post"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-semibold text-center">Add product</h1>
        <hr />

        {/* Choose file */}
        <div className="flex items-center justify-between">
          Choose:
          <input
            type="file"
            name="productImage"
            accept=".jpeg, .png, .jpg"
            className="file:bg-blue-500 file:px-3 file:py-2 file:ml-5 file:text-white  hover:cursor-pointer file:rounded-lg"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Name */}
        <div className="flex items-center justify-between">
          Name:
          <input
            type="text"
            name="productName"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
            value={imageData.name}
            onChange={(e) => {
              dispatch({ type: "name", payload: e.target.value });
            }}
          />
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          Category:
          <input
            type="text"
            name="productCategory"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
            value={imageData.category}
            onChange={(e) => {
              dispatch({ type: "category", payload: e.target.value });
            }}
          />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          Price:
          <input
            type="number"
            name="productPrice"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
            value={imageData.price}
            onChange={(e) => {
              dispatch({ type: "price", payload: e.target.value });
            }}
          />
        </div>

        {/* ✅ NEW: AI generate button (UI structure unchanged style-wise) */}
        <div className="flex items-center justify-between">
          Description:
          <button
            type="button"
            onClick={generateDescription}
            className="flex items-center justify-center text-black w-full ml-5 bg-green-400 rounded-lg px-3 py-2 font-bold hover:cursor-pointer"
          >
            {loadingAI ? <LoadingAnimation /> : "Generate"}
          </button>
        </div>

        {/* optional hidden textarea (keeps UI minimal, still usable) */}
        <textarea
          className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
          placeholder="AI generated description"
          value={imageData.description}
            onChange={(e) => {
              dispatch({ type: "description", payload: e.target.value });
            }}
          rows={3}
        />

        <button
          type="submit"
          className="text-black bg-amber-300 rounded-lg py-2 font-bold hover:cursor-pointer"
        >
          Submit
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

export default ProductForm;
