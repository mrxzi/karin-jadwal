'use client';

import React, { useState } from 'react';
import { ScheduleItem, DayOfWeek } from '@/types/schedule';
import {
  Search,
  Clock,
  MapPin,
  User,
  Pencil,
  Trash2,
  Calendar,
  Filter,
  Plus,
  FileText
} from 'lucide-react';

interface WeeklyViewProps {
  schedules: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (item: ScheduleItem) => void;
  onAddClick: () => void;
}

const DAYS: Array<DayOfWeek | 'Semua'> = [
  'Semua',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  schedules,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter schedules based on day and search query
  const filteredSchedules = schedules.filter((item) => {
    const matchesDay = selectedDay === 'Semua' || item.day === selectedDay;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      item.subject.toLowerCase().includes(q) ||
      item.teacher.toLowerCase().includes(q) ||
      item.room.toLowerCase().includes(q);

    return matchesDay && matchesSearch;
  });

  // Group schedules by day when viewing "Semua"
  const daysList: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const getDayCount = (day: DayOfWeek) => {
    return schedules.filter((s) => s.day === day).length;
  };

  const getColorClasses = (colorName: string = 'indigo') => {
    switch (colorName) {
      case 'emerald':
        return {
          border: 'border-l-4 border-l-emerald-500',
          badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
          accent: 'text-emerald-500',
        };
      case 'rose':
        return {
          border: 'border-l-4 border-l-rose-500',
          badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
          accent: 'text-rose-500',
        };
      case 'violet':
        return {
          border: 'border-l-4 border-l-violet-500',
          badge: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800',
          accent: 'text-violet-500',
        };
      case 'amber':
        return {
          border: 'border-l-4 border-l-amber-500',
          badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
          accent: 'text-amber-500',
        };
      case 'sky':
        return {
          border: 'border-l-4 border-l-sky-500',
          badge: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800',
          accent: 'text-sky-500',
        };
      default: // indigo
        return {
          border: 'border-l-4 border-l-indigo-500',
          badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
          accent: 'text-indigo-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Search Input & Day Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Day Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const count = day === 'Semua' ? schedules.length : getDayCount(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pelajaran, guru, ruangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Display */}
      {filteredSchedules.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Filter className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak Ada Jadwal Ditemukan
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? `Tidak ada pelajaran yang cocok dengan pencarian "${searchQuery}".`
              : `Belum ada jadwal pelajaran untuk hari ${selectedDay}.`}
          </p>
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Pelajaran
          </button>
        </div>
      ) : selectedDay !== 'Semua' ? (
        // Grid View for a Single Selected Day
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((item) => {
              const styles = getColorClasses(item.color);
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group ${styles.border}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${styles.badge}`}
                    >
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {item.startTime} - {item.endTime}
                    </span>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    {item.subject}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${styles.accent}`} />
                      <span>
                        Ruangan: <strong className="text-slate-800 dark:text-slate-200">{item.room}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      <span>
                        Guru: <strong className="text-slate-800 dark:text-slate-200">{item.teacher}</strong>
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 italic">
                      <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        // Grouped Layout by Days for "Semua" View
        <div className="space-y-8">
          {daysList.map((dayName) => {
            const dayItems = filteredSchedules
              .filter((s) => s.day === dayName)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            if (dayItems.length === 0) return null;

            return (
              <div key={dayName} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Hari {dayName}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ({dayItems.length} Pelajaran)
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayItems.map((item) => {
                    const styles = getColorClasses(item.color);
                    return (
                      <div
                        key={item.id}
                        className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group ${styles.border}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${styles.badge}`}
                          >
                            <Clock className="w-3.5 h-3.5 inline mr-1" />
                            {item.startTime} - {item.endTime}
                          </span>

                          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                          {item.subject}
                        </h4>

                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${styles.accent}`} />
                            <span>
                              Ruangan: <strong className="text-slate-800 dark:text-slate-200">{item.room}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-purple-500" />
                            <span>
                              Guru: <strong className="text-slate-800 dark:text-slate-200">{item.teacher}</strong>
                            </span>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 italic">
                            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
