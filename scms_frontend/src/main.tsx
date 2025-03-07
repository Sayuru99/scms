import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './pages/home/Home.tsx'
import Login from './pages/auth/Login.tsx'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import RootLayout from './layouts/root.layout.tsx';
import MainLayout from './layouts/main.layout.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import StudentDashboard from './pages/student/StudentDashboard.tsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/admin_dashboard",
            element: <AdminDashboard />,
          }
        ],
      },
      {
        path: "/student_dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
