import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data dummy mahasiswa - hanya field yang diperlukan (id, nama, nim, aktif)
  const mahasiswaData = [
    { id: 1, nama: "Danny Naufal", nim: "123456", aktif: true },
    { id: 2, nama: "Budi Santoso", nim: "654321", aktif: false },
    { id: 3, nama: "Siti Nurhaliza", nim: "111222", aktif: true },
  ];

  const mahasiswa = mahasiswaData.find(m => m.id === parseInt(id));

  if (!mahasiswa) {
    return (
      <Card>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Data mahasiswa tidak ditemukan</h2>
          <Button onClick={() => navigate("/admin/mahasiswa")}>Kembali ke Daftar Mahasiswa</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Detail Mahasiswa</h1>
        <Button onClick={() => navigate("/admin/mahasiswa")}>← Kembali</Button>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="font-medium text-gray-800">{mahasiswa.nama}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NIM</p>
            <p className="font-medium text-gray-800">{mahasiswa.nim}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-gray-800">{mahasiswa.aktif ? "Aktif" : "Tidak Aktif"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MahasiswaDetail;
