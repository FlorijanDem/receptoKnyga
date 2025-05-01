export const ACTIVITY_LEVELS = {
  SEDENTARY: {
    label: "Sedentary (little or no exercise)",
    multiplier: 1.2,
  },
  LIGHT: {
    label: "Light activity (light exercise/sports 1-3 days/week)",
    multiplier: 1.375,
  },
  MODERATE: {
    label: "Moderate activity (moderate exercise/sports 3-5 days/week)",
    multiplier: 1.55,
  },
  ACTIVE: {
    label: "Active (hard exercise/sports 6-7 days a week)",
    multiplier: 1.725,
  },
  VERY_ACTIVE: {
    label:
      "Very active (very hard exercise, physical job, or training twice a day)",
    multiplier: 1.9,
  },
};

export const BMI_CATEGORIES = {
  UNDERWEIGHT: { min: 0, max: 18.4, label: "Underweight" },
  NORMAL: { min: 18.5, max: 24.9, label: "Normal weight" },
  OVERWEIGHT: { min: 25, max: 29.9, label: "Overweight" },
  OBESE: { min: 30, max: Infinity, label: "Obese" },
};

export const calculateBMR = (weight, height, age, gender) => {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateDailyCalories = (bmr, activityLevel, my_goals) => {
  let goals = 0;
  if (my_goals === "lose_fat") goals -= 500;
  else if (my_goals == "gain_fat") goals += 500;
  else goals = 0;
  return bmr * activityLevel + goals;
};

export const calculateBMI = (weight, height) => {
  const heightM = height / 100;
  return weight / (heightM * heightM);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return BMI_CATEGORIES.UNDERWEIGHT;
  if (bmi <= 24.9) return BMI_CATEGORIES.NORMAL;
  if (bmi <= 29.9) return BMI_CATEGORIES.OVERWEIGHT;
  return BMI_CATEGORIES.OBESE;
};

export const calculateAllMetrics = (
  weight,
  height,
  age,
  gender,
  activityLevel,
  my_goals
) => {
  const bmr = calculateBMR(weight, height, age, gender);
  const dailyCalories = calculateDailyCalories(bmr, activityLevel, my_goals);
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);

  return {
    bmr,
    dailyCalories,
    bmi,
    bmiCategory,
  };
};
