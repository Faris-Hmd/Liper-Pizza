import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getOffers } from "@/services/offersServices";
import { Sparkles, ArrowLeft, PlusCircle } from "lucide-react";

export const metadata = {
  title: "لييبر بيتزا | العروض",
  description: "استكشف عروضنا الحصرية والوفيرة",
};

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={"/" as any}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-black tracking-tight">
              العروض الحصرية
            </h1>
          </div>
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Sparkles size={20} className="animate-pulse" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6 text-center mb-10 md:mb-16">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
              وفر أكثر مع <span className="text-primary italic">باقاتنا</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              لقد قمنا بتجميع ألذ الوجبات في باقات خاصة لتجربة طعام استثنائية
              وبسعر أفضل.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-screen-2xl mx-auto">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}` as any}
              className="group relative flex flex-col bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                {offer.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {offer.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors italic line-clamp-1">
                      {offer.title}
                    </h3>
                    <p className="text-muted-foreground text-xs font-medium line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                    {offer.products.slice(0, 3).map((p, i) => (
                      <div
                        key={p.id}
                        className="inline-block relative h-8 w-8 rounded-full ring-2 ring-card overflow-hidden bg-muted"
                      >
                        <Image
                          src={p.p_imgs[0]?.url || "/placeholder.png"}
                          alt={p.p_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {offer.products.length > 3 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-card bg-muted text-[10px] font-bold">
                        +{offer.products.length - 3}
                      </div>
                    )}
                  </div>

                  {offer.price && (
                    <div className="text-right">
                      <span className="text-lg font-black text-foreground">
                        {offer.price}
                        <span className="text-[10px] mr-1 opacity-60 font-bold">
                          جنية
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full flex items-center justify-center gap-2 bg-muted group-hover:bg-primary group-hover:text-primary-foreground py-3 rounded-xl font-black text-xs transition-all uppercase tracking-wider">
                  <span>طلب العرض</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
