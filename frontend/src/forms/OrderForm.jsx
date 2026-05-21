import { useReducer, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { animate, fadeInUp } from "../components/animation/animate";

const initialState = {
  name: "",
  color: "",
  quantity: "",
  price: "",
  ordered_by: "",
  ordered_date: "",
  category: "",
};

// reducer
function reducer(state, action) {
  switch (action.type) {
    case "update":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const OrderForm = () => {
  const [orderData, dispatch] = useReducer(reducer, initialState);

  // 🔥 NEW STATES
  const [productList, setProductList] = useState([]);
  const [clientList, setClientList] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get("http://localhost:5000/admin/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },);
        const clientRes = await axios.get("http://localhost:5000/admin/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },);

        setProductList(productRes.data);
        setClientList(clientRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  // 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProductDropdown(false);
      setShowClientDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/add-order",
        orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message + " 😊");
      dispatch({ type: "reset" });
    } catch (error) {
      toast.error("Error adding order 😢");
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 p-6 w-full max-w-4xl rounded-2xl mt-5 bg-[#1E1E1E] border-[#2D2D2D] border-2 shadow-md text-lg font-normal ${animate} ${fadeInUp}`}
      >
        <h1 className="text-2xl font-semibold text-center">Add order</h1>
        <hr />

        {/* 🔥 PRODUCT NAME */}
        Product Name:
        <div className="relative">
          <input
            type="text"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold w-full"
            value={orderData.name}
            onChange={(e) => {
              const value = e.target.value;

              dispatch({ type: "update", field: "name", payload: value });

              const filtered = productList.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
              );

              setFilteredProducts(filtered);
              setShowProductDropdown(true);
            }}
            onClick={(e) => e.stopPropagation()}
            required
          />

          {showProductDropdown && filteredProducts.length > 0 && (
            <div
              className="absolute bg-white text-black w-full rounded-md mt-1 max-h-40 overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredProducts.map((item) => (
                <div
                  key={item._id}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "update", field: "name", payload: item.name });
                    dispatch({ type: "update", field: "price", payload: item.price });
                    dispatch({
                      type: "update",
                      field: "category",
                      payload: item.category,
                    });

                    setShowProductDropdown(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLOR */}
        Color:
        <input
          type="text"
          className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
          value={orderData.color}
          onChange={(e) =>
            dispatch({ type: "update", field: "color", payload: e.target.value })
          }
        />

        {/* QUANTITY */}
        Quantity:
        <input
          type="number"
          className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
          value={orderData.quantity}
          onChange={(e) =>
            dispatch({
              type: "update",
              field: "quantity",
              payload: e.target.value,
            })
          }
          required
        />

        {/* PRICE (AUTO) */}
        Price:
        <input
          type="number"
          value={orderData.price}
          readOnly
          className="border-2 rounded-md px-3 py-2 text-sm font-semibold bg-gray-300 text-black"
        />

        {/* 🔥 ORDERED BY */}
        Ordered by:
        <div className="relative">
          <input
            type="text"
            className="border-2 rounded-md px-3 py-2 text-sm font-semibold w-full"
            value={orderData.ordered_by}
            onChange={(e) => {
              const value = e.target.value;

              dispatch({
                type: "update",
                field: "ordered_by",
                payload: value,
              });

              const filtered = clientList.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
              );

              setFilteredClients(filtered);
              setShowClientDropdown(true);
            }}
            onClick={(e) => e.stopPropagation()}
            required
          />

          {showClientDropdown && filteredClients.length > 0 && (
            <div
              className="absolute bg-white text-black w-full rounded-md mt-1 max-h-40 overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredClients.map((item) => (
                <div
                  key={item._id}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    dispatch({
                      type: "update",
                      field: "ordered_by",
                      payload: item.name,
                    });

                    setShowClientDropdown(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATE */}
        Ordered date:
        <input
          type="date"
          className="border-2 rounded-md px-3 py-2 text-sm font-semibold"
          value={orderData.ordered_date}
          onChange={(e) =>
            dispatch({
              type: "update",
              field: "ordered_date",
              payload: e.target.value,
            })
          }
          required
        />

        {/* CATEGORY (AUTO) */}
        Category:
        <input
          type="text"
          value={orderData.category}
          readOnly
          className="border-2 rounded-md px-3 py-2 text-sm font-semibold bg-gray-300 text-black"
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

export default OrderForm;