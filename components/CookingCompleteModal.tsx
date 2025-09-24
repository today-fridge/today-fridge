"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { IngredientForRecipe, RecipeIngredient } from "@/types";
import {
  normalizeIngredientForDisplay,
  processIngredientUpdates,
} from "@/lib/recipeTransform";

interface CookingCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishName: string;
  userIngredientList: IngredientForRecipe[];
  recipeIngredients: RecipeIngredient[];
  onIngredientsUpdate: (updatedIngredients: RecipeIngredient[]) => void;
}

export function CookingCompleteModal({
  isOpen,
  onClose,
  dishName,
  userIngredientList,
  recipeIngredients,
  onIngredientsUpdate,
}: CookingCompleteModalProps) {
  const normalizedRecipeIngredients = useMemo(() => {
    return recipeIngredients.map(normalizeIngredientForDisplay);
  }, [recipeIngredients]);
  const [ingredientQuantity, setIngredientQuantity] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const quantity: { [key: string]: number } = {};
    normalizedRecipeIngredients.forEach((ingredient) => {
      quantity[ingredient.name] = ingredient.displayQuantity;
    });
    setIngredientQuantity(quantity);
  }, [normalizedRecipeIngredients]);

  const handleAdjustQuantity = (ingredientName: string, change: number) => {
    setIngredientQuantity((prev) => {
      const currentQuantity = prev[ingredientName] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      return {
        ...prev,
        [ingredientName]: newQuantity,
      };
    });
  };

  const handleConfirm = () => {
    // 사용한 재료들 생성
    const usedIngredients = normalizedRecipeIngredients.map((ingredient) => ({
      name: ingredient.name,
      quantity:
        ingredientQuantity[ingredient.name] ?? ingredient.displayQuantity,
    }));
    // 냉장고 재료 업데이트
    const updatedFridgeIngredients = processIngredientUpdates(
      userIngredientList,
      usedIngredients
    );

    onIngredientsUpdate(updatedFridgeIngredients);
    onClose();
  };

  const handleCancel = () => {
    // 원래 값으로 리셋
    const quantity = normalizedRecipeIngredients.reduce((acc, ingredient) => {
      acc[ingredient.name] = ingredient.displayQuantity;
      return acc;
    }, {} as { [key: string]: number });
    setIngredientQuantity(quantity);
    onClose();
  };

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            i % 2 === 0 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-xl">
        <div className="relative pt-6 text-center">
          <FloatingParticles />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl text-gray-700">
                  🎉 요리 완성을 축하합니다!
                </h1>
              </div>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-4 rounded-lg bg-gray-50"
              >
                <p className="text-lg text-gray-700">
                  <strong>{dishName}</strong>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-3 flex justify-center items-center">
            <DialogTitle className="text-gray-700">
              사용한 재료량을 확인해주세요
            </DialogTitle>
            <p className="text-s text-gray-500 pl-3 pr-3">개수로 차감됩니다</p>
          </DialogHeader>

          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {normalizedRecipeIngredients.map((ingredient, index) => (
              <motion.div
                key={`${ingredient.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <span className="text-gray-700">{ingredient.name}</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustQuantity(ingredient.name, -0.5)}
                    className="w-8 h-8 p-0 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                    disabled={ingredientQuantity[ingredient.name] <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-16 text-center text-gray-700 text-sm">
                    {ingredientQuantity[ingredient.name]}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustQuantity(ingredient.name, 0.5)}
                    className="w-8 h-8 p-0 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 py-6 rounded-lg text-gray-700 border-gray-500 transition-all duration-300 hover:-translate-y-1 text-base"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 py-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-300 hover:-translate-y-1 text-base"
            >
              냉장고에서 차감하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
