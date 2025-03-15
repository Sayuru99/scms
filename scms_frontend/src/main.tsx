
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Login from "./pages/auth/Login.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root.layout.tsx";
import MainLayout from "./layouts/main.layout.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Users from "./pages/users/Users.tsx";
import Permissions from "./pages/permissions/Permissions.tsx";
import Resources from "./pages/resources/Resources.tsx";
import Courses from "./pages/courses/Course.tsx"; 
import Reservation from "./pages/reservation/Reservation.tsx";
import Calendar from "./pages/Calendar/Calendar.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
        <p className="mt-2">An unexpected error occurred. Please try refreshing the page or contact support.</p>
      </div>
    ),
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "/users",
                element: <Users />,
              },
              {
                path: "/events",
                element: <div>Events (TBD)</div>,
              },
              {
                path: "/permissions",
                element: <Permissions />,
              },
              {
                path: "/calendar",
                element: <Calendar />,
              },
              {
                path: "/resources",
                element: <Resources />,
              },
              {
                path: "/reservation",
                element: <Reservation />,
              },
              {
                path: "/courses", 
                element: <Courses />,
              },
            ],
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </StrictMode>
);