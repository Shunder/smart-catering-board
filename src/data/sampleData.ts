import type { AppData } from '../types/models';

export const sampleData: AppData = {
  ingredients: [
    { id: 'ing_rice', name: '大米', unit: '斤', note: '东北米', createdAt: '2026-03-01T08:00:00.000Z' },
    { id: 'ing_chicken', name: '鸡腿肉', unit: '斤', note: '', createdAt: '2026-03-01T08:01:00.000Z' },
    { id: 'ing_oil', name: '食用油', unit: '瓶', note: '5L/瓶', createdAt: '2026-03-01T08:02:00.000Z' },
    { id: 'ing_broccoli', name: '西兰花', unit: '斤', note: '', createdAt: '2026-03-01T08:03:00.000Z' },
    { id: 'ing_garlic', name: '蒜', unit: '克', note: '', createdAt: '2026-03-01T08:04:00.000Z' }
  ],
  dishes: [
    {
      id: 'dish_chicken',
      name: '宫保鸡丁',
      category: '热菜',
      note: '微辣',
      ingredients: [
        { ingredientId: 'ing_chicken', amount: 0.8 },
        { ingredientId: 'ing_oil', amount: 0.08 },
        { ingredientId: 'ing_garlic', amount: 30 }
      ],
      createdAt: '2026-03-02T08:00:00.000Z'
    },
    {
      id: 'dish_broccoli',
      name: '蒜蓉西兰花',
      category: '素菜',
      note: '',
      ingredients: [
        { ingredientId: 'ing_broccoli', amount: 0.7 },
        { ingredientId: 'ing_garlic', amount: 25 },
        { ingredientId: 'ing_oil', amount: 0.05 }
      ],
      createdAt: '2026-03-02T08:05:00.000Z'
    },
    {
      id: 'dish_rice',
      name: '米饭',
      category: '主食',
      note: '',
      ingredients: [{ ingredientId: 'ing_rice', amount: 0.6 }],
      createdAt: '2026-03-02T08:06:00.000Z'
    }
  ],
  menus: [
    {
      id: 'menu_standard',
      name: '标准围餐菜单',
      note: '10人每桌',
      dishes: [
        { dishId: 'dish_chicken', count: 1 },
        { dishId: 'dish_broccoli', count: 1 },
        { dishId: 'dish_rice', count: 2 }
      ],
      createdAt: '2026-03-03T08:00:00.000Z'
    }
  ],
  projects: [
    {
      id: 'proj_launch',
      name: '春季新品发布会',
      note: '客户A',
      createdAt: '2026-03-05T08:00:00.000Z',
      tables: [
        {
          id: 'table_a',
          name: 'A区标准桌',
          menuId: 'menu_standard',
          tableCount: 6,
          extraDishes: [{ dishId: 'dish_broccoli', count: 1 }],
          extraIngredients: [{ ingredientId: 'ing_oil', amount: 0.2 }],
          note: '靠舞台'
        },
        {
          id: 'table_b',
          name: 'VIP桌',
          menuId: 'menu_standard',
          tableCount: 2,
          extraDishes: [{ dishId: 'dish_chicken', count: 1 }],
          extraIngredients: [],
          note: '不吃辣可调整'
        }
      ]
    }
  ],
  updatedAt: '2026-03-05T08:00:00.000Z'
};
