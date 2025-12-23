import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { confirm } from "../utils/Swal2Helper.jsx";
import { toastError } from "../utils/toastHelper.jsx";
import { useAuthStateContext } from "../utils/contexts/AuthContext";
import { useMahasiswa, useStoreMahasiswa, useUpdateMahasiswa, useDeleteMahasiswa } from "../utils/hooks/UseMahasiswa";
import { getAllKelas } from "../utils/apis/KelasApi";
import { getAllMataKuliah } from "../utils/apis/MataKuliahApi";

const Mahasiswa = () => {
	const navigate = useNavigate();
	const { user } = useAuthStateContext();

	// Pagination states
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [sortBy, setSortBy] = useState("nama");
	const [sortOrder, setSortOrder] = useState("asc");
	const [search, setSearch] = useState("");

	// Data tambahan untuk hitung SKS
	const [kelas, setKelas] = useState([]);
	const [mataKuliah, setMataKuliah] = useState([]);

	// React Query hooks with query params
	const { 
		data: result = { data: [], total: 0 }, 
		isLoading: loading 
	} = useMahasiswa({
		q: search,
		_sort: sortBy,
		_order: sortOrder,
		_page: page,
		_limit: limit,
	});

	const mahasiswa = result.data;
	const totalCount = result.total;
	const totalPages = Math.ceil(totalCount / limit);

	const { mutate: store } = useStoreMahasiswa();
	const { mutate: update } = useUpdateMahasiswa();
	const { mutate: remove } = useDeleteMahasiswa();

	// state modal
	const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		setTimeout(() => fetchKelasData(), 500);
	}, []);

	const fetchKelasData = async () => {
		const [resKelas, resMataKuliah] = await Promise.all([
			getAllKelas(),
			getAllMataKuliah(),
		]);
		setKelas(resKelas.data);
		setMataKuliah(resMataKuliah.data);
	};

	// Fungsi untuk menghitung total SKS mahasiswa
	const getTotalSks = (mhsId) => {
		return kelas
			.filter(k => k.mahasiswa_ids.includes(mhsId))
			.map(k => mataKuliah.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
			.reduce((a, b) => a + b, 0);
	};

	// open tambah modal
	const openAddModal = () => {
		setSelectedMahasiswa(null);
		setModalOpen(true);
	};

	// open edit modal berdasarkan id
	const openEditModal = (id) => {
		const found = mahasiswa.find((m) => m.id === id);
		if (found) {
			setSelectedMahasiswa(found);
			setModalOpen(true);
		}
	};

	// handleSubmit: jika selectedMahasiswa ada => update, jika tidak => store baru
	const handleSubmit = (form) => {
		if (selectedMahasiswa) {
			// Validasi dengan confirm
			confirm("Update data", "Yakin ingin mengupdate data ini?").then((ok) => {
				if (ok) {
					update({ id: selectedMahasiswa.id, data: form });
					setModalOpen(false);
					setSelectedMahasiswa(null);
				}
			});
		} else {
			// Cek NIM duplikat
			const exists = mahasiswa.find((m) => m.nim === form.nim);
			if (exists) {
				toastError("NIM sudah terdaftar!");
				return;
			}
			store(form);
			setModalOpen(false);
			setSelectedMahasiswa(null);
		}
	};

	const handleDelete = (id) => {
		confirm("Hapus data", "Yakin ingin menghapus data ini?").then((ok) => {
			if (ok) {
				remove(id);
			}
		});
	};

	const handleDetail = (id) => {
		navigate(`/admin/mahasiswa/${id}`);
	};

	// Pagination handlers
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
	const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

	return (
		<>
			<Card>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold">Daftar Mahasiswa</h2>
					{user?.permission?.includes("mahasiswa.create") && (
						<Button onClick={openAddModal}>+ Tambah Data</Button>
					)}
				</div>

				{/* Search, Sort, and Filter Controls */}
				<div className="flex flex-wrap gap-2 mb-4">
					{/* Search */}
					<input
						type="text"
						placeholder="Cari nama/NIM..."
						className="border px-3 py-2 rounded flex-grow"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>

					{/* Sort By Field */}
					<select
						value={sortBy}
						onChange={(e) => {
							setSortBy(e.target.value);
							setPage(1);
						}}
						className="border px-3 py-2 rounded"
					>
						<option value="nama">Sort by Nama</option>
						<option value="nim">Sort by NIM</option>
					</select>

					{/* Sort Order */}
					<select
						value={sortOrder}
						onChange={(e) => {
							setSortOrder(e.target.value);
							setPage(1);
						}}
						className="border px-3 py-2 rounded"
					>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>

					{/* Per Page Limit */}
					<select
						value={limit}
						onChange={(e) => {
							setLimit(Number(e.target.value));
							setPage(1);
						}}
						className="border px-3 py-2 rounded"
					>
						<option value="5">5 per halaman</option>
						<option value="10">10 per halaman</option>
						<option value="20">20 per halaman</option>
						<option value="50">50 per halaman</option>
					</select>
				</div>

				{loading ? (
					<div className="text-center py-8">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
						<p className="mt-2 text-gray-600">Loading data...</p>
					</div>
				) : (
					user?.permission?.includes("mahasiswa.read") ? (
						<>
							<MahasiswaTable 
								mahasiswa={mahasiswa} 
								openEditModal={openEditModal} 
								onDelete={handleDelete} 
								onDetail={handleDetail}
								canUpdate={user?.permission?.includes("mahasiswa.update")}
								canDelete={user?.permission?.includes("mahasiswa.delete")}
								isLoading={loading}
								getTotalSks={getTotalSks}
							/>

							{/* Pagination Controls */}
							<div className="flex justify-between items-center mt-4">
								<p className="text-sm text-gray-600">
									Halaman {page} dari {totalPages} | Total: {totalCount} data
								</p>
								<div className="flex gap-2">
									<button
										className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
										onClick={handlePrev}
										disabled={page === 1}
									>
										← Prev
									</button>
									<span className="px-4 py-2 bg-blue-600 text-white rounded">
										{page}
									</span>
									<button
										className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
										onClick={handleNext}
										disabled={page === totalPages || totalPages === 0}
									>
										Next →
									</button>
								</div>
							</div>
						</>
					) : (
						<div className="text-center py-8 text-gray-600">
							Anda tidak memiliki akses untuk melihat data mahasiswa
						</div>
					)
				)}
			</Card>

			{user?.permission?.includes("mahasiswa.create") || user?.permission?.includes("mahasiswa.update") ? (
				<MahasiswaModal
					isModalOpen={isModalOpen}
					onClose={() => {
						setModalOpen(false);
						setSelectedMahasiswa(null);
					}}
					onSubmit={handleSubmit}
					selectedMahasiswa={selectedMahasiswa}
				/>
			) : null}
		</>
	);
};

export default Mahasiswa;

