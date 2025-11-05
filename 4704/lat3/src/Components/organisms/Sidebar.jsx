import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { confirm } from "../../utils/Swal2Helper.jsx";
import { toastSuccess } from "../../utils/toastHelper.jsx";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const ok = await confirm('Logout', 'Apakah Anda yakin ingin logout?');
    if (ok) {
      localStorage.removeItem("user");
      toastSuccess('Anda berhasil logout');
      navigate("/login");
    }
  };

  return (
    <aside className="bg-blue-800 text-white h-full transition-all duration-300 w-20 lg:w-64 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin Panel</span>
      </div>
      <nav className="p-4 space-y-2 flex-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition ${
              isActive ? "bg-blue-700 font-semibold" : ""
            }`
          }
        >
          <span className="text-lg">🏠</span>
          <span className="menu-text hidden lg:inline">Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition ${
              isActive ? "bg-blue-700 font-semibold" : ""
            }`
          }
        >
          <span className="text-lg">🎓</span>
          <span className="menu-text hidden lg:inline">Mahasiswa</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-red-600 transition w-full text-left"
        >
          <span className="text-lg">🚪</span>
          <span className="menu-text hidden lg:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
