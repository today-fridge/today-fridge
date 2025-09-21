import { Clock, SquareUserRound } from "lucide-react";
import { Recipe } from "@/types";
import DifficultyStars from "@/components/DifficultyStars";

interface RecipeDetailHeaderProps {
  recipe: Recipe;
}

const RecipeDetailHeader = ({ recipe }: RecipeDetailHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl lg:text-4xl font-bold text-[#374151] mb-3">
        {recipe.name}
      </h1>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <DifficultyStars difficulty={recipe.difficulty} />
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#10B981]" />
          <span className="text-[#6B7280]">{recipe.cookingTime}분</span>
        </div>
        <div className="flex items-center gap-2">
          <SquareUserRound className="w-5 h-5 text-[#10B981]" />
          <span className="text-[#6B7280]">{recipe.userName}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailHeader;
