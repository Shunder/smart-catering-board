import { Link } from 'react-router-dom';
import { useAppData } from '../state/AppDataContext';

export function ProjectsPage(): JSX.Element {
  const { data, deleteProject } = useAppData();
  return (
    <section>
      <div className="row between">
        <h2>项目管理</h2>
        <Link to="/projects/new"><button>+ 新建项目</button></Link>
      </div>
      {data.projects.length === 0 ? <p className="empty">暂无项目，请点击右上角新建。</p> : (
        <ul className="list">
          {data.projects.map((project) => (
            <li key={project.id}>
              <div>
                <strong>{project.name}</strong>
                <small>{project.tables.reduce((sum, t) => sum + t.tableCount, 0)} 围 · {project.note || '无备注'}</small>
              </div>
              <div className="row">
                <Link to={`/projects/${project.id}/edit`}><button className="ghost">编辑</button></Link>
                <Link to={`/projects/${project.id}/summary`}><button className="ghost">汇总</button></Link>
                <button className="danger" onClick={() => deleteProject(project.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
