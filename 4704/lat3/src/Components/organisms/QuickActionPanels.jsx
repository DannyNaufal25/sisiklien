import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../atoms/Card";

// Summary Statistics Cards
export const SummaryStatsCards = ({ summary }) => {
  const stats = [
    {
      label: "Total Modul",
      value: summary.totalModul,
      icon: "📚",
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Modul Selesai",
      value: summary.modulSelesai,
      icon: "✅",
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Sedang Berjalan",
      value: summary.modulBerjalan,
      icon: "⏳",
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      label: "Poin Pencapaian",
      value: summary.poinPencapaian,
      icon: "⭐",
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Jam Belajar Total",
      value: `${summary.totalJamBelajar} jam`,
      icon: "⏰",
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      label: "Streak Belajar",
      value: `${summary.streakHari} hari`,
      icon: "🔥",
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className={`${stat.bgColor} p-3 rounded-lg text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Continue Last Module Panel
export const ContinueModulePanel = ({ modulTerakhir }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="text-sm font-medium opacity-90 mb-1">Lanjutkan Belajar</div>
          <h3 className="text-xl font-bold mb-2">{modulTerakhir.judul}</h3>
          <div className="flex items-center space-x-4 text-sm opacity-90">
            <span className="flex items-center">
              <span className="mr-1">📁</span> {modulTerakhir.kategori}
            </span>
            <span className="flex items-center">
              <span className="mr-1">📊</span> {modulTerakhir.progress}% selesai
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div
                style={{ width: `${modulTerakhir.progress}%` }}
                className="bg-white h-2 rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/kelas`)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap"
        >
          Lanjutkan →
        </button>
      </div>
    </Card>
  );
};

// Today's Target Progress
export const TodayTargetPanel = ({ summary }) => {
  const progress = (summary.progressTargetHariIni / summary.targetHariIni) * 100;
  const isComplete = summary.progressTargetHariIni >= summary.targetHariIni;

  return (
    <Card className={isComplete ? "bg-green-50 border-green-200" : "bg-gray-50"}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Target Hari Ini</h3>
        <span className={`text-2xl ${isComplete ? "animate-bounce" : ""}`}>
          {isComplete ? "🎉" : "🎯"}
        </span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-blue-600">
            {summary.progressTargetHariIni}
          </span>
          <span className="text-gray-600 ml-1">/ {summary.targetHariIni} modul</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          style={{ width: `${Math.min(progress, 100)}%` }}
          className={`h-3 rounded-full transition-all duration-300 ${
            isComplete ? "bg-green-500" : "bg-blue-600"
          }`}
        ></div>
      </div>
      {isComplete ? (
        <p className="text-sm text-green-600 font-medium">
          ✨ Target hari ini tercapai! Luar biasa!
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Tetap semangat! {summary.targetHariIni - summary.progressTargetHariIni} modul lagi untuk mencapai target.
        </p>
      )}
    </Card>
  );
};

// Recommended Modules
export const RecommendedModules = ({ modules }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "pemula":
        return "bg-green-100 text-green-700";
      case "menengah":
        return "bg-yellow-100 text-yellow-700";
      case "lanjutan":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📌 Rekomendasi Modul Berikutnya
      </h3>
      <div className="space-y-3">
        {modules.map((modul, index) => (
          <div
            key={modul.id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={() => navigate(`/admin/kelas`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg font-semibold text-gray-700">
                    {index + 1}. {modul.judul}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <span className="mr-1">📁</span> {modul.kategori}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-1">⏱️</span> {modul.estimasiWaktu}
                  </span>
                </div>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                    modul.tingkatKesulitan
                  )}`}
                >
                  {modul.tingkatKesulitan}
                </span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm ml-2">
                Mulai →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Bookmarked Materials
export const BookmarkedMaterials = ({ bookmarks }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔖 Materi yang Di-bookmark
      </h3>
      <div className="space-y-2">
        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Belum ada materi yang di-bookmark
          </p>
        ) : (
          bookmarks.map((modul) => (
            <div
              key={modul.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              onClick={() => navigate(`/admin/kelas`)}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{modul.judul}</div>
                <div className="text-sm text-gray-600 flex items-center mt-1">
                  <span className="mr-1">📁</span> {modul.kategori}
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Buka →
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};


export const AchievementBadges = ({ badges }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🏆 Pencapaian & Badge
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
              badge.earned
                ? "bg-yellow-50 border-yellow-400 hover:shadow-md"
                : "bg-gray-50 border-gray-200 opacity-50"
            }`}
          >
            <div className="text-3xl mb-2">
              {badge.earned ? "🏅" : "🔒"}
            </div>
            <div className="font-semibold text-sm text-gray-800 mb-1">
              {badge.nama}
            </div>
            <div className="text-xs text-gray-600">{badge.deskripsi}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Weekly Summary Card
export const WeeklySummaryCard = ({ summary }) => {
  return (
    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
      <h3 className="text-lg font-semibold mb-4">📊 Ringkasan Minggu Ini</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-3xl font-bold mb-1">{summary.jamBelajarMingguIni}</div>
          <div className="text-sm opacity-90">Jam Belajar</div>
        </div>
        <div>
          <div className="text-3xl font-bold mb-1">{summary.modulBerjalan}</div>
          <div className="text-sm opacity-90">Modul Aktif</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-purple-400">
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">Rata-rata per hari</span>
          <span className="font-semibold">
            {(summary.jamBelajarMingguIni / 7).toFixed(1)} jam
          </span>
        </div>
      </div>
    </Card>
  );
};
