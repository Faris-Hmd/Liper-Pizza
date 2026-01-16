import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getOffer } from "@/services/offersServices";
import { ArrowLeft, ShoppingCart, CheckCircle2, Info } from "lucide-react";
import { notFound } from "next/navigation";
import OfferClientActions from "./OfferClientActions";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center justify-between">
        <Link
          href={"/offers" as any}
          className="p-2 hover:bg-muted rounded-full transition-colors flex items-center gap-2 font-bold"
        >
          <ArrowLeft size={20} />
          <span className="hidden md:inline">العودة للعروض</span>
        </Link>
        <span className="font-black text-sm uppercase tracking-widest text-primary italic">
          Detail Page
        </span>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Visual Section */}
          <div className="space-y-6">
            <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-border">
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

            <div className="grid grid-cols-3 gap-4">
              {offer.products.map((p, i) => (
                <div
                  key={p.id}
                  className="relative aspect-square rounded-3xl overflow-hidden border border-border group"
                >
                  <Image
                    src={p.p_imgs[0]?.url || "/placeholder.png"}
                    alt={p.p_name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-tight italic">
                {offer.title}
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="flex items-center gap-4 py-6 border-y border-border">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  السعر الإجمالي
                </span>
                <span className="text-5xl font-black text-foreground">
                  {offer.price}
                  <span className="text-sm mr-2 opacity-60">جنية</span>
                </span>
              </div>
              <div className="mr-auto">
                <OfferClientActions offer={offer} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Info size={20} className="text-primary" />
                مكونات العرض:
              </h3>
              <div className="space-y-4">
                {offer.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm">
                        <Image
                          src={product.p_imgs[0]?.url || "/placeholder.png"}
                          alt={product.p_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {product.p_name}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {product.p_cat}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2
                      size={18}
                      className="text-primary opacity-40 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <p className="text-sm font-bold text-primary/80 flex items-center gap-2 italic">
                <ShoppingCart size={16} />
                تتم إضافة جميع الأصناف أعلاه بضغطة واحدة إلى السلة.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
