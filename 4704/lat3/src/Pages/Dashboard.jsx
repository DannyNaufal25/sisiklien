import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Card from "../Components/atoms/Card";
import { modulList } from "../data/modulData";
import { useChartData } from "../utils/hooks/useChart";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const { data = {}, isLoading } = useChartData();

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data;

  // Calculate progress
  const totalModul = modulList.length;
  const completedModul = user.progress ? user.progress.length : 0;
  const remainingModul = totalModul - completedModul;
  const progressPercentage = totalModul > 0 ? Math.round((completedModul / totalModul) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Selamat Datang, {user.nama || "User"}!</h2>
        <p className="text-gray-600 mb-2">Username: <span className="font-medium">{user.username}</span></p>
        <p className="text-gray-600">Role: <span className="font-medium capitalize">{user.role}</span></p>
      </Card>

      {/* Progress Section */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Progress Belajar</h3>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Total Progress</span>
            <span className="text-sm font-semibold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              style={{ width: `${progressPercentage}%` }} 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{completedModul} dari {totalModul} modul selesai</span>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalModul}</div>
            <div className="text-gray-600">Total Modul</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedModul}</div>
            <div className="text-gray-600">Modul Selesai</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{remainingModul}</div>
            <div className="text-gray-600">Modul Tersisa</div>
          </div>
        </Card>
      </div>

      {/* Continue Learning Button */}
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Siap untuk belajar?</h3>
          <button
            onClick={() => navigate("/admin/kelas")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Lanjutkan Belajar
          </button>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Mahasiswa per Fakultas */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Mahasiswa per Fakultas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={students}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faculty" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Rasio Gender */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Rasio Gender Mahasiswa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={genderRatio} 
                dataKey="count" 
                nameKey="gender" 
                cx="50%" 
                cy="50%" 
                outerRadius={80}
                label
              >
                {genderRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart - Tren Pendaftaran */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Tren Pendaftaran Mahasiswa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart - Distribusi Nilai */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Distribusi Nilai per Jurusan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={gradeDistribution}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
              <Radar name="C" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Area Chart - Pangkat Dosen */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Pangkat Dosen</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lecturerRanks}>
              <defs>
                <linearGradient id="colorLecturer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="rank" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorLecturer)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
