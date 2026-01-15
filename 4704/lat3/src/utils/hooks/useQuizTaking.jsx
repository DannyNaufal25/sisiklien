import { useReducer, useEffect, useCallback } from "react";
import {
  quizReducer,
  initialQuizState,
  QUIZ_ACTIONS,
} from "../reducers/quizReducer";

/**
 * Custom hook untuk mengelola state Quiz Taking menggunakan useReducer
 * Menyediakan semua functionality yang dibutuhkan untuk quiz interface
 */
export const useQuizTaking = (quiz) => {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  // Load quiz saat component mount atau quiz berubah
  useEffect(() => {
    if (quiz) {
      dispatch({
        type: QUIZ_ACTIONS.LOAD_QUIZ,
        payload: { quiz },
      });
    }
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (state.timeRemaining > 0 && !state.isCompleted) {
      const timer = setInterval(() => {
        dispatch({ type: QUIZ_ACTIONS.TICK_TIMER });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.timeRemaining, state.isCompleted]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (state.timeRemaining === 0 && !state.isCompleted && state.quiz) {
      handleSubmitQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeRemaining]);

  // Navigation methods
  const goToNextQuestion = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION });
  }, []);

  const goToPrevQuestion = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.PREV_QUESTION });
  }, []);

  const goToQuestion = useCallback((index) => {
    dispatch({
      type: QUIZ_ACTIONS.GOTO_QUESTION,
      payload: { index },
    });
  }, []);

  // Answer management
  const answerQuestion = useCallback((questionId, answer) => {
    dispatch({
      type: QUIZ_ACTIONS.ANSWER_QUESTION,
      payload: { questionId, answer },
    });
  }, []);

  // Flag management
  const toggleFlag = useCallback(
    (questionId) => {
      if (state.flaggedQuestions.includes(questionId)) {
        dispatch({
          type: QUIZ_ACTIONS.UNFLAG_QUESTION,
          payload: { questionId },
        });
      } else {
        dispatch({
          type: QUIZ_ACTIONS.FLAG_QUESTION,
          payload: { questionId },
        });
      }
    },
    [state.flaggedQuestions]
  );

  // Review mode
  const showReview = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.SHOW_REVIEW });
  }, []);

  const hideReview = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.HIDE_REVIEW });
  }, []);

  // Submit quiz
  const handleSubmitQuiz = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.SUBMIT_QUIZ });
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: QUIZ_ACTIONS.COMPLETE_QUIZ });
    }, 1000);
  }, []);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.RESET_QUIZ });
  }, []);

  // Helper functions
  const getCurrentQuestion = useCallback(() => {
    if (!state.quiz) return null;
    return state.quiz.questions[state.currentQuestionIndex];
  }, [state.quiz, state.currentQuestionIndex]);

  const getAnsweredCount = useCallback(() => {
    return Object.keys(state.answers).length;
  }, [state.answers]);

  const getUnansweredCount = useCallback(() => {
    if (!state.quiz) return 0;
    return state.quiz.questions.length - getAnsweredCount();
  }, [state.quiz, getAnsweredCount]);

  const isQuestionAnswered = useCallback(
    (questionId) => {
      return Object.prototype.hasOwnProperty.call(state.answers, questionId);
    },
    [state.answers]
  );

  const isQuestionFlagged = useCallback(
    (questionId) => {
      return state.flaggedQuestions.includes(questionId);
    },
    [state.flaggedQuestions]
  );

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getProgress = useCallback(() => {
    if (!state.quiz) return 0;
    return Math.round((getAnsweredCount() / state.quiz.questions.length) * 100);
  }, [state.quiz, getAnsweredCount]);

  return {
    // State
    quiz: state.quiz,
    currentQuestionIndex: state.currentQuestionIndex,
    answers: state.answers,
    flaggedQuestions: state.flaggedQuestions,
    timeRemaining: state.timeRemaining,
    isSubmitting: state.isSubmitting,
    showReview: state.showReview,
    isCompleted: state.isCompleted,
    startTime: state.startTime,
    endTime: state.endTime,

    // Actions
    goToNextQuestion,
    goToPrevQuestion,
    goToQuestion,
    answerQuestion,
    toggleFlag,
    toggleReviewMode: showReview,
    hideReview,
    handleSubmitQuiz,
    resetQuiz,

    // Helpers
    getCurrentQuestion,
    getAnsweredCount,
    getUnansweredCount,
    isQuestionAnswered,
    isQuestionFlagged,
    formatTime,
    getProgress,
  };
};
