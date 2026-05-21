import { useReducer } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { animate, fadeInDown } from "../components/animation/animate";

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };

    case "color":
      return { ...state, color: action.payload };

    case "quantity":
      return { ...state, quantity: action.payload };

    case "price":
      return { ...state, price: action.payload };

    case "orderedBy":
      return { ...state, orderedBy: action.payload };

    case "orderedDate":
      return { ...state, orderedDate: action.payload };

    case "category":
      return { ...state, category: action.payload };

    default:
      return state;
  }
};

const EditOrder = ({
  id,
  name,
  color,
  quantity,
  price,
  orderedBy,
  orderedDate,
  category,
  closeModal,
  setOrders,
}) => {
  const [orderData, dispatch] = useReducer(reducer, {
    name,
    color,
    quantity,
    price,
    orderedBy,
    orderedDate,
    category,
  });

  const token = localStorage.getItem("token");

  const handleEditOrder = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...orderData,
        orderedDate: new Date(orderData.orderedDate).toISOString(),
      };
      const res = await axios.put(
        `http://localhost:5000/admin/edit-order/${id}`,
        dataToSend,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message + " 😊", {
        onClose: () => {
          if (setOrders) setOrders();
          closeModal(false);
        },
      });
    } catch (error) {
      toast.error("Error updating order");
      console.log(error);
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
            onClick={() => closeModal(false)}
            className="text-gray-200 hover:text-black hover:bg-gray-300 rounded-full p-2 transition hover:cursor-pointer"
          >
            <FaArrowLeft />
          </button>

          <h2 className="text-2xl font-bold text-amber-600">Edit Order</h2>

          <span></span>
        </div>

        {/* Form */}
        <form onSubmit={handleEditOrder} className="flex flex-col gap-4">
          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label className="text-amber-600 font-semibold">Product Name</label>

            <input
              type="text"
              value={orderData.name}
              onChange={(e) =>
                dispatch({ type: "name", payload: e.target.value })
              }
              className="border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1">
            <label className="text-amber-600 font-semibold">Color</label>

            <input
              type="text"
              value={orderData.color}
              onChange={(e) =>
                dispatch({ type: "color", payload: e.target.value })
              }
              className="border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Quantity and price */}
          <div className="flex gap-2 justify-between">
            {/* quantity */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-amber-600 font-semibold">Quantity</label>

              <input
                type="number"
                value={orderData.quantity}
                onChange={(e) =>
                  dispatch({ type: "quantity", payload: e.target.value })
                }
                className="border-2 border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            {/* price */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-amber-600 font-semibold">
                Price (Rs.)
              </label>

              <input
                type="number"
                value={orderData.price}
                onChange={(e) =>
                  dispatch({ type: "price", payload: e.target.value })
                }
                className="border-2 border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Ordered By and ordered Date*/}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-amber-600 font-semibold">Ordered By</label>

              <input
                type="text"
                value={orderData.orderedBy}
                onChange={(e) =>
                  dispatch({ type: "orderedBy", payload: e.target.value })
                }
                className="border-2 border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            {/* price */}
            <div className="flex flex-col gap-1">
              <label className="text-amber-600 font-semibold">
                Ordered Date
              </label>

              <input
                type="date"
                value={orderData.orderedDate?.split("T")[0]}
                onChange={(e) =>
                  dispatch({ type: "orderedDate", payload: e.target.value })
                }
                className="border-2 border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-amber-600 font-semibold">Category</label>

            <input
              type="text"
              value={orderData.category}
              onChange={(e) =>
                dispatch({ type: "category", payload: e.target.value })
              }
              className="border-2 border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-600 via-amber-600 to-yellow-600 hover:via-pink-600 hover:to-pink-600 transition-all duration-300 px-6 py-2 rounded-lg font-semibold text-lg hover:cursor-pointer"
            >
              Update Order
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default EditOrder;
