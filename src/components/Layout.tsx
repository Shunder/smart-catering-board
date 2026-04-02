import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppData } from '../state/AppDataContext';
import { useSiteCounters } from '../lib/visitorStats';

const navs = [
  ['/', '首页'],
  ['/ingredients', '用料管理'],
  ['/dishes', '菜品管理'],
  ['/menus', '菜单管理'],
  ['/projects', '项目管理'],
  ['/usage', '使用说明']
] as const;

export function Layout(): JSX.Element {
  const location = useLocation();
  const { message, backup, restore } = useAppData();
  const { visitors, visits, loading } = useSiteCounters();

  return (
    <div className="app-shell">
      <aside>
        <h1>智慧餐配台</h1>
        <p className="muted">smart-catering-board</p>
        <nav>
          {navs.map(([path, name]) => (
            <Link
              key={path}
              to={path}
              className={location.pathname === path ? 'active' : ''}
              target={path === '/usage' ? '_blank' : undefined}
              rel={path === '/usage' ? 'noopener noreferrer' : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="panel">
          <button onClick={backup}>导出 JSON 备份</button>
          <label className="upload-btn">
            导入 JSON
            <input
              type="file"
              accept="application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  await restore(file);
                } catch (error) {
                  window.alert((error as Error).message);
                } finally {
                  e.currentTarget.value = '';
                }
              }}
            />
          </label>
        </div>
        <div className="panel stats-panel">
          <div className="stats-panel-head">
            <h3>站点访问统计</h3>
            <span className="stats-dot" aria-hidden="true" />
          </div>
          <div className="stats-metric">
            <span>累计访客</span>
            <b id="busuanzi_value_site_uv">{loading ? '加载中...' : visitors ?? '--'}</b>
          </div>
          <div className="stats-metric">
            <span>累计访问量</span>
            <b id="busuanzi_value_site_pv">{loading ? '加载中...' : visits ?? '--'}</b>
          </div>
        </div>
        <p className="hint">{message}</p>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
