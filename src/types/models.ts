export type Id = string;

export interface Ingredient {
  id: Id;
  name: string;
  unit: string;
  note?: string;
  createdAt: string;
}

export interface DishIngredient {
  ingredientId: Id;
  amount: number;
}

export interface Dish {
  id: Id;
  name: string;
  category?: string;
  note?: string;
  ingredients: DishIngredient[];
  createdAt: string;
}

export interface MenuDish {
  dishId: Id;
  count: number;
}

export interface Menu {
  id: Id;
  name: string;
  note?: string;
  dishes: MenuDish[];
  createdAt: string;
}

export interface ExtraDish {
  dishId: Id;
  count: number;
}

export interface ExtraIngredient {
  ingredientId: Id;
  amount: number;
}

export interface TableConfig {
  id: Id;
  name: string;
  menuId: Id;
  tableCount: number;
  extraDishes: ExtraDish[];
  extraIngredients: ExtraIngredient[];
  note?: string;
}

export interface Project {
  id: Id;
  name: string;
  note?: string;
  tables: TableConfig[];
  createdAt: string;
}

export interface AppData {
  ingredients: Ingredient[];
  dishes: Dish[];
  menus: Menu[];
  projects: Project[];
  updatedAt: string;
}

export interface IngredientTotal {
  ingredientId: Id;
  ingredientName: string;
  unit: string;
  amount: number;
}

export interface ProjectSummary {
  projectId: Id;
  projectName: string;
  generatedAt: string;
  totalTables: number;
  overallIngredients: IngredientTotal[];
  tableDetails: Array<{
    tableId: Id;
    tableName: string;
    tableCount: number;
    menuName: string;
    ingredients: IngredientTotal[];
  }>;
  dishDetails: Array<{
    dishId: Id;
    dishName: string;
    count: number;
  }>;
}
