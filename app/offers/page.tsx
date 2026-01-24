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
      <div className="sticky top-0 z-40 w-full bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={"/" as any}
              className="p-2 bg-muted rounded-radius-sm text-foreground transition-none"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">
                باقات <span className="text-primary">التوفير</span>
              </h1>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                عروض حصرية لفترة محدودة
              </p>
            </div>
          </div>
          <div className="p-2 bg-primary text-primary-foreground rounded-radius-sm shadow-sm group">
            <Sparkles size={18} className="transition-none" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-screen-2xl mx-auto">
          {offers.map((offer) => {
            const individualTotal = offer.products.reduce(
              (acc, p) => acc + (Number(p.p_cost) || 0),
              0,
            );
            const savings = individualTotal - (offer.price || 0);

            return (
              <div
                key={offer.id}
                className="relative flex flex-col bg-card border border-border rounded-radius-md overflow-hidden"
              >
                {/* Visual Area */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-border">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition-none"
                  />
                  {/* Badge Overlay */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    {offer.badge && (
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest rounded-radius-sm shadow-sm">
                        {offer.badge}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="px-2 py-1 bg-success text-success-foreground text-[8px] font-black uppercase tracking-widest rounded-radius-sm shadow-sm">
                        وفر {savings.toLocaleString()} جنية
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="space-y-1.5 mb-5">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight line-clamp-1">
                      {offer.title}
                    </h3>
                    <p className="text-muted-foreground text-xs font-medium line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="mt-auto space-y-4">
                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground line-through font-bold leading-none mb-1">
                          {individualTotal.toLocaleString()}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-foreground tracking-tighter leading-none">
                            {offer.price}
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">
                            جنية
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/offers/${offer.id}` as any}
                        className="bg-primary text-primary-foreground px-4 py-2.5 rounded-radius-sm font-black text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 active:scale-95 transition-all"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
