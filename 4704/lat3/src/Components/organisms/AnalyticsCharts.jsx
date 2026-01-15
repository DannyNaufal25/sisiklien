import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const WeeklyProgressChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="week" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="modulSelesai"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Modul Selesai"
          dot={{ fill: "#3b82f6", r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Target"
          dot={{ fill: "#10b981", r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Study Time by Category Bar Chart
export const StudyTimeCategoryChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="kategori" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
        <YAxis stroke="#6b7280" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="jam" fill="#3b82f6" name="Jam Belajar" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Module Status Pie Chart
export const ModuleStatusChart = ({ data }) => {
  const renderLabel = (entry) => {
    return `${entry.persentase}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="jumlah"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={85}
          innerRadius={0}
          label={renderLabel}
          labelLine={false}
          style={{ fontSize: '14px', fontWeight: 'bold' }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Accumulated Study Hours Area Chart
export const AccumulatedHoursChart = ({ data }) => {
  // Only show every 5th day for cleaner X-axis
  const filteredData = data.filter((_, index) => index % 5 === 0 || index === data.length - 1);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAkumulasi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="tanggal"
          stroke="#6b7280"
          ticks={filteredData.map(d => d.tanggal)}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
        />
        <YAxis stroke="#6b7280" />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const date = new Date(payload[0].payload.tanggal);
              return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                  <p className="font-semibold text-gray-800">
                    {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-sm text-blue-600">
                    Akumulasi: {payload[0].value} jam
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="akumulasi"
          stroke="#3b82f6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorAkumulasi)"
          name="Akumulasi Jam"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const SkillsRadarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="kategori" 
          stroke="#6b7280" 
          tick={{ fontSize: 11 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          stroke="#6b7280"
          tick={{ fontSize: 10 }}
          tickCount={6}
        />
        <Radar
          name="Nilai Saat Ini"
          dataKey="nilai"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
        <Radar
          name="Target"
          dataKey="target"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
          strokeDasharray="5 5"
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Daily Study Pattern Bar Chart
export const DailyPatternChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="hari" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="jam" fill="#8b5cf6" name="Jam Belajar" radius={[8, 8, 0, 0]} />
        <Bar dataKey="modul" fill="#ec4899" name="Modul Selesai" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
