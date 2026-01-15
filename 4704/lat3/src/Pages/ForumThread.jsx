import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import { ForumApi } from "../utils/apis/ForumApi";

const ForumThread = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadThreadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const loadThreadData = async () => {
    try {
      const [threadData, repliesData] = await Promise.all([
        ForumApi.getThreadById(threadId),
        ForumApi.getReplies(threadId),
      ]);
      setThread(threadData);
      setReplies(repliesData);
    } catch (error) {
      console.error("Error loading thread:", error);
      navigate("/admin/forum");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteThread = async (direction) => {
    try {
      const updated = await ForumApi.voteThread(threadId, direction);
      setThread(updated);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleVoteReply = async (replyId, direction) => {
    try {
      const updated = await ForumApi.voteReply(replyId, direction);
      setReplies(
        replies.map((r) => (r.id === updated.id ? updated : r))
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    try {
      const newReply = await ForumApi.createReply({
        threadId: parseInt(threadId),
        content: replyText,
        author: {
          id: currentUser.id || 1,
          name: currentUser.nama || "Current User",
          avatar: "https://i.pravatar.cc/150?img=1",
          reputation: 245,
          badge: "Ahli",
        },
        parentId: replyingTo,
      });

      setReplies([...replies, newReply]);
      setReplyText("");
      setReplyingTo(null);
      loadThreadData(); // Reload to update reply count
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  const handleAcceptAnswer = async (replyId) => {
    try {
      await ForumApi.acceptAnswer(replyId);
      loadThreadData();
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
  };

  const handleTogglePin = async () => {
    try {
      await ForumApi.togglePin(threadId);
      loadThreadData();
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const handleMarkSolved = async () => {
    try {
      await ForumApi.markAsSolved(threadId, !thread.isSolved);
      loadThreadData();
    } catch (error) {
      console.error("Error marking solved:", error);
    }
  };

  const handleReport = async (reason) => {
    try {
      await ForumApi.reportContent(threadId, "thread", reason);
      alert("Konten berhasil dilaporkan. Tim moderator akan meninjau segera.");
      setShowReportModal(false);
    } catch (error) {
      console.error("Error reporting:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const buildReplyTree = (replies) => {
    const replyMap = {};
    const rootReplies = [];

    replies.forEach((reply) => {
      replyMap[reply.id] = { ...reply, children: [] };
    });

    replies.forEach((reply) => {
      if (reply.parentId) {
        if (replyMap[reply.parentId]) {
          replyMap[reply.parentId].children.push(replyMap[reply.id]);
        }
      } else {
        rootReplies.push(replyMap[reply.id]);
      }
    });

    return rootReplies;
  };

  const renderReply = (reply, depth = 0) => {
    return (
      <div key={reply.id} className={`${depth > 0 ? "ml-12 mt-4" : "mt-4"}`}>
        <Card
          className={`${
            reply.isAccepted
              ? "border-2 border-green-500 bg-green-50"
              : ""
          }`}
        >
          <div className="flex gap-4">
            {/* Vote */}
            <div className="flex flex-col items-center gap-1">
              <button
                className="text-gray-400 hover:text-green-600 transition"
                onClick={() => handleVoteReply(reply.id, "up")}
              >
                ▲
              </button>
              <div className="text-sm font-bold text-gray-700">{reply.votes}</div>
              <button
                className="text-gray-400 hover:text-red-600 transition"
                onClick={() => handleVoteReply(reply.id, "down")}
              >
                ▼
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              {reply.isAccepted && (
                <div className="bg-green-600 text-white text-xs px-3 py-1 rounded inline-block mb-2 font-semibold">
                  ✓ Jawaban Diterima
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <img
                  src={reply.author.avatar}
                  alt={reply.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    {reply.author.name}
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {reply.author.badge}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ⭐ {reply.author.reputation} poin
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(reply.createdAt)}
                  </div>
                </div>
              </div>

              <div className="text-gray-700 mb-3 whitespace-pre-wrap">
                {reply.content}
              </div>

              <div className="flex gap-2">
                <Button
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                  onClick={() => {
                    setReplyingTo(reply.id);
                    setReplyText(`@${reply.author.name} `);
                  }}
                >
                  💬 Balas
                </Button>

                {!reply.isAccepted && thread?.author.id === currentUser.id && (
                  <Button
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                    onClick={() => handleAcceptAnswer(reply.id)}
                  >
                    ✓ Terima Jawaban
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Nested Replies */}
        {reply.children && reply.children.map((child) => renderReply(child, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat diskusi...</p>
        </div>
      </div>
    );
  }

  const replyTree = buildReplyTree(replies);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => navigate("/admin/forum")}
          className="hover:text-blue-600"
        >
          Forum
        </button>
        <span>/</span>
        <span className="text-gray-800 font-medium">{thread.title}</span>
      </div>

      {/* Thread Card */}
      <Card>
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1">
            <button
              className="text-gray-400 hover:text-green-600 transition text-2xl"
              onClick={() => handleVoteThread("up")}
            >
              ▲
            </button>
            <div className="text-2xl font-bold text-gray-700">{thread.votes}</div>
            <button
              className="text-gray-400 hover:text-red-600 transition text-2xl"
              onClick={() => handleVoteThread("down")}
            >
              ▼
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Status Badges */}
            <div className="flex gap-2 mb-3">
              {thread.isPinned && (
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded font-semibold">
                  📌 PINNED
                </span>
              )}
              {thread.isSolved && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded font-semibold">
                  ✓ SOLVED
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {thread.title}
            </h1>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <img
                  src={thread.author.avatar}
                  alt={thread.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    {thread.author.name}
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {thread.author.badge}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(thread.createdAt)}
                  </div>
                </div>
              </div>
              <span>• 👁️ {thread.views} views</span>
              <span>• 💬 {thread.replyCount} replies</span>
            </div>

            <div className="prose max-w-none mb-4 text-gray-700 whitespace-pre-wrap">
              {thread.content}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {thread.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Moderator Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
                onClick={handleTogglePin}
              >
                {thread.isPinned ? "📌 Unpin" : "📌 Pin Thread"}
              </Button>
              <Button
                className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200"
                onClick={handleMarkSolved}
              >
                {thread.isSolved ? "↩️ Mark Unsolved" : "✓ Mark Solved"}
              </Button>
              <Button
                className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
                onClick={() => setShowReportModal(true)}
              >
                🚩 Report
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Replies Section */}
      <Card>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          💬 {replies.length} Balasan
        </h2>

        {replyTree.map((reply) => renderReply(reply))}

        {replies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>Belum ada balasan. Jadilah yang pertama!</p>
          </div>
        )}
      </Card>

      {/* Reply Form */}
      <Card>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {replyingTo ? "Balas Komentar" : "Tulis Balasan"}
        </h3>
        {replyingTo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-blue-700">
                Membalas komentar...
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className="text-blue-700 hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 mb-3"
          rows="5"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Tulis balasan Anda di sini... Gunakan @nama untuk mention user"
        />
        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={handleSubmitReply}
        >
          📤 Kirim Balasan
        </Button>
      </Card>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md">
            <h3 className="text-xl font-bold mb-4">🚩 Laporkan Konten</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pilih alasan pelaporan:
            </p>
            <div className="space-y-2">
              {["Spam", "Konten Tidak Pantas", "Harassment", "Misleading Information", "Lainnya"].map(
                (reason) => (
                  <button
                    key={reason}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50 transition"
                    onClick={() => handleReport(reason)}
                  >
                    {reason}
                  </button>
                )
              )}
            </div>
            <Button
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              onClick={() => setShowReportModal(false)}
            >
              Batal
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ForumThread;
