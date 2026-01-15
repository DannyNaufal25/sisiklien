import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import Input from "../Components/atoms/Input";
import Label from "../Components/atoms/Label";
import Select from "../Components/atoms/Select";
import { QuizApi } from "../utils/apis/QuizApi";

const QuizBuilder = () => {
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    description: "",
    modulId: 1,
    durasi: 30,
    nilaiLulus: 70,
    status: "draft",
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10,
    },
  ]);

  const [previewMode, setPreviewMode] = useState(false);

  const handleQuizInfoChange = (field, value) => {
    setQuizInfo({ ...quizInfo, [field]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: questions.length + 1,
      type,
      question: "",
      points: 10,
    };

    if (type === "multiple-choice") {
      newQuestion.options = ["", "", "", ""];
      newQuestion.correctAnswer = 0;
    } else if (type === "true-false") {
      newQuestion.correctAnswer = true;
    }

    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (publishNow = false) => {
    try {
      const quizData = {
        ...quizInfo,
        questions,
        status: publishNow ? "published" : "draft",
      };

      await QuizApi.createQuiz(quizData);
      alert(
        publishNow
          ? "Quiz berhasil dibuat dan dipublish!"
          : "Quiz berhasil disimpan sebagai draft!"
      );
      navigate("/admin/quiz");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Gagal membuat quiz");
    }
  };

  const renderQuestionForm = (question, index) => {
    return (
      <Card key={index} className="mb-4 border-2 border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Soal {index + 1}
            <span className="ml-3 text-sm font-normal text-gray-600">
              ({question.type === "multiple-choice"
                ? "Pilihan Ganda"
                : question.type === "true-false"
                ? "Benar/Salah"
                : "Essay"})
            </span>
          </h3>
          <Button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => removeQuestion(index)}
          >
            Hapus
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Pertanyaan</Label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
              placeholder="Tulis pertanyaan di sini..."
            />
          </div>

          {question.type === "multiple-choice" && (
            <div>
              <Label>Pilihan Jawaban</Label>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={question.correctAnswer === optIndex}
                    onChange={() => handleQuestionChange(index, "correctAnswer", optIndex)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Input
                    className="flex-1"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`}
                  />
                  <span className="text-xs text-gray-500">
                    {question.correctAnswer === optIndex && "✓ Jawaban Benar"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {question.type === "true-false" && (
            <div>
              <Label>Jawaban Benar</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`tf-${index}`}
                    checked={question.correctAnswer === true}
                    onChange={() => handleQuestionChange(index, "correctAnswer", true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Benar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`tf-${index}`}
                    checked={question.correctAnswer === false}
                    onChange={() => handleQuestionChange(index, "correctAnswer", false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Salah</span>
                </label>
              </div>
            </div>
          )}

          <div className="w-32">
            <Label>Poin</Label>
            <Input
              type="number"
              value={question.points}
              onChange={(e) =>
                handleQuestionChange(index, "points", parseInt(e.target.value))
              }
              min="1"
            />
          </div>
        </div>
      </Card>
    );
  };

  if (previewMode) {
    return (
      <div className="space-y-6 pb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">👁️ Preview Quiz</h1>
          <p className="text-purple-100">{quizInfo.title}</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-2">{quizInfo.title}</h2>
          <p className="text-gray-600 mb-4">{quizInfo.description}</p>
          <div className="flex gap-4 text-sm mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
              ⏱️ {quizInfo.durasi} menit
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
              ✓ Nilai Lulus: {quizInfo.nilaiLulus}%
            </span>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">
                {index + 1}. {q.question} ({q.points} poin)
              </h3>
              {q.type === "multiple-choice" && (
                <div className="space-y-2 ml-4">
                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded ${
                        q.correctAnswer === optIndex
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-white"
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {opt}
                      {q.correctAnswer === optIndex && (
                        <span className="ml-2 text-green-600 font-semibold">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {q.type === "true-false" && (
                <div className="ml-4">
                  <span className="font-semibold text-green-600">
                    Jawaban: {q.correctAnswer ? "Benar" : "Salah"}
                  </span>
                </div>
              )}
              {q.type === "essay" && (
                <div className="ml-4 p-3 bg-white rounded border">
                  <em className="text-gray-500">Area jawaban essay...</em>
                </div>
              )}
            </div>
          ))}
        </Card>

        <div className="flex gap-3">
          <Button
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            onClick={() => setPreviewMode(false)}
          >
            ← Kembali Edit
          </Button>
          <Button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => handleSubmit(false)}
          >
            Simpan sebagai Draft
          </Button>
          <Button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => handleSubmit(true)}
          >
            Publish Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📝 Buat Quiz Baru</h1>
        <p className="text-purple-100">
          Buat quiz dengan soal pilihan ganda, benar/salah, atau essay
        </p>
      </div>

      {/* Quiz Info */}
      <Card>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Informasi Quiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Judul Quiz *</Label>
            <Input
              value={quizInfo.title}
              onChange={(e) => handleQuizInfoChange("title", e.target.value)}
              placeholder="Contoh: JavaScript Fundamentals"
            />
          </div>

          <div>
            <Label>Modul</Label>
            <Select
              value={quizInfo.modulId}
              onChange={(e) =>
                handleQuizInfoChange("modulId", parseInt(e.target.value))
              }
            >
              <option value="1">Modul 1 - JavaScript Basics</option>
              <option value="2">Modul 2 - React Fundamentals</option>
              <option value="3">Modul 3 - Database SQL</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Deskripsi</Label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              rows="2"
              value={quizInfo.description}
              onChange={(e) => handleQuizInfoChange("description", e.target.value)}
              placeholder="Deskripsi singkat tentang quiz ini..."
            />
          </div>

          <div>
            <Label>Durasi (menit) *</Label>
            <Input
              type="number"
              value={quizInfo.durasi}
              onChange={(e) =>
                handleQuizInfoChange("durasi", parseInt(e.target.value))
              }
              min="5"
            />
          </div>

          <div>
            <Label>Nilai Lulus (%) *</Label>
            <Input
              type="number"
              value={quizInfo.nilaiLulus}
              onChange={(e) =>
                handleQuizInfoChange("nilaiLulus", parseInt(e.target.value))
              }
              min="0"
              max="100"
            />
          </div>
        </div>
      </Card>

      {/* Questions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Soal-soal ({questions.length})
          </h2>
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => addQuestion("multiple-choice")}
            >
              + Pilihan Ganda
            </Button>
            <Button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => addQuestion("true-false")}
            >
              + Benar/Salah
            </Button>
            <Button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => addQuestion("essay")}
            >
              + Essay
            </Button>
          </div>
        </div>

        {questions.map((question, index) => renderQuestionForm(question, index))}
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          onClick={() => navigate("/admin/quiz")}
        >
          Batal
        </Button>
        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => setPreviewMode(true)}
        >
          Preview Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizBuilder;
