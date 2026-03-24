import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Field } from '../components/Field';
import { createId } from '../lib/id';
import { useAppData } from '../state/AppDataContext';
import type { Project, TableConfig } from '../types/models';

export function ProjectEditorPage(): JSX.Element {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, upsertProject } = useAppData();

  const existing = useMemo(() => data.projects.find((p) => p.id === id), [data.projects, id]);
  const [form, setForm] = useState<Omit<Project, 'id' | 'createdAt'>>({
    name: existing?.name ?? '',
    note: existing?.note ?? '',
    tables: existing?.tables ?? []
  });

  const addTable = () => {
    if (data.menus.length === 0) return window.alert('请先创建菜单');
    const newTable: TableConfig = {
      id: createId('table'),
      name: `第${form.tables.length + 1}类桌型`,
      menuId: data.menus[0].id,
      tableCount: 1,
      extraDishes: [],
      extraIngredients: [],
      note: ''
    };
    setForm({ ...form, tables: [...form.tables, newTable] });
  };

  return (
    <section>
      <div className="row between">
        <h2>{id ? '编辑项目' : '新建项目'}</h2>
        <Link to="/projects">返回项目列表</Link>
      </div>
      <form className="panel" onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return window.alert('请填写项目名称');
        if (form.tables.length === 0) return window.alert('请至少添加一类桌型');
        upsertProject({ ...form, name: form.name.trim(), note: (form.note ?? '').trim() }, existing?.id);
        nav('/projects');
      }}>
        <Field label="项目名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="项目备注"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
        <div className="subhead row"><b>围餐桌配置（同类桌可堆叠）</b><button type="button" className="ghost" onClick={addTable}>+ 添加桌型</button></div>
        {form.tables.map((table, tableIndex) => (
          <div className="panel" key={table.id}>
            <div className="row between"><strong>桌型 {tableIndex + 1}</strong><button type="button" className="danger" onClick={() => setForm({ ...form, tables: form.tables.filter((t) => t.id !== table.id) })}>删除桌型</button></div>
            <div className="grid two">
              <Field label="桌号 / 桌名称"><input value={table.name} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, name: e.target.value } : t) })} /></Field>
              <Field label="堆叠桌数（围）"><input type="number" min={1} value={table.tableCount} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, tableCount: Number(e.target.value) } : t) })} /></Field>
              <Field label="菜单"><select value={table.menuId} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, menuId: e.target.value } : t) })}>{data.menus.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field>
              <Field label="备注"><input value={table.note ?? ''} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, note: e.target.value } : t) })} /></Field>
            </div>
            <div className="subhead">额外加菜</div>
            {table.extraDishes.map((d, idx) => <div className="row" key={idx}>
              <select value={d.dishId} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraDishes: t.extraDishes.map((x, i) => i === idx ? { ...x, dishId: e.target.value } : x) } : t) })}>{data.dishes.map((dish) => <option key={dish.id} value={dish.id}>{dish.name}</option>)}</select>
              <input type="number" min={1} value={d.count} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraDishes: t.extraDishes.map((x, i) => i === idx ? { ...x, count: Number(e.target.value) } : x) } : t) })} />
              <button type="button" className="danger" onClick={() => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraDishes: t.extraDishes.filter((_, i) => i !== idx) } : t) })}>移除</button>
            </div>)}
            <button type="button" className="ghost" onClick={() => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraDishes: [...t.extraDishes, { dishId: data.dishes[0]?.id ?? '', count: 1 }] } : t) })}>+ 添加额外菜</button>
            <div className="subhead">额外用料</div>
            {table.extraIngredients.map((ing, idx) => <div className="row" key={idx}>
              <select value={ing.ingredientId} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraIngredients: t.extraIngredients.map((x, i) => i === idx ? { ...x, ingredientId: e.target.value } : x) } : t) })}>{data.ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
              <input type="number" min={0} step="0.01" value={ing.amount} onChange={(e) => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraIngredients: t.extraIngredients.map((x, i) => i === idx ? { ...x, amount: Number(e.target.value) } : x) } : t) })} />
              <button type="button" className="danger" onClick={() => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraIngredients: t.extraIngredients.filter((_, i) => i !== idx) } : t) })}>移除</button>
            </div>)}
            <button type="button" className="ghost" onClick={() => setForm({ ...form, tables: form.tables.map((t) => t.id === table.id ? { ...t, extraIngredients: [...t.extraIngredients, { ingredientId: data.ingredients[0]?.id ?? '', amount: 1 }] } : t) })}>+ 添加额外用料</button>
          </div>
        ))}
        <button type="submit">保存项目</button>
      </form>
    </section>
  );
}
