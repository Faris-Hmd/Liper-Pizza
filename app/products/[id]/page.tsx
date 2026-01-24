import {
  getProductsIds,
  getProduct,
  getProducts,
} from "@/services/productsServices";
import ProductImgCarousel from "@/components/carousel";
import ProductGrid from "@/components/ProductGrid";
import CartBtn from "./components/cartBtn";
import { ChevronLeft, Info, Package, ShieldCheck } from "lucide-react";
import Link from "next/link";

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

export async function generateStaticParams() {
  return await getProductsIds();
}

export const revalidate = 15;
export const metadata = {
  title: `لييبر بيتزا | تفاصيل المنتج`,
  description: "تفاصيل وجبة البيتزا والمكونات",
};

export default async function ProductsDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const product = await getProduct(id);
  const prodSameCate = await getProducts("p_cat", product?.p_cat, 7);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Package size={48} className="text-muted-foreground/30" />
        <h1 className="text-xl font-black text-foreground uppercase tracking-tighter">
          الوجبة غير موجودة
        </h1>
        <Link
          href="/products"
          className="text-xs font-bold text-primary uppercase underline"
        >
          العودة لقائمة الوجبات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors pb-20">
      {/* Top Navigation Bar */}

      <div className="container mx-auto px-0 md:px-6 max-w-7xl">
        {/* Main Product Card */}
        <div className="bg-card md:rounded-radius-lg shadow-2xl shadow-primary/5 border-y md:border border-border overflow-hidden transition-all">
          <div className="grid md:grid-cols-2">
            {/* Left: Interactive Gallery */}
            <div className="relative bg-card flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
              <div className="w-full h-full">
                <ProductImgCarousel
                  imgH={"h-[250px] md:h-[350px]"}
                  imgs={product.p_imgs}
                  imgFill={"object-contain"}
                />
              </div>
              <div className="absolute top-6 right-6 hidden md:block">
                <span className="px-3 py-1 text-[9px] font-black text-info bg-info/10 rounded-radius-sm uppercase tracking-tighter">
                  منتج أصلي
                </span>
              </div>
            </div>

            {/* Right: Technical Details */}
            <div className="space-y-6 lg:sticky lg:top-6 w-full mx-auto lg:mx-0 p-6 md:p-8">
              <div className="flex-1 space-y-8">
                {/* Product Meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-[9px] font-black text-primary-foreground bg-primary rounded-radius-sm uppercase tracking-widest">
                      {LabelMap[product.p_cat] || product.p_cat}
                    </span>
                    <div className="h-[1px] w-8 bg-border" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      رمز المنتج: {id.slice(0, 8)}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight uppercase tracking-tighter">
                    {product.p_name}
                  </h1>

                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-primary tracking-tighter">
                        {Number(product.p_cost).toLocaleString()}
                      </span>
                      <span className="text-xs font-black text-muted-foreground uppercase">
                        جنية
                      </span>
                    </div>
                  </div>
                </div>

                {/* Structured Specs */}
                <div className="grid grid-cols-2 gap-3 py-6 border-y border-border">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      الحالة
                    </p>
                    <div className="flex items-center gap-1.5 text-success">
                      <ShieldCheck size={14} />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        متوفر
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      التوصيل
                    </p>
                    <div className="flex items-center gap-1.5 text-foreground/80">
                      <Package size={14} />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        توصيل سريع
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description Text */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <Info size={14} className="text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                      وصف الوجبة
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {product.p_details}
                  </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-12">
                <CartBtn product={{ ...product, id } as any} />
                <p className="text-[8px] text-center mt-4 text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  دفع آمن • منتجات لييبر بيتزا المعتمدة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Feed */}
        <div className="mt-16 space-y-8 px-4 md:px-0">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                وجبات مشابهة
              </p>
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">
                قد يعجبك أيضاً
              </h3>
            </div>
            <Link
              href={("/products/categories/" + product?.p_cat) as any}
              className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          <ProductGrid products={prodSameCate} />
        </div>
      </div>
    </div>
  );
}
