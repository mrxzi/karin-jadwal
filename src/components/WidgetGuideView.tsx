'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SCRIPTABLE_CODE } from '@/lib/scriptableScript';
import {
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Play,
  Layers,
  RefreshCw,
  Wifi,
  Clock,
} from 'lucide-react';

interface WidgetGuideViewProps {
  currentOrigin: string;
}

interface ScheduleEntry {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  teacher: string;
  isCurrent: boolean;
  isPast: boolean;
  isNext: boolean;
  status: string;
}

interface ApiData {
  day: string;
  formattedDate: string;
  currentTimeWITA: string;
  timezone: string;
  totalClasses: number;
  schedule: ScheduleEntry[];
  currentClass: { subject: string; time: string; room: string } | null;
}

// WITA (UTC+8) clock for the browser
function getWITAClock(): string {
  const now = new Date();
  const wita = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const h = String(wita.getUTCHours()).padStart(2, '0');
  const m = String(wita.getUTCMinutes()).padStart(2, '0');
  const s = String(wita.getUTCSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getWITADayName(): string {
  const now = new Date();
  const wita = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[wita.getUTCDay()];
}

export const WidgetGuideView: React.FC<WidgetGuideViewProps> = ({ currentOrigin }) => {
  const [copied, setCopied] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [previewSize, setPreviewSize] = useState<'medium' | 'small'>('medium');

  // Live data from API
  const [liveData, setLiveData] = useState<ApiData | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [fetchError, setFetchError] = useState(false);

  // Live WITA clock (updates every second)
  const [witaClock, setWitaClock] = useState(getWITAClock());
  const [witaDay, setWitaDay] = useState(getWITADayName());

  // Refs for interval cleanup
  const clockRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const defaultUrl = `${currentOrigin || 'https://karin-jadwal.vercel.app'}/api/jadwal/today`;
    setApiEndpoint(defaultUrl);
  }, [currentOrigin]);

  // Live WITA clock — ticks every second
  useEffect(() => {
    clockRef.current = setInterval(() => {
      setWitaClock(getWITAClock());
      setWitaDay(getWITADayName());
    }, 1000);
    return () => { if (clockRef.current) clearInterval(clockRef.current); };
  }, []);

  // Fetch real schedule data from API
  const fetchLiveData = async () => {
    try {
      setFetchError(false);
      const res = await fetch('/api/jadwal/today', { cache: 'no-store' });
      const json = await res.json();
      setLiveData(json);
      const now = getWITAClock();
      setLastUpdated(now);
    } catch (err) {
      console.error('Live widget fetch error:', err);
      setFetchError(true);
    } finally {
      setLiveLoading(false);
    }
  };

  // Initial fetch + auto-refresh every 30 seconds
  useEffect(() => {
    fetchLiveData();
    dataRef.current = setInterval(fetchLiveData, 30_000);
    return () => { if (dataRef.current) clearInterval(dataRef.current); };
  }, []);

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

  // Determine items to show in the preview widget
  const widgetItems = liveData?.schedule ?? [];
  const maxItems = previewSize === 'small' ? 3 : 5;
  const displayItems = widgetItems.slice(0, maxItems);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-zinc-700/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" /> iOS Widget / Scriptable — Realtime WITA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Integrasi Widget iPhone Realtime
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Jadwal mengikuti waktu <strong className="text-zinc-200">Lombok / Mataram (WITA, UTC+8)</strong> secara realtime. Preview di bawah ini mencerminkan data jadwal yang sebenarnya.
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
        {/* Left Column: Steps + API Tester */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Panduan Pemasangan di iOS (4 Langkah)
            </h3>

            <div className="space-y-4 text-sm">
              {[
                {
                  n: 1,
                  title: 'Install Aplikasi Scriptable',
                  body: (
                    <>
                      Buka App Store di iPhone Anda dan install aplikasi gratis{' '}
                      <a
                        href="https://apps.apple.com/us/app/scriptable/id1405459188"
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-900 dark:text-white font-bold underline inline-flex items-center gap-0.5"
                      >
                        Scriptable <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  ),
                },
                {
                  n: 2,
                  title: 'Buat Script Baru & Paste Kode',
                  body: 'Buka Scriptable, tekan + (Tambah), lalu tempel kode dari tombol Salin di atas.',
                },
                {
                  n: 3,
                  title: 'API URL Sudah Dikonfigurasi',
                  body: (
                    <div className="space-y-2">
                      <p>Variabel <code>const API_URL</code> sudah mengarah ke domain Anda.</p>
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  ),
                },
                {
                  n: 4,
                  title: 'Pasang di Home Screen',
                  body: 'Tahan Home Screen iPhone → Tekan + → Cari Scriptable → Pilih ukuran Medium Widget!',
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold flex items-center justify-center shrink-0 shadow">
                    {n}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Live Tester */}
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
              Endpoint publik:{' '}
              <code className="text-zinc-900 dark:text-zinc-100 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                /api/jadwal/today
              </code>
              {' '}— Selalu segar, tanpa cache.
            </p>

            {testResult && (
              <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto max-h-60 border border-zinc-800">
                <pre>{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Widget Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* WITA Live Clock Badge */}
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <Clock className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Waktu WITA (Lombok)</p>
                <p className="font-mono font-black text-lg text-white leading-none tracking-wider">{witaClock}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Hari ini</p>
              <p className="text-sm font-black text-zinc-200">{witaDay}</p>
            </div>
          </div>

          {/* Simulated iPhone Widget Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Preview Widget Realtime
                </span>
                {!liveLoading && !fetchError && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                    <Wifi className="w-2.5 h-2.5" />
                    Live
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLiveData}
                  title="Refresh data"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${liveLoading ? 'animate-spin' : ''}`} />
                </button>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewSize('medium')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${previewSize === 'medium'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm'
                      : 'text-zinc-500'
                      }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setPreviewSize('small')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${previewSize === 'small'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm'
                      : 'text-zinc-500'
                      }`}
                  >
                    Small
                  </button>
                </div>
              </div>
            </div>

            {/* Widget Container Mockup — reflects real schedule */}
            <div className="p-5 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl text-white font-sans">
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  JADWAL KARIN — {(liveData?.day ?? witaDay).toUpperCase()}
                </span>
                <span className="text-[11px] text-zinc-500 font-medium font-mono">
                  {liveLoading ? '...' : `${liveData?.totalClasses ?? 0} Pelajaran`}
                </span>
              </div>

              {/* Loading state */}
              {liveLoading && (
                <div className="py-6 flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin" />
                  <span className="text-[11px] text-zinc-600">Memuat jadwal...</span>
                </div>
              )}

              {/* Error state */}
              {!liveLoading && fetchError && (
                <div className="py-4 text-center">
                  <p className="text-xs text-zinc-600">Tidak bisa terhubung ke API</p>
                </div>
              )}

              {/* Weekend / no schedule */}
              {!liveLoading && !fetchError && displayItems.length === 0 && (
                <div className="py-4">
                  <p className="text-sm font-semibold text-zinc-200">Libur & Membuat Matcha! 🍵</p>
                  <p className="text-xs text-zinc-600 mt-1">Tidak ada jadwal pelajaran hari ini.</p>
                </div>
              )}

              {/* Real schedule items */}
              {!liveLoading && !fetchError && displayItems.length > 0 && (
                <div className="space-y-2.5">
                  {displayItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span className={`text-xs shrink-0 ${item.isCurrent ? 'text-white' : 'text-zinc-600'}`}>
                        {item.isCurrent ? '●' : '•'}
                      </span>
                      <span
                        className={`text-xs font-medium truncate ${item.isCurrent
                          ? 'font-bold text-white'
                          : item.isPast
                            ? 'text-zinc-600 line-through'
                            : 'text-zinc-300'
                          }`}
                      >
                        {item.subject}
                      </span>
                      {item.isCurrent && (
                        <span className="text-[10px] italic text-zinc-400 shrink-0 ml-auto">sekarang</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer: last updated */}
              {lastUpdated && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-700">WITA {lastUpdated}</span>
                  <span className="text-[10px] text-zinc-700">auto-refresh 30s</span>
                </div>
              )}
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
