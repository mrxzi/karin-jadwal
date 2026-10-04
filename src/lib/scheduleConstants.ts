import { ScheduleItem, DayOfWeek } from '@/types/schedule';

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  // Senin
  {
    id: 'karin-sen-1',
    subject: 'Bahasa Inggris',
    room: 'Kelas XII C',
    teacher: 'Guru Bahasa Inggris',
    startTime: '07:00',
    endTime: '08:30',
    day: 'Senin',
    color: 'rose',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-sen-2',
    subject: 'Sejarah',
    room: 'Kelas XII C',
    teacher: 'Guru Sejarah',
    startTime: '08:30',
    endTime: '10:00',
    day: 'Senin',
    color: 'amber',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-sen-3',
    subject: 'Informatika',
    room: 'Lab Komputer',
    teacher: 'Guru Informatika',
    startTime: '10:30',
    endTime: '12:00',
    day: 'Senin',
    color: 'sky',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-sen-4',
    subject: 'Matematika',
    room: 'Kelas XII C',
    teacher: 'Guru Matematika',
    startTime: '12:30',
    endTime: '14:00',
    day: 'Senin',
    color: 'indigo',
    notes: 'Karin - XII C'
  },

  // Selasa
  {
    id: 'karin-sel-1',
    subject: 'Agama',
    room: 'Kelas XII C',
    teacher: 'Guru Agama',
    startTime: '07:00',
    endTime: '08:30',
    day: 'Selasa',
    color: 'emerald',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-sel-2',
    subject: 'Matematika',
    room: 'Kelas XII C',
    teacher: 'Guru Matematika',
    startTime: '08:30',
    endTime: '10:00',
    day: 'Selasa',
    color: 'indigo',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-sel-3',
    subject: 'Bahasa Jerman',
    room: 'Kelas XII C / Ruang Bahasa',
    teacher: 'Guru Bahasa Jerman',
    startTime: '10:30',
    endTime: '12:00',
    day: 'Selasa',
    color: 'violet',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-sel-4',
    subject: 'Bahasa Indonesia',
    room: 'Kelas XII C',
    teacher: 'Guru Bahasa Indonesia',
    startTime: '12:30',
    endTime: '14:00',
    day: 'Selasa',
    color: 'rose',
    notes: 'Karin - XII C'
  },

  // Rabu
  {
    id: 'karin-rab-1',
    subject: 'Biologi',
    room: 'Lab Biologi',
    teacher: 'Guru Biologi',
    startTime: '07:00',
    endTime: '08:30',
    day: 'Rabu',
    color: 'emerald',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-rab-2',
    subject: 'Olahraga',
    room: 'Lapangan Utama',
    teacher: 'Guru Olahraga',
    startTime: '08:30',
    endTime: '10:00',
    day: 'Rabu',
    color: 'amber',
    notes: 'Seragam Olahraga • Karin - XII C'
  },
  {
    id: 'karin-rab-3',
    subject: 'Bimbingan Konseling (BK)',
    room: 'Ruang BK',
    teacher: 'Guru BK',
    startTime: '10:30',
    endTime: '11:30',
    day: 'Rabu',
    color: 'violet',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-rab-4',
    subject: 'Bahasa Inggris',
    room: 'Kelas XII C',
    teacher: 'Guru Bahasa Inggris',
    startTime: '11:30',
    endTime: '12:30',
    day: 'Rabu',
    color: 'rose',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-rab-5',
    subject: 'Kimia',
    room: 'Lab Kimia',
    teacher: 'Guru Kimia',
    startTime: '13:00',
    endTime: '14:30',
    day: 'Rabu',
    color: 'sky',
    notes: 'Karin - XII C'
  },

  // Kamis
  {
    id: 'karin-kam-1',
    subject: 'Matematika Lanjut',
    room: 'Kelas XII C',
    teacher: 'Guru Matematika Lanjut',
    startTime: '07:00',
    endTime: '08:30',
    day: 'Kamis',
    color: 'indigo',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-kam-2',
    subject: 'Biologi',
    room: 'Lab Biologi',
    teacher: 'Guru Biologi',
    startTime: '08:30',
    endTime: '10:00',
    day: 'Kamis',
    color: 'emerald',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-kam-3',
    subject: 'Seni Budaya',
    room: 'Ruang Seni',
    teacher: 'Guru Seni Budaya',
    startTime: '10:30',
    endTime: '12:00',
    day: 'Kamis',
    color: 'violet',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-kam-4',
    subject: 'PPKn',
    room: 'Kelas XII C',
    teacher: 'Guru PPKn',
    startTime: '12:30',
    endTime: '14:00',
    day: 'Kamis',
    color: 'amber',
    notes: 'Karin - XII C'
  },

  // Jumat
  {
    id: 'karin-jum-1',
    subject: 'Kimia',
    room: 'Lab Kimia',
    teacher: 'Guru Kimia',
    startTime: '07:00',
    endTime: '08:30',
    day: 'Jumat',
    color: 'sky',
    notes: 'Karin - XII C'
  },
  {
    id: 'karin-jum-2',
    subject: 'Matematika Lanjut',
    room: 'Kelas XII C',
    teacher: 'Guru Matematika Lanjut',
    startTime: '08:30',
    endTime: '10:00',
    day: 'Jumat',
    color: 'indigo',
    notes: 'Karin - XII C'
  }
];

export function getIndonesianDayName(dateObj: Date = new Date()): DayOfWeek {
  const days: DayOfWeek[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayIndex = dateObj.getDay(); // 0 is Minggu, 1 is Senin...
  return days[dayIndex];
}
