import { useQuery } from "@tanstack/react-query";

// Generate mock analytics data
const generateAnalyticsData = () => {
  const currentDate = new Date();
  
  // Helper to get date string
  const getDateString = (daysAgo) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  // Weekly Progress Data (last 4 weeks)
  const weeklyProgress = [
    { week: 'Minggu 1', modulSelesai: 2, target: 3, waktuBelajar: 8 },
    { week: 'Minggu 2', modulSelesai: 3, target: 3, waktuBelajar: 12 },
    { week: 'Minggu 3', modulSelesai: 4, target: 3, waktuBelajar: 15 },
    { week: 'Minggu 4', modulSelesai: 5, target: 3, waktuBelajar: 18 },
  ];

  // Study Time by Category
  const studyTimeByCategory = [
    { kategori: 'Programming', jam: 25, modul: 8 },
    { kategori: 'Database', jam: 15, modul: 5 },
    { kategori: 'Network', jam: 12, modul: 4 },
    { kategori: 'Web Development', jam: 20, modul: 7 },
    { kategori: 'Mobile Dev', jam: 10, modul: 3 },
  ];

  // Module Status Distribution
  const moduleStatus = [
    { status: 'Selesai', jumlah: 14, persentase: 35 },
    { status: 'Sedang Berjalan', jumlah: 6, persentase: 15 },
    { status: 'Belum Dimulai', jumlah: 20, persentase: 50 },
  ];

  // Accumulated Study Hours (last 30 days)
  const accumulatedHours = Array.from({ length: 30 }, (_, i) => ({
    tanggal: getDateString(29 - i),
    jam: Math.floor(Math.random() * 3) + 1,
    akumulasi: (i + 1) * 2 + Math.floor(Math.random() * 5),
  }));

  // Skills Assessment (Radar Chart)
  const skillsAssessment = [
    { kategori: 'Programming', nilai: 85, target: 90 },
    { kategori: 'Database', nilai: 70, target: 80 },
    { kategori: 'Network', nilai: 65, target: 75 },
    { kategori: 'Web Dev', nilai: 90, target: 95 },
    { kategori: 'Mobile Dev', nilai: 60, target: 70 },
    { kategori: 'Cloud', nilai: 55, target: 65 },
  ];

  // Daily Study Pattern
  const dailyPattern = [
    { hari: 'Sen', jam: 3, modul: 2 },
    { hari: 'Sel', jam: 2.5, modul: 1 },
    { hari: 'Rab', jam: 4, modul: 2 },
    { hari: 'Kam', jam: 3.5, modul: 2 },
    { hari: 'Jum', jam: 2, modul: 1 },
    { hari: 'Sab', jam: 5, modul: 3 },
    { hari: 'Min', jam: 4.5, modul: 2 },
  ];

  // Summary Statistics
  const summary = {
    totalModul: 40,
    modulSelesai: 14,
    modulBerjalan: 6,
    modulBelumDimulai: 20,
    totalJamBelajar: 82,
    jamBelajarMingguIni: 18,
    poinPencapaian: 1450,
    streakHari: 7,
    targetHariIni: 3,
    progressTargetHariIni: 2,
    modulTerakhir: {
      id: 'modul-14',
      judul: 'Advanced React Hooks',
      progress: 75,
      kategori: 'Web Development'
    },
    rekomendasiModul: [
      {
        id: 'modul-15',
        judul: 'React Context API',
        kategori: 'Web Development',
        estimasiWaktu: '2 jam',
        tingkatKesulitan: 'Menengah'
      },
      {
        id: 'modul-16',
        judul: 'React Query Basics',
        kategori: 'Web Development',
        estimasiWaktu: '3 jam',
        tingkatKesulitan: 'Menengah'
      },
      {
        id: 'modul-17',
        judul: 'State Management with Redux',
        kategori: 'Web Development',
        estimasiWaktu: '4 jam',
        tingkatKesulitan: 'Lanjutan'
      }
    ],
    bookmarkedModul: [
      {
        id: 'modul-8',
        judul: 'Database Normalization',
        kategori: 'Database'
      },
      {
        id: 'modul-12',
        judul: 'RESTful API Design',
        kategori: 'Web Development'
      },
      {
        id: 'modul-20',
        judul: 'Docker Fundamentals',
        kategori: 'Cloud'
      }
    ],
    achievementsBadges: [
      { nama: 'First Step', deskripsi: 'Menyelesaikan modul pertama', earned: true },
      { nama: '7 Day Streak', deskripsi: 'Belajar 7 hari berturut-turut', earned: true },
      { nama: 'Fast Learner', deskripsi: 'Menyelesaikan 10 modul', earned: true },
      { nama: 'Night Owl', deskripsi: 'Belajar di malam hari', earned: false },
    ]
  };

  return {
    weeklyProgress,
    studyTimeByCategory,
    moduleStatus,
    accumulatedHours,
    skillsAssessment,
    dailyPattern,
    summary,
  };
};

// Fetch function with delay to simulate API call
const fetchAnalyticsData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateAnalyticsData();
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
