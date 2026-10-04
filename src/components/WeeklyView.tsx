'use client';

import React, { useState } from 'react';
import { ScheduleItem, DayOfWeek } from '@/types/schedule';
import {
  Search,
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
  const daysList: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const getDayCount = (day: DayOfWeek) => {
    return schedules.filter((s) => s.day === day).length;
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Search Input & Day Filter Tabs - Matte Dark Monochrome */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Day Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const count = day === 'Semua' ? schedules.length : getDayCount(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
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
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pelajaran, guru, ruangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Display */}
      {filteredSchedules.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <Filter className="w-7 h-7" />
          </div>
          <h4 className="text-base sm:text-lg font-black text-zinc-800 dark:text-zinc-100">
            Tidak Ada Jadwal Ditemukan
          </h4>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? `Tidak ada pelajaran yang cocok dengan pencarian "${searchQuery}".`
              : `Belum ada jadwal pelajaran untuk hari ${selectedDay}.`}
          </p>
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm shadow transition"
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
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-zinc-700 dark:border-l-zinc-300"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
                    {item.subject}
                  </h4>

                  <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        Ruangan: <strong className="text-zinc-800 dark:text-zinc-200">{item.room}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        Guru: <strong className="text-zinc-800 dark:text-zinc-200">{item.teacher}</strong>
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 italic">
                      <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
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
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold flex items-center justify-center text-xs shadow-sm">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                    Hari {dayName}
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    ({dayItems.length} Pelajaran)
                  </span>
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayItems.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-zinc-700 dark:border-l-zinc-300"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
                          {item.subject}
                        </h4>

                        <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <span>
                              Ruangan: <strong className="text-zinc-800 dark:text-zinc-200">{item.room}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <span>
                              Guru: <strong className="text-zinc-800 dark:text-zinc-200">{item.teacher}</strong>
                            </span>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 italic">
                            <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
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
