import { Link } from 'react-router-dom';
import { useAppData } from '../state/AppDataContext';

export function HomePage(): JSX.Element {
  const { data } = useAppData();
  return (
    <section>
      <h2>首页 / 项目列表</h2>
      <p>这是一个纯前端的餐配配置工具，数据仅保存于浏览器本地。</p>
      <div className="grid four">
        <div className="card"><b>{data.ingredients.length}</b><span>用料总数</span></div>
        <div className="card"><b>{data.dishes.length}</b><span>菜品总数</span></div>
        <div className="card"><b>{data.menus.length}</b><span>菜单总数</span></div>
        <div className="card"><b>{data.projects.length}</b><span>项目总数</span></div>
      </div>
      <h3>最近项目</h3>
      {data.projects.length === 0 ? <p className="empty">暂无项目，请先创建。</p> : (
        <ul className="list">
          {data.projects.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.name}</strong>
                <small>{p.tables.reduce((sum, t) => sum + t.tableCount, 0)} 围 / {p.tables.length} 种桌型</small>
              </div>
              <Link to={`/projects/${p.id}/summary`}>查看汇总</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
