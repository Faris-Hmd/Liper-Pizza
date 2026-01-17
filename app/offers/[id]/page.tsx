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

  // Calculate individual total considering quantities
  const individualTotal = offer.products.reduce(
    (acc, p) => acc + (Number(p.p_cost) || 0) * (p.p_qu || 1),
    0,
  );
  const savings = individualTotal - (offer.price || 0);

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
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Info size={20} className="text-primary" />
                  مكونات العرض:
                </h3>
                <span className="text-tiny font-bold text-muted-foreground uppercase tracking-wider bg-muted px-3 py-1 rounded-full">
                  {offer.products.length} منتج
                </span>
              </div>
              <div className="space-y-3">
                {offer.products.map((product, index) => (
                  <Link
                    key={`${product.id}-${index}`}
                    href={`/products/${product.id}` as any}
                    className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden shadow-sm ring-1 ring-border">
                        <Image
                          src={product.p_imgs[0]?.url || "/placeholder.png"}
                          alt={product.p_name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                        {(product.p_qu || 1) > 1 && (
                          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-tiny font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                            {product.p_qu || 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">
                          {product.p_name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <p className="text-tiny text-muted-foreground font-medium uppercase tracking-wide">
                            {CategoryLabelMap[product.p_cat] || product.p_cat}
                          </p>
                          {(product.p_qu || 1) > 1 && (
                            <>
                              <span className="text-muted-foreground/30">
                                •
                              </span>
                              <span className="text-tiny font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                الكمية: {product.p_qu}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-sm font-black text-foreground">
                        {Number(product.p_cost).toLocaleString()}
                        <span className="text-tiny mr-1 text-muted-foreground font-bold">
                          جنية
                        </span>
                      </span>
                      {(product.p_qu || 1) > 1 && (
                        <span className="text-tiny font-bold text-muted-foreground">
                          {(
                            Number(product.p_cost) * (product.p_qu || 1)
                          ).toLocaleString()}{" "}
                          إجمالي
                        </span>
                      )}
                      <CheckCircle2
                        size={14}
                        className="text-success opacity-60 group-hover:opacity-100 transition-opacity"
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
