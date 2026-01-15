// Reducer untuk Quiz Taking State Management

// Initial State
export const initialQuizState = {
  quiz: null,
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: [],
  timeRemaining: 0,
  isSubmitting: false,
  showReview: false,
  isCompleted: false,
  startTime: null,
  endTime: null,
};

// Action Types
export const QUIZ_ACTIONS = {
  LOAD_QUIZ: "LOAD_QUIZ",
  NEXT_QUESTION: "NEXT_QUESTION",
  PREV_QUESTION: "PREV_QUESTION",
  GOTO_QUESTION: "GOTO_QUESTION",
  ANSWER_QUESTION: "ANSWER_QUESTION",
  FLAG_QUESTION: "FLAG_QUESTION",
  UNFLAG_QUESTION: "UNFLAG_QUESTION",
  TICK_TIMER: "TICK_TIMER",
  SHOW_REVIEW: "SHOW_REVIEW",
  HIDE_REVIEW: "HIDE_REVIEW",
  SUBMIT_QUIZ: "SUBMIT_QUIZ",
  COMPLETE_QUIZ: "COMPLETE_QUIZ",
  RESET_QUIZ: "RESET_QUIZ",
};

// Reducer Function
export const quizReducer = (state, action) => {
  switch (action.type) {
    case QUIZ_ACTIONS.LOAD_QUIZ:
      return {
        ...state,
        quiz: action.payload.quiz,
        timeRemaining: action.payload.quiz.durasi * 60, // Convert minutes to seconds
        startTime: new Date().toISOString(),
        answers: {},
        currentQuestionIndex: 0,
        flaggedQuestions: [],
        isCompleted: false,
      };

    case QUIZ_ACTIONS.NEXT_QUESTION:
      if (state.currentQuestionIndex < state.quiz.questions.length - 1) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        };
      }
      return state;

    case QUIZ_ACTIONS.PREV_QUESTION:
      if (state.currentQuestionIndex > 0) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
        };
      }
      return state;

    case QUIZ_ACTIONS.GOTO_QUESTION:
      return {
        ...state,
        currentQuestionIndex: action.payload.index,
        showReview: false,
      };

    case QUIZ_ACTIONS.ANSWER_QUESTION:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    case QUIZ_ACTIONS.FLAG_QUESTION:
      if (!state.flaggedQuestions.includes(action.payload.questionId)) {
        return {
          ...state,
          flaggedQuestions: [...state.flaggedQuestions, action.payload.questionId],
        };
      }
      return state;

    case QUIZ_ACTIONS.UNFLAG_QUESTION:
      return {
        ...state,
        flaggedQuestions: state.flaggedQuestions.filter(
          (id) => id !== action.payload.questionId
        ),
      };

    case QUIZ_ACTIONS.TICK_TIMER:
      if (state.timeRemaining > 0) {
        return {
          ...state,
          timeRemaining: state.timeRemaining - 1,
        };
      }
      // Auto-submit when time runs out
      return {
        ...state,
        timeRemaining: 0,
        isCompleted: true,
        endTime: new Date().toISOString(),
      };

    case QUIZ_ACTIONS.SHOW_REVIEW:
      return {
        ...state,
        showReview: true,
      };

    case QUIZ_ACTIONS.HIDE_REVIEW:
      return {
        ...state,
        showReview: false,
      };

    case QUIZ_ACTIONS.SUBMIT_QUIZ:
      return {
        ...state,
        isSubmitting: true,
      };

    case QUIZ_ACTIONS.COMPLETE_QUIZ:
      return {
        ...state,
        isCompleted: true,
        isSubmitting: false,
        endTime: new Date().toISOString(),
      };

    case QUIZ_ACTIONS.RESET_QUIZ:
      return initialQuizState;

    default:
      return state;
  }
};
