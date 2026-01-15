// Reducer untuk Forum Thread State Management

// Initial State
export const initialForumState = {
  thread: null,
  replies: [],
  replyText: "",
  replyingTo: null, // { id, author } when replying to a comment
  editingReply: null, // { id, text } when editing
  isSubmitting: false,
  isLoading: false,
  error: null,
  sortBy: "oldest", // oldest, newest, popular
  filterBy: "all", // all, accepted, mine
};

// Action Types
export const FORUM_ACTIONS = {
  LOAD_THREAD: "LOAD_THREAD",
  LOAD_THREAD_SUCCESS: "LOAD_THREAD_SUCCESS",
  LOAD_THREAD_ERROR: "LOAD_THREAD_ERROR",
  SET_REPLY_TEXT: "SET_REPLY_TEXT",
  SET_REPLYING_TO: "SET_REPLYING_TO",
  CANCEL_REPLY: "CANCEL_REPLY",
  START_EDIT_REPLY: "START_EDIT_REPLY",
  CANCEL_EDIT_REPLY: "CANCEL_EDIT_REPLY",
  SUBMIT_REPLY: "SUBMIT_REPLY",
  SUBMIT_REPLY_SUCCESS: "SUBMIT_REPLY_SUCCESS",
  SUBMIT_REPLY_ERROR: "SUBMIT_REPLY_ERROR",
  UPDATE_REPLY: "UPDATE_REPLY",
  DELETE_REPLY: "DELETE_REPLY",
  UPVOTE_REPLY: "UPVOTE_REPLY",
  DOWNVOTE_REPLY: "DOWNVOTE_REPLY",
  ACCEPT_ANSWER: "ACCEPT_ANSWER",
  PIN_THREAD: "PIN_THREAD",
  CLOSE_THREAD: "CLOSE_THREAD",
  SET_SORT: "SET_SORT",
  SET_FILTER: "SET_FILTER",
  RESET: "RESET",
};

// Reducer Function
export const forumReducer = (state, action) => {
  switch (action.type) {
    case FORUM_ACTIONS.LOAD_THREAD:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FORUM_ACTIONS.LOAD_THREAD_SUCCESS:
      return {
        ...state,
        thread: action.payload.thread,
        replies: action.payload.replies,
        isLoading: false,
        error: null,
      };

    case FORUM_ACTIONS.LOAD_THREAD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };

    case FORUM_ACTIONS.SET_REPLY_TEXT:
      return {
        ...state,
        replyText: action.payload.text,
      };

    case FORUM_ACTIONS.SET_REPLYING_TO:
      return {
        ...state,
        replyingTo: action.payload.comment,
        replyText: "", // Clear text when starting new reply
      };

    case FORUM_ACTIONS.CANCEL_REPLY:
      return {
        ...state,
        replyingTo: null,
        replyText: "",
      };

    case FORUM_ACTIONS.START_EDIT_REPLY:
      return {
        ...state,
        editingReply: {
          id: action.payload.id,
          text: action.payload.text,
        },
        replyText: action.payload.text,
      };

    case FORUM_ACTIONS.CANCEL_EDIT_REPLY:
      return {
        ...state,
        editingReply: null,
        replyText: "",
      };

    case FORUM_ACTIONS.SUBMIT_REPLY:
      return {
        ...state,
        isSubmitting: true,
      };

    case FORUM_ACTIONS.SUBMIT_REPLY_SUCCESS:
      return {
        ...state,
        replies: [...state.replies, action.payload.reply],
        replyText: "",
        replyingTo: null,
        isSubmitting: false,
      };

    case FORUM_ACTIONS.SUBMIT_REPLY_ERROR:
      return {
        ...state,
        isSubmitting: false,
        error: action.payload.error,
      };

    case FORUM_ACTIONS.UPDATE_REPLY:
      return {
        ...state,
        replies: state.replies.map((reply) =>
          reply.id === action.payload.id
            ? { ...reply, content: action.payload.content, edited: true }
            : reply
        ),
        editingReply: null,
        replyText: "",
      };

    case FORUM_ACTIONS.DELETE_REPLY:
      return {
        ...state,
        replies: state.replies.filter((reply) => reply.id !== action.payload.id),
      };

    case FORUM_ACTIONS.UPVOTE_REPLY:
      return {
        ...state,
        replies: state.replies.map((reply) =>
          reply.id === action.payload.id
            ? { ...reply, upvotes: reply.upvotes + 1 }
            : reply
        ),
      };

    case FORUM_ACTIONS.DOWNVOTE_REPLY:
      return {
        ...state,
        replies: state.replies.map((reply) =>
          reply.id === action.payload.id
            ? { ...reply, downvotes: reply.downvotes + 1 }
            : reply
        ),
      };

    case FORUM_ACTIONS.ACCEPT_ANSWER:
      return {
        ...state,
        thread: {
          ...state.thread,
          acceptedAnswerId: action.payload.id,
          status: "solved",
        },
        replies: state.replies.map((reply) =>
          reply.id === action.payload.id ? { ...reply, accepted: true } : reply
        ),
      };

    case FORUM_ACTIONS.PIN_THREAD:
      return {
        ...state,
        thread: {
          ...state.thread,
          pinned: !state.thread.pinned,
        },
      };

    case FORUM_ACTIONS.CLOSE_THREAD:
      return {
        ...state,
        thread: {
          ...state.thread,
          closed: !state.thread.closed,
        },
      };

    case FORUM_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
      };

    case FORUM_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterBy: action.payload.filterBy,
      };

    case FORUM_ACTIONS.RESET:
      return initialForumState;

    default:
      return state;
  }
};

// Helper function to sort replies
export const sortReplies = (replies, sortBy) => {
  const sorted = [...replies];
  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    case "popular":
      return sorted.sort((a, b) => b.upvotes - a.upvotes);
    default:
      return sorted;
  }
};

// Helper function to filter replies
export const filterReplies = (replies, filterBy, currentUser) => {
  switch (filterBy) {
    case "accepted":
      return replies.filter((reply) => reply.accepted);
    case "mine":
      return replies.filter((reply) => reply.author === currentUser);
    case "all":
    default:
      return replies;
  }
};
