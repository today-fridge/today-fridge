import { getDifficultyText } from "@/lib/recipeTransform";
import { Star } from "lucide-react";

const DifficultyStars = ({ difficulty }: { difficulty: number }) => {
  return (
    <span className="flex items-center text-[#6B7280]">
      {Array.from({ length: difficulty }, (_, index) => (
        <Star
          key={index}
          size={18}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
      <span className="ml-2">{getDifficultyText(difficulty)}</span>
    </span>
  );
};

export default DifficultyStars;
