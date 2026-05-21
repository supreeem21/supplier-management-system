import { FaProductHunt, FaUser  } from "react-icons/fa";
import { RiAlignItemLeftFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { BiSolidContact } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { animate, fadeInLeft } from "./components/animation/animate";

const ClientNavBar = () => {
  const changeLinkColor = (e) => {
    return e.isActive ? "text-amber-500" : "";
  };

  const listCss =
    `flex items-center gap-3 hover:text-amber-600 hover:cursor-pointer transition-all duration-300 ${animate} ${fadeInLeft}`;
  const spanCss = "flex items-center gap-3";

  return (
    <div className=" bg-[#121212] border-r-2 border-[#2D2D2D] text-gray-300 font-semibold text-xl h-[100vh] flex flex-col items-center justify-start gap-8 sticky left-0 top-0">
      {/* logo */}
      <div className="w-full px-10 pt-5">
        <NavLink to="/">
          <img
            src="/images/patan-handcraft_main.png"
            alt=""
            className={`h-25 w-40 object-contain hover:cursor-pointer ${animate} ${fadeInLeft}`}
          />
        </NavLink>
      </div>

      {/* link items */}
      <div className=" px-10">
        <ul className="flex flex-col gap-3">
          <li className={listCss}>
            <NavLink className={changeLinkColor} to="/">
              <span className={spanCss}>
                <FaProductHunt />
                Products
              </span>
            </NavLink>
          </li>
          <li className={listCss}>
            <NavLink className={changeLinkColor} to="/contact">
              <span className={spanCss}>
                <BiSolidContact />
                Contact
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClientNavBar;
