import React, { useState, useEffect } from "react";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import Input from "../Components/atoms/Input";
import Select from "../Components/atoms/Select";
import Label from "../Components/atoms/Label";
import { InstructorApi } from "../utils/apis/InstructorApi";
import { feedbackCategories } from "../data/instructorData";

const Instruktur = () => {
  const [activeTab, setActiveTab] = useState("analytics"); // analytics, content, feedback
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [studentPerformance, setStudentPerformance] = useState([]);
  const [strugglingStudents, setStrugglingStudents] = useState([]);
  const [studyTimeData, setStudyTimeData] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  
  // Content Management States
  const [contentAnalytics, setContentAnalytics] = useState([]);
  const [engagementStats, setEngagementStats] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    fileName: "",
    title: "",
    type: "video",
    file: null,
  });

  // Feedback States
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [
        classesData,
        studyTime,
        allContent,
        engStats,
        mediaData,
        allFeedback,
        fbStats,
      ] = await Promise.all([
        InstructorApi.getClasses(),
        InstructorApi.getStudyTimeAnalytics(),
        InstructorApi.getAllContentAnalytics(),
        InstructorApi.getContentEngagementStats(),
        InstructorApi.getUploadedMedia(),
        InstructorApi.getStudentFeedback(),
        InstructorApi.getFeedbackStats(),
      ]);

      setClasses(classesData);
      setStudyTimeData(studyTime);
      setContentAnalytics(allContent);
      setEngagementStats(engStats);
      setUploadedMedia(mediaData);
      setFeedbacks(allFeedback);
      setFeedbackStats(fbStats);

      if (classesData.length > 0) {
        loadClassData(classesData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = async (classId) => {
    try {
      const [summary, performance, struggling, distribution] =
        await Promise.all([
          InstructorApi.getAnalyticsSummary(classId),
          InstructorApi.getStudentPerformance(classId),
          InstructorApi.getStrugglingStudents(classId),
          InstructorApi.getScoreDistribution(classId),
        ]);

      const selectedClassData = classes.find((c) => c.id === classId);
      setSelectedClass(selectedClassData);
      setAnalyticsSummary(summary);
      setStudentPerformance(performance);
      setStrugglingStudents(struggling);
      setScoreDistribution(distribution);
    } catch (error) {
      console.error("Error loading class data:", error);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClassChange = (classId) => {
    loadClassData(parseInt(classId));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.fileName || !uploadForm.title) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await InstructorApi.uploadMedia({
        fileName: uploadForm.fileName,
        title: uploadForm.title,
        type: uploadForm.type,
        size: "Calculating...",
        thumbnail: `https://placehold.co/300x200/blue/white?text=${uploadForm.type.toUpperCase()}`,
      });

      alert("Media berhasil diupload!");
      setShowUploadModal(false);
      setUploadForm({ fileName: "", title: "", type: "video", file: null });

      // Reload media
      const mediaData = await InstructorApi.getUploadedMedia();
      setUploadedMedia(mediaData);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Gagal upload media");
    }
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    if (selectedRating !== "all") {
      filtered = filtered.filter((f) => f.rating === parseInt(selectedRating));
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: "bg-green-100 text-green-700",
      good: "bg-blue-100 text-blue-700",
      struggling: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getTrendIcon = (trend) => {
    const icons = {
      up: "📈",
      down: "📉",
      stable: "➡️",
    };
    return icons[trend] || "➡️";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredFeedbacks = filterFeedbacks();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">👨‍🏫 Dashboard Instruktur</h1>
        <p className="text-indigo-100">
          Kelola kelas dan monitor performa mahasiswa Anda
        </p>
      </div>

      {/* Class Selector */}
      <Card>
        <div className="flex items-center gap-4">
          <Label className="font-semibold">Pilih Kelas:</Label>
          <Select
            className="flex-1 max-w-md"
            value={selectedClass?.id || ""}
            onChange={(e) => handleClassChange(e.target.value)}
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.code} - {cls.name} ({cls.semester})
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "analytics"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📊 Analitik Kelas
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "content"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📚 Manajemen Konten
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "feedback"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          💬 Feedback Mahasiswa
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === "analytics" && analyticsSummary && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsSummary.totalStudents}
              </div>
              <div className="text-sm text-gray-600">Total Mahasiswa</div>
              <div className="text-xs text-green-600 mt-1">
                {analyticsSummary.activeRate}% aktif
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsSummary.averageScore}
              </div>
              <div className="text-sm text-gray-600">Rata-rata Nilai</div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsSummary.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Penyelesaian Modul</div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsSummary.totalStudyHours}
              </div>
              <div className="text-sm text-gray-600">Total Jam Belajar</div>
            </Card>
          </div>

          {/* Student Performance Distribution */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              📊 Distribusi Performa Mahasiswa
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {analyticsSummary.excellentStudents}
                </div>
                <div className="text-sm text-gray-600">Excellent</div>
                <div className="text-xs text-gray-500">(≥80)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {analyticsSummary.goodStudents}
                </div>
                <div className="text-sm text-gray-600">Good</div>
                <div className="text-xs text-gray-500">(65-79)</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">
                  {analyticsSummary.strugglingStudents}
                </div>
                <div className="text-sm text-gray-600">Struggling</div>
                <div className="text-xs text-gray-500">(&lt;65)</div>
              </div>
            </div>
          </Card>

          {/* Score Distribution Chart */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              📈 Distribusi Nilai
            </h3>
            <div className="space-y-3">
              {scoreDistribution.map((range) => (
                <div key={range.range}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{range.range}</span>
                    <span className="text-gray-600">
                      {range.count} mahasiswa ({range.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                      style={{ width: `${range.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Study Time Analytics */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              ⏱️ Analitik Waktu Belajar
            </h3>
            <div className="space-y-3">
              {studyTimeData.map((week) => (
                <div
                  key={week.week}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      {week.week}
                    </div>
                    <div className="text-sm text-gray-600">
                      Rata-rata: {week.averagePerStudent} jam/mahasiswa
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {week.totalHours} jam
                    </div>
                    <div className="text-xs text-gray-500">
                      Peak: {week.peakHours}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Struggling Students Alert */}
          {strugglingStudents.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-700 mb-2">
                    Mahasiswa yang Memerlukan Perhatian ({strugglingStudents.length})
                  </h3>
                  <div className="space-y-2">
                    {strugglingStudents.map((student) => (
                      <div
                        key={student.id}
                        className="bg-white p-3 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-gray-800">
                            {student.nama} ({student.nim})
                          </div>
                          <div className="text-sm text-gray-600">
                            Nilai: {student.averageScore} • Completion:{" "}
                            {student.moduleCompletion}% • {student.studyHours}{" "}
                            jam belajar
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                          <span className="text-xl">
                            {getTrendIcon(student.trend)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* All Students Performance Table */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              👥 Detail Performa Semua Mahasiswa
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      NIM
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Rata-rata
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Completion
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Jam Belajar
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentPerformance.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {student.nama}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.nim}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">
                        {student.averageScore}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {student.moduleCompletion}%
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {student.studyHours} jam
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xl">
                        {getTrendIcon(student.trend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* Upload Media Section */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                📤 Upload Media
              </h3>
              <Button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowUploadModal(true)}
              >
                + Upload Media Baru
              </Button>
            </div>

            {/* Uploaded Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {uploadedMedia.map((media) => (
                <div
                  key={media.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  <img
                    src={media.thumbnail}
                    alt={media.fileName}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {media.type === "video" ? "🎥" : "📄"}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {media.type}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-gray-800 mb-1 truncate">
                      {media.fileName}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {media.size} •{" "}
                      {new Date(media.uploadDate).toLocaleDateString("id-ID")}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">
                        Edit
                      </Button>
                      <Button className="flex-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Content Analytics */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              📊 Analitik Konten
            </h3>

            {/* Engagement Summary */}
            {engagementStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {engagementStats.averageEngagement.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Rata-rata Engagement
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {contentAnalytics.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Konten</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {contentAnalytics.reduce((sum, c) => sum + c.views, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
              </div>
            )}

            {/* Most Engaging Content */}
            {engagementStats && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  🔥 Konten Paling Engaging
                </h4>
                <div className="space-y-2">
                  {engagementStats.mostEngaging.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {content.type === "video" ? "🎥" : "📄"}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {content.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {content.views} views • {content.completions}{" "}
                            completions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {content.engagementRate}%
                        </div>
                        <div className="text-xs text-gray-600">engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Least Engaging Content */}
            {engagementStats && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  ⚠️ Konten yang Perlu Ditingkatkan
                </h4>
                <div className="space-y-2">
                  {engagementStats.leastEngaging.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {content.type === "video" ? "🎥" : "📄"}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {content.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {content.views} views • {content.completions}{" "}
                            completions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">
                          {content.engagementRate}%
                        </div>
                        <div className="text-xs text-gray-600">engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Detailed Content Table */}
          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              📋 Detail Semua Konten
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Views
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Completions
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Engagement
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Likes
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Downloads
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contentAnalytics.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <span>
                            {content.type === "video" ? "🎥" : "📄"}
                          </span>
                          {content.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {content.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {content.views}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {content.completions}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-sm font-semibold ${
                            content.engagementRate >= 70
                              ? "text-green-600"
                              : content.engagementRate >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {content.engagementRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        👍 {content.likes} / 👎 {content.dislikes}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {content.downloads}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          {/* Feedback Stats */}
          {feedbackStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-2xl font-bold text-gray-800">
                  {feedbackStats.total}
                </div>
                <div className="text-sm text-gray-600">Total Feedback</div>
              </Card>

              <Card className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-gray-800">
                  {feedbackStats.averageRating}
                </div>
                <div className="text-sm text-gray-600">Rata-rata Rating</div>
              </Card>

              <Card className="text-center">
                <div className="text-3xl mb-2">👍</div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(
                    ((feedbackStats.byRating[5] + feedbackStats.byRating[4]) /
                      feedbackStats.total) *
                      100
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Positive Feedback</div>
              </Card>
            </div>
          )}

          {/* Rating Distribution */}
          {feedbackStats && (
            <Card>
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                ⭐ Distribusi Rating
              </h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = feedbackStats.byRating[rating];
                  const percentage = (count / feedbackStats.total) * 100;
                  return (
                    <div key={rating}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1">
                          {"⭐".repeat(rating)}
                        </span>
                        <span className="text-gray-600">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rating >= 4
                              ? "bg-green-500"
                              : rating === 3
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <div className="flex flex-wrap gap-4">
              <div>
                <Label className="block mb-2">Filter by Rating</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRating("all")}
                    className={`px-4 py-2 rounded text-sm ${
                      selectedRating === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating.toString())}
                      className={`px-4 py-2 rounded text-sm ${
                        selectedRating === rating.toString()
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {"⭐".repeat(rating)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block mb-2">Filter by Category</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded text-sm ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua
                  </button>
                  {feedbackCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded text-sm ${
                        selectedCategory === cat.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Feedback List */}
          <div className="space-y-3">
            {filteredFeedbacks.map((feedback) => {
              const category = feedbackCategories.find(
                (c) => c.id === feedback.category
              );
              return (
                <Card key={feedback.id}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        {feedback.studentName.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {feedback.studentName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {feedback.contentTitle}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-yellow-500">
                            {"⭐".repeat(feedback.rating)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(feedback.date).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{feedback.comment}</p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-3 py-1 rounded bg-${category?.color}-100 text-${category?.color}-700`}
                        >
                          {category?.icon} {category?.label}
                        </span>
                        <div className="text-sm text-gray-600">
                          👍 {feedback.helpful} orang merasa helpful
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600">
                Tidak ada feedback dengan filter ini
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              📤 Upload Media Baru
            </h3>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <Label>Nama File *</Label>
                <Input
                  type="text"
                  value={uploadForm.fileName}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, fileName: e.target.value })
                  }
                  placeholder="contoh: intro-react.mp4"
                  required
                />
              </div>

              <div>
                <Label>Judul *</Label>
                <Input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
                  }
                  placeholder="Judul yang deskriptif"
                  required
                />
              </div>

              <div>
                <Label>Tipe Media</Label>
                <Select
                  value={uploadForm.type}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, type: e.target.value })
                  }
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Image</option>
                </Select>
              </div>

              <div>
                <Label>Upload File (UI Only)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop file or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Max file size: 500MB • Supported: MP4, PDF, PNG, JPG
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => setShowUploadModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload Media
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Instruktur;
