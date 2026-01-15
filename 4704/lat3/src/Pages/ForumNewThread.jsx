import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import Input from "../Components/atoms/Input";
import Label from "../Components/atoms/Label";
import Select from "../Components/atoms/Select";
import { ForumApi } from "../utils/apis/ForumApi";

const ForumNewThread = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    selectedTags: [],
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        ForumApi.getCategories(),
        ForumApi.getTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleTag = (tag) => {
    const currentTags = formData.selectedTags;
    if (currentTags.includes(tag)) {
      handleChange(
        "selectedTags",
        currentTags.filter((t) => t !== tag)
      );
    } else {
      if (currentTags.length < 5) {
        handleChange("selectedTags", [...currentTags, tag]);
      } else {
        alert("Maksimal 5 tag");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Judul tidak boleh kosong");
      return;
    }

    if (!formData.content.trim()) {
      alert("Konten tidak boleh kosong");
      return;
    }

    if (!formData.categoryId) {
      alert("Pilih kategori");
      return;
    }

    if (formData.selectedTags.length === 0) {
      alert("Pilih minimal 1 tag");
      return;
    }

    try {
      const newThread = await ForumApi.createThread({
        title: formData.title,
        content: formData.content,
        categoryId: parseInt(formData.categoryId),
        tags: formData.selectedTags,
        author: {
          id: currentUser.id || 1,
          name: currentUser.nama || "Current User",
          avatar: "https://i.pravatar.cc/150?img=1",
          reputation: 245,
          badge: "Ahli",
        },
      });

      navigate(`/admin/forum/${newThread.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      alert("Gagal membuat thread");
    }
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

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">✍️ Buat Thread Baru</h1>
        <p className="text-indigo-100">
          Bagikan pertanyaan atau mulai diskusi baru dengan komunitas
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Informasi Thread
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label>
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Tuliskan judul yang deskriptif dan jelas"
                maxLength={150}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.title.length}/150 karakter
              </div>
            </div>

            {/* Category */}
            <div>
              <Label>
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Content */}
            <div>
              <Label>
                Konten <span className="text-red-500">*</span>
              </Label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500"
                rows="12"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Tuliskan pertanyaan atau topik diskusi Anda secara detail...

Tips:
- Jelaskan masalah dengan jelas
- Sertakan contoh kode jika relevan
- Jelaskan apa yang sudah dicoba
- Tambahkan screenshot jika membantu"
              />
              <div className="text-xs text-gray-500 mt-1">
                Minimal 50 karakter • {formData.content.length} karakter
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>
                Tag <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Pilih 1-5 tag yang relevan)
                </span>
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              {formData.selectedTags.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Tag terpilih: {formData.selectedTags.length}/5
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Preview */}
        {formData.title && formData.content && (
          <Card className="mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              👁️ Preview
            </h3>
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {formData.title}
              </h4>
              <div className="text-sm text-gray-600 mb-3">
                Oleh {currentUser.nama || "Current User"} • Baru saja
              </div>
              <div className="text-gray-700 whitespace-pre-wrap mb-3">
                {formData.content}
              </div>
              {formData.selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-gray-800 mb-2">
            📋 Panduan Posting
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Gunakan judul yang jelas dan deskriptif</li>
            <li>✓ Jelaskan masalah dengan detail dan contoh</li>
            <li>✓ Pilih kategori dan tag yang sesuai</li>
            <li>✓ Cari terlebih dahulu apakah pertanyaan serupa sudah ada</li>
            <li>✗ Jangan gunakan bahasa yang kasar atau tidak sopan</li>
            <li>✗ Jangan spam atau posting iklan</li>
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            onClick={() => navigate("/admin/forum")}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            📤 Publish Thread
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForumNewThread;
