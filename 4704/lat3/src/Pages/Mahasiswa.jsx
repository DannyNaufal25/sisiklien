import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { confirm } from "../utils/Swal2Helper.jsx";
import { toastSuccess } from "../utils/toastHelper.jsx";

const Mahasiswa = () => {
	const navigate = useNavigate();

	// state mahasiswa sesuai permintaan
	const [mahasiswa, setMahasiswa] = useState([
		{ id: 1, nama: "Danny Naufal", nim: "123456", aktif: true },
		{ id: 2, nama: "Budi Santoso", nim: "654321", aktif: false },
		{ id: 3, nama: "Siti Nurhaliza", nim: "111222", aktif: true },
	]);

	const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);

	// storeMahasiswa: tambah mahasiswa baru ke state
	const storeMahasiswa = (form) => {
		const newId = mahasiswa.length > 0 ? Math.max(...mahasiswa.map((m) => m.id)) + 1 : 1;
		setMahasiswa([...mahasiswa, { id: newId, ...form }]);
	};

	// updateMahasiswa: update mahasiswa dengan nim
	const updateMahasiswa = (nim, updated) => {
		setMahasiswa((prev) => prev.map((m) => (m.nim === nim ? { ...m, ...updated } : m)));
	};

	// deleteMahasiswa: delete berdasarkan nim
		const deleteMahasiswa = async (nim) => {
			const ok = await confirm('Hapus data', 'Yakin ingin menghapus data ini?');
			if (ok) {
				setMahasiswa((prev) => prev.filter((m) => m.nim !== nim));
				toastSuccess('Data mahasiswa dihapus');
			}
		};

	// open tambah modal
	const openAddModal = () => {
		setSelectedMahasiswa(null);
		setModalOpen(true);
	};

	// open edit modal berdasarkan nim
	const openEditModal = (nim) => {
		const found = mahasiswa.find((m) => m.nim === nim);
		if (found) {
			setSelectedMahasiswa(found);
			setModalOpen(true);
		}
	};

	// handleSubmit: jika selectedMahasiswa ada => update, jika tidak => store baru
	const handleSubmit = (form) => {
		if (selectedMahasiswa) {
			updateMahasiswa(selectedMahasiswa.nim, form);
		} else {
			storeMahasiswa(form);
		}
		// tutup modal dan reset selected
		setModalOpen(false);
		setSelectedMahasiswa(null);
	};

	const handleDelete = (nim) => {
		deleteMahasiswa(nim);
	};

	const handleDetail = (id) => {
		navigate(`/admin/mahasiswa/${id}`);
	};

	return (
		<>
			<Card>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold">Daftar Mahasiswa</h2>
					<Button onClick={openAddModal}>+ Tambah Data</Button>
				</div>

				<MahasiswaTable mahasiswa={mahasiswa} openEditModal={openEditModal} onDelete={handleDelete} onDetail={handleDetail} />
			</Card>

					<MahasiswaModal
						isModalOpen={isModalOpen}
						onClose={() => {
							setModalOpen(false);
							setSelectedMahasiswa(null);
						}}
						onSubmit={handleSubmit}
						selectedMahasiswa={selectedMahasiswa}
						mahasiswa={mahasiswa}
					/>
		</>
	);
};

export default Mahasiswa;

