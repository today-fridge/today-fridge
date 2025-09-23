// components/ReceiptScanner.tsx
"use client";

import { ReceiptText, Loader2 } from "lucide-react";
import { useScanReceipt, useReceiptTest } from "@/hooks/useReceiptOcr";
import type { ExtractedItem } from "@/services/receipt";
import { useId } from "react";

type Props = {
  onExtract: (items: ExtractedItem[]) => void;
  className?: string;
};

export default function ReceiptScanner({ onExtract, className }: Props) {
  const inputId = useId();
  const test = useReceiptTest();
  const scan = useScanReceipt();

  const scanning = scan.isPending || test.isPending;

  const handleTest = () => {
    test.mutate(undefined, {
      onSuccess: (items) => onExtract(items),
      onError: (e) => alert(e.message),
    });
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    scan.mutate(file, {
      onSuccess: (items) => onExtract(items),
      onError: (e) => alert(e.message),
    });
    // 같은 파일로 다시 선택 가능하도록 reset
    e.currentTarget.value = "";
  };

  return (
    <div className={className}>
      {/* 테스트 데이터 버튼 */}
      <button
        onClick={handleTest}
        className="text-sm underline text-[#6B7280] disabled:opacity-50"
        disabled={scanning}
        type="button"
      >
        테스트 데이터로 채우기
      </button>

      {/* 업로드 버튼 */}
      <div className="mt-4">
        <label
          htmlFor={inputId}
          className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer ${
            scanning
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#10B981] text-white hover:bg-[#059669]"
          }`}
        >
          {scanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              영수증 분석 중...
            </>
          ) : (
            <>
              <ReceiptText className="w-5 h-5" />
              영수증으로 추가하기
            </>
          )}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={scanning}
          onChange={handleChangeFile}
        />
      </div>
    </div>
  );
}
