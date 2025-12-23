import React, { useState } from "react";
import Modal from "./Modal";
import Button from "../atoms/Button";
import { toastSuccess } from "../../utils/toastHelper.jsx";

const TanyaDosenModal = ({ isOpen, onClose, modulJudul }) => {
  const [pertanyaan, setPertanyaan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pertanyaan.trim()) {
      return;
    }
    
    toastSuccess("Pertanyaan berhasil dikirim ke dosen!");
    setPertanyaan("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Tanya Dosen</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Modul: <span className="font-medium">{modulJudul}</span>
            </p>
          </div>
          
          <textarea
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            placeholder="Tuliskan pertanyaan Anda di sini..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 min-h-[120px]"
            required
          />
          
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Kirim Pertanyaan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TanyaDosenModal;
