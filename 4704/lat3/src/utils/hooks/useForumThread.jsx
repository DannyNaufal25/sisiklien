import { useReducer, useCallback } from "react";
import {
  forumReducer,
  initialForumState,
  FORUM_ACTIONS,
  sortReplies,
  filterReplies,
} from "../reducers/forumReducer";

/**
 * Custom hook untuk mengelola state Forum Thread menggunakan useReducer
 * Menyediakan semua functionality untuk forum discussions dengan nested replies
 */
export const useForumThread = (threadId, currentUser) => {
  const [state, dispatch] = useReducer(forumReducer, initialForumState);

  // Load thread data
  const loadThread = useCallback(async (threadData, repliesData) => {
    dispatch({ type: FORUM_ACTIONS.LOAD_THREAD });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({
        type: FORUM_ACTIONS.LOAD_THREAD_SUCCESS,
        payload: {
          thread: threadData,
          replies: repliesData,
        },
      });
    } catch (error) {
      dispatch({
        type: FORUM_ACTIONS.LOAD_THREAD_ERROR,
        payload: { error: error.message },
      });
    }
  }, []);

  // Reply text management
  const setReplyText = useCallback((text) => {
    dispatch({
      type: FORUM_ACTIONS.SET_REPLY_TEXT,
      payload: { text },
    });
  }, []);

  // Reply to comment
  const startReplyTo = useCallback((comment) => {
    dispatch({
      type: FORUM_ACTIONS.SET_REPLYING_TO,
      payload: { comment },
    });
  }, []);

  const cancelReply = useCallback(() => {
    dispatch({ type: FORUM_ACTIONS.CANCEL_REPLY });
  }, []);

  // Edit reply
  const startEditReply = useCallback((id, text) => {
    dispatch({
      type: FORUM_ACTIONS.START_EDIT_REPLY,
      payload: { id, text },
    });
  }, []);

  const cancelEditReply = useCallback(() => {
    dispatch({ type: FORUM_ACTIONS.CANCEL_EDIT_REPLY });
  }, []);

  // Submit reply
  const submitReply = useCallback(
    async (content) => {
      dispatch({ type: FORUM_ACTIONS.SUBMIT_REPLY });
      try {
        // Simulate API call
        const newReply = {
          id: Date.now(),
          threadId: threadId,
          parentId: state.replyingTo?.id || null,
          author: currentUser,
          content: content,
          upvotes: 0,
          downvotes: 0,
          accepted: false,
          edited: false,
          createdAt: new Date().toISOString(),
        };

        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch({
          type: FORUM_ACTIONS.SUBMIT_REPLY_SUCCESS,
          payload: { reply: newReply },
        });

        return newReply;
      } catch (error) {
        dispatch({
          type: FORUM_ACTIONS.SUBMIT_REPLY_ERROR,
          payload: { error: error.message },
        });
        throw error;
      }
    },
    [threadId, currentUser, state.replyingTo]
  );

  // Update reply
  const updateReply = useCallback((id, content) => {
    dispatch({
      type: FORUM_ACTIONS.UPDATE_REPLY,
      payload: { id, content },
    });
  }, []);

  // Delete reply
  const deleteReply = useCallback((id) => {
    dispatch({
      type: FORUM_ACTIONS.DELETE_REPLY,
      payload: { id },
    });
  }, []);

  // Voting
  const upvoteReply = useCallback((id) => {
    dispatch({
      type: FORUM_ACTIONS.UPVOTE_REPLY,
      payload: { id },
    });
  }, []);

  const downvoteReply = useCallback((id) => {
    dispatch({
      type: FORUM_ACTIONS.DOWNVOTE_REPLY,
      payload: { id },
    });
  }, []);

  // Accept answer
  const acceptAnswer = useCallback((id) => {
    dispatch({
      type: FORUM_ACTIONS.ACCEPT_ANSWER,
      payload: { id },
    });
  }, []);

  // Thread moderation
  const togglePinThread = useCallback(() => {
    dispatch({ type: FORUM_ACTIONS.PIN_THREAD });
  }, []);

  const toggleCloseThread = useCallback(() => {
    dispatch({ type: FORUM_ACTIONS.CLOSE_THREAD });
  }, []);

  // Sorting and filtering
  const setSortBy = useCallback((sortBy) => {
    dispatch({
      type: FORUM_ACTIONS.SET_SORT,
      payload: { sortBy },
    });
  }, []);

  const setFilterBy = useCallback((filterBy) => {
    dispatch({
      type: FORUM_ACTIONS.SET_FILTER,
      payload: { filterBy },
    });
  }, []);

  // Get sorted and filtered replies
  const getSortedAndFilteredReplies = useCallback(() => {
    let replies = state.replies;
    replies = filterReplies(replies, state.filterBy, currentUser);
    replies = sortReplies(replies, state.sortBy);
    return replies;
  }, [state.replies, state.sortBy, state.filterBy, currentUser]);

  // Helper: Get nested replies structure
  const getNestedReplies = useCallback(() => {
    const repliesMap = {};
    const rootReplies = [];

    // First pass: create map of all replies
    state.replies.forEach((reply) => {
      repliesMap[reply.id] = { ...reply, children: [] };
    });

    // Second pass: build tree structure
    state.replies.forEach((reply) => {
      if (reply.parentId) {
        // This is a nested reply
        if (repliesMap[reply.parentId]) {
          repliesMap[reply.parentId].children.push(repliesMap[reply.id]);
        }
      } else {
        // This is a root reply
        rootReplies.push(repliesMap[reply.id]);
      }
    });

    return rootReplies;
  }, [state.replies]);

  // Helper: Count total replies including nested
  const getTotalReplyCount = useCallback(() => {
    return state.replies.length;
  }, [state.replies]);

  // Helper: Get reply count for specific comment
  const getReplyCount = useCallback(
    (parentId) => {
      return state.replies.filter((r) => r.parentId === parentId).length;
    },
    [state.replies]
  );

  // Reset
  const reset = useCallback(() => {
    dispatch({ type: FORUM_ACTIONS.RESET });
  }, []);

  return {
    // State
    thread: state.thread,
    replies: state.replies,
    replyText: state.replyText,
    replyingTo: state.replyingTo,
    editingReply: state.editingReply,
    isSubmitting: state.isSubmitting,
    isLoading: state.isLoading,
    error: state.error,
    sortBy: state.sortBy,
    filterBy: state.filterBy,

    // Actions
    loadThread,
    setReplyText,
    startReplyTo,
    cancelReply,
    startEditReply,
    cancelEditReply,
    submitReply,
    updateReply,
    deleteReply,
    upvoteReply,
    downvoteReply,
    acceptAnswer,
    togglePinThread,
    toggleCloseThread,
    setSortBy,
    setFilterBy,
    reset,

    // Helpers
    getSortedAndFilteredReplies,
    getNestedReplies,
    getTotalReplyCount,
    getReplyCount,
  };
};
