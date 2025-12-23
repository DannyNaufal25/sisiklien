import React, { useEffect, useState } from "react";
import Form from "../Components/molecules/Form";
import Input from "../Components/atoms/Input";
import Label from "../Components/atoms/Label";
import Button from "../Components/atoms/Button";
import { toastError } from "../utils/toastHelper.jsx";

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa }) => {
  const [form, setForm] = useState({ name: "", nim: "", max_sks: 0 });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({ 
        name: selectedMahasiswa.name || "", 
        nim: selectedMahasiswa.nim || "", 
        max_sks: selectedMahasiswa.max_sks || 0 
      });
    } else {
      setForm({ name: "", nim: "", max_sks: 0 });
    }
  }, [selectedMahasiswa]);

  useEffect(() => {
    // optional: when modal closed reset form
    if (!isModalOpen && !selectedMahasiswa) {
      setForm({ name: "", nim: "", max_sks: 0 });
    }
  }, [isModalOpen, selectedMahasiswa]);

  const handleChange = (e) => {
    // support both synthetic events and manual change objects
    if (e && e.target) {
      const { name, value } = e.target;
      setForm((f) => ({ ...f, [name]: value }));
    } else if (typeof e === "object") {
      setForm((f) => ({ ...f, ...e }));
    }
  };

  const handleSubmit = (ev) => {
    ev && ev.preventDefault && ev.preventDefault();
    // basic validation
    if (!form.nim || !form.name || !form.max_sks) {
      toastError('NIM, Nama, dan Max SKS wajib diisi');
      return;
    }

    onSubmit(form);
    // keep modal controlled by parent; but reset form locally
    setForm({ name: "", nim: "", max_sks: 0 });
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
        </div>

        <Form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={(e) => handleChange(e)}
              placeholder="Masukkan NIM"
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Nama</Label>
            <Input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={(e) => handleChange(e)} 
              placeholder="Masukkan Nama" 
              required 
            />
          </div>

          <div>
            <Label htmlFor="max_sks">Max SKS</Label>
            <Input
              type="number"
              name="max_sks"
              value={form.max_sks}
              onChange={(e) => handleChange(e)}
              placeholder="Masukkan Max SKS"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MahasiswaModal;
