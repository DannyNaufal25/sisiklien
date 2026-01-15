import React, { useState, useEffect } from "react";
import Card from "../Components/atoms/Card";
import { ForumApi } from "../utils/apis/ForumApi";

const UserReputation = () => {
  const [reputationData, setReputationData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const loadReputationData = async () => {
    try {
      const data = await ForumApi.getUserReputation(currentUser.id || 1);
      setReputationData(data);
      
      const allBadges = await ForumApi.getBadges();
      setBadges(allBadges);
    } catch (error) {
      console.error("Error loading reputation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReputationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action) => {
    const icons = {
      thread_created: "➕",
      reply_posted: "💬",
      answer_accepted: "✅",
      upvote_received: "👍",
      helpful_answer: "🌟",
    };
    return icons[action] || "•";
  };

  const getActionLabel = (action) => {
    const labels = {
      thread_created: "Thread dibuat",
      reply_posted: "Balasan diposting",
      answer_accepted: "Jawaban diterima",
      upvote_received: "Upvote diterima",
      helpful_answer: "Jawaban membantu",
    };
    return labels[action] || action;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!reputationData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Data reputasi tidak ditemukan</p>
      </div>
    );
  }

  const currentBadge = badges.find((b) => b.name === reputationData.currentBadge);
  const nextBadge = badges.find((b) => b.minPoints > reputationData.totalPoints);
  const progressToNext = nextBadge
    ? ((reputationData.totalPoints - (currentBadge?.minPoints || 0)) /
        (nextBadge.minPoints - (currentBadge?.minPoints || 0))) *
      100
    : 100;

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🏆 Reputasi & Badge</h1>
        <p className="text-purple-100">
          Tingkatkan reputasi Anda dengan berkontribusi di forum
        </p>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentUser.nama || "Current User"}
            </h2>
            <p className="text-gray-600">Member sejak 2024</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-indigo-600">
              {reputationData.totalPoints}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Total Poin Reputasi
            </div>
          </div>
        </div>

        {/* Current Badge */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentBadge?.icon || "🎖️"}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Badge Saat Ini</div>
              <div className="text-2xl font-bold text-gray-800">
                {reputationData.currentBadge}
              </div>
              <div className="text-sm text-gray-600">
                {currentBadge?.minPoints || 0}+ poin
              </div>
            </div>
          </div>
        </div>

        {/* Progress to Next Badge */}
        {nextBadge && (
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress ke {nextBadge.name}
              </span>
              <span className="text-sm text-gray-600">
                {reputationData.totalPoints} / {nextBadge.minPoints}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {nextBadge.minPoints - reputationData.totalPoints} poin lagi untuk
              naik level
            </div>
          </div>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-3xl font-bold text-gray-800">
            {reputationData.threadsCreated}
          </div>
          <div className="text-sm text-gray-600">Thread Dibuat</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <div className="text-3xl font-bold text-gray-800">
            {reputationData.repliesPosted}
          </div>
          <div className="text-sm text-gray-600">Balasan Diposting</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold text-gray-800">
            {reputationData.acceptedAnswers}
          </div>
          <div className="text-sm text-gray-600">Jawaban Diterima</div>
        </Card>
      </div>

      {/* All Badges */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🎖️ Semua Badge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = reputationData.totalPoints >= badge.minPoints;
            return (
              <div
                key={badge.name}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{badge.name}</div>
                    <div className="text-xs text-gray-600">
                      {badge.minPoints}+ poin
                    </div>
                    {isUnlocked && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        ✓ Terbuka
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="text-xs text-gray-500 mt-1">
                        🔒 Terkunci
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* How to Earn Points */}
      <Card className="bg-green-50 border-green-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💡 Cara Mendapatkan Poin
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl">➕</div>
            <div>
              <div className="font-semibold text-gray-800">Buat Thread</div>
              <div className="text-sm text-gray-600">+10 poin per thread</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">💬</div>
            <div>
              <div className="font-semibold text-gray-800">Posting Balasan</div>
              <div className="text-sm text-gray-600">+5 poin per balasan</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">👍</div>
            <div>
              <div className="font-semibold text-gray-800">
                Dapatkan Upvote
              </div>
              <div className="text-sm text-gray-600">
                +2 poin per upvote pada balasan
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="font-semibold text-gray-800">
                Jawaban Diterima
              </div>
              <div className="text-sm text-gray-600">
                +15 poin jika jawaban diterima sebagai solusi
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reputation History */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📊 Riwayat Reputasi
        </h2>
        <div className="space-y-3">
          {reputationData.history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada riwayat reputasi
            </div>
          ) : (
            reputationData.history.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getActionIcon(item.action)}</div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {getActionLabel(item.action)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(item.date)}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-bold text-lg ${
                    item.points > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.points > 0 ? "+" : ""}
                  {item.points}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserReputation;
