import { useMemo, useState } from 'react';
import { Field } from '../components/Field';
import { useAppData } from '../state/AppDataContext';
import type { Dish, DishIngredient } from '../types/models';

export function DishesPage(): JSX.Element {
  const { data, upsertDish, deleteDish } = useAppData();
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<Dish | null>(null);
  const [form, setForm] = useState({ name: '', category: '', note: '', ingredients: [] as DishIngredient[] });

  const ingMap = useMemo(() => new Map(data.ingredients.map((i) => [i.id, i])), [data.ingredients]);
  const filtered = useMemo(() => data.dishes.filter((d) => d.name.includes(keyword)), [data.dishes, keyword]);

  const addIng = () => {
    if (data.ingredients.length === 0) return window.alert('请先创建用料');
    setForm({ ...form, ingredients: [...form.ingredients, { ingredientId: data.ingredients[0].id, amount: 1 }] });
  };

  return (
    <section>
      <h2>菜品管理</h2>
      <div className="panel"><input value={keyword} placeholder="搜索菜品" onChange={(e) => setKeyword(e.target.value)} /></div>
      <form className="panel" onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return window.alert('请填写菜品名称');
        if (form.ingredients.length === 0) return window.alert('请至少添加一个用料');
        upsertDish({ name: form.name.trim(), category: form.category.trim(), note: form.note.trim(), ingredients: form.ingredients }, editing?.id);
        setEditing(null);
        setForm({ name: '', category: '', note: '', ingredients: [] });
      }}>
        <h3>{editing ? '编辑菜品' : '新建菜品'}</h3>
        <Field label="菜品名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="分类"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
        <Field label="备注"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>

        <div className="subhead row"><b>用料清单</b><button type="button" className="ghost" onClick={addIng}>+ 添加用料</button></div>
        {form.ingredients.map((item, idx) => (
          <div className="row" key={idx}>
            <select value={item.ingredientId} onChange={(e) => setForm({ ...form, ingredients: form.ingredients.map((v, i) => i === idx ? { ...v, ingredientId: e.target.value } : v) })}>
              {data.ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <input type="number" min={0} step="0.01" value={item.amount} onChange={(e) => setForm({ ...form, ingredients: form.ingredients.map((v, i) => i === idx ? { ...v, amount: Number(e.target.value) } : v) })} />
            <small>{ingMap.get(item.ingredientId)?.unit ?? ''}</small>
            <button type="button" className="danger" onClick={() => setForm({ ...form, ingredients: form.ingredients.filter((_, i) => i !== idx) })}>移除</button>
          </div>
        ))}
        <div className="row"><button type="submit">{editing ? '保存修改' : '新增菜品'}</button></div>
      </form>

      {filtered.length === 0 ? <p className="empty">暂无菜品数据。</p> : (
        <ul className="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>{item.category || '未分类'} · {item.ingredients.map((it) => {
                  const ing = ingMap.get(it.ingredientId);
                  return `${ing?.name ?? '未知'}×${it.amount}${ing?.unit ? ing.unit : ''}`;
                }).join('，')}</small>
              </div>
              <div className="row">
                <button className="ghost" onClick={() => { setEditing(item); setForm({ name: item.name, category: item.category ?? '', note: item.note ?? '', ingredients: item.ingredients }); }}>编辑</button>
                <button className="danger" onClick={() => deleteDish(item.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
