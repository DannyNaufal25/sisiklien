import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) {
    navigate("/admin/quiz");
    return null;
  }

  const isPassed = result.score >= 70; // Assuming 70 is pass threshold
  const totalQuestions = result.answers.length;
  const correctAnswers = result.answers.filter((a) => a.correct).length;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Result Banner */}
      <Card
        className={`text-center mb-6 ${
          isPassed
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : "bg-gradient-to-r from-red-500 to-red-600"
        } text-white`}
      >
        <div className="text-6xl mb-4">{isPassed ? "🎉" : "😔"}</div>
        <h1 className="text-4xl font-bold mb-2">
          {isPassed ? "Selamat! Anda Lulus!" : "Belum Berhasil"}
        </h1>
        <p className="text-xl opacity-90">
          {isPassed
            ? "Kerja bagus! Anda telah menguasai materi ini."
            : "Jangan menyerah! Coba lagi untuk hasil yang lebih baik."}
        </p>
      </Card>

      {/* Score Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-blue-700">{result.score}%</div>
          <div className="text-sm text-gray-600">Nilai Akhir</div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-green-700">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-gray-600">Jawaban Benar</div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-3xl font-bold text-purple-700">{result.timeSpent}m</div>
          <div className="text-sm text-gray-600">Waktu Digunakan</div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-yellow-700">
            {result.earnedPoints}/{result.totalPoints}
          </div>
          <div className="text-sm text-gray-600">Total Poin</div>
        </Card>
      </div>

      {/* Detailed Answers Review */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Review Jawaban</h2>
        <div className="space-y-4">
          {result.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                answer.correct
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  Soal {index + 1}
                  {answer.correct ? (
                    <span className="ml-2 text-green-600">✓ Benar</span>
                  ) : (
                    <span className="ml-2 text-red-600">✗ Salah</span>
                  )}
                </h3>
                <span className="text-sm text-gray-600">
                  {answer.timeSpent ? `⏱️ ${answer.timeSpent}s` : ""}
                </span>
              </div>
              
              {answer.manualScore !== undefined && (
                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Essay:</strong> Poin yang diperoleh: {answer.manualScore}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Jawaban essay dinilai oleh instruktur
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Insight */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">📈 Insight Performa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Kecepatan Pengerjaan</div>
            <div className="text-lg font-bold text-blue-600">
              {(result.timeSpent / totalQuestions).toFixed(1)} menit/soal
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Tingkat Akurasi</div>
            <div className="text-lg font-bold text-green-600">
              {((correctAnswers / totalQuestions) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          onClick={() => navigate("/admin/quiz")}
        >
          Kembali ke Daftar Quiz
        </Button>
        <Button
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
          onClick={() => navigate(`/admin/quiz/${result.quizId}/analytics`)}
        >
          Lihat Analitik Detail
        </Button>
        {!isPassed && (
          <Button
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            onClick={() => navigate(`/admin/quiz/${result.quizId}/take`)}
          >
            Coba Lagi
          </Button>
        )}
      </div>

      {/* Tips */}
      {!isPassed && (
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Tips untuk Attempt Berikutnya:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Review materi yang belum dipahami dengan baik</li>
            <li>• Kerjakan latihan soal tambahan</li>
            <li>• Manajemen waktu dengan lebih baik</li>
            <li>• Baca setiap soal dengan teliti sebelum menjawab</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default QuizResult;
