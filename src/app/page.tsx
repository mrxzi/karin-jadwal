'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleItem, DayOfWeek } from '@/types/schedule';
import { getIndonesianDayName, INITIAL_SCHEDULES } from '@/lib/scheduleConstants';
import { Navbar } from '@/components/Navbar';
import { TodayView } from '@/components/TodayView';
import { WeeklyView } from '@/components/WeeklyView';
import { WidgetGuideView } from '@/components/WidgetGuideView';
import { ScheduleModal } from '@/components/ScheduleModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

export default function HomePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'widget'>('today');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Time & Date State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [origin, setOrigin] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ScheduleItem | null>(null);

  // Initialize Dark Mode & Clock on mount
  useEffect(() => {
    // Check dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('jadwal_theme');
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }

    // Live Clock Interval
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Fetch Schedules from API
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jadwal');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSchedules(json.data);
      } else {
        // LocalStorage fallback
        const saved = localStorage.getItem('jadwal_items');
        if (saved) {
          setSchedules(JSON.parse(saved));
        } else {
          setSchedules(INITIAL_SCHEDULES);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat jadwal dari API, menggunakan data lokal:', err);
      const saved = localStorage.getItem('jadwal_items');
      if (saved) {
        setSchedules(JSON.parse(saved));
      } else {
        setSchedules(INITIAL_SCHEDULES);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Save to LocalStorage helper for redundant offline support
  useEffect(() => {
    if (schedules.length > 0) {
      localStorage.setItem('jadwal_items', JSON.stringify(schedules));
    }
  }, [schedules]);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem('jadwal_theme', nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Time & Day formatters
  const currentDayName = getIndonesianDayName(currentDate);
  const currentHourStr = String(currentDate.getHours()).padStart(2, '0');
  const currentMinStr = String(currentDate.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHourStr}:${currentMinStr}`;

  const formattedDateStr = currentDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Modal actions
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ScheduleItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item: ScheduleItem) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSaveSchedule = async (itemData: Partial<ScheduleItem>) => {
    try {
      if (itemData.id) {
        // Edit existing
        const res = await fetch(`/api/jadwal/${itemData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setSchedules((prev) =>
            prev.map((s) => (s.id === itemData.id ? json.data : s))
          );
        } else {
          // Local fallback
          setSchedules((prev) =>
            prev.map((s) => (s.id === itemData.id ? ({ ...s, ...itemData } as ScheduleItem) : s))
          );
        }
      } else {
        // Add new item
        const res = await fetch('/api/jadwal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setSchedules((prev) => [...prev, json.data]);
        } else {
          // Local fallback
          const newItem: ScheduleItem = {
            id: `sch-${Date.now()}`,
            subject: itemData.subject || 'Pelajaran Baru',
            day: itemData.day || 'Senin',
            startTime: itemData.startTime || '07:00',
            endTime: itemData.endTime || '08:30',
            room: itemData.room || 'Ruangan Belum Diatur',
            teacher: itemData.teacher || 'Guru Belum Diatur',
            color: itemData.color || 'indigo',
            notes: itemData.notes || '',
          };
          setSchedules((prev) => [...prev, newItem]);
        }
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await fetch(`/api/jadwal/${deletingItem.id}`, { method: 'DELETE' });
      setSchedules((prev) => prev.filter((s) => s.id !== deletingItem.id));
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setSchedules((prev) => prev.filter((s) => s.id !== deletingItem.id));
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    }
  };

  const todaySchedules = schedules.filter((s) => s.day === currentDayName);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenAddModal={handleOpenAddModal}
        currentTimeStr={currentTimeStr}
        currentDayName={currentDayName}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Memuat Jadwal Pelajaran...</p>
          </div>
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayView
                schedules={todaySchedules}
                currentDayName={currentDayName}
                formattedDateStr={formattedDateStr}
                currentTimeStr={currentTimeStr}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onAddClick={handleOpenAddModal}
              />
            )}

            {activeTab === 'weekly' && (
              <WeeklyView
                schedules={schedules}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onAddClick={handleOpenAddModal}
              />
            )}

            {activeTab === 'widget' && (
              <WidgetGuideView currentOrigin={origin} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 mt-16 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 JadwalKu • Website Jadwal Pelajaran Personal & Widget iOS</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>JSON API: <code className="text-indigo-600 dark:text-indigo-400">/api/jadwal/today</code></span>
            <span>•</span>
            <span>Scriptable iOS Supported</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        initialData={editingItem}
        defaultDay={currentDayName as DayOfWeek}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={deletingItem}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
