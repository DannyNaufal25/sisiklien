import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import { getMahasiswa } from "../utils/apis/MahasiswaApi";
import { getAllKelas } from "../utils/apis/KelasApi";
import { getAllMataKuliah } from "../utils/apis/MataKuliahApi";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resMahasiswa, resKelas, resMataKuliah] = await Promise.all([
        getMahasiswa(id),
        getAllKelas(),
        getAllMataKuliah(),
      ]);
      setMahasiswa(resMahasiswa.data);
      setKelas(resKelas.data);
      setMataKuliah(resMataKuliah.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKelasMahasiswa = () => {
    return kelas.filter(k => k.mahasiswa_ids.includes(id));
  };

  const getTotalSks = () => {
    return getKelasMahasiswa()
      .map(k => mataKuliah.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </Card>
    );
  }

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

  const kelasMahasiswa = getKelasMahasiswa();
  const totalSks = getTotalSks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Detail Mahasiswa</h1>
        <Button onClick={() => navigate("/admin/mahasiswa")}>← Kembali</Button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Informasi Mahasiswa</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="font-medium text-gray-800">{mahasiswa.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NIM</p>
            <p className="font-medium text-gray-800">{mahasiswa.nim}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Max SKS</p>
            <p className="font-medium text-gray-800">{mahasiswa.max_sks || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">SKS Terpakai</p>
            <p className="font-medium text-gray-800">{totalSks} SKS</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">SKS Tersisa</p>
            <p className="font-medium text-gray-800">{(mahasiswa.max_sks || 0) - totalSks} SKS</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Kelas yang Diambil</h2>
        {kelasMahasiswa.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Mata Kuliah</th>
                  <th className="py-2 px-4 text-center">SKS</th>
                  <th className="py-2 px-4 text-left">Dosen</th>
                </tr>
              </thead>
              <tbody>
                {kelasMahasiswa.map((k, index) => {
                  const matkul = mataKuliah.find(mk => mk.id === k.mata_kuliah_id);
                  return (
                    <tr key={k.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{matkul?.name || "-"}</td>
                      <td className="py-2 px-4 text-center">{matkul?.sks || 0}</td>
                      <td className="py-2 px-4">-</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">Belum mengambil kelas apapun.</p>
        )}
      </Card>
    </div>
  );
};

export default MahasiswaDetail;
