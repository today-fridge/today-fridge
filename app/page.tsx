"use client";

import dynamic from "next/dynamic";
const IngredientClient = dynamic(() => import("./IngredientClient"), {
  ssr: false,
});

export default function HomePage() {
  return <IngredientClient />;
}
