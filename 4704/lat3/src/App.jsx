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
import QuizManagement from "./Pages/QuizManagement";
import QuizBuilder from "./Pages/QuizBuilder";
import QuizTaking from "./Pages/QuizTaking";
import QuizResult from "./Pages/QuizResult";
import QuizAnalytics from "./Pages/QuizAnalytics";
import Forum from "./Pages/Forum";
import ForumThread from "./Pages/ForumThread";
import ForumNewThread from "./Pages/ForumNewThread";
import UserReputation from "./Pages/UserReputation";
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
          
          {/* Quiz Routes */}
          <Route path="quiz" element={<QuizManagement />} />
          <Route path="quiz/create" element={<QuizBuilder />} />
          <Route path="quiz/:quizId/edit" element={<QuizBuilder />} />
          <Route path="quiz/:quizId/preview" element={<QuizTaking />} />
          <Route path="quiz/:quizId/take" element={<QuizTaking />} />
          <Route path="quiz/:quizId/result" element={<QuizResult />} />
          <Route path="quiz/:quizId/analytics" element={<QuizAnalytics />} />

          {/* Forum Routes */}
          <Route path="forum" element={<Forum />} />
          <Route path="forum/new" element={<ForumNewThread />} />
          <Route path="forum/:threadId" element={<ForumThread />} />
          <Route path="reputation" element={<UserReputation />} />
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
