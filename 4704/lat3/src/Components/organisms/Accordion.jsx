import React from "react";
import Button from "../atoms/Button";

const Accordion = ({ modul, activeId, onToggle, onSelesai, onTanyaDosen }) => {
  const isActive = activeId === modul.id;

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <button
        onClick={() => onToggle(modul.id)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
      >
        <div className="text-left">
          <h3 className="font-semibold text-gray-800">{modul.judul}</h3>
          <p className="text-sm text-gray-500">
            {modul.selesai ? '✓ Selesai' : 'Belum Selesai'}
          </p>
        </div>
        <span className="text-xl">{isActive ? "▲" : "▼"}</span>
      </button>

      {isActive && (
        <div className="p-4 bg-white border-t">
          <p className="text-gray-600 mb-4">{modul.deskripsi}</p>

          <div className="flex gap-2">
            <Button
              variant={modul.selesai ? "info" : "primary"}
              onClick={() => onSelesai(modul.id)}
              className="flex-1"
            >
              {modul.selesai ? '✓ Selesai' : 'Tandai Selesai'}
            </Button>
            <Button
              variant="edit"
              onClick={() => onTanyaDosen(modul.judul)}
              className="flex-1"
            >
              💬 Tanya Dosen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
