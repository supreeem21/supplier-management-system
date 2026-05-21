import ClientNavBar from "./ClientNavBar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
        <div className="flex relative">
          <ClientNavBar />
          <Outlet />
        </div>
    </>
  );
}
