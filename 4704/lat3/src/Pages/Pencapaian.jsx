import React, { useState, useEffect } from "react";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import { AchievementsApi } from "../utils/apis/AchievementsApi";
import {
  rarityConfig,
  categoryLabels,
} from "../data/achievementsData";

const Pencapaian = () => {
  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [achievementStats, setAchievementStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [activeTab, setActiveTab] = useState("overview"); // overview, achievements, paths
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [stats, achievementsData, pathsData, achStats] = await Promise.all([
        AchievementsApi.getUserStats(),
        AchievementsApi.getAchievements("all"),
        AchievementsApi.getLearningPaths(),
        AchievementsApi.getAchievementStats(),
      ]);
      setUserStats(stats);
      setAchievements(achievementsData);
      setLearningPaths(pathsData);
      setAchievementStats(achStats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filterAchievements = () => {
    let filtered = achievements;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (selectedRarity !== "all") {
      filtered = filtered.filter((a) => a.rarity === selectedRarity);
    }

    return filtered;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: "✅",
      "in-progress": "🔄",
      locked: "🔒",
      available: "📖",
    };
    return icons[status] || "📖";
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700",
      "in-progress": "bg-blue-100 text-blue-700",
      locked: "bg-gray-100 text-gray-500",
      available: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat pencapaian...</p>
        </div>
      </div>
    );
  }

  const filteredAchievements = filterAchievements();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏆 Pencapaian & Progress</h1>
            <p className="text-yellow-100">
              Track progress Anda dan raih semua achievement!
            </p>
          </div>
          <div className="text-center bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-4xl font-bold">{userStats.level}</div>
            <div className="text-sm">Level</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "overview"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "achievements"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🏅 Achievements
        </button>
        <button
          onClick={() => setActiveTab("paths")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "paths"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🗺️ Learning Paths
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* User Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gray-800">
                {userStats.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Total Poin</div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-gray-800">
                {userStats.streak} hari
              </div>
              <div className="text-sm text-gray-600">Streak Saat Ini</div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-800">
                {userStats.modulesCompleted}
              </div>
              <div className="text-sm text-gray-600">Modul Selesai</div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-gray-800">
                {userStats.totalStudyHours} jam
              </div>
              <div className="text-sm text-gray-600">Total Belajar</div>
            </Card>
          </div>

          {/* Level Progress */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Progress ke Level {userStats.level + 1}
            </h3>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Level {userStats.level}</span>
                <span>
                  {userStats.totalPoints - userStats.currentLevelPoints} /{" "}
                  {userStats.nextLevelPoints - userStats.currentLevelPoints} XP
                </span>
                <span>Level {userStats.level + 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${
                      ((userStats.totalPoints - userStats.currentLevelPoints) /
                        (userStats.nextLevelPoints -
                          userStats.currentLevelPoints)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {userStats.nextLevelPoints - userStats.totalPoints} XP lagi untuk
              level berikutnya!
            </p>
          </Card>

          {/* Achievement Summary */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              📊 Ringkasan Achievement
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {achievementStats.unlocked}
                </div>
                <div className="text-xs text-gray-600">Terbuka</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {achievementStats.locked}
                </div>
                <div className="text-xs text-gray-600">Terkunci</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {achievementStats.percentage}%
                </div>
                <div className="text-xs text-gray-600">Completion</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {achievementStats.total}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </Card>

          {/* Recent Unlocked Achievements */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              🎉 Achievement Terbaru
            </h3>
            <div className="space-y-3">
              {achievements
                .filter((a) => a.unlocked)
                .sort(
                  (a, b) =>
                    new Date(b.unlockedDate) - new Date(a.unlockedDate)
                )
                .slice(0, 3)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500"
                  >
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">
                        +{achievement.points} XP
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(achievement.unlockedDate).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua
                  </button>
                  {Object.entries(categoryLabels).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {value.icon} {value.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelangkaan
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedRarity("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedRarity === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua
                  </button>
                  {Object.entries(rarityConfig).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedRarity(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedRarity === key
                          ? `${value.bgColor} ${value.textColor} border-2 ${value.borderColor}`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const rarity = rarityConfig[achievement.rarity];
              const category = categoryLabels[achievement.category];
              const progress = (achievement.progress / achievement.total) * 100;

              return (
                <Card
                  key={achievement.id}
                  className={`${
                    achievement.unlocked
                      ? `border-2 ${rarity.borderColor}`
                      : "opacity-60"
                  } transition-all hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`text-5xl ${
                        !achievement.unlocked && "grayscale"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span
                        className={`text-xs px-2 py-1 rounded ${rarity.bgColor} ${rarity.textColor} font-semibold`}
                      >
                        {rarity.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded bg-${category.color}-100 text-${category.color}-700`}
                      >
                        {category.icon} {category.label}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-lg text-gray-800 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!achievement.unlocked && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r from-${category.color}-400 to-${category.color}-600 h-2 rounded-full`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm font-semibold text-yellow-600">
                      +{achievement.points} XP
                    </span>
                    {achievement.unlocked ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span>✓</span> Unlocked
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <span>🔒</span> Locked
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600">
                Tidak ada achievement dengan filter ini
              </p>
            </div>
          )}
        </div>
      )}

      {/* Learning Paths Tab */}
      {activeTab === "paths" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {learningPaths.map((path) => {
              const pathProgress =
                (path.completedModules / path.totalModules) * 100;

              return (
                <Card key={path.id} className="overflow-hidden">
                  {/* Path Header */}
                  <div
                    className={`bg-gradient-to-r from-${path.color}-500 to-${path.color}-600 text-white p-6 -m-6 mb-6`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">
                          {path.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-4">
                          {path.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span>📚 {path.totalModules} modul</span>
                          <span>⏱️ {path.estimatedHours} jam</span>
                          <span>🎯 {path.difficulty}</span>
                        </div>
                      </div>
                      <div className="text-right bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="text-3xl font-bold">
                          {Math.round(pathProgress)}%
                        </div>
                        <div className="text-xs">Complete</div>
                      </div>
                    </div>

                    {/* Overall Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>
                          {path.completedModules} / {path.totalModules} modul
                          selesai
                        </span>
                      </div>
                      <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all"
                          style={{ width: `${pathProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Learning Path Journey Visualization */}
                  <div className="space-y-4">
                    {path.modules.map((module, index) => {
                      const isLastModule = index === path.modules.length - 1;

                      return (
                        <div key={module.id} className="relative">
                          {/* Connection Line */}
                          {!isLastModule && (
                            <div
                              className={`absolute left-6 top-16 w-0.5 h-full ${
                                module.status === "completed"
                                  ? `bg-${path.color}-500`
                                  : "bg-gray-300"
                              }`}
                              style={{ height: "calc(100% + 1rem)" }}
                            />
                          )}

                          {/* Module Card */}
                          <div className="flex gap-4">
                            {/* Status Icon */}
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 ${getStatusColor(
                                module.status
                              )} ${
                                module.status === "completed"
                                  ? `border-${path.color}-500 bg-${path.color}-100`
                                  : "border-gray-300 bg-white"
                              } z-10 flex-shrink-0`}
                            >
                              {getStatusIcon(module.status)}
                            </div>

                            {/* Module Info */}
                            <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-800">
                                    {module.title}
                                  </h4>
                                  <div className="text-sm text-gray-600 mt-1">
                                    ⏱️ {module.duration}
                                  </div>
                                </div>
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                                    module.status
                                  )}`}
                                >
                                  {module.status === "completed" &&
                                    "✅ Selesai"}
                                  {module.status === "in-progress" &&
                                    "🔄 Sedang Berjalan"}
                                  {module.status === "locked" && "🔒 Terkunci"}
                                  {module.status === "available" &&
                                    "📖 Tersedia"}
                                </span>
                              </div>

                              {/* Topics */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {module.topics.map((topic, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-white px-2 py-1 rounded border"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>

                              {/* Progress Bar for in-progress modules */}
                              {module.status === "in-progress" && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{module.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`bg-gradient-to-r from-${path.color}-400 to-${path.color}-600 h-2 rounded-full`}
                                      style={{ width: `${module.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Prerequisite */}
                              {module.prerequisite && module.status === "locked" && (
                                <div className="text-xs text-gray-500 mb-2">
                                  🔐 Selesaikan "{module.prerequisite}" terlebih
                                  dahulu
                                </div>
                              )}

                              {/* Completion Date */}
                              {module.completedDate && (
                                <div className="text-xs text-green-600 mb-2">
                                  ✓ Selesai pada{" "}
                                  {new Date(
                                    module.completedDate
                                  ).toLocaleDateString("id-ID")}
                                </div>
                              )}

                              {/* Action Button */}
                              <div className="flex gap-2">
                                {module.status === "in-progress" && (
                                  <Button className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
                                    Lanjutkan Belajar
                                  </Button>
                                )}
                                {module.status === "available" && (
                                  <Button className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700">
                                    Mulai Modul
                                  </Button>
                                )}
                                {module.status === "completed" && (
                                  <Button className="bg-gray-600 text-white text-sm px-4 py-2 rounded hover:bg-gray-700">
                                    Tinjau Kembali
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pencapaian;
