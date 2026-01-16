import { getProducts } from "./productsServices";
import { Offer } from "@/types/offerTypes";

export async function getOffers(): Promise<Offer[]> {
  const products = await getProducts("all", "", 20);

  const offers: Offer[] = [
    {
      id: "offer-1",
      title: "العرض العائلي الضخم",
      description:
        "باكيت متكامل يضم بيتزا كبيرة، مشروبات باردة، وبطاطس مقرمشة تكفي العائلة.",
      image: "/dessert_combo_offer_1768573450246.png",
      badge: "الأكثر مبيعاً",
      products: products.slice(0, 3),
      price: 1500, // Example discounted price
    },
    {
      id: "offer-2",
      title: "تريو الساندوتشات",
      description:
        "ثلاثة من أشهر ساندوتشات لييبر المختارة بعناية مع حصة مضاعفة من البطاطس.",
      image: "/sandwich_trio_offer_1768573435256.png",
      badge: "عرض التوفير",
      products: products.slice(3, 6),
      price: 1200,
    },
    {
      id: "offer-3",
      title: "كومبو الحلويات",
      description:
        "استمتع بألذ أنواع الحلويات الإيطالية في باقة واحدة للتحلية المثالية.",
      image: "/dessert_combo_offer_1768573450246.png",
      badge: "جديد",
      products: products.slice(6, 9),
      price: 850,
    },
  ];

  return offers.filter((o) => o.products.length > 0);
}

export async function getOffer(id: string): Promise<Offer | null> {
  const offers = await getOffers();
  return offers.find((o) => o.id === id) || null;
}
