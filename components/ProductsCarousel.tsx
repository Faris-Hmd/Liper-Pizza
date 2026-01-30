"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ProductType } from "@/types/productsTypes";
import QuickAddBtn from "./quickAddBtn";
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

export default function ProductsCarousel({
  products,
}: {
  products: ProductType[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="relative py-8 md:py-16 overflow-hidden bg-muted/20 border border-border rounded-radius-sm">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full pointer-events-none hidden md:block" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:mb-2">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
              <Zap size={12} className="text-primary animate-pulse" />
              <span className="text-tiny font-black uppercase tracking-[0.2em] text-primary">
                أداء متميز
              </span>
            </div>
            <h2 className="text-2xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.85]">
              أبرز
              <span className="text-primary italic"> الوجبات</span>
            </h2>
          </div>
        </div>

        {/* Carousel Component */}
        {/* Carousel Component */}
        <div
          className="w-full flex gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mb-6 scrollbar-hide"
          dir="rtl"
        >
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="snap-start flex-shrink-0 w-[85%] sm:w-1/2 lg:w-1/3"
            >
              <div
                className={cn(
                  "group relative bg-card h-full border border-border rounded-sm p-3 md:p-5 transition-all duration-500 hover:border-primary/50",
                )}
              >
                {/* Product Media */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted mb-4 md:mb-6">
                  <Link
                    href={`/products/${product.id}`}
                    className="block h-full"
                  >
                    <Image
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      src={product.p_imgs[0].url}
                      alt={product.p_name}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700"
                    />
                  </Link>

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-background/90  border rounded-radius-sm border-border text-tiny font-black text-primary uppercase tracking-widest">
                      {LabelMap[product.p_cat] || product.p_cat}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space">
                  <div className="">
                    <h3 className="text-base md:text-xl font-black text-foreground leading-tight line-clamp-2 uppercase tracking-tight">
                      {product.p_name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-tiny font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">
                        قيمة الوجبة
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl md:text-2xl font-black text-foreground tracking-tighter">
                          {Number(product.p_cost).toLocaleString()}
                        </span>
                        <span className="text-tiny font-black text-primary uppercase">
                          جنية
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 scale-90 md:scale-100 origin-right">
                      <QuickAddBtn product={product} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
