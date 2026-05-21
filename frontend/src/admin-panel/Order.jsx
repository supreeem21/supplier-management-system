import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import {
  animate,
  fadeInDown,
  fadeInUp,
  flash,
  infinite,
  slower,
} from "../components/animation/animate";
import EditOrder from "../forms/EditOrder";
import AlertDialog from "../components/AlertDialog";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const tableRef = useRef(null);
  const allTableRef = useRef(null);
  const completedTableRef = useRef(null);
  const pendingTableRef = useRef(null);

  // get all orders
  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setFilteredOrders(response.data.filter((o) => o.status === status));
    } catch (error) {
      toast.error("Error fetching order data 😢");
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [status, selectedOrder]);

  // marking completion of the order
  const markComplete = async (item) => {
    const id = item._id;
    try {
      const res = await axios.post(
        `http://localhost:5000/admin/order-complete/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      getOrders(); // refresh orders
    } catch (error) {
      toast.error("Error while marking order as complete");
      console.log(error);
    }
  };

  // filter value change
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setStatus(filterValue);
    const filteredData = orders.filter((item) => item.status === filterValue);
    setFilteredOrders(filteredData);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/admin/delete-order/${orderToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(response.data.message);
      setShowAlertDialog(false);
      getOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const { onDownload: downloadSingle } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "AllOrders",
    sheet: "Single Order",
  });

  const { onDownload: downloadAll } = useDownloadExcel({
    currentTableRef: allTableRef.current,
    filename: "AllOrders",
    sheet: "All Order",
  });

  const { onDownload: downloadCompleted } = useDownloadExcel({
    currentTableRef: completedTableRef.current,
    filename: "AllOrders",
    sheet: "Completed Order",
  });

  const { onDownload: downloadPending } = useDownloadExcel({
    currentTableRef: pendingTableRef.current,
    filename: "AllOrders",
    sheet: "Pending",
  });

  return (
    <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 sm:px-10 text-white font-bold">
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${animate} ${fadeInDown}`}
      >
        <h1 className="text-3xl sm:text-4xl text-amber-600">Orders</h1>
        <div className="flex items-center gap-2">
          <label
            htmlFor="orderFilter"
            className="text-lg sm:text-xl font-semibold"
          >
            Filter by:
          </label>
          <select
            id="orderFilter"
            className="border-2 border-slate-400 rounded-lg px-3 sm:px-4 py-1 sm:py-1.5 text-gray-400 focus:ring-2 font-normal hover:outline-none text-base sm:text-lg"
            value={status}
            onChange={handleFilterChange}
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex items-center gap-5 mt-5">
        <span className="flex gap-2 items-center"><RiFileExcel2Fill/> Export: </span>
        <button
          className="px-3 py-1 rounded-sm  border-gray-400 hover:cursor-pointer hover:bg-gray-600 transition-all duration-200"
          onClick={downloadAll}
        >
          All
        </button>
        <button
          className="px-3 py-1 rounded-sm  border-gray-400 hover:cursor-pointer hover:bg-gray-600 transition-all duration-200"
          onClick={downloadCompleted}
        >
          Completed
        </button>
        <button
          className="px-3 py-1 rounded-sm  border-gray-400 hover:cursor-pointer hover:bg-gray-600 transition-all duration-200"
          onClick={downloadPending}
        >
          Pending
        </button>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-5 mt-5">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-xl sm:text-2xl text-gray-400 mt-10">
            No data found 😢
          </p>
        ) : (
          filteredOrders.map((item, index) => (
            <div
              key={index}
              className={`bg-[#1E1E1E] rounded-2xl p-5 flex flex-col lg:flex-row gap-5 ${animate} ${fadeInUp}`}
            >
              <div className="flex-1">
                {/* order name and list with action buttons */}
                <div className="flex items-center justify-between font-semibold text-2xl sm:text-3xl">
                  {/* order product name */}
                  <p>{item.name}</p>
                  {/* action buttons */}
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <button
                      className="px-3 py-3 rounded-[50%] text-xl hover:cursor-pointer hover:text-blue-500 transition-transform"
                      onClick={() => {
                        setSelectedOrder(item);
                        setShowModal(true);
                      }}
                    >
                      <MdEdit/>
                    </button>
                    <button
                      className=" px-3 py-3 rounded-[50%] hover:cursor-pointer hover:text-red-500 transition-transform"
                      onClick={() => {
                        setOrderToDelete(item);
                        setShowAlertDialog(true);
                      }}
                    >
                      <FaTrash/>
                    </button>
                    <button
                      className=" px-3 py-3 rounded-[50%] text-xl hover:cursor-pointer hover:text-green-500 transition-all duration-200"
                      onClick={downloadSingle}
                    >
                      <RiFileExcel2Fill/>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-500">
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          S.N.
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Color
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Quantity (pcs)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Price (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Total (Rs.)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-600 font-semibold">
                        <td className="py-1 px-1 sm:px-2 text-left">
                          {index + 1}.
                        </td>
                        <td className="py-1 px-1 sm:px-2">{item.color}</td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.price}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.quantity * item.price}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Order Details */}
                <div className="flex flex-col lg:flex-row justify-between mt-3 gap-3">
                  <div className="flex flex-col gap-1 text-sm sm:text-base">
                    <p>
                      <span className="text-amber-500">Ordered by: </span>
                      <span className="font-semibold">{item.ordered_by}</span>
                    </p>
                    <p>
                      <span className="text-amber-500">Ordered date: </span>
                      <span className="font-semibold">
                        {new Date(item.ordered_date).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <span className="text-amber-500">Category: </span>
                      <span className="font-semibold">{item.category}</span>
                    </p>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <p className="text-lg sm:text-2xl font-semibold">
                      Status:
                      {item.status === "pending" ? (
                        <span
                          className={`ml-2 text-red-500 text-lg sm:text-2xl ${animate} ${flash} ${slower} ${infinite}`}
                        >
                          Pending... 😢
                        </span>
                      ) : (
                        <span
                          className={`ml-2 text-green-500 text-lg sm:text-2xl ${animate} ${flash} ${slower} ${infinite}`}
                        >
                          Completed 😄
                        </span>
                      )}
                    </p>

                    {item.status === "completed" ? (
                      <button className="flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-green-600 py-1 px-3 rounded-lg font-bold transition-all duration-300">
                        <TiTick className="text-2xl sm:text-3xl" /> Completed
                      </button>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-emerald-400 to-green-600 hover:from-green-500 hover:to-green-600 py-1 px-3 rounded-lg font-bold hover:cursor-pointer hover:scale-105 transition-all duration-300"
                        onClick={() => markComplete(item)}
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>

                {/*  hidden tables for downloading data. */}
                <div className="hidden">
                  {/* table for downloading single order */}
                  <table className="absolute -left-[9999px]" ref={tableRef}>
                    <thead>
                      <tr className="border-b-2 border-slate-500">
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          S.N.
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Category
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Color
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Quantity (pcs)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Price (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Total (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered By
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered Date
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className="border-b border-slate-600 font-semibold"
                        key={index}
                      >
                        <td className="py-1 px-1 sm:px-2 text-left">
                          {index + 1}.
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-left">
                          {item.category}
                        </td>
                        <td className="py-1 px-1 sm:px-2">{item.color}</td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.price}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.quantity * item.price}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.ordered_by}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {new Date(item.ordered_date).toLocaleDateString()}
                        </td>
                        <td className="py-1 px-1 sm:px-2 text-right">
                          {item.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* table for downloading all order */}
                  <table className="absolute -left-[9999px]" ref={allTableRef}>
                    <thead>
                      <tr className="border-b-2 border-slate-500">
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          S.N.
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Category
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Color
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Quantity (pcs)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Price (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Total (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered By
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered Date
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((item, index) => (
                        <tr
                          className="border-b border-slate-600 font-semibold"
                          key={index}
                        >
                          <td className="py-1 px-1 sm:px-2 text-left">
                            {index + 1}.
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-left">
                            {item.category}
                          </td>
                          <td className="py-1 px-1 sm:px-2">{item.color}</td>
                          <td className="py-1 px-1 sm:px-2 text-right">
                            {item.quantity}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right">
                            {item.price}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right">
                            {item.quantity * item.price}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right">
                            {item.ordered_by}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right">
                            {new Date(item.ordered_date).toLocaleDateString()}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right">
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* table for downloading completed order */}
                  <table
                    className="absolute -left-[9999px]"
                    ref={completedTableRef}
                  >
                    <thead>
                      <tr className="border-b-2 border-slate-500">
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          S.N.
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Category
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Color
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Quantity (pcs)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Price (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Total (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered By
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered Date
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter((item) => item.status === "completed")
                        .map((item, index) => (
                          <tr
                            className="border-b border-slate-600 font-semibold"
                            key={index}
                          >
                            <td className="py-1 px-1 sm:px-2 text-left">
                              {index + 1}.
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-left">
                              {item.category}
                            </td>
                            <td className="py-1 px-1 sm:px-2">{item.color}</td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.quantity}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.price}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.quantity * item.price}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.ordered_by}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {new Date(item.ordered_date).toLocaleDateString()}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.status}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* table for downloading pending order */}
                  <table
                    className="absolute -left-[9999px]"
                    ref={pendingTableRef}
                  >
                    <thead>
                      <tr className="border-b-2 border-slate-500">
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          S.N.
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Category
                        </th>
                        <th className="text-left text-amber-500 py-1 px-1 sm:px-2">
                          Color
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Quantity (pcs)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Price (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Total (Rs.)
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered By
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Ordered Date
                        </th>
                        <th className="text-right text-amber-500 py-1 px-1 sm:px-2">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter((item) => item.status === "pending")
                        .map((item, index) => (
                          <tr
                            className="border-b border-slate-600 font-semibold"
                            key={index}
                          >
                            <td className="py-1 px-1 sm:px-2 text-left">
                              {index + 1}.
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-left">
                              {item.category}
                            </td>
                            <td className="py-1 px-1 sm:px-2">{item.color}</td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.quantity}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.price}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.quantity * item.price}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.ordered_by}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {new Date(item.ordered_date).toLocaleDateString()}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right">
                              {item.status}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
        {showAlertDialog && (
          <AlertDialog
            onConfirm={handleDeleteOrder}
            onCancel={() => setShowAlertDialog(false)}
          />
        )}
      </div>

      <ToastContainer
        className="text-lg font-semibold"
        position="bottom-right"
        autoClose={800}
        theme="dark"
      />

      {/* Edit order Modal */}
      {showModal && (
        <EditOrder
          id={selectedOrder._id}
          name={selectedOrder.name}
          color={selectedOrder.color}
          quantity={selectedOrder.quantity}
          price={selectedOrder.price}
          orderedBy={selectedOrder.ordered_by}
          orderedDate={selectedOrder.ordered_date}
          category={selectedOrder.category}
          setOrders={setOrders}
          closeModal={setShowModal}
        />
      )}
    </div>
  );
};

export default Order;
