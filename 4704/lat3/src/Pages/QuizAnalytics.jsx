import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/atoms/Card";
import { QuizApi } from "../utils/apis/QuizApi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const QuizAnalytics = () => {
  const { quizId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [quizId]);

  const loadAnalytics = async () => {
    try {
      const data = await QuizApi.getStudentAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat analitik...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📊 Analitik Quiz</h1>
        <p className="text-purple-100">
          Dashboard performa dan analisis mendalam hasil quiz Anda
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Quiz</div>
              <div className="text-3xl font-bold text-blue-700">
                {analytics.totalQuizzesTaken}
              </div>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Rata-rata Nilai</div>
              <div className="text-3xl font-bold text-green-700">
                {analytics.averageScore}%
              </div>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Waktu</div>
              <div className="text-3xl font-bold text-purple-700">
                {analytics.totalTimeSpent}m
              </div>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Pass Rate</div>
              <div className="text-3xl font-bold text-yellow-700">
                {analytics.passRate}%
              </div>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quiz History Line Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📈 Riwayat Nilai Quiz
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.quizHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Nilai"
                dot={{ fill: "#3b82f6", r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Trend:</span> Nilai Anda menunjukkan{" "}
              <span className="font-bold text-blue-600">
                peningkatan konsisten
              </span>{" "}
              dari quiz pertama hingga terakhir! 🎉
            </p>
          </div>
        </Card>

        {/* Question Accuracy Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🎯 Akurasi Per Soal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.questionAccuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="question"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="accuracy"
                fill="#10b981"
                name="Akurasi (%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Insight:</span> Soal dengan akurasi
              tertinggi:{" "}
              <span className="font-bold text-green-600">
                {
                  analytics.questionAccuracy.reduce((max, item) =>
                    item.accuracy > max.accuracy ? item : max
                  ).question
                }
              </span>{" "}
              (
              {
                analytics.questionAccuracy.reduce((max, item) =>
                  item.accuracy > max.accuracy ? item : max
                ).accuracy
              }
              %)
            </p>
          </div>
        </Card>

        {/* Time Per Question Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ⏱️ Waktu Per Soal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.timePerQuestion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="question"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#6b7280" label={{ value: "Detik", angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="avgTime"
                fill="#f59e0b"
                name="Rata-rata Waktu (detik)"
                radius={[8, 8, 0, 0]}
              >
                {analytics.timePerQuestion.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.difficulty === "Easy"
                        ? "#10b981"
                        : entry.difficulty === "Medium"
                        ? "#f59e0b"
                        : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Insight:</span> Soal dengan waktu
              terlama:{" "}
              <span className="font-bold text-orange-600">
                {
                  analytics.timePerQuestion.reduce((max, item) =>
                    item.avgTime > max.avgTime ? item : max
                  ).question
                }
              </span>{" "}
              (
              {
                analytics.timePerQuestion.reduce((max, item) =>
                  item.avgTime > max.avgTime ? item : max
                ).avgTime
              }{" "}
              detik - Kesulitan:{" "}
              {
                analytics.timePerQuestion.reduce((max, item) =>
                  item.avgTime > max.avgTime ? item : max
                ).difficulty
              }
              )
            </p>
          </div>
        </Card>

        {/* Category Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📚 Performa Per Kategori
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="score"
                fill="#8b5cf6"
                name="Rata-rata Nilai"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {analytics.categoryPerformance.map((cat, index) => (
              <div key={index} className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">{cat.category}</div>
                <div className="text-xl font-bold text-purple-700">{cat.score}%</div>
                <div className="text-xs text-gray-500">{cat.attempts} attempts</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Accuracy Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📋 Detail Akurasi Soal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Soal</th>
                  <th className="px-4 py-2 text-center">Benar</th>
                  <th className="px-4 py-2 text-center">Salah</th>
                  <th className="px-4 py-2 text-center">Akurasi</th>
                </tr>
              </thead>
              <tbody>
                {analytics.questionAccuracy.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{item.question}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {item.correct}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                        {item.incorrect}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-semibold ${
                          item.accuracy >= 80
                            ? "text-green-600"
                            : item.accuracy >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Time Analysis */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ⏳ Analisis Waktu Pengerjaan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Soal</th>
                  <th className="px-4 py-2 text-center">Waktu (s)</th>
                  <th className="px-4 py-2 text-center">Kesulitan</th>
                </tr>
              </thead>
              <tbody>
                {analytics.timePerQuestion.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{item.question}</td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {item.avgTime}s
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : item.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          💡 Rekomendasi Pembelajaran
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-2">Fokus Perbaikan</h4>
            <p className="text-sm text-gray-700">
              Tingkatkan pemahaman pada soal dengan akurasi rendah, khususnya{" "}
              <strong>
                {
                  analytics.questionAccuracy.reduce((min, item) =>
                    item.accuracy < min.accuracy ? item : min
                  ).question
                }
              </strong>
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-2">Manajemen Waktu</h4>
            <p className="text-sm text-gray-700">
              Latih kecepatan pada soal yang memakan waktu lama. Target: kurangi waktu
              pengerjaan 15-20%.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold mb-2">Review Materi</h4>
            <p className="text-sm text-gray-700">
              Ulangi materi pada kategori dengan nilai terendah untuk meningkatkan
              pemahaman.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizAnalytics;
