import { sampleData } from '../data/sampleData';
import type { AppData } from '../types/models';

const STORAGE_KEY = 'smart-catering-board-data-v1';

function isValidData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<AppData>;
  return Array.isArray(data.ingredients) && Array.isArray(data.dishes) && Array.isArray(data.menus) && Array.isArray(data.projects);
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleData;
    const parsed = JSON.parse(raw) as unknown;
    return isValidData(parsed) ? parsed : sampleData;
  } catch {
    return sampleData;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `智慧餐配台备份-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as unknown;
        if (!isValidData(parsed)) {
          reject(new Error('JSON 格式不符合要求，请检查备份文件。'));
          return;
        }
        resolve(parsed);
      } catch {
        reject(new Error('读取失败：请导入有效 JSON 文件。'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败。'));
    reader.readAsText(file, 'utf-8');
  });
}
