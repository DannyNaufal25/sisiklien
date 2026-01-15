// Quiz Data Structure
export const quizData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    modulId: 1,
    description: "Test pemahaman dasar JavaScript",
    durasi: 30, // dalam menit
    nilaiLulus: 70,
    status: "published",
    createdAt: "2026-01-01",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Apa output dari console.log(typeof null)?",
        options: ["null", "undefined", "object", "number"],
        correctAnswer: 2,
        points: 10,
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "Manakah yang bukan merupakan tipe data primitif di JavaScript?",
        options: ["String", "Boolean", "Array", "Number"],
        correctAnswer: 2,
        points: 10,
      },
      {
        id: 3,
        type: "true-false",
        question: "JavaScript adalah bahasa yang strongly typed",
        correctAnswer: false,
        points: 10,
      },
      {
        id: 4,
        type: "essay",
        question: "Jelaskan perbedaan antara let, const, dan var dalam JavaScript",
        points: 20,
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "Apa yang dimaksud dengan hoisting dalam JavaScript?",
        options: [
          "Proses compile JavaScript",
          "Pemindahan deklarasi ke atas scope",
          "Optimasi kode",
          "Error handling",
        ],
        correctAnswer: 1,
        points: 10,
      },
    ],
  },
  {
    id: 2,
    title: "React Basics Quiz",
    modulId: 2,
    description: "Quiz tentang konsep dasar React",
    durasi: 45,
    nilaiLulus: 75,
    status: "published",
    createdAt: "2026-01-05",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Apa yang dimaksud dengan Virtual DOM?",
        options: [
          "DOM asli browser",
          "Representasi in-memory dari DOM",
          "Database virtual",
          "API React",
        ],
        correctAnswer: 1,
        points: 15,
      },
      {
        id: 2,
        type: "true-false",
        question: "React component harus dimulai dengan huruf kapital",
        correctAnswer: true,
        points: 10,
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Hook mana yang digunakan untuk side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        points: 15,
      },
    ],
  },
  {
    id: 3,
    title: "Database SQL Advanced",
    modulId: 3,
    description: "Quiz SQL tingkat lanjut",
    durasi: 60,
    nilaiLulus: 80,
    status: "draft",
    createdAt: "2026-01-10",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Apa fungsi dari JOIN dalam SQL?",
        options: [
          "Menggabungkan tabel",
          "Menghapus data",
          "Membuat tabel baru",
          "Update record",
        ],
        correctAnswer: 0,
        points: 10,
      },
      {
        id: 2,
        type: "essay",
        question: "Jelaskan perbedaan antara INNER JOIN dan LEFT JOIN",
        points: 25,
      },
    ],
  },
];

// Quiz Submissions/Results
export const quizSubmissions = [
  {
    id: 1,
    quizId: 1,
    userId: 1,
    userName: "John Doe",
    submittedAt: "2026-01-08T10:30:00",
    timeSpent: 25, // menit
    score: 85,
    totalPoints: 60,
    earnedPoints: 51,
    answers: [
      { questionId: 1, answer: 2, correct: true, timeSpent: 45 },
      { questionId: 2, answer: 2, correct: true, timeSpent: 30 },
      { questionId: 3, answer: false, correct: true, timeSpent: 20 },
      {
        questionId: 4,
        answer:
          "let dan const adalah block-scoped, var adalah function-scoped. const tidak bisa di-reassign.",
        correct: true,
        timeSpent: 180,
        manualScore: 18,
      },
      { questionId: 5, answer: 1, correct: true, timeSpent: 40 },
    ],
  },
  {
    id: 2,
    quizId: 1,
    userId: 1,
    userName: "John Doe",
    submittedAt: "2026-01-12T14:20:00",
    timeSpent: 22,
    score: 92,
    totalPoints: 60,
    earnedPoints: 55,
    answers: [
      { questionId: 1, answer: 2, correct: true, timeSpent: 35 },
      { questionId: 2, answer: 2, correct: true, timeSpent: 25 },
      { questionId: 3, answer: false, correct: true, timeSpent: 15 },
      {
        questionId: 4,
        answer:
          "let dan const memiliki block scope, var memiliki function scope. let bisa di-reassign, const tidak bisa di-reassign setelah deklarasi.",
        correct: true,
        timeSpent: 150,
        manualScore: 20,
      },
      { questionId: 5, answer: 1, correct: true, timeSpent: 30 },
    ],
  },
  {
    id: 3,
    quizId: 2,
    userId: 1,
    userName: "John Doe",
    submittedAt: "2026-01-13T09:15:00",
    timeSpent: 35,
    score: 88,
    totalPoints: 40,
    earnedPoints: 35,
    answers: [
      { questionId: 1, answer: 1, correct: true, timeSpent: 60 },
      { questionId: 2, answer: true, correct: true, timeSpent: 25 },
      { questionId: 3, answer: 1, correct: true, timeSpent: 45 },
    ],
  },
  {
    id: 4,
    quizId: 1,
    userId: 1,
    userName: "John Doe",
    submittedAt: "2026-01-05T16:45:00",
    timeSpent: 28,
    score: 75,
    totalPoints: 60,
    earnedPoints: 45,
    answers: [
      { questionId: 1, answer: 2, correct: true, timeSpent: 50 },
      { questionId: 2, answer: 1, correct: false, timeSpent: 40 },
      { questionId: 3, answer: false, correct: true, timeSpent: 18 },
      {
        questionId: 4,
        answer: "let dan const adalah variable declaration yang modern",
        correct: true,
        timeSpent: 200,
        manualScore: 10,
      },
      { questionId: 5, answer: 1, correct: true, timeSpent: 35 },
    ],
  },
];

// Student Quiz Analytics
export const studentQuizAnalytics = {
  totalQuizzesTaken: 4,
  averageScore: 85,
  totalTimeSpent: 110, // menit
  passRate: 100,
  quizHistory: [
    { date: "2026-01-05", quizTitle: "JavaScript Fundamentals", score: 75 },
    { date: "2026-01-08", quizTitle: "JavaScript Fundamentals", score: 85 },
    { date: "2026-01-12", quizTitle: "JavaScript Fundamentals", score: 92 },
    { date: "2026-01-13", quizTitle: "React Basics Quiz", score: 88 },
  ],
  questionAccuracy: [
    { question: "Q1: typeof null", correct: 4, incorrect: 0, accuracy: 100 },
    { question: "Q2: Tipe data primitif", correct: 3, incorrect: 1, accuracy: 75 },
    { question: "Q3: Strongly typed", correct: 4, incorrect: 0, accuracy: 100 },
    { question: "Q4: let/const/var", correct: 3, incorrect: 1, accuracy: 75 },
    { question: "Q5: Hoisting", correct: 4, incorrect: 0, accuracy: 100 },
  ],
  timePerQuestion: [
    { question: "Q1: typeof null", avgTime: 45, difficulty: "Easy" },
    { question: "Q2: Tipe data primitif", avgTime: 32, difficulty: "Easy" },
    { question: "Q3: Strongly typed", avgTime: 18, difficulty: "Easy" },
    { question: "Q4: let/const/var", avgTime: 182, difficulty: "Hard" },
    { question: "Q5: Hoisting", avgTime: 35, difficulty: "Medium" },
  ],
  categoryPerformance: [
    { category: "JavaScript Basics", score: 84, attempts: 3 },
    { category: "React Fundamentals", score: 88, attempts: 1 },
  ],
};
