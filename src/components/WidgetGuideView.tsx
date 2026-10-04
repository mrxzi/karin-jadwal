'use client';

import React, { useState, useEffect } from 'react';
import { SCRIPTABLE_CODE } from '@/lib/scriptableScript';
import {
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Play,
  Layers
} from 'lucide-react';

interface WidgetGuideViewProps {
  currentOrigin: string;
}

export const WidgetGuideView: React.FC<WidgetGuideViewProps> = ({ currentOrigin }) => {
  const [copied, setCopied] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [previewSize, setPreviewSize] = useState<'medium' | 'small'>('medium');

  useEffect(() => {
    const defaultUrl = `${currentOrigin || 'https://karin-jadwal.vercel.app'}/api/jadwal/today`;
    setApiEndpoint(defaultUrl);
  }, [currentOrigin]);

  const handleCopyScript = () => {
    const customizedScript = SCRIPTABLE_CODE.replace(
      'https://karin-jadwal.vercel.app/api/jadwal/today',
      apiEndpoint || `${currentOrigin}/api/jadwal/today`
    );

    navigator.clipboard.writeText(customizedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestApi = async () => {
    setLoadingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/jadwal/today');
      const json = await res.json();
      setTestResult(json);
    } catch (err: any) {
      setTestResult({ error: err.message || 'Gagal terhubung ke API' });
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-zinc-700/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" /> iOS WidgetKit / Scriptable Monochrome
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Integrasi Widget iPhone Minimalis
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Tampilkan jadwal pelajaran Karin hari ini langsung di layar utama iPhone Anda dalam format clean & monochrome.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-sm shadow-lg active:scale-95 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Script Widget</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Installation Steps & API Tester (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1 to 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Panduan Pemasangan di iOS (4 Langkah Mudah)
            </h3>

            <div className="space-y-4 text-sm">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold flex items-center justify-center shrink-0 shadow">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">
                    Install Aplikasi Scriptable
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Buka App Store di iPhone Anda dan install aplikasi gratis{' '}
                    <a
                      href="https://apps.apple.com/us/app/scriptable/id1405459188"
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-900 dark:text-white font-bold underline inline-flex items-center gap-0.5"
                    >
                      Scriptable <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold flex items-center justify-center shrink-0 shadow">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">
                    Buat Script Baru & Paste Kode
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Buka Scriptable, tekan <strong>+ (Tambah)</strong>, lalu tempel (paste) kode JavaScript dari tombol Salin di atas.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold flex items-center justify-center shrink-0 shadow">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">
                    Domain API_URL Otomatis
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Variabel <code>const API_URL</code> sudah dikonfigurasi ke domain Vercel Anda.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold flex items-center justify-center shrink-0 shadow">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">
                    Pasang di Home Screen
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Tahan Home Screen iPhone &rarr; Tekan <strong>+</strong> &rarr; Cari <strong>Scriptable</strong> &rarr; Pilih ukuran <strong>Medium Widget</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoint Live Tester */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-zinc-500" />
                Uji Endpoint JSON API Live
              </h3>
              <button
                onClick={handleTestApi}
                disabled={loadingTest}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loadingTest ? 'Memuat...' : 'Uji API Live'}</span>
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Endpoint publik yang dipanggil oleh Widget iPhone:{' '}
              <code className="text-zinc-900 dark:text-zinc-100 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                /api/jadwal/today
              </code>
            </p>

            {testResult && (
              <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto max-h-60 border border-zinc-800">
                <pre>{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Widget Mockup & Script Code View (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulated iPhone Widget Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Simulasi Widget iPhone
              </span>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewSize('medium')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                    previewSize === 'medium'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm'
                      : 'text-zinc-500'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setPreviewSize('small')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                    previewSize === 'small'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm'
                      : 'text-zinc-500'
                  }`}
                >
                  Small
                </button>
              </div>
            </div>

            {/* Widget Container Mockup */}
            <div className="p-5 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl text-white font-sans space-y-3">
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  JADWAL KARIN - SENIN
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">
                  4 Pelajaran
                </span>
              </div>

              {/* Items Mock (Clean, No Times, No Rooms) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white">●</span>
                  <span className="text-xs font-bold text-white">
                    Bahasa Inggris
                  </span>
                  <span className="text-[10px] italic text-zinc-400">
                    sekarang
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs font-medium text-zinc-300">
                    Sejarah
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs font-medium text-zinc-300">
                    Informatika
                  </span>
                </div>

                {previewSize === 'medium' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">•</span>
                    <span className="text-xs font-medium text-zinc-300">
                      Matematika
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Script Code Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Scriptable JavaScript Code
              </span>
              <button
                onClick={handleCopyScript}
                className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
              >
                {copied ? 'Tersalin' : 'Salin Kode'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto max-h-72 border border-zinc-800 leading-relaxed">
              <pre>{SCRIPTABLE_CODE}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
