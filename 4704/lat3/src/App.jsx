import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Login from "./Pages/Login";

import AnalyticsDashboard from "./Pages/AnalyticsDashboard";
import Mahasiswa from "./Pages/Mahasiswa";
import MahasiswaDetail from "./Pages/MahasiswaDetail";
import Kelas from "./Pages/Kelas";
import RencanaStudi from "./Pages/RencanaStudi";
import AuthLayout from "./Components/templates/AuthLayout";
import AdminLayout from "./Components/templates/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import PageNotFound from "./Pages/PageNotFound";
import { AuthProvider } from "./utils/contexts/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
          <Route path="dashboard" element={<AnalyticsDashboard />} />
          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="mahasiswa/:id" element={<MahasiswaDetail />} />
          <Route path="kelas" element={<Kelas />} />
          <Route path="rencana-studi" element={<RencanaStudi />} />
        </Route>

  {/* Default Route */}
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
