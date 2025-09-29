"use client";

import dynamic from "next/dynamic";

const CookingRecordClient = dynamic(() => import("./CookingRecordClient"), {
  ssr: false,
});

export default function RecordsPage() {
  return <CookingRecordClient />;
}