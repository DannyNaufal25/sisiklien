import React from "react";
import { useAnalytics } from "../utils/hooks/useAnalytics";
import Card from "../Components/atoms/Card";
import {
  WeeklyProgressChart,
  StudyTimeCategoryChart,
  ModuleStatusChart,
  AccumulatedHoursChart,
  SkillsRadarChart,
  DailyPatternChart,
} from "../Components/organisms/AnalyticsCharts";
import {
  SummaryStatsCards,
  ContinueModulePanel,
  TodayTargetPanel,
  RecommendedModules,
  BookmarkedMaterials,
  AchievementBadges,
  WeeklySummaryCard,
} from "../Components/organisms/QuickActionPanels";

const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useAnalytics();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data analitik...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-800 font-semibold text-lg mb-2">
            Gagal memuat data analitik
          </p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const {
    weeklyProgress,
    studyTimeByCategory,
    moduleStatus,
    accumulatedHours,
    skillsAssessment,
    dailyPattern,
    summary,
  } = data;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          📊 Dashboard Analitik Pembelajaran
        </h1>
        <p className="text-blue-100">
          Selamat datang kembali, <span className="font-semibold">{user.nama || "User"}</span>! 
          Berikut adalah ringkasan progress belajar Anda.
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <SummaryStatsCards summary={summary} />

      {/* Quick Action Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Last Module */}
        <ContinueModulePanel modulTerakhir={summary.modulTerakhir} />
        
        {/* Today's Target */}
        <TodayTargetPanel summary={summary} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Recommendations & Bookmarks */}
        <div className="xl:col-span-1 space-y-6">
          {/* Weekly Summary */}
          <WeeklySummaryCard summary={summary} />
          
          {/* Today's Target - Mobile Only */}
          <div className="lg:hidden">
            <TodayTargetPanel summary={summary} />
          </div>
          
          {/* Recommended Modules */}
          <RecommendedModules modules={summary.rekomendasiModul} />
          
          {/* Bookmarked Materials */}
          <BookmarkedMaterials bookmarks={summary.bookmarkedModul} />
          
          {/* Achievement Badges */}
          <AchievementBadges badges={summary.achievementsBadges} />
        </div>

        {/* Right Column - Charts */}
        <div className="xl:col-span-2 space-y-6 max-w-4xl">
          {/* Weekly Progress Line Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Progress Belajar Per Minggu (4 Minggu Terakhir)
            </h3>
            <WeeklyProgressChart data={weeklyProgress} />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight:</span> Anda telah menyelesaikan{" "}
                <span className="font-bold text-blue-600">
                  {weeklyProgress[weeklyProgress.length - 1].modulSelesai} modul
                </span>{" "}
                minggu ini, {weeklyProgress[weeklyProgress.length - 1].modulSelesai >= 
                  weeklyProgress[weeklyProgress.length - 1].target 
                  ? "melebihi target! 🎉" 
                  : "terus tingkatkan! 💪"}
              </p>
            </div>
          </Card>

          {/* Study Time by Category Bar Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ⏰ Waktu Belajar Per Kategori Materi
            </h3>
            <StudyTimeCategoryChart data={studyTimeByCategory} />
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight:</span> Kategori dengan waktu belajar terbanyak:{" "}
                <span className="font-bold text-green-600">
                  {studyTimeByCategory.reduce((max, cat) => 
                    cat.jam > max.jam ? cat : max
                  ).kategori}
                </span>{" "}
                ({studyTimeByCategory.reduce((max, cat) => 
                  cat.jam > max.jam ? cat : max
                ).jam} jam)
              </p>
            </div>
          </Card>

          {/* Module Status Pie Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Distribusi Status Modul
            </h3>
            <ModuleStatusChart data={moduleStatus} />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {moduleStatus.map((status, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {status.jumlah}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{status.status}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Accumulated Study Hours Area Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Akumulasi Jam Belajar (30 Hari Terakhir)
            </h3>
            <AccumulatedHoursChart data={accumulatedHours} />
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight:</span> Total akumulasi jam belajar:{" "}
                <span className="font-bold text-purple-600">
                  {accumulatedHours[accumulatedHours.length - 1].akumulasi} jam
                </span>{" "}
                dalam 30 hari terakhir
              </p>
            </div>
          </Card>

          {/* Skills Assessment Radar Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎓 Penilaian Kemampuan Per Kategori
            </h3>
            <SkillsRadarChart data={skillsAssessment} />
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight:</span> Kategori dengan nilai tertinggi:{" "}
                <span className="font-bold text-yellow-600">
                  {skillsAssessment.reduce((max, skill) => 
                    skill.nilai > max.nilai ? skill : max
                  ).kategori}
                </span>{" "}
                ({skillsAssessment.reduce((max, skill) => 
                    skill.nilai > max.nilai ? skill : max
                  ).nilai}/100)
              </p>
            </div>
          </Card>

          {/* Daily Study Pattern */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📅 Pola Belajar Harian (Seminggu Terakhir)
            </h3>
            <DailyPatternChart data={dailyPattern} />
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight:</span> Hari dengan aktivitas belajar tertinggi:{" "}
                <span className="font-bold text-indigo-600">
                  {dailyPattern.reduce((max, day) => 
                    day.jam > max.jam ? day : max
                  ).hari}
                </span>{" "}
                ({dailyPattern.reduce((max, day) => 
                    day.jam > max.jam ? day : max
                  ).jam} jam)
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Message */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="text-center py-4">
          <p className="text-gray-700 font-medium">
            💡 <span className="font-semibold">Tips:</span> Konsistensi adalah kunci! Coba pertahankan 
            streak belajar Anda selama <span className="font-bold text-green-600">{summary.streakHari + 3} hari</span> berturut-turut 
            untuk mendapatkan badge baru!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
