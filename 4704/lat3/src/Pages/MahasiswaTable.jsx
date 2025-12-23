import React from "react";
import Button from "../Components/atoms/Button";
import { useAuthStateContext } from "../utils/contexts/AuthContext";

const MahasiswaTable = ({ mahasiswa = [], openEditModal, onDelete, onDetail, canUpdate = false, canDelete = false, getTotalSks }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">NIM</th>
            <th className="px-4 py-2 text-center">Max SKS</th>
            <th className="px-4 py-2 text-center">SKS Terpakai</th>
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((mhs) => {
            const totalSks = getTotalSks ? getTotalSks(mhs.id) : 0;

            return (
              <tr key={mhs.id} className="border-b">
                <td className="px-4 py-2 align-middle">{mhs.name}</td>
                <td className="px-4 py-2 align-middle">{mhs.nim}</td>
                <td className="px-4 py-2 text-center align-middle">{mhs.max_sks || "-"}</td>
                <td className="px-4 py-2 text-center align-middle">{totalSks}</td>
                <td className="px-4 py-2 align-middle">
                  <div className="flex justify-center gap-2">
                    <Button variant="info" onClick={() => onDetail && onDetail(mhs.id)}>
                      Detail
                    </Button>
                    {canUpdate && user?.permission?.includes("mahasiswa.update") && (
                      <Button variant="edit" onClick={() => openEditModal && openEditModal(mhs.id)}>
                        Edit
                      </Button>
                    )}
                    {canDelete && user?.permission?.includes("mahasiswa.delete") && (
                      <Button variant="delete" onClick={() => onDelete && onDelete(mhs.id)}>
                        Hapus
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
