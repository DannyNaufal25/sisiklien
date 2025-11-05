import React, { useEffect, useState } from "react";
import Form from "../Components/molecules/Form";
import Input from "../Components/atoms/Input";
import Label from "../Components/atoms/Label";
import Button from "../Components/atoms/Button";
import { toastError, toastSuccess } from "../utils/toastHelper.jsx";

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa, mahasiswa = [] }) => {
  const [form, setForm] = useState({ nama: "", nim: "", aktif: true });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({ nama: selectedMahasiswa.nama || "", nim: selectedMahasiswa.nim || "", aktif: !!selectedMahasiswa.aktif });
    } else {
      setForm({ nama: "", nim: "", aktif: true });
    }
  }, [selectedMahasiswa]);

  useEffect(() => {
    // optional: when modal closed reset form
    if (!isModalOpen && !selectedMahasiswa) {
      setForm({ nama: "", nim: "", aktif: true });
    }
  }, [isModalOpen, selectedMahasiswa]);

  const handleChange = (e) => {
    // support both synthetic events and manual change objects
    if (e && e.target) {
      const { name, value } = e.target;
      const parsed = value === "true" ? true : value === "false" ? false : value;
      setForm((f) => ({ ...f, [name]: parsed }));
    } else if (typeof e === "object") {
      setForm((f) => ({ ...f, ...e }));
    }
  };

  const handleSubmit = (ev) => {
    ev && ev.preventDefault && ev.preventDefault();
    // basic validation
    if (!form.nim || !form.nama) {
      toastError('NIM dan Nama wajib diisi');
      return;
    }

    // unique NIM validation: check if another mahasiswa (different id) uses same nim
    const duplicate = mahasiswa.find((m) => m.nim === form.nim && (!selectedMahasiswa || m.id !== selectedMahasiswa.id));
    if (duplicate) {
      toastError('NIM sudah digunakan oleh mahasiswa lain');
      return;
    }

    onSubmit(form);
    toastSuccess('Data berhasil disimpan');
    // keep modal controlled by parent; but reset form locally
    setForm({ nama: "", nim: "", aktif: true });
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
            <Label htmlFor="nama">Nama</Label>
            <Input type="text" name="nama" value={form.nama} onChange={(e) => handleChange(e)} placeholder="Masukkan Nama" required />
          </div>

          <div>
            <Label htmlFor="aktif">Status</Label>
            <div className="mt-1">
              <label className="inline-flex items-center mr-4">
                <input type="radio" name="aktif" value="true" checked={form.aktif === true} onChange={() => handleChange({ target: { name: "aktif", value: "true" } })} className="mr-2" />
                Aktif
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="aktif" value="false" checked={form.aktif === false} onChange={() => handleChange({ target: { name: "aktif", value: "false" } })} className="mr-2" />
                Tidak Aktif
              </label>
            </div>
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
