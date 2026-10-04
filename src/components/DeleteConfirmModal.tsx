'use client';

import React from 'react';
import { ScheduleItem } from '@/types/schedule';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: ScheduleItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
          <Trash2 className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-1">
          Hapus Jadwal Pelajaran?
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Apakah Anda yakin ingin menghapus <strong className="text-zinc-900 dark:text-zinc-200">{item.subject}</strong> ({item.day}, {item.startTime} - {item.endTime})? Action ini tidak dapat dibatalkan.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow transition active:scale-95"
          >
            Hapus Pelajaran
          </button>
        </div>
      </div>
    </div>
  );
};
