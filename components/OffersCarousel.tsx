"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Offer } from "@/types/offerTypes";
import { dispatchCartUpdate, useCart } from "@/hooks/useCart";
import { PlusCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface OffersCarouselProps {
  offers: Offer[];
}

const OffersCarousel: React.FC<OffersCarouselProps> = ({ offers }) => {
  const { cart } = useCart();

  const handleAddOffer = (e: React.MouseEvent, offer: Offer) => {
    e.preventDefault();
    e.stopPropagation();

    let currentCart = [...cart];

    offer.products.forEach((product) => {
      const existing = currentCart.find((p) => p.id === product.id);
      if (existing) {
        existing.p_qu = (existing.p_qu || 1) + 1;
      } else {
        currentCart.push({ ...product, p_qu: 1 });
      }
    });

    localStorage.setItem("sh", JSON.stringify(currentCart));
    dispatchCartUpdate();
    toast.success(`تم إضافة عرض "${offer.title}" إلى السلة!`, {
      description: "تم تحديث سلة التسوق الخاصة بك بنجاح",
    });
  };

  return (
    <div className="relative w-full max-w-screen-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 group/header">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-sm ring-1 ring-primary/20">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              عروض حصرية
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              وفر أكثر مع باقاتنا المختارة بعناية
            </p>
          </div>
        </div>

        <Link
          href={"/offers" as any}
          className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider hover:gap-3 transition-all"
        >
          <span>عرض الكل</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          direction: "rtl",
        }}
        className="w-full relative group"
      >
        <CarouselContent className="-ml-4">
          {offers.map((offer) => {
            const individualTotal = offer.products.reduce(
              (acc, p) => acc + (Number(p.p_cost) || 0),
              0,
            );
            const savings = individualTotal - (offer.price || 0);

            return (
              <CarouselItem
                key={offer.id}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
              >
                <Link
                  href={`/offers/${offer.id}` as any}
                  className="group/card relative block aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-card cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/40"
                >
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover/card:opacity-95" />

                  {/* Image */}
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-1000"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                    {offer.badge && (
                      <span className="px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                        {offer.badge}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="px-3 py-1 bg-success text-success-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl animate-in fade-in slide-in-from-top-2 duration-700">
                        وفر {savings.toLocaleString()} جنية
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-all duration-500">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-1 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm font-medium mb-5 line-clamp-1 group-hover/card:text-white/90">
                      {offer.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => handleAddOffer(e, offer)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
                      >
                        <PlusCircle size={18} />
                        <span>اطلب الآن</span>
                      </button>

                      {offer.price && (
                        <div className="flex flex-col items-end">
                          <span className="text-white/50 text-[10px] line-through font-bold">
                            {individualTotal.toLocaleString()}
                          </span>
                          <span className="text-white font-black text-lg leading-none">
                            {offer.price}{" "}
                            <span className="text-xs opacity-70">جنية</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary-rgb),0.15),transparent_80%)]" />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden md:block">
          <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all border-none bg-background/80 blur-none hover:bg-primary hover:text-white shadow-xl" />
          <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all border-none bg-background/80 blur-none hover:bg-primary hover:text-white shadow-xl" />
        </div>
      </Carousel>
    </div>
  );
};

export default OffersCarousel;
