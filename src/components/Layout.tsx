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
          <h3>站点访问统计</h3>
          <p>
            本站访客数：<b>{loading ? '加载中...' : visitors ?? '--'}</b>
          </p>
          <p>
            本站总访问量：<b>{loading ? '加载中...' : visits ?? '--'}</b>
          </p>
          <small>（基于 GitHub Pages + CountAPI，无需后端）</small>
        </div>
        <p className="hint">{message}</p>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
