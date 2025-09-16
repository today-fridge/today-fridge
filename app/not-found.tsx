"use client";

import { MessageCircleWarning } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col justify-center items-center text-center mt-[200px] text-[17px]">
      <MessageCircleWarning className="text-[90px] mb-2.5" />
      <div>잘못된 접근입니다</div>
      <div>찾으시는 페이지가 존재하지 않습니다</div>
      <button
        className="bg-[#10B981] my-[30px] text-center text-[15px] font-semibold rounded-[13px] w-[130px] h-[45px] shadow-[rgba(0,0,0,0.4)_0px_2px_4px,rgba(0,0,0,0.3)_0px_7px_13px_-3px,rgba(0,0,0,0.2)_0px_-3px_0px_inset] bg-[#10B981]/10 active:transform active:scale-95 transition-all duration-150"
        onClick={handleGoBack}
      >
        이전 페이지로
      </button>
    </div>
  );
};

export default NotFound;
