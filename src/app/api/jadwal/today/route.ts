import { NextRequest, NextResponse } from 'next/server';
import { getAllSchedules, getIndonesianDayName } from '@/lib/scheduleStore';
import { DayOfWeek } from '@/types/schedule';

interface ClassInfo {
  subject: string;
  time: string;
  room: string;
  teacher: string;
  status?: 'Sedang Berlangsung' | 'Akan Datang' | 'Selesai Hari Ini';
}

// WITA = Waktu Indonesia Tengah (UTC+8) — Lombok / Mataram
const WITA_OFFSET_MS = 8 * 60 * 60 * 1000;

function getWITADate(): Date {
  const utcNow = new Date();
  return new Date(utcNow.getTime() + WITA_OFFSET_MS);
}

function getWITATimeStr(witaDate: Date): string {
  const h = String(witaDate.getUTCHours()).padStart(2, '0');
  const m = String(witaDate.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // All date/time calculations in WITA (UTC+8, Asia/Makassar)
    const witaDate = getWITADate();

    // Support parameter ?day=Senin to override today for testing
    const overrideDay = searchParams.get('day') as DayOfWeek | null;
    const targetDay: DayOfWeek = overrideDay || getIndonesianDayName(witaDate);

    // Format ISO date YYYY-MM-DD (in WITA)
    const yyyy = witaDate.getUTCFullYear();
    const mm = String(witaDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(witaDate.getUTCDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;

    // Format Indonesian Date (in WITA)
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Makassar',
    }).format(new Date());

    // Current time in HH:mm (WITA)
    const nowTimeStr = getWITATimeStr(witaDate);

    // Get today's schedules sorted by start time
    const todayList = getAllSchedules(targetDay);

    let currentClass: ClassInfo | null = null;
    let nextClass: ClassInfo | null = null;

    const formattedSchedule = todayList.map((item) => {
      const isPast = nowTimeStr > item.endTime;
      const isCurrent = nowTimeStr >= item.startTime && nowTimeStr <= item.endTime;
      const isNext = nowTimeStr < item.startTime;

      let status: 'Sedang Berlangsung' | 'Akan Datang' | 'Selesai' = 'Akan Datang';
      if (isCurrent) {
        status = 'Sedang Berlangsung';
        if (!currentClass) {
          currentClass = {
            subject: item.subject,
            time: `${item.startTime} - ${item.endTime}`,
            room: item.room,
            teacher: item.teacher,
            status: 'Sedang Berlangsung',
          };
        }
      } else if (isPast) {
        status = 'Selesai';
      } else if (isNext && !nextClass) {
        nextClass = {
          subject: item.subject,
          time: `${item.startTime} - ${item.endTime}`,
          room: item.room,
          teacher: item.teacher,
          status: 'Akan Datang',
        };
      }

      return {
        id: item.id,
        subject: item.subject,
        time: `${item.startTime} - ${item.endTime}`,
        startTime: item.startTime,
        endTime: item.endTime,
        room: item.room,
        teacher: item.teacher,
        color: item.color || 'slate',
        notes: item.notes || '',
        status,
        isCurrent,
        isNext: isNext && (!currentClass || nextClass?.subject === item.subject),
        isPast,
      };
    });

    // If no active class, show next class as reference
    if (!currentClass && nextClass) {
      currentClass = {
        ...(nextClass as ClassInfo),
        status: 'Akan Datang',
      };
    }

    return NextResponse.json(
      {
        day: targetDay,
        date: isoDate,
        formattedDate,
        currentTimeWITA: nowTimeStr,
        timezone: 'WITA (UTC+8) — Lombok/Mataram',
        totalClasses: todayList.length,
        currentClass,
        nextClass,
        schedule: formattedSchedule,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          // No cache — always fresh, realtime
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memproses data jadwal hari ini' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
