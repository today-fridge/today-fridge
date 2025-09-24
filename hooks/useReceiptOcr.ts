// hooks/useReceiptOcr.ts
import { useMutation } from "@tanstack/react-query";
import { scanReceipt, fetchReceiptTest, type ExtractedItem } from "@/services/receipt";

export const useScanReceipt = () =>
  useMutation<ExtractedItem[], Error, File>({
    mutationFn: scanReceipt,
  });

export const useReceiptTest = () =>
  useMutation<ExtractedItem[], Error, void>({
    mutationFn: fetchReceiptTest,
  });
