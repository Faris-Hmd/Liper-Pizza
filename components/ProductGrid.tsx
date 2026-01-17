"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductGridProps, ProductCardProps } from "@/types/productsTypes";
import QuickAddBtn from "./quickAddBtn";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LabelMap: Record<string, string> = {
  PC: "بيتزا",
  LAPTOP: "ساندوتشات",
  WEBCAMS: "مقبلات",
  HARD_DRIVES: "مشروبات باردة",
  HEADSETS: "مشروبات ساخنة",
  KEYBOARDS: "حلويات",
  SPEAKERS: "سلطات",
  PRINTERS: "وجبات عائلية",
  MICROPHONES: "إضافات",
  MONITORS: "بيتزا إيطالية",
  SSD: "بيتزا شرقية",
  MOUSES: "وجبات سريعة",
};

// --- 1. Product Card Component ---
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.p_imgs?.[0]?.url || "/placeholder.png";

  return (
    <div className="group relative flex flex-col bg-card border border-border rounded overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50">
      {/* Visual Area */}
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-[5/3] bg-muted overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={product.p_name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-500"
        />

        <div className="absolute top-1 left-3 overflow-hidden z-10">
          <span className="px-2 py-0.5 bg-background/90 border border-border rounded-md text-[9px] font-black text-primary uppercase tracking-widest">
            {LabelMap[product.p_cat] || product.p_cat}
          </span>
        </div>
      </Link>

      {/* Info Area */}
      <div className="p-2 md:p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="text-[11px] md:text-xs font-bold text-foreground leading-tight line-clamp-2 min-h-[2rem]">
          {product.p_name}
        </h3>

        <div className="mt-auto pt-2 border-t flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-black text-foreground leading-none">
              {Number(product.p_cost).toLocaleString()}
              <span className="text-[8px] mr-0.5 text-muted-foreground uppercase font-bold">
                جنية
              </span>
            </span>
          </div>

          <div className="shrink-0 scale-75 md:scale-90 origin-right">
            <QuickAddBtn product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Main Grid Component ---
interface ExtendedGridProps extends ProductGridProps {
  showSort?: boolean;
}

const ProductGrid: React.FC<ExtendedGridProps> = ({
  products,
  showSort = false,
}) => {
  const [sortBy, setSortBy] = useState<"name" | "price_asc" | "price_desc">(
    "name",
  );

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "name")
      return list.sort((a, b) => a.p_name.localeCompare(b.p_name));
    if (sortBy === "price_asc")
      return list.sort((a, b) => Number(a.p_cost) - Number(b.p_cost));
    if (sortBy === "price_desc")
      return list.sort((a, b) => Number(b.p_cost) - Number(a.p_cost));
    return list;
  }, [products, sortBy]);

  return (
    <div className="w-full px-4 py-8 md:py-12">
      {/* --- CONDITIONAL SORTING BAR --- */}
      {showSort && products.length > 0 && (
        <div className="flex items-center justify-between mb-8 max-w-screen-2xl mx-auto px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded text-primary-foreground">
              <ArrowUpDown size={14} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              ترتيب
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => setSortBy("name")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all",
                sortBy === "name"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              أ-ي
            </button>
            <button
              onClick={() => setSortBy("price_asc")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all",
                sortBy === "price_asc"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              $ الأقل سعراً
            </button>
            <button
              onClick={() => setSortBy("price_desc")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all",
                sortBy === "price_desc"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              $ الأعلى سعراً
            </button>
          </div>
        </div>
      )}

      {/* Grid Display */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 max-w-screen-2xl mx-auto">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-screen-2xl mx-auto rounded-xl border-2 border-dashed border-border bg-muted/30">
          <h3 className="text-foreground font-black text-base uppercase">
            لم يتم العثور على أي وجبات
          </h3>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
