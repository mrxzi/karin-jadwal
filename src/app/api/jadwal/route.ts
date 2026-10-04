import { NextRequest, NextResponse } from 'next/server';
import { getAllSchedules, createSchedule } from '@/lib/scheduleStore';
import { DayOfWeek } from '@/types/schedule';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day') as DayOfWeek | null;
    const search = searchParams.get('search');

    const schedules = getAllSchedules(day || undefined, search || undefined);
    return NextResponse.json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data jadwal' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.subject || !body.startTime || !body.endTime || !body.day) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mata pelajaran, jam mulai, jam selesai, dan hari wajib diisi.',
        },
        { status: 400 }
      );
    }

    const newItem = createSchedule({
      subject: body.subject,
      room: body.room || 'Ruangan Belum Diatur',
      teacher: body.teacher || 'Guru Belum Diatur',
      startTime: body.startTime,
      endTime: body.endTime,
      day: body.day as DayOfWeek,
      color: body.color || 'indigo',
      notes: body.notes || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Jadwal berhasil ditambahkan',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menambah data jadwal' },
      { status: 500 }
    );
  }
}
