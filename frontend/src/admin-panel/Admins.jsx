import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { animate, fadeInDown, fadeInUp } from "../components/animation/animate";
import EditAdmin from "../forms/EditAdmin.jsx";
import AlertDialog from "../components/AlertDialog.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useDownloadExcel } from "react-export-table-to-excel";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [adminDetails, setAdminDetails] = useState(null);
  const [editAdmin, setEditAdmin] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const tableRef = useRef(null);

  const getAdmins = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/admin-details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAdmins(response.data);
    } catch (error) {
      toast.error("Error fetching admin data 😢");
      console.log(error);
    }
  };

  const handleEditAdmin = (admin) => {
    setEditAdmin(true);
    setAdminDetails(admin);
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/admin/delete-admin/${adminToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(response.data.message);
      setShowAlertDialog(false);
      setAdmins(admins.filter((c) => c._id !== adminToDelete._id));
    } catch (error) {
      toast.error("Failed to delete admin 😢");
    } finally {
      setShowAlertDialog(false);
      setAdminToDelete(null);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Users",
    sheet: "admins",
  });

  return (
    <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 sm:px-10 text-white font-bold">
      <div className="flex justify-between">
        <h1
          className={`text-3xl sm:text-4xl text-amber-600 ${animate} ${fadeInDown}`}
        >
          Admins
        </h1>
        <button
          onClick={() => {
            if (admins.length === 0) {
              toast.error("No data to export 😢");
              return;
            }
            onDownload();
          }}
          className="bg-green-700 px-3 py-1 text-gray-200 rounded-sm hover:cursor-pointer hover:bg-green-600 transition-all duration-200 flex gap-2 justify-center items-center"
        >
          <RiFileExcel2Fill />
          Export Emails
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        {admins.map((admin, index) => {
          <p>{admin.email}</p>;
        })}
        <table className={`min-w-[700px] w-full ${animate} ${fadeInUp}`}>
          <thead className="font-semibold text-lg sm:text-xl text-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-3 px-2">S.N</th>
              <th className="text-left px-2">Email</th>
              <th className="text-center px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-xl sm:text-2xl text-gray-400 py-10"
                >
                  No data found 😢
                </td>
              </tr>
            ) : (
              admins.map((admin, index) => {
                return (
                  <tr
                    key={admin._id}
                    className="text-sm sm:text-base font-medium text-gray-200 border-b-2 border-gray-300 hover:bg-[#2D2D2D] transition-all duration-200"
                  >
                    <td className="text-left px-2 py-2">{index + 1}.</td>
                    <td className="text-left px-2">{admin.email}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <button
                          className="bg-blue-500 px-5 py-1 rounded-sm hover:cursor-pointer hover:bg-blue-600 transition-all duration-200"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 px-3 py-1 rounded-sm hover:cursor-pointer hover:bg-red-700 transition-all duration-200"
                          onClick={() => {
                            setAdminToDelete(admin);
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

        {/* hidden table for exporting the emails of the admin users */}
        <table ref={tableRef} className="absolute -left-[9999px]">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => {
              return (
                <tr key={admin._id}>
                  <td>{admin.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ToastContainer position="bottom-right" autoClose={800} theme="dark" />

      {editAdmin && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 overflow-auto z-50">
          <EditAdmin {...adminDetails} closeModal={() => setEditAdmin(false)} />
        </div>
      )}

      {showAlertDialog && (
        <AlertDialog
          onConfirm={handleDeleteAdmin}
          onCancel={() => setShowAlertDialog(false)}
        />
      )}
    </div>
  );
};

export default Admins;
