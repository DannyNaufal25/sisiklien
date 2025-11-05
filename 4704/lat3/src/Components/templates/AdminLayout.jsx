import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../organisms/Sidebar";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

const AdminLayout = () => {
  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
