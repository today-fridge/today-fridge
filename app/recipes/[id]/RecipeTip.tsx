const RecipeTip = ({ difficulty }: { difficulty: number }) => {
  const getMessage = () => {
    if (difficulty <= 2) {
      return "간단한 레시피예요! 천천히 따라하시면 완벽한 요리가 완성됩니다.";
    }

    if (difficulty === 3) {
      return "중간 난이도 레시피입니다. 각 단계를 차근차근 따라해보세요.";
    }

    return "고급 레시피입니다. 시간을 충분히 두고 정성스럽게 만들어보세요.";
  };

  return (
    <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#F59E0B]/20 rounded-xl p-4">
      <h4 className="font-semibold text-[#92400E] mb-2 flex items-center gap-2">
        <span>💡</span>
        요리 팁
      </h4>
      <p className="text-[#92400E] text-sm">{getMessage()}</p>
    </div>
  );
};

export default RecipeTip;
