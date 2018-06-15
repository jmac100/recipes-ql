export type Recipe = {
  id: string
  name: string
  description: string
  image: string
  url: string,
  Ingredients: Ingredient[],
  Instructions: Instruction[]
}

export type Instruction = {
  id: string
  description: string
  ordinal: number
  recipeId: string
}

export type Ingredient = {
  id: string
  description: string
  ordinal: number
  recipeId: string
}

export type Query = {
  recipe: Recipe
  recipes: Recipe[]
  recipeByName: Recipe
  ingredient: Ingredient
  ingredients: Ingredient[]
  instruction: Instruction
  instructions: Instruction[]
}

export type Mutation = {
  addRecipe: Recipe
  editRecipe: Recipe
  deleteRecipe: Recipe
  addIngredient: Ingredient
  editIngredient: Ingredient
  deleteIngredient: Ingredient
  addInstruction: Instruction
  editInstruction: Instruction
  deleteInstruction: Instruction
}