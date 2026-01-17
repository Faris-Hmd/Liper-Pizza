import { Offer } from "@/types/offerTypes";

export const DUMMY_OFFERS: Offer[] = [
  {
    id: "sandwich-trio-offer",
    title: "باقة الثلاثي السعيد",
    description:
      "3 ساندوتشات من اختيارك مع طبقتين من البطاطس و3 علب صودا. وجبة متكاملة لمشاركتها مع الأصدقاء.",
    image: "/sandwich_trio_offer_1768573435256.png",
    badge: "عرض جديد",
    price: 320,
    products: [
      {
        id: "p2",
        p_name: "ساندوتش دجاج",
        p_cost: 80,
        p_cat: "LAPTOP",
        p_details: "ساندوتش دجاج مشوي مميز",
        p_imgs: [
          {
            url: "https://lzmijym9f9dkp5qm.public.blob.vercel-storage.com/products/sandwich.png",
          },
        ],
      },
    ],
  },
  {
    id: "dessert-combo-offer",
    title: "كومبو التحلية",
    description:
      "احصل على صنفين من الحلويات المختارة مع قهوة ساخنة بسعر مخفض. ختم وجبتك بأحلى مذاق.",
    image: "/dessert_combo_offer_1768573450246.png",
    badge: "وقت التحلية",
    price: 180,
    products: [
      {
        id: "p3",
        p_name: "قهوة كابتشينو",
        p_cost: 45,
        p_cat: "HEADSETS",
        p_details: "قهوة ايطالية بالرغوة",
        p_imgs: [
          {
            url: "https://lzmijym9f9dkp5qm.public.blob.vercel-storage.com/products/coffee.png",
          },
        ],
      },
    ],
  },
];
