import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import usersData from "../data/users.json";
import { toastSuccess, toastError } from "../utils/toastHelper.jsx";
import { useAuthStateContext } from "../utils/contexts/AuthContext";

const Login = () => {
	const { user, setUser } = useAuthStateContext();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Redirect jika sudah login
	if (user) {
		return <Navigate to="/admin/dashboard" replace />;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		
		try {
			// Validasi dengan data dummy
			const foundUser = usersData.find(
				(u) => u.username === username && u.password === password
			);
			
			if (foundUser) {
				// Simpan data user ke context (otomatis ke localStorage juga)
				setUser({
					id: foundUser.id,
					username: foundUser.username,
					nama: foundUser.nama,
					role: foundUser.role,
					permission: foundUser.permission,
					progress: foundUser.progress
				});
				
				toastSuccess("Login berhasil!");
				
				// Beri waktu sebentar untuk context update
				setTimeout(() => {
					navigate("/admin/dashboard");
				}, 100);
			} else {
				setError("Username atau password salah!");
				toastError("Username atau password salah!");
			}
		} catch (err) {
			setError("Terjadi kesalahan saat login");
			toastError(err.message || "Terjadi kesalahan saat login");
		}
	};

	return (
		<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
			<h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
			{error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						required
						placeholder="Masukan Username"
						className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus-blue-300"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						placeholder="Masukan Password"
						className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus-blue-300"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
					<div className="flex items-center justify-between">
						<label className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								name="remember"
								className="mr-2 rounded"
								checked={remember}
								onChange={() => setRemember(!remember)}
							/>
							<span className="text-sm text-gray-700">Ingat saya</span>
						</label>
						<a href="#" className="text-sm text-blue-600 hover:underline">Lupa password?</a>
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mt-2"
					>
						Submit
					</button>
				</form>
			<p className="mt-4 text-center text-sm text-gray-600">
				Belum punya akun? <a href="#" className="text-blue-500 hover:underline">Daftar</a>
			</p>
		</div>
	);
};

export default Login;
