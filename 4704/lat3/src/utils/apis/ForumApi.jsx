import {
  forumCategories,
  forumThreads,
  forumReplies,
  forumTags,
  userBadges,
  userReputationHistory,
} from "../../data/forumData";

// Simulasi API untuk Forum
export const ForumApi = {
  // Get all categories
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(forumCategories);
      }, 300);
    });
  },

  // Get all threads with optional filters
  getThreads: (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredThreads = [...forumThreads];

        // Filter by category
        if (filters.categoryId) {
          filteredThreads = filteredThreads.filter(
            (t) => t.categoryId === parseInt(filters.categoryId)
          );
        }

        // Filter by tag
        if (filters.tag) {
          filteredThreads = filteredThreads.filter((t) =>
            t.tags.includes(filters.tag)
          );
        }

        // Filter by search query
        if (filters.search) {
          const query = filters.search.toLowerCase();
          filteredThreads = filteredThreads.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              t.content.toLowerCase().includes(query)
          );
        }

        // Filter by author
        if (filters.author) {
          filteredThreads = filteredThreads.filter((t) =>
            t.author.name.toLowerCase().includes(filters.author.toLowerCase())
          );
        }

        // Filter by solved status
        if (filters.solved !== undefined) {
          filteredThreads = filteredThreads.filter(
            (t) => t.isSolved === filters.solved
          );
        }

        // Sort
        if (filters.sort === "popular") {
          filteredThreads.sort((a, b) => b.votes - a.votes);
        } else if (filters.sort === "newest") {
          filteredThreads.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (filters.sort === "active") {
          filteredThreads.sort(
            (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
          );
        }

        resolve(filteredThreads);
      }, 400);
    });
  },

  // Get thread by ID
  getThreadById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const thread = forumThreads.find((t) => t.id === parseInt(id));
        if (thread) {
          resolve(thread);
        } else {
          reject(new Error("Thread tidak ditemukan"));
        }
      }, 300);
    });
  },

  // Get replies for a thread
  getReplies: (threadId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const replies = forumReplies.filter(
          (r) => r.threadId === parseInt(threadId)
        );
        resolve(replies);
      }, 400);
    });
  },

  // Create new thread
  createThread: (threadData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newThread = {
          id: forumThreads.length + 1,
          ...threadData,
          views: 0,
          votes: 0,
          replyCount: 0,
          isPinned: false,
          isSolved: false,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        };
        forumThreads.unshift(newThread);
        resolve(newThread);
      }, 600);
    });
  },

  // Create reply
  createReply: (replyData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReply = {
          id: forumReplies.length + 1,
          ...replyData,
          votes: 0,
          isAccepted: false,
          createdAt: new Date().toISOString(),
        };
        forumReplies.push(newReply);

        // Update thread reply count and last activity
        const thread = forumThreads.find(
          (t) => t.id === parseInt(replyData.threadId)
        );
        if (thread) {
          thread.replyCount++;
          thread.lastActivity = new Date().toISOString();
        }

        resolve(newReply);
      }, 600);
    });
  },

  // Vote thread
  voteThread: (threadId, direction) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const thread = forumThreads.find((t) => t.id === parseInt(threadId));
        if (thread) {
          thread.votes += direction === "up" ? 1 : -1;
          resolve(thread);
        }
      }, 300);
    });
  },

  // Vote reply
  voteReply: (replyId, direction) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reply = forumReplies.find((r) => r.id === parseInt(replyId));
        if (reply) {
          reply.votes += direction === "up" ? 1 : -1;
          resolve(reply);
        }
      }, 300);
    });
  },

  // Mark thread as solved
  markAsSolved: (threadId, solved = true) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const thread = forumThreads.find((t) => t.id === parseInt(threadId));
        if (thread) {
          thread.isSolved = solved;
          resolve(thread);
        }
      }, 300);
    });
  },

  // Pin/Unpin thread
  togglePin: (threadId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const thread = forumThreads.find((t) => t.id === parseInt(threadId));
        if (thread) {
          thread.isPinned = !thread.isPinned;
          resolve(thread);
        }
      }, 300);
    });
  },

  // Accept answer
  acceptAnswer: (replyId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reply = forumReplies.find((r) => r.id === parseInt(replyId));
        if (reply) {
          // Unaccept other replies in the same thread
          forumReplies.forEach((r) => {
            if (r.threadId === reply.threadId) {
              r.isAccepted = false;
            }
          });
          reply.isAccepted = true;

          // Mark thread as solved
          const thread = forumThreads.find((t) => t.id === reply.threadId);
          if (thread) {
            thread.isSolved = true;
          }

          resolve(reply);
        }
      }, 400);
    });
  },

  // Get all tags
  getTags: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(forumTags);
      }, 200);
    });
  },

  // Get user badges
  getBadges: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userBadges);
      }, 200);
    });
  },

  // Get user reputation history
  getReputationHistory: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userReputationHistory);
      }, 300);
    });
  },

  // Get user reputation data
  getUserReputation: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate reputation data from forum activity
        const userThreads = forumThreads.filter(
          (t) => t.author.id === userId
        );
        const userReplies = forumReplies.filter(
          (r) => r.author.id === userId
        );
        const acceptedAnswers = userReplies.filter((r) => r.isAccepted);

        // Calculate total points
        let totalPoints = 0;
        totalPoints += userThreads.length * 10; // +10 per thread
        totalPoints += userReplies.length * 5; // +5 per reply
        totalPoints += acceptedAnswers.length * 15; // +15 per accepted answer
        
        // Add upvote points
        userReplies.forEach((r) => {
          totalPoints += r.votes * 2; // +2 per upvote
        });

        // Determine current badge
        let currentBadge = "Pemula";
        if (totalPoints >= 2500) currentBadge = "Legend";
        else if (totalPoints >= 1000) currentBadge = "Master";
        else if (totalPoints >= 500) currentBadge = "Ahli";
        else if (totalPoints >= 100) currentBadge = "Kontributor";

        const reputationData = {
          userId,
          totalPoints,
          currentBadge,
          threadsCreated: userThreads.length,
          repliesPosted: userReplies.length,
          acceptedAnswers: acceptedAnswers.length,
          history: userReputationHistory,
        };

        resolve(reputationData);
      }, 400);
    });
  },

  // Report content (UI only)
  // eslint-disable-next-line no-unused-vars
  reportContent: (contentId, type, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Konten berhasil dilaporkan",
        });
      }, 400);
    });
  },
};
