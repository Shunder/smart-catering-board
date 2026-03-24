import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { summarizeProject } from '../lib/calc';
import { useAppData } from '../state/AppDataContext';

export function ProjectSummaryPage(): JSX.Element {
  const { id } = useParams();
  const { data } = useAppData();
  const containerRef = useRef<HTMLDivElement>(null);

  const project = data.projects.find((p) => p.id === id);
  if (!project) return <section><p>项目不存在</p></section>;

  const summary = summarizeProject(project, data.ingredients, data.dishes, data.menus);

  const exportPng = async () => {
    if (!containerRef.current) return;
    const dataUrl = await toPng(containerRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${project.name}-汇总图.png`;
    a.click();
  };

  return (
    <section>
      <div className="row between">
        <h2>项目汇总与导出</h2>
        <div className="row">
          <Link to={`/projects/${project.id}/edit`}><button className="ghost">返回编辑</button></Link>
          <button onClick={exportPng}>导出 PNG 图片</button>
        </div>
      </div>
      <div className="report" ref={containerRef}>
        <h1>{summary.projectName}</h1>
        <p>总桌数：{summary.totalTables} 围 · 生成时间：{summary.generatedAt}</p>

        <h3>总用料汇总</h3>
        <table>
          <thead><tr><th>用料</th><th>总量</th><th>单位</th></tr></thead>
          <tbody>{summary.overallIngredients.map((item) => <tr key={item.ingredientId}><td>{item.ingredientName}</td><td>{item.amount.toFixed(2)}</td><td>{item.unit}</td></tr>)}</tbody>
        </table>

        <h3>按菜品统计</h3>
        <table>
          <thead><tr><th>菜品</th><th>总份数</th></tr></thead>
          <tbody>{summary.dishDetails.map((item) => <tr key={item.dishId}><td>{item.dishName}</td><td>{item.count}</td></tr>)}</tbody>
        </table>

        <h3>按桌型明细</h3>
        {summary.tableDetails.map((table) => (
          <div className="panel" key={table.tableId}>
            <strong>{table.tableName}（{table.tableCount} 围）</strong>
            <p>菜单：{table.menuName}</p>
            <ul>{table.ingredients.map((item) => <li key={item.ingredientId}>{item.ingredientName}：{item.amount.toFixed(2)} {item.unit}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
