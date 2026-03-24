import { createContext, useContext, useMemo, useState } from 'react';
import { createId } from '../lib/id';
import { exportData, importData, loadData, saveData } from '../lib/storage';
import type { AppData, Dish, Ingredient, Menu, Project } from '../types/models';

interface AppDataContextValue {
  data: AppData;
  message: string;
  setMessage: (msg: string) => void;
  upsertIngredient: (input: Omit<Ingredient, 'id' | 'createdAt'>, id?: string) => void;
  deleteIngredient: (id: string) => void;
  upsertDish: (input: Omit<Dish, 'id' | 'createdAt'>, id?: string) => void;
  deleteDish: (id: string) => void;
  upsertMenu: (input: Omit<Menu, 'id' | 'createdAt'>, id?: string) => void;
  deleteMenu: (id: string) => void;
  upsertProject: (input: Omit<Project, 'id' | 'createdAt'>, id?: string) => void;
  deleteProject: (id: string) => void;
  backup: () => void;
  restore: (file: File) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [data, setData] = useState<AppData>(() => loadData());
  const [message, setMessage] = useState('欢迎使用智慧餐配台');

  const apply = (next: AppData, msg: string) => {
    setData(next);
    saveData(next);
    setMessage(msg);
  };

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,
      message,
      setMessage,
      upsertIngredient: (input, id) => {
        const target: Ingredient = id
          ? { ...input, id, createdAt: data.ingredients.find((v) => v.id === id)?.createdAt ?? new Date().toISOString() }
          : { ...input, id: createId('ing'), createdAt: new Date().toISOString() };
        const next = {
          ...data,
          ingredients: id ? data.ingredients.map((v) => (v.id === id ? target : v)) : [target, ...data.ingredients],
          updatedAt: new Date().toISOString()
        };
        apply(next, id ? '用料已更新' : '用料已新增');
      },
      deleteIngredient: (id) => {
        if (!window.confirm('确定删除该用料吗？与其关联的菜品需要您手工检查。')) return;
        apply({ ...data, ingredients: data.ingredients.filter((i) => i.id !== id), updatedAt: new Date().toISOString() }, '用料已删除');
      },
      upsertDish: (input, id) => {
        const target: Dish = id
          ? { ...input, id, createdAt: data.dishes.find((v) => v.id === id)?.createdAt ?? new Date().toISOString() }
          : { ...input, id: createId('dish'), createdAt: new Date().toISOString() };
        apply(
          {
            ...data,
            dishes: id ? data.dishes.map((v) => (v.id === id ? target : v)) : [target, ...data.dishes],
            updatedAt: new Date().toISOString()
          },
          id ? '菜品已更新' : '菜品已新增'
        );
      },
      deleteDish: (id) => {
        if (!window.confirm('确定删除该菜品吗？')) return;
        apply({ ...data, dishes: data.dishes.filter((d) => d.id !== id), updatedAt: new Date().toISOString() }, '菜品已删除');
      },
      upsertMenu: (input, id) => {
        const target: Menu = id
          ? { ...input, id, createdAt: data.menus.find((v) => v.id === id)?.createdAt ?? new Date().toISOString() }
          : { ...input, id: createId('menu'), createdAt: new Date().toISOString() };
        apply(
          {
            ...data,
            menus: id ? data.menus.map((v) => (v.id === id ? target : v)) : [target, ...data.menus],
            updatedAt: new Date().toISOString()
          },
          id ? '菜单已更新' : '菜单已新增'
        );
      },
      deleteMenu: (id) => {
        if (!window.confirm('确定删除该菜单吗？')) return;
        apply({ ...data, menus: data.menus.filter((m) => m.id !== id), updatedAt: new Date().toISOString() }, '菜单已删除');
      },
      upsertProject: (input, id) => {
        const target: Project = id
          ? { ...input, id, createdAt: data.projects.find((v) => v.id === id)?.createdAt ?? new Date().toISOString() }
          : { ...input, id: createId('proj'), createdAt: new Date().toISOString() };
        apply(
          {
            ...data,
            projects: id ? data.projects.map((v) => (v.id === id ? target : v)) : [target, ...data.projects],
            updatedAt: new Date().toISOString()
          },
          id ? '项目已更新' : '项目已新增'
        );
      },
      deleteProject: (id) => {
        if (!window.confirm('确定删除该项目吗？')) return;
        apply({ ...data, projects: data.projects.filter((p) => p.id !== id), updatedAt: new Date().toISOString() }, '项目已删除');
      },
      backup: () => exportData(data),
      restore: async (file) => {
        const restored = await importData(file);
        apply(restored, '数据已导入');
      }
    }),
    [data, message]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData 必须在 AppDataProvider 内部使用');
  return ctx;
}
