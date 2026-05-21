import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { animate, fadeInDown, fadeInUp } from "../components/animation/animate";
import EditClient from "../forms/EditClient";
import AlertDialog from "../components/AlertDialog.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useDownloadExcel } from "react-export-table-to-excel";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [editClient, setEditClient] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const tableRef = useRef(null);

  const getClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      toast.error("Error fetching client data 😢");
      console.log(error);
    }
  };

  const handleEditClient = (client) => {
    setEditClient(true);
    setClientDetails(client);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/admin/delete-client/${clientToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(response.data.message);
      setShowAlertDialog(false);
      setClients(clients.filter((c) => c._id !== clientToDelete._id));
    } catch (error) {
      toast.error("Failed to delete client 😢");
    } finally {
      setShowAlertDialog(false);
      setClientToDelete(null);
    }
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Patan Handcraft",
    sheet: "ClientData",
  });

  useEffect(() => {
    getClients();
  }, [clients, clientDetails]);

  return (
    <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 sm:px-10 text-white font-bold">
      <div className="flex justify-between">
        <h1
          className={`text-3xl sm:text-4xl text-amber-600 ${animate} ${fadeInDown}`}
        >
          Clients
        </h1>
        <button
          onClick={() => {
            if (clients.length === 0) {
              toast.error("No data to export 😢");
              return;
            }
            onDownload();
          }}
          className="bg-green-700 px-3 py-1 text-gray-200 rounded-sm hover:cursor-pointer hover:bg-green-600 transition-all duration-200 flex gap-2 justify-center items-center"
        >
          <RiFileExcel2Fill />
          Export Data
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className={`min-w-[700px] w-full ${animate} ${fadeInUp}`}>
          <thead className="font-semibold text-lg sm:text-xl text-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-3 px-2">S.N</th>
              <th className="text-left px-2">Name</th>
              <th className="text-left px-2">Email</th>
              <th className="text-left px-2">Address</th>
              <th className="text-center px-2">Phone Number</th>
              <th className="text-center px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-xl sm:text-2xl text-gray-400 py-10"
                >
                  No data found 😢
                </td>
              </tr>
            ) : (
              clients.map((client, index) => {
                const address = client.address || {};
                return (
                  <tr
                    key={client._id}
                    className="text-sm sm:text-base font-medium text-gray-200 border-b-2 border-gray-300 hover:bg-[#2D2D2D] transition-all duration-200"
                  >
                    <td className="text-left px-2 py-2">{index + 1}.</td>
                    <td className="text-left px-2">{client.name}</td>
                    <td className="text-left px-2">
                      {client?.email || "----------"}
                    </td>
                    <td className="text-left px-2 py-2">
                      {address?.house_no || ""} {address?.district || ""} <br />
                      {address?.city || ""} {address?.state || ""}{" "}
                      {address?.postal_code || ""} <br />
                      {address?.country || ""}
                    </td>
                    <td className="text-center px-2">
                      {client?.phone || "----------"}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <button
                          className="bg-blue-500 px-5 py-1 rounded-sm hover:bg-blue-600 hover:cursor-pointer transition-all duration-200"
                          onClick={() => handleEditClient(client)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 px-3 py-1 rounded-sm hover:bg-red-700 hover:cursor-pointer transition-all duration-200"
                          onClick={() => {
                            setClientToDelete(client);
                            setShowAlertDialog(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* hidden table for exporting data to excel sheet */}
        <table ref={tableRef} className="absolute -left-[9999px]">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Name</th>
              <th>Email</th>
              <th>House Number</th>
              <th>District</th>
              <th>City</th>
              <th>State</th>
              <th>Postal Code</th>
              <th>Country</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => {
              const address = client.address || {};
              return (
                <tr key={client._id}>
                  <td>{index + 1}</td>
                  <td>{client.name}</td>
                  <td>{client?.email || ""}</td>
                  <td>{address.house_no || ""}</td>
                  <td>{address.district || ""}</td>
                  <td>{address.city || ""}</td>
                  <td>{address.state || ""}</td>
                  <td>{address.postal_code || ""}</td>
                  <td>{address.country || ""}</td>
                  <td>{client?.phone || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ToastContainer position="bottom-right" autoClose={800} theme="dark" />

      {editClient && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 overflow-auto z-50">
          <EditClient
            {...clientDetails}
            closeModal={() => setEditClient(false)}
          />
        </div>
      )}

      {showAlertDialog && (
        <AlertDialog
          onConfirm={handleDeleteClient}
          onCancel={() => setShowAlertDialog(false)}
        />
      )}
    </div>
  );
};

export default Clients;
