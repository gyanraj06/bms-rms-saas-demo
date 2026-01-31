export type Unit = "kg" | "g" | "l" | "ml" | "pcs" | "oz" | "lb";

export type Ingredient = {
  id: string;
  name: string;
  unit: Unit;
  costPerUnit: number;
  currentStock: number;
  minStockLevel: number;
  idealStock?: number; // For progress bar visualization
  category?: string;
  lastUpdated: number;
};

export type InventoryTransaction = {
  id: string;
  ingredientId: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  itemName?: string; // Dish name that consumed this
  orderId?: string;
  reason?: string;
  timestamp: number;
};

// Initial Mock Data with DEMO ITEMS
export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: "ing-paneer",
    name: "Paneer (Fresh)",
    unit: "kg",
    costPerUnit: 350,
    currentStock: 3.26, // Low stock demo
    idealStock: 10,
    minStockLevel: 3,
    category: "Dairy",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-1",
    name: "Burger Bun",
    unit: "pcs",
    costPerUnit: 5,
    currentStock: 100,
    idealStock: 150,
    minStockLevel: 20,
    category: "Bakery",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-2",
    name: "Chicken Patty",
    unit: "pcs",
    costPerUnit: 30,
    currentStock: 50,
    idealStock: 100,
    minStockLevel: 10,
    category: "Frozen",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-3",
    name: "Cheese Slice",
    unit: "pcs",
    costPerUnit: 10,
    currentStock: 200,
    idealStock: 300,
    minStockLevel: 50,
    category: "Dairy",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-4",
    name: "Tomato",
    unit: "kg",
    costPerUnit: 40,
    currentStock: 5,
    idealStock: 10,
    minStockLevel: 2,
    category: "Produce",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-5",
    name: "Lettuce",
    unit: "kg",
    costPerUnit: 60,
    currentStock: 3,
    idealStock: 5,
    minStockLevel: 1,
    category: "Produce",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-6",
    name: "Rice",
    unit: "kg",
    costPerUnit: 80,
    currentStock: 25,
    idealStock: 50,
    minStockLevel: 5,
    category: "Grains",
    lastUpdated: Date.now(),
  },
  {
    id: "ing-7",
    name: "Milk",
    unit: "l",
    costPerUnit: 60,
    currentStock: 10,
    idealStock: 20,
    minStockLevel: 5,
    category: "Dairy",
    lastUpdated: Date.now(),
  },
];
