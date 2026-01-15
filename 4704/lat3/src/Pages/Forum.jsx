import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import Input from "../Components/atoms/Input";
import Select from "../Components/atoms/Select";
import { ForumApi } from "../utils/apis/ForumApi";

const Forum = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("active");
  const [showSolvedOnly, setShowSolvedOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedTag, sortBy, showSolvedOnly]);

  const loadData = async () => {
    try {
      const [threadsData, categoriesData, tagsData] = await Promise.all([
        ForumApi.getThreads(),
        ForumApi.getCategories(),
        ForumApi.getTags(),
      ]);
      setThreads(threadsData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error loading forum data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchQuery,
        categoryId: selectedCategory,
        tag: selectedTag,
        sort: sortBy,
        solved: showSolvedOnly ? true : undefined,
      };
      const filtered = await ForumApi.getThreads(filters);
      setThreads(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID");
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "gray";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">💬 Forum Diskusi</h1>
        <p className="text-indigo-100">
          Bertanya, berbagi pengetahuan, dan berdiskusi dengan komunitas
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === cat.id.toString()
                ? `bg-${cat.color}-100 border-2 border-${cat.color}-500`
                : "hover:shadow-lg"
            }`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat.id.toString() ? "" : cat.id.toString()
              )
            }
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-800">{cat.name}</div>
              <div className="text-xs text-gray-600">{cat.threadCount} threads</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="🔍 Cari diskusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">Semua Tag</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </Select>

          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="active">Terbaru Aktif</option>
            <option value="newest">Terbaru Dibuat</option>
            <option value="popular">Paling Populer</option>
          </Select>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSolvedOnly}
              onChange={(e) => setShowSolvedOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Hanya yang terpecahkan</span>
          </label>

          <Button
            className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/admin/forum/new")}
          >
            + Buat Thread Baru
          </Button>
        </div>
      </Card>

      {/* Thread List */}
      <div className="space-y-3">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(`/admin/forum/${thread.id}`)}
          >
            <div className="flex gap-4">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <button className="text-gray-400 hover:text-green-600 transition">
                  ▲
                </button>
                <div className="text-lg font-bold text-gray-700">{thread.votes}</div>
                <button className="text-gray-400 hover:text-red-600 transition">
                  ▼
                </button>
                <div className="text-xs text-gray-500 mt-2">votes</div>
              </div>

              {/* Thread Info */}
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  {thread.isPinned && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-semibold">
                      📌 PINNED
                    </span>
                  )}
                  {thread.isSolved && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                      ✓ SOLVED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 mb-2">
                  {thread.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {thread.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {thread.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={thread.author.avatar}
                        alt={thread.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium">{thread.author.name}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        {thread.author.badge}
                      </span>
                    </div>
                    <span>• {formatDate(thread.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      👁️ {thread.views}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {thread.replyCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {threads.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada thread ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Coba ubah filter atau buat thread baru
            </p>
            <Button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => navigate("/admin/forum/new")}
            >
              + Buat Thread Baru
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Forum;
