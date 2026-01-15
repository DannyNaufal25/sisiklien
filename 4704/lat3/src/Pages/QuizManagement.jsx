import React, { useState, useEffect } from "react";
import { QuizApi } from "../utils/apis/QuizApi";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import { useNavigate } from "react-router-dom";

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, published, draft
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await QuizApi.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus quiz ini?")) {
      try {
        await QuizApi.deleteQuiz(id);
        loadQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filter === "all") return true;
    return quiz.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📝 Manajemen Quiz</h1>
        <p className="text-purple-100">
          Kelola quiz, buat soal baru, dan lihat hasil pengerjaan
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2">
          <Button
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("all")}
          >
            Semua ({quizzes.length})
          </Button>
          <Button
            className={`px-4 py-2 rounded-lg ${
              filter === "published"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("published")}
          >
            Published ({quizzes.filter((q) => q.status === "published").length})
          </Button>
          <Button
            className={`px-4 py-2 rounded-lg ${
              filter === "draft"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("draft")}
          >
            Draft ({quizzes.filter((q) => q.status === "draft").length})
          </Button>
        </div>

        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => navigate("/admin/quiz/create")}
        >
          <span className="text-xl">+</span> Buat Quiz Baru
        </Button>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  quiz.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {quiz.status === "published" ? "✓ Published" : "✎ Draft"}
              </span>
              <span className="text-sm text-gray-500">{quiz.questions.length} soal</span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-gray-600">Durasi</div>
                <div className="font-semibold text-blue-700">{quiz.durasi} menit</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600">Nilai Lulus</div>
                <div className="font-semibold text-green-700">{quiz.nilaiLulus}%</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={() => navigate(`/admin/quiz/${quiz.id}/preview`)}
              >
                Preview
              </Button>
              <Button
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                className="px-4 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                onClick={() => handleDelete(quiz.id)}
              >
                🗑️
              </Button>
            </div>

            {quiz.status === "published" && (
              <Button
                className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={() => navigate(`/admin/quiz/${quiz.id}/analytics`)}
              >
                📊 Lihat Analitik
              </Button>
            )}
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Belum ada quiz {filter !== "all" && filter}
          </h3>
          <p className="text-gray-600 mb-4">Mulai buat quiz pertama Anda</p>
          <Button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/admin/quiz/create")}
          >
            Buat Quiz Baru
          </Button>
        </Card>
      )}
    </div>
  );
};

export default QuizManagement;
