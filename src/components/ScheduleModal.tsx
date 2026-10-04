'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleItem, DayOfWeek } from '@/types/schedule';
import { X, MapPin, User, BookOpen } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ScheduleItem>) => void;
  initialData?: ScheduleItem | null;
  defaultDay?: DayOfWeek;
}

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultDay = 'Senin',
}) => {
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('08:30');
  const [room, setRoom] = useState('');
  const [teacher, setTeacher] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject || '');
      setDay(initialData.day || 'Senin');
      setStartTime(initialData.startTime || '07:00');
      setEndTime(initialData.endTime || '08:30');
      setRoom(initialData.room || '');
      setTeacher(initialData.teacher || '');
      setNotes(initialData.notes || '');
    } else {
      setSubject('');
      setDay(defaultDay);
      setStartTime('07:00');
      setEndTime('08:30');
      setRoom('');
      setTeacher('');
      setNotes('');
    }
    setErrorMsg('');
  }, [initialData, isOpen, defaultDay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      setErrorMsg('Nama pelajaran wajib diisi.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMsg('Jam mulai dan jam selesai wajib diisi.');
      return;
    }
    if (startTime >= endTime) {
      setErrorMsg('Jam mulai harus lebih awal daripada jam selesai.');
      return;
    }

    onSave({
      id: initialData?.id,
      subject: subject.trim(),
      day,
      startTime,
      endTime,
      room: room.trim() || 'Kelas XII C',
      teacher: teacher.trim() || 'Guru Pelajaran',
      color: 'slate',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold shadow">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
              {initialData ? 'Edit Pelajaran' : 'Tambah Pelajaran Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-700 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Nama Pelajaran */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Nama Pelajaran <span className="text-zinc-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Matematika, Bahasa Inggris, Fisika"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white"
              required
            />
          </div>

          {/* Hari & Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Hari <span className="text-zinc-400">*</span>
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white font-medium"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Jam Mulai <span className="text-zinc-400">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Jam Selesai <span className="text-zinc-400">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white font-mono"
                required
              />
            </div>
          </div>

          {/* Ruangan & Guru */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Ruangan / Kelas
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Kelas XII C, Lab Komputer"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Nama Guru
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Guru Pelajaran"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Catatan Opsional
            </label>
            <textarea
              placeholder="Contoh: Kumpulkan tugas, bawa seragam olahraga"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:text-white resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-sm shadow transition active:scale-95"
            >
              {initialData ? 'Simpan Perubahan' : 'Tambah Pelajaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
