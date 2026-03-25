export function UsagePage(): JSX.Element {
  return (
    <section>
      <h2>智慧餐配台使用说明</h2>
      <div className="panel">
        <h3>推荐使用流程</h3>
        <ol>
          <li>先在「用料管理」中维护基础用料及单位。</li>
          <li>在「菜品管理」中给每道菜配置用料与用量。</li>
          <li>在「菜单管理」中组合菜品并设置默认份数。</li>
          <li>在「项目管理」中创建项目、配置桌型与叠加围数。</li>
          <li>进入项目汇总页查看总用料，并导出 PNG 图片。</li>
        </ol>
      </div>
      <div className="panel">
        <h3>数据备份</h3>
        <p>侧边栏支持导出 JSON 备份与导入 JSON 恢复，建议活动前后都备份一次。</p>
      </div>
    </section>
  );
}
