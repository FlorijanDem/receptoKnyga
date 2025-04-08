/**
 * Validation rules for recipe forms
 * These rules match backend validation requirements
 */

// Recipe form field validation rules
export const RECIPE_VALIDATION = {
  title: {
    required: "Title is required",
    minLength: {
      value: 3,
      message: "Title must be at least 3 characters long",
    },
    maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
  },
  description: {
    required: "Description is required",
    minLength: {
      value: 5,
      message: "Description must be at least 5 characters long",
    },
    maxLength: {
      value: 1000,
      message: "Description cannot exceed 1000 characters",
    },
  },
  method: {
    required: "Method is required",
    minLength: {
      value: 5,
      message: "Method must be at least 5 characters long",
    },
    maxLength: { value: 2000, message: "Method cannot exceed 2000 characters" },
  },
  preparation_time: {
    required: "Preparation time is required",
    min: { value: 1, message: "Preparation time must be at least 1 minute" },
    max: {
      value: 1440,
      message: "Preparation time cannot exceed 24 hours (1440 minutes)",
    },
    valueAsNumber: true,
  },
  servings: {
    required: "Servings is required",
    min: { value: 1, message: "Must be at least 1 serving" },
    max: { value: 20, message: "Number of servings cannot exceed 20" },
    valueAsNumber: true,
  },
  photo: {
    required: "Photo URL is required",
    pattern: {
      value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))?$/i,
      message: "Invalid photo URL format",
    },
  },
};

// Ingredient validation rules
export const INGREDIENT_VALIDATION = {
  title: {
    required: "Ingredient name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters long" },
  },
  amount: {
    required: "Amount is required",
    min: { value: 1, message: "Minimum amount is 1" },
    max: { value: 10000, message: "Maximum amount is 10,000" },
    valueAsNumber: true,
  },
};

// Recipe form field labels
export const RECIPE_LABELS = {
  title: "Recipe Title",
  description: "Description",
  method: "Preparation Method",
  preparation_time: "Preparation Time (min)",
  servings: "Number of Servings",
  photo: "Photo URL",
  type: "Recipe Type",
};

// Recipe type options
export const RECIPE_TYPES = [
  { value: "non-veg", label: "Non-Vegetarian" },
  { value: "veg", label: "Vegetarian" },
];

// Categories that are not shown for vegetarian recipes
export const NON_VEGETARIAN_CATEGORIES = [
  "Meats",
  "Fish",
  "meat",
  "fish",
  "Meat",
  "Fish Products"
];

// Keywords that indicate non-vegetarian products
export const NON_VEGETARIAN_KEYWORDS = [
  "beef",
  "pork",
  "chicken",
  "fish",
  "meat",
  "turkey",
  "lamb",
  "bacon",
  "ham",
  "sausage",
  "duck",
  "animal"
];
