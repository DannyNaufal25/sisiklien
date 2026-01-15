import {
  achievements,
  learningPaths,
  userStats,
} from "../../data/achievementsData";

// Simulasi API untuk Achievements & Gamifikasi
export const AchievementsApi = {
  // Get user stats
  getUserStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userStats);
      }, 300);
    });
  },

  // Get all achievements
  getAchievements: (filter = "all") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...achievements];

        if (filter === "unlocked") {
          filtered = filtered.filter((a) => a.unlocked);
        } else if (filter === "locked") {
          filtered = filtered.filter((a) => !a.unlocked);
        } else if (filter !== "all") {
          // Filter by category
          filtered = filtered.filter((a) => a.category === filter);
        }

        resolve(filtered);
      }, 400);
    });
  },

  // Get achievement by ID
  getAchievementById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const achievement = achievements.find((a) => a.id === parseInt(id));
        if (achievement) {
          resolve(achievement);
        } else {
          reject(new Error("Achievement not found"));
        }
      }, 200);
    });
  },

  // Get learning paths
  getLearningPaths: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(learningPaths);
      }, 400);
    });
  },

  // Get learning path by ID
  getLearningPathById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const path = learningPaths.find((p) => p.id === parseInt(id));
        if (path) {
          resolve(path);
        } else {
          reject(new Error("Learning path not found"));
        }
      }, 300);
    });
  },

  // Start module in learning path
  startModule: (pathId, moduleId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const path = learningPaths.find((p) => p.id === parseInt(pathId));
        if (path) {
          const module = path.modules.find((m) => m.id === parseInt(moduleId));
          if (module && module.status === "locked") {
            module.status = "in-progress";
            module.progress = 0;
          }
          resolve(module);
        }
      }, 500);
    });
  },

  // Complete module in learning path
  completeModule: (pathId, moduleId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const path = learningPaths.find((p) => p.id === parseInt(pathId));
        if (path) {
          const module = path.modules.find((m) => m.id === parseInt(moduleId));
          if (module) {
            module.status = "completed";
            module.completedDate = new Date().toISOString().split("T")[0];
            module.progress = 100;
            path.completedModules++;

            // Unlock next module
            const currentIndex = path.modules.findIndex(
              (m) => m.id === parseInt(moduleId)
            );
            if (currentIndex < path.modules.length - 1) {
              const nextModule = path.modules[currentIndex + 1];
              if (nextModule.status === "locked") {
                nextModule.status = "available";
              }
            }
          }
          resolve(module);
        }
      }, 600);
    });
  },

  // Claim achievement reward
  claimAchievement: (achievementId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const achievement = achievements.find(
          (a) => a.id === parseInt(achievementId)
        );
        if (achievement && achievement.unlocked && !achievement.claimed) {
          achievement.claimed = true;
          userStats.totalPoints += achievement.points;
          resolve({
            success: true,
            points: achievement.points,
            newTotalPoints: userStats.totalPoints,
          });
        } else {
          resolve({
            success: false,
            message: "Achievement already claimed or not unlocked",
          });
        }
      }, 400);
    });
  },

  // Get achievements by rarity
  getAchievementsByRarity: (rarity) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = achievements.filter((a) => a.rarity === rarity);
        resolve(filtered);
      }, 300);
    });
  },

  // Get achievements by category
  getAchievementsByCategory: (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = achievements.filter((a) => a.category === category);
        resolve(filtered);
      }, 300);
    });
  },

  // Get achievement stats
  getAchievementStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = achievements.length;
        const unlocked = achievements.filter((a) => a.unlocked).length;
        const byRarity = {
          common: achievements.filter((a) => a.rarity === "common").length,
          rare: achievements.filter((a) => a.rarity === "rare").length,
          epic: achievements.filter((a) => a.rarity === "epic").length,
          legendary: achievements.filter((a) => a.rarity === "legendary")
            .length,
        };
        const byCategory = {
          learning: achievements.filter((a) => a.category === "learning")
            .length,
          consistency: achievements.filter((a) => a.category === "consistency")
            .length,
          mastery: achievements.filter((a) => a.category === "mastery").length,
          community: achievements.filter((a) => a.category === "community")
            .length,
          special: achievements.filter((a) => a.category === "special").length,
        };

        resolve({
          total,
          unlocked,
          locked: total - unlocked,
          percentage: Math.round((unlocked / total) * 100),
          byRarity,
          byCategory,
        });
      }, 400);
    });
  },
};
