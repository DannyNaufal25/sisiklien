import { quizData, quizSubmissions, studentQuizAnalytics } from "../../data/quizData";

// Simulasi API untuk Quiz Management
export const QuizApi = {
  // Get all quizzes
  getAllQuizzes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(quizData);
      }, 500);
    });
  },

  // Get quiz by ID
  getQuizById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const quiz = quizData.find((q) => q.id === parseInt(id));
        if (quiz) {
          resolve(quiz);
        } else {
          reject(new Error("Quiz tidak ditemukan"));
        }
      }, 300);
    });
  },

  // Get quiz submissions
  getQuizSubmissions: (quizId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const submissions = quizSubmissions.filter(
          (s) => s.quizId === parseInt(quizId)
        );
        resolve(submissions);
      }, 400);
    });
  },

  // Get student analytics
  getStudentAnalytics: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studentQuizAnalytics);
      }, 500);
    });
  },

  // Submit quiz
  submitQuiz: (quizId, answers, timeSpent) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulasi penilaian
        const quiz = quizData.find((q) => q.id === quizId);
        let earnedPoints = 0;
        let totalPoints = 0;

        const gradedAnswers = answers.map((ans) => {
          const question = quiz.questions.find((q) => q.id === ans.questionId);
          totalPoints += question.points;

          if (question.type === "essay") {
            // Essay dinilai manual (sementara dikasih 80% dari points)
            const manualScore = Math.floor(question.points * 0.8);
            earnedPoints += manualScore;
            return { ...ans, correct: true, manualScore };
          } else if (question.type === "true-false") {
            const correct = ans.answer === question.correctAnswer;
            if (correct) earnedPoints += question.points;
            return { ...ans, correct };
          } else {
            const correct = ans.answer === question.correctAnswer;
            if (correct) earnedPoints += question.points;
            return { ...ans, correct };
          }
        });

        const score = Math.round((earnedPoints / totalPoints) * 100);

        const submission = {
          id: quizSubmissions.length + 1,
          quizId,
          userId: 1,
          userName: "Current User",
          submittedAt: new Date().toISOString(),
          timeSpent,
          score,
          totalPoints,
          earnedPoints,
          answers: gradedAnswers,
        };

        resolve(submission);
      }, 1000);
    });
  },

  // Create new quiz
  createQuiz: (quizData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQuiz = {
          id: Math.max(...quizData.map((q) => q.id)) + 1,
          ...quizData,
          createdAt: new Date().toISOString(),
        };
        resolve(newQuiz);
      }, 800);
    });
  },

  // Update quiz
  updateQuiz: (id, updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = quizData.findIndex((q) => q.id === id);
        if (index !== -1) {
          quizData[index] = { ...quizData[index], ...updatedData };
          resolve(quizData[index]);
        }
      }, 600);
    });
  },

  // Delete quiz
  deleteQuiz: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = quizData.findIndex((q) => q.id === id);
        if (index !== -1) {
          quizData.splice(index, 1);
          resolve({ success: true });
        }
      }, 400);
    });
  },
};
