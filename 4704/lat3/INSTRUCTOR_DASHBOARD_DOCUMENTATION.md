# 👨‍🏫 Dashboard Instruktur - Dokumentasi

## 📋 Deskripsi Fitur

Dashboard Instruktur adalah fitur komprehensif yang memungkinkan instruktur/dosen untuk memantau performa mahasiswa, mengelola konten pembelajaran, dan menganalisis feedback dari mahasiswa. Dashboard ini menyediakan insights mendalam tentang efektivitas pembelajaran dan identifikasi mahasiswa yang memerlukan bantuan tambahan.

## 🎯 Fitur Utama

### 1. **Analitik Kelas**
Dashboard analitik yang memberikan overview lengkap performa kelas:

#### 📊 Overview Cards
- **Total Mahasiswa**: Jumlah total mahasiswa dengan persentase aktif
- **Rata-rata Nilai**: Nilai rata-rata kelas
- **Penyelesaian Modul**: Persentase penyelesaian modul pembelajaran
- **Total Jam Belajar**: Total akumulasi jam belajar mahasiswa

#### 👥 Distribusi Performa Mahasiswa
Mahasiswa dikategorikan menjadi 3 level:
- **Excellent** (≥80): Mahasiswa berprestasi tinggi
- **Good** (65-79): Mahasiswa dengan performa baik
- **Struggling** (<65): Mahasiswa yang kesulitan

#### 📈 Distribusi Nilai
Visualisasi distribusi nilai dalam 5 range:
- 90-100 (A)
- 80-89 (B)
- 70-79 (C)
- 60-69 (D)
- 0-59 (E)

Setiap range ditampilkan dengan progress bar dan persentase.

#### ⏱️ Analitik Waktu Belajar
Tracking mingguan dengan informasi:
- Total jam belajar per minggu
- Rata-rata jam per mahasiswa
- Peak hours (jam tersibuk belajar)

#### ⚠️ Identifikasi Mahasiswa Kesulitan
Alert khusus untuk mahasiswa yang memerlukan perhatian:
- Highlight mahasiswa dengan nilai < 65
- Informasi detail: nilai, completion rate, jam belajar
- Status badge (excellent/good/struggling)
- Trend indicator (📈 naik, ➡️ stabil, 📉 turun)

#### 📋 Detail Performa Semua Mahasiswa
Tabel lengkap dengan kolom:
- Nama & NIM
- Rata-rata nilai
- Module completion percentage
- Total jam belajar
- Status performa
- Trend (naik/turun/stabil)

### 2. **Manajemen Konten**
Fitur untuk mengelola dan menganalisis konten pembelajaran:

#### 📤 Upload Media
Interface untuk upload konten baru:
- **Form Upload**:
  - Nama File (required)
  - Judul (required)
  - Tipe Media (video/pdf/image)
  - File uploader (UI only - drag & drop simulation)
- **File Info**: Max 500MB, support MP4, PDF, PNG, JPG
- **Action**: Upload button dengan loading state

#### 🖼️ Uploaded Media Grid
Gallery view dari media yang telah diupload:
- Thumbnail preview
- Type badge (video 🎥/pdf 📄)
- File name & upload date
- Size information
- Quick actions: Edit & Delete buttons

#### 📊 Analitik Konten

**Summary Cards**:
- Rata-rata Engagement Rate
- Total Konten
- Total Views

**🔥 Konten Paling Engaging** (Top 3):
- Title & type
- Views & completions count
- Engagement rate (highlighted in green)

**⚠️ Konten yang Perlu Ditingkatkan** (Bottom 3):
- Title & type
- Views & completions count
- Low engagement rate (highlighted in red)

#### 📋 Detail Semua Konten
Tabel komprehensif dengan kolom:
- Judul & Type
- Views count
- Completions count
- **Engagement Rate** (color-coded):
  - Green ≥70% (bagus)
  - Yellow 50-69% (cukup)
  - Red <50% (perlu perbaikan)
- Likes/Dislikes ratio
- Downloads count

### 3. **Feedback Mahasiswa**
Sistem koleksi dan analisis feedback:

#### 📊 Feedback Statistics Cards
- **Total Feedback**: Jumlah total feedback
- **Rata-rata Rating**: Average dari semua rating (1-5)
- **Positive Feedback**: Persentase rating 4-5 bintang

#### ⭐ Distribusi Rating
Progress bar visualization untuk tiap level rating:
- 5 bintang ⭐⭐⭐⭐⭐
- 4 bintang ⭐⭐⭐⭐
- 3 bintang ⭐⭐⭐
- 2 bintang ⭐⭐
- 1 bintang ⭐

Dengan jumlah dan persentase, color-coded:
- Green untuk rating 4-5
- Yellow untuk rating 3
- Red untuk rating 1-2

#### 🔍 Filters
**Filter by Rating**:
- Semua
- 5, 4, 3, 2, 1 bintang

**Filter by Category**:
- Semua
- 📚 Kualitas Konten
- ⏱️ Kecepatan Penyampaian
- 💪 Tingkat Kesulitan
- 🎨 Format Penyajian
- ✍️ Latihan & Tugas
- 🤝 Interaksi Instruktur

#### 💬 Feedback Cards
Setiap feedback ditampilkan dengan:
- **Student Info**: Avatar, nama, konten yang dikomentari
- **Rating**: Star rating display
- **Date**: Tanggal feedback diberikan
- **Comment**: Teks feedback lengkap
- **Category Badge**: Dengan color coding
- **Helpful Count**: Jumlah mahasiswa yang merasa helpful

## 🗂️ Struktur Data

### instructorData.js

```javascript
// 1. instructorClasses
[
  {
    id: 1,
    code: "WEB101",
    name: "Web Development Fundamentals",
    semester: "Ganjil 2024/2025",
    averageScore: 75.3,
    moduleCompletion: 78,
    totalStudents: 42,
    activeStudents: 38
  }
]

// 2. studentPerformanceData
[
  {
    id: 1,
    nama: "Ahmad Rizki",
    nim: "2024001",
    classId: 1,
    averageScore: 85,
    moduleCompletion: 92,
    quizScores: [88, 82, 90],
    studyHours: 45,
    lastActivity: "2024-01-15",
    status: "excellent", // excellent | good | struggling
    trend: "up" // up | down | stable
  }
]

// 3. contentAnalytics
[
  {
    id: 1,
    classId: 1,
    title: "Introduction to HTML & CSS",
    type: "video",
    views: 156,
    completions: 142,
    averageWatchTime: "24:35",
    engagementRate: 91,
    likes: 89,
    dislikes: 3,
    comments: 24,
    downloads: 67
  }
]

// 4. studentFeedback
[
  {
    id: 1,
    contentId: 1,
    contentTitle: "Introduction to HTML & CSS",
    studentName: "Ahmad Rizki",
    rating: 5,
    category: "content_quality",
    comment: "Penjelasan sangat detail...",
    date: "2024-01-12",
    helpful: 12,
    published: true
  }
]

// 5. studyTimeAnalytics
[
  {
    week: "Minggu 1 (1-7 Jan)",
    totalHours: 234,
    averagePerStudent: 5.6,
    peakHours: "19:00-21:00"
  }
]

// 6. scoreDistribution
[
  { range: "90-100", count: 8, percentage: 19 },
  { range: "80-89", count: 12, percentage: 29 },
  { range: "70-79", count: 14, percentage: 33 },
  { range: "60-69", count: 6, percentage: 14 },
  { range: "0-59", count: 2, percentage: 5 }
]

// 7. feedbackCategories
[
  {
    id: "content_quality",
    label: "Kualitas Konten",
    icon: "📚",
    color: "blue"
  }
]

// 8. uploadedMedia
[
  {
    id: 1,
    fileName: "intro-html-css.mp4",
    type: "video",
    size: "245 MB",
    uploadDate: "2024-01-05",
    thumbnail: "https://..."
  }
]
```

## 🔌 API Methods (InstructorApi.jsx)

### Class Management
```javascript
getClasses() // Get all instructor classes
getClassById(classId) // Get specific class details
```

### Student Analytics
```javascript
getStudentPerformance(classId) // Get students filtered by class
getStrugglingStudents(classId) // Get students with score < 65
getAnalyticsSummary(classId) // Get aggregated class statistics
```

### Content Management
```javascript
getContentAnalytics(classId) // Get content filtered by class
getAllContentAnalytics() // Get all content across classes
getContentEngagementStats() // Get top/bottom performers
uploadMedia(mediaData) // Simulate media upload
getUploadedMedia() // Get all uploaded files
deleteMedia(mediaId) // Delete specific media
```

### Feedback & Analytics
```javascript
getStudentFeedback(filters) // Get feedback with optional filters
  // filters: { contentId, rating, category }
getFeedbackStats() // Get feedback statistics
submitFeedback(feedbackData) // Submit new feedback
getScoreDistribution(classId) // Get grade distribution
getStudyTimeAnalytics() // Get weekly study time data
```

### Example Usage:
```javascript
// Get struggling students for intervention
const strugglingStudents = await InstructorApi.getStrugglingStudents(1);

// Get feedback for specific content
const contentFeedback = await InstructorApi.getStudentFeedback({
  contentId: 5,
  rating: 5
});

// Upload new video
const newMedia = await InstructorApi.uploadMedia({
  fileName: "react-hooks.mp4",
  title: "Understanding React Hooks",
  type: "video",
  size: "180 MB",
  thumbnail: "https://..."
});
```

## 🎨 UI Components

### Tabs Navigation
3 tabs dengan active state indicator:
- 📊 Analitik Kelas
- 📚 Manajemen Konten
- 💬 Feedback Mahasiswa

### Class Selector
Dropdown untuk memilih kelas yang akan dianalisis:
```jsx
<Select>
  <option>WEB101 - Web Development Fundamentals (Ganjil 2024/2025)</option>
  <option>DB201 - Database Systems (Ganjil 2024/2025)</option>
  <option>MOB301 - Mobile App Development (Ganjil 2024/2025)</option>
</Select>
```

### Upload Modal
Full-screen modal dengan:
- Form fields (File Name, Title, Type)
- Drag & drop area (UI only)
- Submit/Cancel buttons
- Validation

### Color Coding System
**Student Status**:
- 🟢 Excellent: Green (bg-green-100 text-green-700)
- 🔵 Good: Blue (bg-blue-100 text-blue-700)
- 🔴 Struggling: Red (bg-red-100 text-red-700)

**Engagement Rate**:
- ≥70%: Green (excellent)
- 50-69%: Yellow (good)
- <50%: Red (needs improvement)

**Trend Indicators**:
- 📈 Up: Performance improving
- ➡️ Stable: Consistent performance
- 📉 Down: Performance declining

## 📊 Performance Insights

### Struggling Student Identification
Mahasiswa teridentifikasi sebagai "struggling" jika:
1. Average score < 65, ATAU
2. Status field === "struggling"

Alert khusus ditampilkan dengan:
- Red background highlight
- Warning icon ⚠️
- Count badge
- Intervention suggestions

### Content Engagement Metrics
Konten ranked berdasarkan engagement rate:
- **Most Engaging**: Top 3 content (green highlight)
- **Least Engaging**: Bottom 3 content (red highlight)

Formula: `engagementRate = (completions / views) * 100`

### Feedback Analysis
Positive feedback rate:
```javascript
positiveRate = ((rating5 + rating4) / totalFeedback) * 100
```

## 🚀 Usage Guide

### Untuk Instruktur:

1. **Monitoring Kelas**:
   - Login ke dashboard
   - Navigate ke "Dashboard Instruktur" via sidebar
   - Pilih kelas dari dropdown
   - Review overview cards untuk quick insights

2. **Identifikasi Mahasiswa Kesulitan**:
   - Scroll ke "Mahasiswa yang Memerlukan Perhatian"
   - Check details: nilai, completion rate, jam belajar
   - Note trend indicator untuk lihat perkembangan
   - Plan intervention berdasarkan data

3. **Analisis Konten**:
   - Switch ke tab "Manajemen Konten"
   - Review "Konten Paling Engaging"
   - Identify "Konten yang Perlu Ditingkatkan"
   - Update/replace low-performing content

4. **Upload Media Baru**:
   - Click "Upload Media Baru" button
   - Fill in: File name, Title, Type
   - (UI simulation - actual upload not implemented)
   - Click "Upload Media"

5. **Review Feedback**:
   - Switch ke tab "Feedback Mahasiswa"
   - Check average rating dan positive feedback rate
   - Use filters untuk focus pada:
     * Low ratings (1-2 stars) untuk improvement
     * Specific categories (content quality, pacing, etc.)
   - Read comments untuk actionable insights

## 🔄 Data Flow

```
User Action → Component State → API Call → Mock Data → State Update → UI Render
```

Example:
```
Class Selection → handleClassChange() → loadClassData() → 
InstructorApi.getAnalyticsSummary(classId) → 
instructorData.studentPerformanceData → 
setAnalyticsSummary() → 
Overview Cards Render
```

## 📱 Responsive Design

- **Desktop (lg)**: Full layout dengan semua kolom
- **Tablet (md)**: Grid 2 kolom untuk cards
- **Mobile**: Single column stack layout
- Sidebar collapse pada mobile (icon only)

## 🔐 Access Control

Currently no specific permissions required, but can be integrated with:
```javascript
{user?.permission?.includes("instruktur.page") && (
  <Route path="instruktur" element={<Instruktur />} />
)}
```

## 🎯 Key Features Summary

✅ **Real-time Analytics**: Class performance overview  
✅ **Student Tracking**: Individual performance monitoring  
✅ **Intervention Alerts**: Struggling student identification  
✅ **Content Analytics**: Engagement rate tracking  
✅ **Feedback System**: Student feedback collection & analysis  
✅ **Media Management**: Upload & organize learning materials  
✅ **Trend Analysis**: Performance trends over time  
✅ **Filtering**: Multi-criteria feedback filtering  
✅ **Visual Reports**: Charts, graphs, progress bars  
✅ **Responsive UI**: Works on all device sizes  

## 📈 Future Enhancements

Potential improvements:
1. **Real File Upload**: Implement actual file upload to server/cloud storage
2. **Export Reports**: PDF/Excel export functionality
3. **Email Notifications**: Auto-notify struggling students
4. **Comparative Analysis**: Compare classes performance
5. **Predictive Analytics**: ML-based performance prediction
6. **Live Chat**: Direct messaging with students
7. **Assignment Tracking**: Integration with assignment system
8. **Calendar Integration**: Sync with Google Calendar
9. **Mobile App**: Native iOS/Android app
10. **Advanced Filters**: Date range, multiple criteria

## 🐛 Known Limitations

1. **Upload Media**: UI only simulation, no actual file processing
2. **Delete Media**: Not implemented yet
3. **Edit Media**: Placeholder, no edit functionality
4. **Real-time Updates**: Data doesn't auto-refresh
5. **Pagination**: Feedback list not paginated
6. **Search**: No search functionality for students/content

## 📝 Notes

- All data is mocked via `instructorData.js`
- API calls use `setTimeout` for realistic latency (200-1000ms)
- LocalStorage not used - data resets on refresh
- Ideal for demo/prototype purposes
- Production requires backend integration

## 🔗 Related Components

- [src/Pages/Instruktur.jsx](../Pages/Instruktur.jsx) - Main page
- [src/data/instructorData.js](../data/instructorData.js) - Data structure
- [src/utils/apis/InstructorApi.jsx](../utils/apis/InstructorApi.jsx) - API layer
- [src/Components/organisms/Sidebar.jsx](../Components/organisms/Sidebar.jsx) - Navigation
- [src/App.jsx](../App.jsx) - Routing

---

**Created**: January 2024  
**Version**: 1.0.0  
**Author**: Development Team  
**Status**: ✅ Production Ready (with mock data)
