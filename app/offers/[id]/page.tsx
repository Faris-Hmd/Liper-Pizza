import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getOffer } from "@/services/offersServices";
import { ArrowLeft, ShoppingCart, CheckCircle2, Info } from "lucide-react";
import { notFound } from "next/navigation";
import OfferCheckout from "../components/OfferCheckout";
import { CategoryLabelMap } from "@/data/categoryMapping";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) return { title: "العرض غير موجود" };
  return {
    title: `لييبر بيتزا | ${offer.title}`,
    description: offer.description,
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);

  if (!offer) {
    notFound();
  }

  const individualTotal = offer.products.reduce(
    (acc, p) => acc + (Number(p.p_cost) || 0),
    0,
  );
  const savings = individualTotal - (offer.price || 0);

  // Group products to show quantities
  const groupedProducts = offer.products.reduce((acc: any[], product) => {
    const existing = acc.find((p) => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...product, quantity: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky shadow-sm top-0 z-50 w-full py-5 bg-background border-b border-white/10 px-4 h-18 flex items-center justify-between">
        <Link
          href={"/offers" as any}
          className="p-2 hover:bg-muted rounded-full transition-colors flex items-center gap-2 font-bold"
        >
          <ArrowLeft size={20} />
          <span className="hidden md:inline">العودة للعروض</span>
        </Link>
        <div className="flex flex-col items-center">
          <span className="font-black text-sm uppercase tracking-widest text-primary italic leading-none">
            باقة توفير حصرية
          </span>
          {savings > 0 && (
            <span className="text-[10px] font-bold text-success uppercase tracking-tighter mt-1 bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
              وفر {savings.toLocaleString()} جنية
            </span>
          )}
        </div>
        <div className="w-10 md:w-24" /> {/* Spacer */}
      </div>

      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Visual Section */}
          <div className="space-y-6 lg:sticky lg:top-24 w-full max-w-lg mx-auto lg:mx-0">
            <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-border">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {offer.badge && (
                <div className="absolute top-8 right-8">
                  <span className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full shadow-2xl">
                    {offer.badge}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3 w-full max-w-lg mx-auto lg:mx-0">
              {offer.products.map((p, i) => (
                <Link
                  key={`${p.id}-${i}`}
                  href={`/products/${p.id}` as any}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-border group bg-muted/30 shadow-sm transition-all hover:border-primary/50 active:scale-95"
                >
                  <Image
                    src={p.p_imgs[0]?.url || "/placeholder.png"}
                    alt={p.p_name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="100px"
                  />
                </Link>
              ))}
            </div>

            {savings > 0 && (
              <div className="p-4 bg-success/5 rounded-2xl border border-success/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-success uppercase tracking-widest">
                    إجمالي سعر الأصناف منفردة
                  </p>
                  <p className="text-sm font-bold text-muted-foreground line-through decoration-error/30">
                    {individualTotal.toLocaleString()} جنية
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-success uppercase tracking-widest">
                    نسبة التوفير
                  </p>
                  <p className="text-lg font-black text-success italic">
                    {savings.toLocaleString()} جنية
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter leading-tight italic">
                {offer.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-medium max-w-md leading-relaxed">
                {offer.description}
              </p>
            </div>

            <OfferCheckout offer={offer} />

            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Info size={20} className="text-primary" />
                مكونات العرض:
              </h3>
              <div className="space-y-4">
                {groupedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}` as any}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all group shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm">
                        <Image
                          src={product.p_imgs[0]?.url || "/placeholder.png"}
                          alt={product.p_name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          {product.p_name}
                          {product.quantity > 1 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              × {product.quantity}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {CategoryLabelMap[product.p_cat] || product.p_cat}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-black text-foreground">
                        {Number(product.p_cost).toLocaleString()}
                        <span className="text-[10px] mr-1 text-muted-foreground font-bold">
                          جنية
                        </span>
                      </span>
                      <CheckCircle2
                        size={14}
                        className="text-primary opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <p className="text-sm font-bold text-primary/80 flex items-center gap-2 italic">
                <ShoppingCart size={16} />
                هذا العرض يتم طلبه بشكل مستقل ومباشر كطلب جديد.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
