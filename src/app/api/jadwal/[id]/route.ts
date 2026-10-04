import { NextRequest, NextResponse } from 'next/server';
import { updateSchedule, deleteSchedule, getScheduleById } from '@/lib/scheduleStore';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = getScheduleById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Jadwal tidak ditemukan' },
        { status: 404 }
      );
    }

    const updated = updateSchedule(id, body);
    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui jadwal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = getScheduleById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Jadwal tidak ditemukan' },
        { status: 404 }
      );
    }

    const success = deleteSchedule(id);
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Jadwal berhasil dihapus',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus jadwal' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
