import { Ingredient } from '../types';

export const addIngredientToList = (
  currentIngredients: Ingredient[],
  newIngredient: Omit<Ingredient, 'id' | 'daysLeft' | 'available'>
): Ingredient[] => {
  const purchaseDate = new Date(newIngredient.purchaseDate);
  const expiryDate = new Date(newIngredient.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const ingredient: Ingredient = {
    ...newIngredient,
    id: Date.now().toString(),
    daysLeft,
    available: true
  };
  
  return [...currentIngredients, ingredient];
};