import React from "react";
import { useAuthStateContext } from "../../utils/contexts/AuthContext";

const Header = () => {
  const { user } = useAuthStateContext();
  
  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Mahasiswa</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Login sebagai</p>
            <p className="text-base font-semibold text-blue-600 capitalize">{user?.role || "Guest"}</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.nama?.charAt(0) || "?"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
