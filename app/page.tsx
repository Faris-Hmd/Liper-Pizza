import ProductsCarousel from "../components/ProductsCarousel";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import OffersCarousel from "../components/OffersCarousel";
import { getProducts } from "@/services/productsServices";
import { getOffers } from "@/services/offersServices";

export const revalidate = 15; // revalidate at most every hour
export const metadata = {
  title: "لييبر بيتزا | الرئيسية",
  description: "الصفحة الرئيسية لمطعم لييبر بيتزا",
};

export default async function Home() {
  const products = await getProducts("all", "", 20);
  const offers = await getOffers();

  return (
    <>
      <Hero />

      <div className="container mx-auto px-1 py-6 space-y-16">
        {offers.length > 0 && (
          <section className="scroll-mt-24">
            <OffersCarousel offers={offers} />
          </section>
        )}

        <section id="shop" className="scroll-mt-24 space-y-8 px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-1 bg-primary rounded-full mb-2" />
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic">
              الأصناف الأكثر <span className="text-primary">طلباً</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              استكشف قائمتنا المختارة من ألذ أنواع البيتزا والوجبات المحضرة
              بعناية فائقة لتناسب ذوقك الرفيع.
            </p>
          </div>
          <ProductGrid products={products.slice(0, 8)} />
        </section>

        <section className="space-y-6">
          <ProductsCarousel
            products={products
              .filter((p) => p?.isFeatured === true)
              .slice(0, 6)}
          />
        </section>

        <Categories />
      </div>
    </>
  );
}
