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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateNow = new Date();

    // Support parameter ?day=Senin to override today for testing
    const overrideDay = searchParams.get('day') as DayOfWeek | null;
    const targetDay: DayOfWeek = overrideDay || getIndonesianDayName(dateNow);

    // Format ISO date YYYY-MM-DD
    const isoDate = dateNow.toISOString().split('T')[0];

    // Format Indonesian Date (e.g., "Minggu, 4 Oktober 2026")
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = dateNow.toLocaleDateString('id-ID', options);

    // Get today's schedules sorted by start time
    const todayList = getAllSchedules(targetDay);

    // Current time in HH:mm
    const currentHourStr = String(dateNow.getHours()).padStart(2, '0');
    const currentMinStr = String(dateNow.getMinutes()).padStart(2, '0');
    const nowTimeStr = `${currentHourStr}:${currentMinStr}`;

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
        color: item.color || 'indigo',
        notes: item.notes || '',
        status,
        isCurrent,
        isNext: isNext && (!currentClass || nextClass?.subject === item.subject),
        isPast,
      };
    });

    // If no active class currently, set next class as current status indicator if available
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
        totalClasses: todayList.length,
        currentClass,
        nextClass,
        schedule: formattedSchedule,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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
