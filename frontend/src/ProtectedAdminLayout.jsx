import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./admin-panel/NavBar.jsx";
import axios from "axios";

function ProtectedAdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data || !res.data.email) {
          navigate("/admin/login");
          return;
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="flex relative">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default ProtectedAdminLayout;
