import { useMemo, useState } from 'react';
import { Field } from '../components/Field';
import { useAppData } from '../state/AppDataContext';
import type { Menu, MenuDish } from '../types/models';

export function MenusPage(): JSX.Element {
  const { data, upsertMenu, deleteMenu } = useAppData();
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<Menu | null>(null);
  const [form, setForm] = useState({ name: '', note: '', dishes: [] as MenuDish[] });

  const dishMap = useMemo(() => new Map(data.dishes.map((d) => [d.id, d])), [data.dishes]);
  const filtered = useMemo(() => data.menus.filter((m) => m.name.includes(keyword)), [data.menus, keyword]);

  return (
    <section>
      <h2>菜单管理</h2>
      <div className="panel"><input value={keyword} placeholder="搜索菜单" onChange={(e) => setKeyword(e.target.value)} /></div>
      <form className="panel" onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return window.alert('请填写菜单名称');
        if (form.dishes.length === 0) return window.alert('请至少添加一个菜品');
        upsertMenu({ name: form.name.trim(), note: form.note.trim(), dishes: form.dishes }, editing?.id);
        setEditing(null);
        setForm({ name: '', note: '', dishes: [] });
      }}>
        <h3>{editing ? '编辑菜单' : '新建菜单'}</h3>
        <Field label="菜单名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="备注"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
        <div className="subhead row"><b>菜品列表</b><button type="button" className="ghost" onClick={() => {
          if (data.dishes.length === 0) return window.alert('请先创建菜品');
          setForm({ ...form, dishes: [...form.dishes, { dishId: data.dishes[0].id, count: 1 }] });
        }}>+ 添加菜品</button></div>
        <div className="form-list">
          {form.dishes.map((item, idx) => (
            <div className="row" key={idx}>
              <select value={item.dishId} onChange={(e) => setForm({ ...form, dishes: form.dishes.map((v, i) => i === idx ? { ...v, dishId: e.target.value } : v) })}>
                {data.dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <input type="number" min={1} value={item.count} onChange={(e) => setForm({ ...form, dishes: form.dishes.map((v, i) => i === idx ? { ...v, count: Number(e.target.value) } : v) })} />
              <button type="button" className="danger" onClick={() => setForm({ ...form, dishes: form.dishes.filter((_, i) => i !== idx) })}>移除</button>
            </div>
          ))}
        </div>
        <button type="submit">{editing ? '保存修改' : '新增菜单'}</button>
      </form>

      {filtered.length === 0 ? <p className="empty">暂无菜单数据。</p> : (
        <ul className="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <div><strong>{item.name}</strong><small>{item.dishes.map((d) => `${dishMap.get(d.dishId)?.name ?? '未知'}×${d.count}`).join('，')}</small></div>
              <div className="row">
                <button className="ghost" onClick={() => { setEditing(item); setForm({ name: item.name, note: item.note ?? '', dishes: item.dishes }); }}>编辑</button>
                <button className="danger" onClick={() => deleteMenu(item.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
