import { useMemo, useState } from 'react';
import { Field } from '../components/Field';
import { useAppData } from '../state/AppDataContext';
import type { Ingredient } from '../types/models';

const units = ['斤', '克', '袋', '瓶', '份', '个'];

export function IngredientsPage(): JSX.Element {
  const { data, upsertIngredient, deleteIngredient } = useAppData();
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [form, setForm] = useState({ name: '', unit: '斤', note: '' });

  const filtered = useMemo(() => data.ingredients.filter((i) => i.name.includes(keyword)), [data.ingredients, keyword]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return window.alert('请填写用料名称');
    upsertIngredient({ name: form.name.trim(), unit: form.unit, note: form.note.trim() }, editing?.id);
    setEditing(null);
    setForm({ name: '', unit: '斤', note: '' });
  };

  return (
    <section>
      <h2>用料管理</h2>
      <div className="panel">
        <input value={keyword} placeholder="搜索用料名称" onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <form className="panel" onSubmit={submit}>
        <h3>{editing ? '编辑用料' : '新建用料'}</h3>
        <Field label="用料名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="单位">
          <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>{units.map((u) => <option key={u}>{u}</option>)}</select>
        </Field>
        <Field label="备注"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
        <div className="row">
          <button type="submit">{editing ? '保存修改' : '新增用料'}</button>
          {editing && <button type="button" className="ghost" onClick={() => { setEditing(null); setForm({ name: '', unit: '斤', note: '' }); }}>取消</button>}
        </div>
      </form>

      {filtered.length === 0 ? <p className="empty">暂无用料数据。</p> : (
        <ul className="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <div><strong>{item.name}</strong><small>{item.unit} {item.note ? `· ${item.note}` : ''}</small></div>
              <div className="row">
                <button className="ghost" onClick={() => { setEditing(item); setForm({ name: item.name, unit: item.unit, note: item.note ?? '' }); }}>编辑</button>
                <button className="danger" onClick={() => deleteIngredient(item.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
