import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Login from "./pages/auth/Login.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root.layout.tsx";
import MainLayout from "./layouts/main.layout.tsx";
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Users from "./pages/users/Users.tsx"; 

const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
                path: "/calendar",
                element: <div>Calendar (TBD)</div>, 
              },
              {
                path: "/student_dashboard",
                element: <StudentDashboard />,
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