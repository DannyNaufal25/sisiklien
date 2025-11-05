import React, { useState } from "react";
import Sidebar from "../Components/organisms/Sidebar";
import Header from "../Components/organisms/Header";
import Footer from "../Components/organisms/Footer";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import Modal from "../Components/organisms/Modal";
import Form from "../Components/molecules/Form";
import Input from "../Components/atoms/Input";
import Label from "../Components/atoms/Label";

const Admin = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [mahasiswa, setMahasiswa] = useState([
    { nama: "Danny Naufal", nim: "123456" },
    { nama: "Budi Santoso", nim: "654321" },
  ]);
  const [form, setForm] = useState({ nama: "", nim: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIdx !== null) {
      const updated = [...mahasiswa];
      updated[editIdx] = form;
      setMahasiswa(updated);
      setEditIdx(null);
    } else {
      setMahasiswa([...mahasiswa, form]);
    }
    setForm({ nama: "", nim: "" });
    setModalOpen(false);
  };

  const handleEdit = (idx) => {
    setForm(mahasiswa[idx]);
    setEditIdx(idx);
    setModalOpen(true);
  };

  const handleDelete = async (idx) => {
  const { confirm } = await import("../utils/Swal2Helper.jsx");
    const ok = await confirm('Hapus data', 'Yakin ingin menghapus data ini?');
    if (ok) {
      setMahasiswa(mahasiswa.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-x-auto">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Daftar Mahasiswa</h2>
              <Button onClick={() => { setModalOpen(true); setEditIdx(null); }}>
                + Tambah Data
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">NIM</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mahasiswa.map((mhs, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2 align-middle">{mhs.nama}</td>
                      <td className="px-4 py-2 align-middle">{mhs.nim}</td>
                      <td className="px-4 py-2 align-middle">
                        <div className="flex justify-center gap-2">
                          <Button variant="edit" onClick={() => handleEdit(idx)}>
                            Edit
                          </Button>
                          <Button variant="delete" onClick={() => handleDelete(idx)}>
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditIdx(null); }}>
            <h3 className="text-lg font-semibold mb-4">{editIdx !== null ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}</h3>
            <Form onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  name="nim"
                  value={form.nim}
                  onChange={handleChange}
                  placeholder="Masukkan NIM"
                  required
                />
              </div>
              <Button type="submit" className="mt-2 w-full">
                {editIdx !== null ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </Form>
          </Modal>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Admin;
