import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import { QuizApi } from "../utils/apis/QuizApi";

const QuizTaking = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState({});

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, timeLeft]);

  // Auto-save setiap 10 detik
  useEffect(() => {
    if (started) {
      const autoSave = setInterval(() => {
        localStorage.setItem(
          `quiz-${quizId}-progress`,
          JSON.stringify({ answers, currentQuestionIndex, timeLeft })
        );
      }, 10000);
      return () => clearInterval(autoSave);
    }
  }, [started, answers, currentQuestionIndex, timeLeft, quizId]);

  // Track waktu per soal
  useEffect(() => {
    if (started && quiz) {
      const questionId = quiz.questions[currentQuestionIndex].id;
      setQuestionStartTime((prev) => ({
        ...prev,
        [questionId]: prev[questionId] || Date.now(),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, started]);

  const loadQuiz = async () => {
    try {
      const data = await QuizApi.getQuizById(quizId);
      setQuiz(data);
      setTimeLeft(data.durasi * 60); // convert to seconds

      // Load saved progress
      const saved = localStorage.getItem(`quiz-${quizId}-progress`);
      if (saved) {
        const { answers: savedAnswers, currentQuestionIndex: savedIndex, timeLeft: savedTime } = JSON.parse(saved);
        if (window.confirm("Anda memiliki progress tersimpan. Lanjutkan?")) {
          setAnswers(savedAnswers);
          setCurrentQuestionIndex(savedIndex);
          setTimeLeft(savedTime);
        }
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("Gagal memuat quiz");
      navigate("/admin/quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    const firstQuestionId = quiz.questions[0].id;
    setQuestionStartTime({ [firstQuestionId]: Date.now() });
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      // Track time untuk soal ini (optional logging)
      // const currentQuestion = quiz.questions[currentQuestionIndex];
      // const timeSpent = Math.floor((Date.now() - questionStartTime[currentQuestion.id]) / 1000);
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleMarkForReview = (questionId) => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const handleAutoSubmit = async () => {
    alert("Waktu habis! Quiz akan otomatis disubmit.");
    await submitQuiz();
  };

  const submitQuiz = async () => {
    const totalTimeSpent = quiz.durasi * 60 - timeLeft;
    const formattedAnswers = quiz.questions.map((q) => {
      const questionId = q.id;
      const timeSpent = questionStartTime[questionId] 
        ? Math.floor((Date.now() - questionStartTime[questionId]) / 1000)
        : 0;

      return {
        questionId,
        answer: answers[questionId] ?? null,
        timeSpent,
      };
    });

    try {
      const result = await QuizApi.submitQuiz(
        parseInt(quizId),
        formattedAnswers,
        Math.floor(totalTimeSpent / 60)
      );

      localStorage.removeItem(`quiz-${quizId}-progress`);
      navigate(`/admin/quiz/${quizId}/result`, { state: { result } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Gagal submit quiz");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card className="text-center">
          <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
          <p className="text-gray-600 mb-6">{quiz.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📝</div>
              <div className="font-semibold">{quiz.questions.length} Soal</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold">{quiz.durasi} Menit</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">✓</div>
              <div className="font-semibold">Nilai Lulus: {quiz.nilaiLulus}%</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold">
                Total: {quiz.questions.reduce((sum, q) => sum + q.points, 0)} Poin
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">⚠️ Instruksi:</h3>
            <ul className="text-left text-sm space-y-1 max-w-md mx-auto">
              <li>• Timer akan mulai saat Anda klik "Mulai Quiz"</li>
              <li>• Jawaban otomatis tersimpan setiap 10 detik</li>
              <li>• Anda bisa menandai soal untuk direview nanti</li>
              <li>• Pastikan koneksi internet stabil</li>
            </ul>
          </div>

          <Button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
            onClick={handleStart}
          >
            🚀 Mulai Quiz
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Timer & Progress Bar */}
      <Card className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-90">Soal {currentQuestionIndex + 1} dari {quiz.questions.length}</div>
            <div className="text-xs opacity-75">
              {answeredCount} dijawab • {markedForReview.size} ditandai
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timeLeft < 300 ? "text-red-200 animate-pulse" : ""}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
            <div className="text-xs opacity-75">Waktu Tersisa</div>
          </div>
        </div>
        <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="mb-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </h2>
          <Button
            className={`px-4 py-2 rounded ${
              markedForReview.has(currentQuestion.id)
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => toggleMarkForReview(currentQuestion.id)}
          >
            {markedForReview.has(currentQuestion.id) ? "🚩 Ditandai" : "🏴 Tandai"}
          </Button>
        </div>

        <div className="text-sm text-gray-600 mb-4">Poin: {currentQuestion.points}</div>

        <div className="space-y-3">
          {currentQuestion.type === "multiple-choice" && (
            <>
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="mr-3"
                  />
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </label>
              ))}
            </>
          )}

          {currentQuestion.type === "true-false" && (
            <div className="flex gap-4">
              <label
                className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.id] === true
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === true}
                  onChange={() => handleAnswerChange(currentQuestion.id, true)}
                  className="mr-3"
                />
                ✓ Benar
              </label>
              <label
                className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.id] === false
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === false}
                  onChange={() => handleAnswerChange(currentQuestion.id, false)}
                  className="mr-3"
                />
                ✗ Salah
              </label>
            </div>
          )}

          {currentQuestion.type === "essay" && (
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="6"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Tulis jawaban Anda di sini..."
            />
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          className={`px-6 py-2 rounded ${
            currentQuestionIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Sebelumnya
        </Button>

        <div className="text-center text-sm text-gray-600">
          {!isAnswered && (
            <div className="text-yellow-600 font-semibold">⚠️ Soal ini belum dijawab</div>
          )}
        </div>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handleNext}
          >
            Selanjutnya →
          </Button>
        ) : (
          <Button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => setShowSubmitConfirm(true)}
          >
            Selesai & Submit
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <Card className="mt-6">
        <h3 className="font-semibold mb-3 text-gray-800">Navigasi Soal:</h3>
        <div className="grid grid-cols-10 gap-2">
          {quiz.questions.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined;
            const isMarked = markedForReview.has(q.id);
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded font-semibold text-sm transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-2 ring-blue-300"
                    : isMarked
                    ? "bg-yellow-400 text-gray-800"
                    : isAnswered
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Sudah Dijawab</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Ditandai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Belum Dijawab</span>
          </div>
        </div>
      </Card>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md">
            <h3 className="text-xl font-bold mb-4">Konfirmasi Submit</h3>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Soal:</span>
                <span className="font-semibold">{quiz.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Dijawab:</span>
                <span className="font-semibold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Belum Dijawab:</span>
                <span className="font-semibold text-red-600">
                  {quiz.questions.length - answeredCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ditandai untuk Review:</span>
                <span className="font-semibold text-yellow-600">
                  {markedForReview.size}
                </span>
              </div>
            </div>

            {answeredCount < quiz.questions.length && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm">
                <strong>⚠️ Peringatan:</strong> Masih ada soal yang belum dijawab!
              </div>
            )}

            <p className="mb-6 text-gray-700">
              Apakah Anda yakin ingin submit quiz? Anda tidak bisa mengubah jawaban setelah
              submit.
            </p>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  submitQuiz();
                }}
              >
                Ya, Submit
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuizTaking;
