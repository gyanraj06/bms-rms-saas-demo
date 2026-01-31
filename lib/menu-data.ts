export type Modifier = {
  id: string;
  name: string;
  price: number;
  available: boolean;
};

export type ModifierGroup = {
  id: string;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  modifiers: Modifier[];
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  itemsCount: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime?: number;
  categoryId: string;
  image?: string;
  isVeg: boolean;
  available: boolean;
  modifierGroups: string[]; // IDs of modifier groups
  recipe?: {
    ingredientId: string;
    quantity: number;
  }[]; // Inventory Integration
};

export type Menu = {
  id: string;
  name: string;
  description?: string;
  categoryIds: string[]; // Categories to include in this menu
  itemIds: string[]; // Specific items to include (if empty, includes all items from categories)
  active: boolean;
  createdAt: number;
};

// Mock Data
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Appetizers",
    description: "Starters and small bites",
    itemsCount: 3,
  },
  { id: "2", name: "Main Course", description: "Hearty meals", itemsCount: 4 },
  {
    id: "3",
    name: "Beverages",
    description: "Refreshing drinks",
    itemsCount: 2,
  },
  { id: "4", name: "Desserts", description: "Sweet treats", itemsCount: 2 },
];

export const INITIAL_MODIFIER_GROUPS: ModifierGroup[] = [
  {
    id: "mg1",
    name: "Spice Level",
    required: true,
    minSelection: 1,
    maxSelection: 1,
    modifiers: [
      { id: "m1", name: "Mild", price: 0, available: true },
      { id: "m2", name: "Medium", price: 0, available: true },
      { id: "m3", name: "Spicy", price: 0, available: true },
    ],
  },
  {
    id: "mg2",
    name: "Add-ons",
    required: false,
    minSelection: 0,
    maxSelection: 3,
    modifiers: [
      { id: "m4", name: "Extra Cheese", price: 30, available: true },
      { id: "m5", name: "Mushrooms", price: 20, available: true },
      { id: "m6", name: "Olives", price: 20, available: true },
    ],
  },
  {
    id: "mg3",
    name: "Size",
    required: true,
    minSelection: 1,
    maxSelection: 1,
    modifiers: [
      { id: "m7", name: "Regular", price: 0, available: true },
      { id: "m8", name: "Large", price: 50, available: true },
    ],
  },
];

export const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "i1",
    name: "Crispy Corn",
    description: "Fresh corn kernels fried to perfection with spices.",
    price: 180,
    categoryId: "1",
    isVeg: true,
    available: true,
    modifierGroups: ["mg1"],
  },
  {
    id: "i2",
    name: "Chicken Wings",
    description: "Spicy buffalo wings served with ranch dip.",
    price: 250,
    categoryId: "1",
    isVeg: false,
    available: true,
    modifierGroups: ["mg1"],
  },
  {
    id: "i3",
    name: "Paneer Tikka",
    description: "Marinated paneer grilled in tandoor.",
    price: 220,
    categoryId: "1",
    isVeg: true,
    available: true,
    modifierGroups: ["mg1"],
  },
  {
    id: "i4",
    name: "Butter Chicken",
    description: "Classic chicken curry in a rich tomato gravy.",
    price: 350,
    categoryId: "2",
    isVeg: false,
    available: true,
    modifierGroups: ["mg1"],
  },
  {
    id: "i5",
    name: "Dal Makhani",
    description: "Creamy black lentils cooked overnight.",
    price: 280,
    categoryId: "2",
    isVeg: true,
    available: true,
    modifierGroups: [],
  },
  {
    id: "i6",
    name: "Fresh Lime Soda",
    description: "Sweet and salty refreshing drink.",
    price: 80,
    categoryId: "3",
    isVeg: true,
    available: true,
    modifierGroups: [],
  },
  {
    id: "i7",
    name: "Chocolate Brownie",
    description: "Warm fudge brownie with vanilla ice cream.",
    price: 150,
    categoryId: "4",
    isVeg: false, // Contains egg usually
    available: true,
    modifierGroups: ["mg2"], // Maybe extra chocolate sauce?
  },
];

export const INITIAL_MENUS: Menu[] = [
  {
    id: "menu-all",
    name: "All Items",
    description: "Complete menu with all available items",
    categoryIds: ["1", "2", "3", "4"],
    itemIds: [],
    active: true,
    createdAt: Date.now(),
  },
  {
    id: "menu-breakfast",
    name: "Breakfast Menu",
    description: "Morning specials and light bites",
    categoryIds: ["1", "3"],
    itemIds: ["i1", "i3", "i6"],
    active: true,
    createdAt: Date.now(),
  },
  {
    id: "menu-lunch-dinner",
    name: "Lunch & Dinner",
    description: "Full course meals",
    categoryIds: ["1", "2", "3", "4"],
    itemIds: [],
    active: true,
    createdAt: Date.now(),
  },
];
