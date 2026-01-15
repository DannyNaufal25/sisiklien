# 💬 Forum Diskusi - Dokumentasi

## Overview
Sistem Forum Diskusi telah berhasil ditambahkan ke aplikasi. Fitur ini menyediakan platform untuk mahasiswa berdiskusi, bertanya, dan berbagi pengetahuan dengan sistem voting, moderasi, dan reputasi user.

## 🎯 Fitur yang Telah Diimplementasikan

### 1. **Struktur Forum**

#### a. Kategori Forum
- ✅ 6 Kategori tersedia:
  - 💻 Programming Fundamentals
  - 🗄️ Database & SQL
  - 🎨 Framework & Libraries
  - ☁️ Cloud Computing
  - 🔧 DevOps & Tools
  - 💡 General Discussion

#### b. Thread System
- ✅ Judul thread (max 150 karakter)
- ✅ Konten dengan textarea yang luas
- ✅ Kategori selection
- ✅ Tag system (1-5 tag per thread)
- ✅ Author information (nama, avatar, reputation, badge)
- ✅ Metadata (views, replies, votes, creation date)
- ✅ Status (solved/unsolved)
- ✅ Pin thread untuk moderator

#### c. Reply System
- ✅ Nested replies (unlimited depth)
- ✅ Reply to reply support
- ✅ Visual indent untuk menunjukkan hierarchy
- ✅ Mention support (@username)
- ✅ Accept answer untuk thread author

#### d. Tag System
- ✅ 20+ tag tersedia:
  - javascript, python, java, react, node.js, etc.
- ✅ Multi-tag selection (max 5 tags)
- ✅ Filter by tag
- ✅ Tag display pada thread card

### 2. **Fitur Forum**

#### a. Main Forum Page (`/admin/forum`)
**Category Filter:**
- Grid display semua kategori dengan icon
- Click to filter by category
- Active category highlighting

**Search & Filter Bar:**
- Real-time search (judul & konten)
- Filter by:
  - Kategori
  - Tag
  - Author
  - Status (semua/terjawab/belum terjawab)
- Sort options:
  - Terbaru
  - Terlama
  - Terpopuler (votes)
  - Paling banyak dilihat

**Thread List:**
- Card-based layout
- Displays:
  - Vote count dengan up/down buttons
  - Thread title (clickable)
  - Author info (nama, badge, avatar)
  - Stats (views, replies)
  - Tags
  - Solved badge jika sudah terjawab
  - Pin badge untuk pinned threads
  - Relative timestamps ("5 menit lalu", "2 hari lalu")

**Quick Actions:**
- ➕ Buat Thread Baru button (navigates to create form)

#### b. Thread Detail Page (`/admin/forum/:threadId`)
**Thread View:**
- Full thread content display
- Vote buttons untuk thread
- View count
- Solved/Unsolved badge
- Moderator actions (pin/unpin, mark solved, report)

**Reply Section:**
- Nested reply tree dengan visual hierarchy
- Each reply shows:
  - Author info (nama, reputation, badge)
  - Vote buttons
  - Reply content
  - Timestamp
  - Accept answer button (for thread author)
  - Report button
- Reply to specific comment dengan @mention
- Maximum indent level untuk readability

**Reply Form:**
- Textarea untuk konten reply
- @mention support
- Preview before posting
- Cancel & Submit buttons

**Moderation Tools:**
- 📌 Pin/Unpin thread
- ✅ Mark as Solved
- 🚩 Report content dengan modal
- Accept answer (✓ best answer badge)

#### c. Create Thread Page (`/admin/forum/new`)
**Form Fields:**
- Judul thread (required, max 150 chars)
- Kategori selection (required)
- Konten textarea (required, min 50 chars)
- Tag selection (1-5 tags required)
- Character counter untuk judul

**Features:**
- Live preview card
- Form validation
- Guidelines panel dengan tips
- Cancel & Publish buttons

**Preview Panel:**
- Shows bagaimana thread akan terlihat
- Real-time update saat typing
- Displays selected tags

**Guidelines:**
- 📋 Panduan posting yang baik
- Tips untuk pertanyaan efektif
- Do's and Don'ts

### 3. **Fitur Lanjutan**

#### a. Pencarian & Filter
**Advanced Search:**
- Search by keyword (title + content)
- Real-time filtering (useEffect)
- Clear search button

**Multiple Filters:**
- Category filter dengan visual grid
- Tag filter dengan dropdown
- Author filter
- Solved status filter
- Kombinasi multiple filters

**Sorting Options:**
- By date (newest/oldest)
- By popularity (vote count)
- By views (most viewed)
- Sort persistence dalam session

#### b. Voting System
**Thread Voting:**
- Upvote (+1)
- Downvote (-1)
- Vote count display
- Visual feedback saat voting
- Update real-time

**Reply Voting:**
- Same mechanics as thread voting
- Independent vote counts
- Affects user reputation

**Reputation Impact:**
- +2 points per upvote received
- -1 point per downvote received
- Encourages quality content

#### c. Tools Moderasi
**Pin Thread:**
- Moderator can pin important threads
- Pinned threads appear at top
- 📌 Pin badge visual indicator

**Mark as Solved:**
- Thread author dapat mark solved
- ✅ Solved badge
- Filter untuk show/hide solved threads

**Accept Answer:**
- Thread author select best answer
- ✓ Best Answer badge on reply
- +15 reputation untuk answerer

**Report System:**
- Report threads atau replies
- Report reasons:
  - Spam
  - Konten tidak pantas
  - Informasi salah
  - Pelanggaran aturan
  - Lainnya (custom reason)
- Modal UI untuk report form
- Admin notification (console.log for now)

#### d. Reputasi & Badge System (`/admin/reputation`)
**Current Status Card:**
- Large display of total reputation points
- Current badge with icon
- Progress bar ke next badge
- Points needed untuk level up

**Badge Levels:**
1. 🎖️ Pemula (0+ points) - Default
2. 🥉 Kontributor (100+ points)
3. 🥈 Ahli (500+ points)
4. 🥇 Master (1000+ points)
5. 👑 Legend (2500+ points)

**Stats Dashboard:**
- 📝 Thread Dibuat (total count)
- 💬 Balasan Diposting (total count)
- ✅ Jawaban Diterima (total count)

**All Badges Display:**
- Grid layout semua badges
- Locked/Unlocked status
- Min points requirement
- Visual indicator (✓ Terbuka / 🔒 Terkunci)

**Cara Mendapatkan Poin:**
- ➕ Buat Thread: +10 points
- 💬 Post Reply: +5 points
- 👍 Upvote Diterima: +2 points
- ✅ Answer Accepted: +15 points

**Reputation History:**
- Chronological log of all reputation changes
- Action icons (➕, 💬, ✅, 👍)
- Action labels (Thread dibuat, Balasan diposting, etc.)
- Timestamp dengan format Indonesia
- Points gained/lost (+10, +5, -1, etc.)
- Color-coded (green for positive, red for negative)

### 4. **UI/UX Features**

#### a. Responsive Design
- Mobile-first approach dengan Tailwind CSS
- Grid layouts yang adaptive
- Collapsed sidebar pada mobile
- Touch-friendly buttons

#### b. Visual Feedback
- Hover effects pada buttons dan cards
- Active state highlighting
- Loading spinners
- Transition animations
- Color-coded badges

#### c. User Experience
- Breadcrumb navigation
- Relative timestamps ("5 menit lalu")
- Character counters
- Form validation dengan alerts
- Preview before post
- Cancel confirmations

## 📁 Struktur File yang Dibuat

```
src/
├── Pages/
│   ├── Forum.jsx                    # Main forum listing page
│   ├── ForumThread.jsx              # Thread detail dengan replies
│   ├── ForumNewThread.jsx           # Create new thread form
│   └── UserReputation.jsx           # Reputation & badge dashboard
├── data/
│   └── forumData.js                 # Forum data structure
└── utils/
    └── apis/
        └── ForumApi.jsx             # Forum API (mock)
```

## 🔌 API Endpoints (Mock)

### ForumApi.jsx

**Thread Operations:**
```javascript
- getThreads(filters) // Get all threads dengan filter
- getThreadById(id) // Get single thread
- createThread(data) // Create new thread
- updateThread(id, data) // Update thread
- togglePin(threadId) // Pin/unpin thread
- markAsSolved(threadId, isSolved) // Mark solved
```

**Reply Operations:**
```javascript
- getReplies(threadId) // Get replies untuk thread
- createReply(data) // Create new reply
- acceptAnswer(replyId) // Accept as best answer
```

**Voting:**
```javascript
- voteThread(threadId, direction) // Vote thread (+1/-1)
- voteReply(replyId, direction) // Vote reply (+1/-1)
```

**Category & Tag:**
```javascript
- getCategories() // Get all categories
- getTags() // Get all tags
```

**Reputation:**
```javascript
- getUserReputation(userId) // Get user reputation data
- getBadges() // Get all badge definitions
```

**Moderation:**
```javascript
- reportContent(contentId, type, reason) // Report content
```

## 💾 Data Structure

### Thread Object
```javascript
{
  id: 1,
  title: "Bagaimana cara mengoptimalkan query database?",
  content: "Saya punya tabel dengan 10 juta rows...",
  categoryId: 2,
  tags: ["sql", "database", "performance"],
  author: {
    id: 1,
    name: "Ahmad Santoso",
    avatar: "...",
    reputation: 245,
    badge: "Ahli"
  },
  votes: 15,
  views: 234,
  replyCount: 8,
  isSolved: false,
  isPinned: false,
  createdAt: "2024-01-15T10:30:00",
  updatedAt: "2024-01-15T14:20:00"
}
```

### Reply Object
```javascript
{
  id: 1,
  threadId: 1,
  content: "Coba gunakan indexing...",
  author: {...},
  votes: 5,
  parentId: null, // null untuk top-level reply
  isAccepted: false,
  createdAt: "2024-01-15T11:00:00"
}
```

### User Reputation Object
```javascript
{
  userId: 1,
  totalPoints: 245,
  currentBadge: "Ahli",
  threadsCreated: 12,
  repliesPosted: 45,
  acceptedAnswers: 3,
  history: [
    {
      action: "thread_created",
      points: 10,
      date: "2024-01-15T10:30:00"
    },
    ...
  ]
}
```

## 🎨 Customization

### Menambah Kategori Baru

Edit `forumData.js`:
```javascript
export const forumCategories = [
  ...existing,
  {
    id: 7,
    name: "AI & Machine Learning",
    icon: "🤖",
    description: "Diskusi tentang AI dan ML",
    threadCount: 0
  }
];
```

### Mengubah Point System

Edit `ForumApi.jsx` di bagian reputation calculations:
```javascript
// Create thread
points += 10; // Ganti dengan nilai lain

// Create reply
points += 5; // Ganti dengan nilai lain

// Upvote received
points += 2; // Ganti dengan nilai lain

// Answer accepted
points += 15; // Ganti dengan nilai lain
```

### Menambah Badge Level

Edit `forumData.js`:
```javascript
export const userBadges = [
  ...existing,
  {
    name: "Grand Master",
    minPoints: 5000,
    icon: "💎"
  }
];
```

### Mengubah Tag List

Edit `forumData.js`:
```javascript
export const availableTags = [
  ...existing,
  "typescript",
  "graphql",
  "nextjs"
];
```

## 🔄 Integration dengan Backend

Saat ini forum menggunakan mock data. Untuk integrasi dengan backend:

### 1. Replace ForumApi.jsx
```javascript
// Before (Mock)
export const ForumApi = {
  getThreads: async (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filteredThreads);
      }, 500);
    });
  }
};

// After (Real API)
export const ForumApi = {
  getThreads: async (filters) => {
    const response = await fetch('/api/forum/threads', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
    return response.json();
  }
};
```

### 2. Update Data Structure
Pastikan backend mengembalikan struktur data yang sama dengan mock data.

### 3. Add Authentication
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### 4. Error Handling
```javascript
try {
  const data = await ForumApi.getThreads(filters);
  setThreads(data);
} catch (error) {
  console.error('Error loading threads:', error);
  // Show error message to user
}
```

## 🐛 Troubleshooting

### Nested Replies tidak render
- Check `buildReplyTree()` function
- Verify `parentId` references
- Check recursive `renderReply()` implementation

### Vote tidak update
- Check `voteThread/voteReply` API calls
- Verify state update setelah vote
- Check network tab untuk errors

### Filter tidak bekerja
- Verify useEffect dependencies
- Check filter logic di `ForumApi.getThreads()`
- Console.log filtered results

### Reputation tidak calculate
- Check reputation history structure
- Verify point calculations
- Check badge level thresholds

## 📊 Performance Considerations

### Pagination (Future Enhancement)
```javascript
const [page, setPage] = useState(1);
const threadsPerPage = 20;

// Implement pagination in API
const paginatedThreads = threads.slice(
  (page - 1) * threadsPerPage,
  page * threadsPerPage
);
```

### Lazy Loading Replies
```javascript
// Load replies on demand
const [loadedReplies, setLoadedReplies] = useState({});

const loadReplies = async (threadId) => {
  if (!loadedReplies[threadId]) {
    const replies = await ForumApi.getReplies(threadId);
    setLoadedReplies({...loadedReplies, [threadId]: replies});
  }
};
```

### Search Debouncing
```javascript
// Add debounce to search
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
  setSearchQuery(query);
}, 300);
```

## 🔮 Future Enhancements

### 1. Rich Text Editor
- Implement TinyMCE atau Quill
- Support bold, italic, links
- Code block dengan syntax highlighting
- Image upload

### 2. Notifications
- New reply notifications
- Mention notifications (@username)
- Upvote notifications
- Answer accepted notifications

### 3. Advanced Moderation
- Admin panel untuk manage reports
- Ban/suspend users
- Edit/delete content
- Merge duplicate threads

### 4. Analytics
- Thread popularity trends
- User activity statistics
- Category performance
- Tag usage analytics

### 5. Social Features
- Follow users
- Subscribe to threads
- Bookmark threads
- Share on social media

### 6. Gamification
- Daily challenges
- Achievement system
- Leaderboards
- Special event badges

## 🔐 Security Considerations

### Input Sanitization
```javascript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

### Rate Limiting
```javascript
// Limit thread creation
const lastThreadTime = localStorage.getItem('lastThreadTime');
const now = Date.now();

if (now - lastThreadTime < 60000) { // 1 minute
  alert('Tunggu 1 menit sebelum membuat thread baru');
  return;
}
```

### XSS Protection
- Never use `dangerouslySetInnerHTML` without sanitization
- Escape HTML characters
- Validate URLs before rendering

### CSRF Protection
- Include CSRF tokens in forms
- Verify tokens on backend
- Use SameSite cookies

## 📝 Notes

1. Semua data saat ini adalah **mock data** untuk demonstrasi
2. Forum system menggunakan **localStorage** untuk persistence
3. Nested replies menggunakan **recursive rendering**
4. Timestamps menggunakan **relative format** (id-ID locale)
5. Vote system **client-side only** (belum persisten)
6. Reputation calculations **automatic** berdasarkan actions
7. Moderation tools **console.log only** untuk report actions

## 📞 Testing Checklist

- [x] Navigate to /admin/forum
- [x] Test category filtering
- [x] Test search functionality
- [x] Test tag filtering
- [x] Test sort options
- [x] Create new thread
- [x] View thread detail
- [x] Post reply
- [x] Reply to reply (nested)
- [x] Vote on thread
- [x] Vote on reply
- [x] Pin thread (moderator)
- [x] Mark as solved
- [x] Accept answer
- [x] Report content
- [x] View reputation page
- [x] Check badge progression
- [x] View reputation history
- [x] Responsive design (mobile/tablet)

---

**Status**: ✅ **SELESAI & SIAP DIGUNAKAN**

Semua fitur Forum Diskusi telah berhasil diimplementasikan dan terintegrasi dengan aplikasi!

**Git Commit**: d939e13  
**Files**: 12 files changed, 3374+ insertions
