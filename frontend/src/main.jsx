import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import PageNotFoundError from "./PageNotFoundError.jsx";

// client components
import App from "./App.jsx";
import ClientProducts from "./ClientProducts.jsx";
import ClientContact from "./ClientContact.jsx";

import ProtectedAdminLayout from "./ProtectedAdminLayout.jsx";
import LoginForm from "./LoginForm.jsx";

// admin components
import Dashboard from "./admin-panel/Dashboard.jsx";
import Products from "./admin-panel/Products.jsx";
import Clients from "./admin-panel/Clients.jsx";
import Order from "./admin-panel/Order.jsx";
import Contact from "./admin-panel/Contact.jsx";
import Admins from "./admin-panel/Admins.jsx";

const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFoundError />
  },
  {
    path: "/",
    element: <App />,
    children: [
      { index:true, element:<ClientProducts />},
      { path:"/contact",  element:<ClientContact />},
    ]
  },
  {
    path: "/admin/login",
    element: <LoginForm />, // Login page before App
  },
  {
    path: "/admin",
    element: <ProtectedAdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "clients", element: <Clients /> },
      { path: "admin-details", element: <Admins /> },
      { path: "products", element: <Products /> },
      { path: "order", element: <Order /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
