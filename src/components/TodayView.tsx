'use client';

import React from 'react';
import { ScheduleItem } from '@/types/schedule';
import {
  Clock,
  MapPin,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  CalendarDays,
  ArrowRight,
  BookOpen,
  FileText
} from 'lucide-react';

interface TodayViewProps {
  schedules: ScheduleItem[];
  currentDayName: string;
  formattedDateStr: string;
  currentTimeStr: string;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (item: ScheduleItem) => void;
  onAddClick: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  schedules,
  currentDayName,
  formattedDateStr,
  currentTimeStr,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  // Sort today's schedules by startTime
  const todaySchedules = [...schedules].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  // Determine class status based on current time
  const getStatus = (item: ScheduleItem) => {
    if (currentTimeStr > item.endTime) {
      return 'past';
    }
    if (currentTimeStr >= item.startTime && currentTimeStr <= item.endTime) {
      return 'current';
    }
    return 'upcoming';
  };

  const currentClass = todaySchedules.find(
    (item) => getStatus(item) === 'current'
  );

  const nextClass = todaySchedules.find(
    (item) => getStatus(item) === 'upcoming'
  );

  // Calculate progress percentage if in current class
  const getProgressPercent = (item: ScheduleItem) => {
    const [startH, startM] = item.startTime.split(':').map(Number);
    const [endH, endM] = item.endTime.split(':').map(Number);
    const [nowH, nowM] = currentTimeStr.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const nowMinutes = nowH * 60 + nowM;

    if (nowMinutes <= startMinutes) return 0;
    if (nowMinutes >= endMinutes) return 100;

    const total = endMinutes - startMinutes;
    const elapsed = nowMinutes - startMinutes;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  };

  return (
    <div className="space-y-6">
      {/* Today Overview Header Banner - Matte Dark Monochrome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-8 shadow-2xl border border-zinc-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-zinc-700/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 rounded-full bg-zinc-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-medium mb-1">
              <CalendarDays className="w-4 h-4 text-zinc-300" />
              <span>{formattedDateStr}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Jadwal Karin - {currentDayName}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              {todaySchedules.length > 0
                ? `Anda memiliki ${todaySchedules.length} mata pelajaran yang dijadwalkan hari ini.`
                : 'Tidak ada jadwal pelajaran untuk hari ini. Waktu bersantai! 🎉'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/90 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-zinc-800 self-start md:self-auto shadow-inner">
            <div className="text-center">
              <span className="block text-2xl font-black text-white">
                {todaySchedules.length}
              </span>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Total Pelajaran
              </span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <span className="block text-2xl font-black text-zinc-200">
                {todaySchedules.filter((i) => getStatus(i) === 'past').length}
              </span>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Selesai
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active / Spotlight Banner Section */}
      {currentClass ? (
        <div className="p-6 rounded-3xl bg-zinc-900/90 dark:bg-zinc-900/90 border-2 border-zinc-700/80 backdrop-blur-sm relative overflow-hidden shadow-xl text-white">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-950 text-xs font-black tracking-wider uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
              Sedang Berlangsung Saat Ini
            </div>
            <span className="text-xs font-mono font-bold text-zinc-300">
              {getProgressPercent(currentClass)}% Selesai
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
            {currentClass.subject}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-zinc-300 mb-4">
            <div className="flex items-center gap-2 bg-zinc-950/80 px-3.5 py-2.5 rounded-xl border border-zinc-800">
              <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="font-bold">{currentClass.startTime} - {currentClass.endTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/80 px-3.5 py-2.5 rounded-xl border border-zinc-800">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{currentClass.room}</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/80 px-3.5 py-2.5 rounded-xl border border-zinc-800">
              <User className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="truncate">{currentClass.teacher}</span>
            </div>
          </div>

          {/* Progress Bar Monochrome */}
          <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercent(currentClass)}%` }}
            />
          </div>

          {currentClass.notes && (
            <div className="mt-3 flex items-start gap-2 text-xs text-zinc-400 italic">
              <FileText className="w-3.5 h-3.5 mt-0.5 text-zinc-400 shrink-0" />
              <span>{currentClass.notes}</span>
            </div>
          )}
        </div>
      ) : nextClass ? (
        <div className="p-5 rounded-2xl bg-zinc-900 dark:bg-zinc-900 text-white border border-zinc-800 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center shrink-0 border border-zinc-700">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Pelajaran Berikutnya
              </span>
              <h4 className="text-base font-bold text-white">
                {nextClass.subject} ({nextClass.startTime} - {nextClass.endTime})
              </h4>
              <p className="text-xs text-zinc-400">
                {nextClass.room} • {nextClass.teacher}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Timeline Schedule List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Daftar Pelajaran Hari Ini
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Jam: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{currentTimeStr}</span>
          </span>
        </div>

        {todaySchedules.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-zinc-900/90 border border-dashed border-zinc-300 dark:border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-zinc-800 dark:text-zinc-100">
              {currentDayName === 'Sabtu' || currentDayName === 'Minggu'
                ? `🎉 Hari ${currentDayName} Libur!`
                : 'Tidak Ada Pelajaran Hari Ini'}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1.5 mb-6">
              {currentDayName === 'Sabtu' || currentDayName === 'Minggu'
                ? 'Tidak ada sekolah maupun ekskul! Hari Sabtu & Minggu waktunya bersantai dan menikmati liburan.'
                : 'Hari ini tidak ada kelas yang terjadwal. Anda bisa menikmati waktu luang atau menambahkan pelajaran baru.'}
            </p>
            <button
              onClick={onAddClick}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs sm:text-sm shadow transition"
            >
              + Tambah Pelajaran Baru
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-4">
            {todaySchedules.map((item) => {
              const status = getStatus(item);

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div
                    className={`absolute -left-[23px] sm:-left-[31px] top-4 w-4 h-4 rounded-full border-2 transition-all ${
                      status === 'current'
                        ? 'border-white bg-zinc-900 dark:bg-white ring-4 ring-zinc-400/30 scale-125'
                        : status === 'past'
                        ? 'border-zinc-400 dark:border-zinc-700 bg-zinc-300 dark:bg-zinc-800'
                        : 'border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                    }`}
                  />

                  {/* Schedule Item Card - Matte Monochrome */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                      status === 'current'
                        ? 'bg-zinc-900 dark:bg-zinc-900 border-zinc-700 text-white shadow-xl ring-2 ring-zinc-600'
                        : status === 'past'
                        ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80 opacity-70'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                            status === 'current'
                              ? 'bg-white text-zinc-950'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                          }`}
                        >
                          {item.startTime} - {item.endTime}
                        </span>

                        {status === 'current' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            Berlangsung
                          </span>
                        )}

                        {status === 'past' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                            Selesai
                          </span>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                          title="Edit Pelajaran"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                          title="Hapus Pelajaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-black tracking-tight mb-2 text-zinc-900 dark:text-zinc-50">
                      {item.subject}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>Ruangan: <strong className="text-zinc-800 dark:text-zinc-200">{item.room}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">Guru: <strong className="text-zinc-800 dark:text-zinc-200">{item.teacher}</strong></span>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 italic">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
