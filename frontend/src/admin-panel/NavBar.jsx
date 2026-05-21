import { useState } from "react";
import { FaProductHunt, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { RiAlignItemLeftFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { BiSolidContact } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { animate, fadeInLeft } from "../components/animation/animate";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const changeLinkColor = (e) =>
    e.isActive ? "text-amber-500" : "text-gray-300";

  const listCss = `flex items-center gap-3 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 ${animate} ${fadeInLeft}`;
  const spanCss = "flex items-center gap-3";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-[#121212] border-b-2 border-[#2D2D2D] px-5 py-3">
        <NavLink to="/admin">
          <img
            src="/images/patan-handcraft_main.png"
            alt="Logo"
            className="h-10 w-28 object-contain"
          />
        </NavLink>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 text-2xl"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          bg-[#121212] border-r-2 border-[#2D2D2D] text-gray-300 font-semibold text-xl
          flex flex-col items-center gap-8
          w-64 md:w-64
          transform transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0 fixed top-0 left-0 z-50 h-screen" : "-translate-x-full md:translate-x-0"}
          md:sticky md:top-0 md:h-screen
          pt-16 md:pt-5
          overflow-hidden
        `}
      >
        {/* Logo */}
        <div className="w-full px-10 md:px-10">
          <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="/images/patan-handcraft_main.png"
              alt="Logo"
              className="h-10 md:h-24 w-36 object-contain hover:cursor-pointer"
            />
          </NavLink>
        </div>

        {/* Nav links */}
        <div className="px-10 w-full flex-1 flex flex-col justify-between">
          <ul className="flex flex-col gap-3 md:gap-4">
            {/* Dashboard */}
            <li className={listCss}>
              <NavLink
                className={changeLinkColor}
                to="/admin"
                end
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={spanCss}>
                  <MdDashboard />
                  Dashboard
                </span>
              </NavLink>
            </li>

            {/* Products */}
            <li className={listCss}>
              <NavLink
                className={changeLinkColor}
                to="/admin/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={spanCss}>
                  <FaProductHunt />
                  Products
                </span>
              </NavLink>
            </li>

            {/* Clients */}
            <li className={listCss}>
              <NavLink
                className={changeLinkColor}
                to="/admin/clients"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={spanCss}>
                  <FaUser />
                  Clients
                </span>
              </NavLink>
            </li>

            {/* Admins */}
            <li className={listCss}>
              <NavLink
                className={changeLinkColor}
                to="/admin/admin-details"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={spanCss}>
                  <FaUserCheck />
                  Admins
                </span>
              </NavLink>
            </li>

            {/* Order */}
            <li className={listCss}>
              <NavLink
                className={changeLinkColor}
                to="/admin/order"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={spanCss}>
                  <RiAlignItemLeftFill />
                  Order
                </span>
              </NavLink>
            </li>

            {/* Contact */}
            <li className={listCss}>
              <NavLink
                className={changeLinkColor}
                to="/admin/contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={spanCss}>
                  <BiSolidContact />
                  Contact
                </span>
              </NavLink>
            </li>
          </ul>

          <ul>
            {/* Logout */}
            <li className={listCss}>
              <button onClick={handleLogout} className="mb-5 hover:cursor-pointer">
                <span className={spanCss}>
                  <IoLogOut />
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default NavBar;
