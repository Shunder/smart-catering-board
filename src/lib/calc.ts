import type { Dish, Ingredient, IngredientTotal, Menu, Project, ProjectSummary } from '../types/models';

function addAmount(map: Map<string, IngredientTotal>, ingredient: Ingredient, amount: number): void {
  const existing = map.get(ingredient.id);
  if (existing) {
    existing.amount += amount;
  } else {
    map.set(ingredient.id, {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      unit: ingredient.unit,
      amount
    });
  }
}

export function summarizeProject(project: Project, ingredients: Ingredient[], dishes: Dish[], menus: Menu[]): ProjectSummary {
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));
  const dishMap = new Map(dishes.map((d) => [d.id, d]));
  const menuMap = new Map(menus.map((m) => [m.id, m]));

  const overall = new Map<string, IngredientTotal>();
  const dishCount = new Map<string, number>();

  const tableDetails = project.tables.map((table) => {
    const perTable = new Map<string, IngredientTotal>();
    const menu = menuMap.get(table.menuId);

    for (const menuDish of menu?.dishes ?? []) {
      const totalCount = menuDish.count * table.tableCount;
      dishCount.set(menuDish.dishId, (dishCount.get(menuDish.dishId) ?? 0) + totalCount);
      const dish = dishMap.get(menuDish.dishId);
      for (const item of dish?.ingredients ?? []) {
        const ing = ingredientMap.get(item.ingredientId);
        if (!ing) continue;
        const amount = item.amount * totalCount;
        addAmount(perTable, ing, amount);
        addAmount(overall, ing, amount);
      }
    }

    for (const extra of table.extraDishes) {
      const totalCount = extra.count * table.tableCount;
      dishCount.set(extra.dishId, (dishCount.get(extra.dishId) ?? 0) + totalCount);
      const dish = dishMap.get(extra.dishId);
      for (const item of dish?.ingredients ?? []) {
        const ing = ingredientMap.get(item.ingredientId);
        if (!ing) continue;
        const amount = item.amount * totalCount;
        addAmount(perTable, ing, amount);
        addAmount(overall, ing, amount);
      }
    }

    for (const extraIng of table.extraIngredients) {
      const ing = ingredientMap.get(extraIng.ingredientId);
      if (!ing) continue;
      const amount = extraIng.amount * table.tableCount;
      addAmount(perTable, ing, amount);
      addAmount(overall, ing, amount);
    }

    return {
      tableId: table.id,
      tableName: table.name,
      tableCount: table.tableCount,
      menuName: menu?.name ?? '未选择菜单',
      ingredients: Array.from(perTable.values()).sort((a, b) => a.ingredientName.localeCompare(b.ingredientName, 'zh-CN'))
    };
  });

  const dishDetails = Array.from(dishCount.entries())
    .map(([dishId, count]) => ({ dishId, count, dishName: dishMap.get(dishId)?.name ?? '未知菜品' }))
    .sort((a, b) => b.count - a.count);

  return {
    projectId: project.id,
    projectName: project.name,
    generatedAt: new Date().toLocaleString('zh-CN'),
    totalTables: project.tables.reduce((sum, table) => sum + table.tableCount, 0),
    overallIngredients: Array.from(overall.values()).sort((a, b) => a.ingredientName.localeCompare(b.ingredientName, 'zh-CN')),
    tableDetails,
    dishDetails
  };
}
