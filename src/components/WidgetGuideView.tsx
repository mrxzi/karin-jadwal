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
  Layers,
  Sparkles,
  Info,
  ChevronRight
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
    // Replace placeholder URL in script before copying
    const customizedScript = SCRIPTABLE_CODE.replace(
      'https://DOMAIN-ANDA.vercel.app/api/jadwal/today',
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
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" /> iOS WidgetKit / Scriptable Ready
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Integrasi Widget Home Screen iPhone
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Tampilkan jadwal pelajaran hari ini langsung di layar utama iPhone Anda tanpa perlu membuka browser.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition"
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
          {/* Step 1 to 4 Accordion/Cards */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Panduan Pemasangan di iOS (4 Langkah Mudah)
            </h3>

            <div className="space-y-4 text-sm">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Install Aplikasi Scriptable
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Buka App Store di iPhone Anda dan install aplikasi gratis{' '}
                    <a
                      href="https://apps.apple.com/us/app/scriptable/id1405459188"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      Scriptable <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Buat Script Baru & Paste Kode
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Buka aplikasi Scriptable, tekan tombol <strong>+ (Tambah)</strong> di pojok kanan atas, lalu paste (tempel) kode JavaScript yang disalin dari halaman ini.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Sesuaikan API_URL
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Pastikan variabel <code>const API_URL</code> di dalam script sudah mengarah ke domain Vercel/Netlify website Anda.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Tambahkan Widget ke Home Screen
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Tahan area kosong di Home Screen iPhone &rarr; Tekan <strong>+</strong> &rarr; Cari <strong>Scriptable</strong> &rarr; Pilih ukuran Widget (Medium direkomendasikan) &rarr; Pilih script yang baru dibuat!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoint Live Tester */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-500" />
                Uji Endpoint JSON API Hari Ini
              </h3>
              <button
                onClick={handleTestApi}
                disabled={loadingTest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loadingTest ? 'Memuat...' : 'Uji API Live'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Endpoint publik yang diakses oleh Widget iOS:{' '}
              <code className="text-indigo-600 dark:text-indigo-400 font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                /api/jadwal/today
              </code>
            </p>

            {testResult && (
              <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800">
                <pre>{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Widget Mockup & Script Code View (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulated iPhone Widget Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Simulasi Widget iPhone
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewSize('medium')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    previewSize === 'medium'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setPreviewSize('small')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    previewSize === 'small'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                      : 'text-slate-500'
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
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scriptable JavaScript Code
              </span>
              <button
                onClick={handleCopyScript}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copied ? 'Tersalin' : 'Salin Kode'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
              <pre>{SCRIPTABLE_CODE}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
