import React from "react";

const Header = () => (
  <header className="bg-white shadow-md">
    <div className="flex justify-between items-center px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800">Mahasiswa</h1>
      <div className="relative">
        <button className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"></button>
        {/* Profile menu logic can be added here */}
      </div>
    </div>
  </header>
);

export default Header;
