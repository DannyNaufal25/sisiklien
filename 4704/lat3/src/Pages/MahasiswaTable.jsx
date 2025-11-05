import React from "react";
import Button from "../Components/atoms/Button";

const MahasiswaTable = ({ mahasiswa = [], openEditModal, onDelete, onDetail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">NIM</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((mhs) => (
            <tr key={mhs.id} className="border-b">
              <td className="px-4 py-2 align-middle">{mhs.nama}</td>
              <td className="px-4 py-2 align-middle">{mhs.nim}</td>
              <td className="px-4 py-2 align-middle">
                {mhs.aktif ? (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Aktif</span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Tidak Aktif</span>
                )}
              </td>
              <td className="px-4 py-2 align-middle">
                <div className="flex justify-center gap-2">
                  <Button variant="info" onClick={() => onDetail && onDetail(mhs.id)}>
                    Detail
                  </Button>
                  <Button variant="edit" onClick={() => openEditModal && openEditModal(mhs.nim)}>
                    Edit
                  </Button>
                  <Button variant="delete" onClick={() => onDelete && onDelete(mhs.nim)}>
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
