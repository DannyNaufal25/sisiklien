import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Mahasiswa from "./Pages/Mahasiswa";
import MahasiswaDetail from "./Pages/MahasiswaDetail";
import AuthLayout from "./Components/templates/AuthLayout";
import AdminLayout from "./Components/templates/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import PageNotFound from "./Pages/PageNotFound";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="mahasiswa/:id" element={<MahasiswaDetail />} />
        </Route>

  {/* Default Route */}
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
