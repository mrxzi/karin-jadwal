import fs from 'fs';
import path from 'path';
import { ScheduleItem, DayOfWeek } from '@/types/schedule';
import { INITIAL_SCHEDULES, getIndonesianDayName } from './scheduleConstants';

export { INITIAL_SCHEDULES, getIndonesianDayName };

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'schedules.json');



// Memory cache fallback (for serverless environments like Vercel)
let inMemoryStore: ScheduleItem[] | null = null;

function ensureDataFile(): ScheduleItem[] {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SCHEDULES, null, 2), 'utf-8');
      inMemoryStore = INITIAL_SCHEDULES;
      return INITIAL_SCHEDULES;
    }

    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(fileData);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryStore = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read JSON file, falling back to memory store:', err);
  }

  inMemoryStore = INITIAL_SCHEDULES;
  return INITIAL_SCHEDULES;
}

function saveDataFile(data: ScheduleItem[]): boolean {
  inMemoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Could not write JSON file to filesystem:', err);
    return false;
  }
}

export function getAllSchedules(day?: DayOfWeek, search?: string): ScheduleItem[] {
  let list = ensureDataFile();

  if (day) {
    list = list.filter((item) => item.day.toLowerCase() === day.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.subject.toLowerCase().includes(q) ||
        item.teacher.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q)
    );
  }

  // Sort by startTime
  return list.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getScheduleById(id: string): ScheduleItem | undefined {
  const list = ensureDataFile();
  return list.find((item) => item.id === id);
}

export function createSchedule(item: Omit<ScheduleItem, 'id'>): ScheduleItem {
  const list = ensureDataFile();
  const newItem: ScheduleItem = {
    ...item,
    id: `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...list, newItem];
  saveDataFile(updatedList);
  return newItem;
}

export function updateSchedule(id: string, updates: Partial<Omit<ScheduleItem, 'id'>>): ScheduleItem | null {
  const list = ensureDataFile();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updatedItem: ScheduleItem = {
    ...list[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updatedItem;
  saveDataFile(list);
  return updatedItem;
}

export function deleteSchedule(id: string): boolean {
  const list = ensureDataFile();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length === list.length) return false;

  saveDataFile(filtered);
  return true;
}


