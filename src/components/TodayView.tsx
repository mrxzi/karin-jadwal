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

  const getColorClasses = (colorName: string = 'indigo') => {
    switch (colorName) {
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500 text-white',
          text: 'text-emerald-600 dark:text-emerald-400',
          ring: 'ring-emerald-500/30',
          indicator: 'bg-emerald-500',
        };
      case 'rose':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-500/20',
          border: 'border-rose-500/30',
          badge: 'bg-rose-500 text-white',
          text: 'text-rose-600 dark:text-rose-400',
          ring: 'ring-rose-500/30',
          indicator: 'bg-rose-500',
        };
      case 'violet':
        return {
          bg: 'bg-violet-500/10 dark:bg-violet-500/20',
          border: 'border-violet-500/30',
          badge: 'bg-violet-500 text-white',
          text: 'text-violet-600 dark:text-violet-400',
          ring: 'ring-violet-500/30',
          indicator: 'bg-violet-500',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-500/20',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-600 dark:text-amber-400',
          ring: 'ring-amber-500/30',
          indicator: 'bg-amber-500',
        };
      case 'sky':
        return {
          bg: 'bg-sky-500/10 dark:bg-sky-500/20',
          border: 'border-sky-500/30',
          badge: 'bg-sky-500 text-white',
          text: 'text-sky-600 dark:text-sky-400',
          ring: 'ring-sky-500/30',
          indicator: 'bg-sky-500',
        };
      default: // indigo
        return {
          bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
          border: 'border-indigo-500/30',
          badge: 'bg-indigo-500 text-white',
          text: 'text-indigo-600 dark:text-indigo-400',
          ring: 'ring-indigo-500/30',
          indicator: 'bg-indigo-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Today Overview Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-8 shadow-2xl border border-zinc-800">
        {/* Background Decorative Shapes */}
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
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border-2 border-emerald-500/40 dark:border-emerald-500/30 backdrop-blur-sm relative overflow-hidden shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Sedang Berlangsung Saat Ini
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {getProgressPercent(currentClass)}% Selesai
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {currentClass.subject}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-700 dark:text-slate-300 mb-4">
            <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-semibold">{currentClass.startTime} - {currentClass.endTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{currentClass.room}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <User className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">{currentClass.teacher}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercent(currentClass)}%` }}
            />
          </div>

          {currentClass.notes && (
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 italic">
              <FileText className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
              <span>{currentClass.notes}</span>
            </div>
          )}
        </div>
      ) : nextClass ? (
        <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-800/80 text-white border border-slate-700 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                Pelajaran Berikutnya
              </span>
              <h4 className="text-base font-bold text-white">
                {nextClass.subject} ({nextClass.startTime} - {nextClass.endTime})
              </h4>
              <p className="text-xs text-slate-400">
                {nextClass.room} • {nextClass.teacher}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Timeline Schedule List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Daftar Pelajaran Hari Ini
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Jam Saat Ini: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{currentTimeStr}</span>
          </span>
        </div>

        {todaySchedules.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {currentDayName === 'Sabtu' || currentDayName === 'Minggu'
                ? `🎉 Hari ${currentDayName} Libur!`
                : 'Tidak Ada Pelajaran Hari Ini'}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1.5 mb-6">
              {currentDayName === 'Sabtu' || currentDayName === 'Minggu'
                ? 'Tidak ada sekolah maupun ekskul! Hari Sabtu & Minggu waktunya bersantai dan menikmati liburan.'
                : 'Hari ini tidak ada kelas yang terjadwal. Anda bisa menikmati waktu luang atau menambahkan pelajaran baru.'}
            </p>
            <button
              onClick={onAddClick}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md transition"
            >
              + Tambah Pelajaran Baru
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
            {todaySchedules.map((item) => {
              const status = getStatus(item);
              const colors = getColorClasses(item.color);

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div
                    className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 transition-all ${
                      status === 'current'
                        ? 'border-emerald-500 bg-emerald-500 ring-4 ring-emerald-500/20 scale-125'
                        : status === 'past'
                        ? 'border-slate-400 dark:border-slate-600 bg-slate-400 dark:bg-slate-600'
                        : 'border-indigo-500 bg-white dark:bg-slate-900'
                    }`}
                  />

                  {/* Schedule Item Card */}
                  <div
                    className={`p-5 rounded-2xl border transition-all duration-200 ${
                      status === 'current'
                        ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                        : status === 'past'
                        ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                            status === 'current'
                              ? 'bg-emerald-500 text-white'
                              : status === 'past'
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              : `${colors.bg} ${colors.text}`
                          }`}
                        >
                          {item.startTime} - {item.endTime}
                        </span>

                        {status === 'current' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            Berlangsung
                          </span>
                        )}

                        {status === 'past' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                            Selesai
                          </span>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit Pelajaran"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Hapus Pelajaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {item.subject}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>Ruangan: <strong className="text-slate-800 dark:text-slate-200">{item.room}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Guru: <strong className="text-slate-800 dark:text-slate-200">{item.teacher}</strong></span>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
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
