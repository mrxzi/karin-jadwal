export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export interface ScheduleItem {
  id: string;
  subject: string;      // Nama Pelajaran
  room: string;         // Ruangan / Kelas
  teacher: string;      // Nama Guru
  startTime: string;    // Jam Mulai (Format HH:mm, contoh: "07:00")
  endTime: string;      // Jam Selesai (Format HH:mm, contoh: "08:30")
  day: DayOfWeek;       // Hari (Senin - Minggu)
  color?: string;       // Warna tema card (indigo, emerald, violet, rose, amber, sky)
  notes?: string;       // Catatan opsional
  createdAt?: string;
  updatedAt?: string;
}

export interface TodayWidgetResponse {
  day: string;
  date: string;
  formattedDate: string;
  totalClasses: number;
  currentClass: {
    subject: string;
    time: string;
    room: string;
    teacher: string;
    status: 'Sedang Berlangsung' | 'Akan Datang' | 'Selesai Hari Ini';
  } | null;
  nextClass: {
    subject: string;
    time: string;
    room: string;
    teacher: string;
  } | null;
  schedule: Array<{
    id: string;
    subject: string;
    time: string;
    startTime: string;
    endTime: string;
    room: string;
    teacher: string;
    color: string;
    status: 'Sedang Berlangsung' | 'Akan Datang' | 'Selesai';
    isCurrent: boolean;
    isNext: boolean;
    isPast: boolean;
  }>;
}
