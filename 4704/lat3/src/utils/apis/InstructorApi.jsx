import {
  instructorClasses,
  studentPerformanceData,
  contentAnalytics,
  studentFeedback,
  studyTimeAnalytics,
  scoreDistribution,
  uploadedMedia,
} from "../../data/instructorData";

// Simulasi API untuk Dashboard Instruktur
export const InstructorApi = {
  // Get all classes for instructor
  getClasses: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(instructorClasses);
      }, 300);
    });
  },

  // Get class by ID
  getClassById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classData = instructorClasses.find((c) => c.id === parseInt(id));
        if (classData) {
          resolve(classData);
        } else {
          reject(new Error("Class not found"));
        }
      }, 200);
    });
  },

  // Get student performance data for a class
  getStudentPerformance: (classId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const students = studentPerformanceData.filter(
          (s) => s.classId === parseInt(classId)
        );
        resolve(students);
      }, 400);
    });
  },

  // Get struggling students (score < 65)
  getStrugglingStudents: (classId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const struggling = studentPerformanceData.filter(
          (s) =>
            s.classId === parseInt(classId) &&
            (s.status === "struggling" || s.averageScore < 65)
        );
        resolve(struggling);
      }, 300);
    });
  },

  // Get content analytics for a class
  getContentAnalytics: (classId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = contentAnalytics.filter(
          (c) => c.classId === parseInt(classId)
        );
        resolve(content);
      }, 400);
    });
  },

  // Get all content analytics
  getAllContentAnalytics: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(contentAnalytics);
      }, 300);
    });
  },

  // Get student feedback
  getStudentFeedback: (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...studentFeedback];

        if (filters.contentId) {
          filtered = filtered.filter(
            (f) => f.contentId === parseInt(filters.contentId)
          );
        }

        if (filters.rating) {
          filtered = filtered.filter(
            (f) => f.rating === parseInt(filters.rating)
          );
        }

        if (filters.category) {
          filtered = filtered.filter((f) => f.category === filters.category);
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        resolve(filtered);
      }, 400);
    });
  },

  // Get study time analytics
  getStudyTimeAnalytics: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studyTimeAnalytics);
      }, 300);
    });
  },

  // Get score distribution
  getScoreDistribution: (classId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(scoreDistribution);
      }, 300);
    });
  },

  // Upload media (UI only - simulation)
  uploadMedia: (mediaData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMedia = {
          id: uploadedMedia.length + 1,
          ...mediaData,
          uploadDate: new Date().toISOString(),
          status: "published",
        };
        uploadedMedia.push(newMedia);
        resolve(newMedia);
      }, 1000);
    });
  },

  // Get uploaded media
  getUploadedMedia: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(uploadedMedia);
      }, 300);
    });
  },

  // Delete media
  deleteMedia: (mediaId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = uploadedMedia.findIndex(
          (m) => m.id === parseInt(mediaId)
        );
        if (index !== -1) {
          uploadedMedia.splice(index, 1);
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "Media not found" });
        }
      }, 400);
    });
  },

  // Submit feedback (for students)
  submitFeedback: (feedbackData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFeedback = {
          id: studentFeedback.length + 1,
          ...feedbackData,
          date: new Date().toISOString(),
          helpful: 0,
          status: "published",
        };
        studentFeedback.push(newFeedback);
        resolve(newFeedback);
      }, 500);
    });
  },

  // Get analytics summary
  getAnalyticsSummary: (classId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const classData = instructorClasses.find(
          (c) => c.id === parseInt(classId)
        );
        const students = studentPerformanceData.filter(
          (s) => s.classId === parseInt(classId)
        );

        const excellentStudents = students.filter(
          (s) => s.status === "excellent"
        ).length;
        const goodStudents = students.filter((s) => s.status === "good").length;
        const strugglingStudents = students.filter(
          (s) => s.status === "struggling"
        ).length;

        const summary = {
          class: classData,
          totalStudents: students.length,
          excellentStudents,
          goodStudents,
          strugglingStudents,
          averageScore: classData?.averageScore || 0,
          completionRate: classData?.moduleCompletion || 0,
          totalStudyHours: classData?.totalStudyHours || 0,
          activeRate: classData
            ? Math.round((classData.activeStudents / classData.totalStudents) * 100)
            : 0,
        };

        resolve(summary);
      }, 400);
    });
  },

  // Get most/least engaging content
  getContentEngagementStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...contentAnalytics].sort(
          (a, b) => b.engagementRate - a.engagementRate
        );

        resolve({
          mostEngaging: sorted.slice(0, 3),
          leastEngaging: sorted.slice(-3).reverse(),
          averageEngagement:
            sorted.reduce((sum, c) => sum + c.engagementRate, 0) /
            sorted.length,
        });
      }, 300);
    });
  },

  // Get feedback stats
  getFeedbackStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = studentFeedback.length;
        const averageRating =
          studentFeedback.reduce((sum, f) => sum + f.rating, 0) / total;

        const byRating = {
          5: studentFeedback.filter((f) => f.rating === 5).length,
          4: studentFeedback.filter((f) => f.rating === 4).length,
          3: studentFeedback.filter((f) => f.rating === 3).length,
          2: studentFeedback.filter((f) => f.rating === 2).length,
          1: studentFeedback.filter((f) => f.rating === 1).length,
        };

        const byCategory = {};
        studentFeedback.forEach((f) => {
          byCategory[f.category] = (byCategory[f.category] || 0) + 1;
        });

        resolve({
          total,
          averageRating: averageRating.toFixed(1),
          byRating,
          byCategory,
        });
      }, 400);
    });
  },
};
