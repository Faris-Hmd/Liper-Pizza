import { productsRef } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

const CATEGORY_DATA = {
  PC: {
    imgs: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
    ],
    desc: "بيتزا نابوليتانية أصيلة مع جبنة الموزاريلا الفاخرة والصلصة الإيطالية.",
    names: ["بيتزا مارغريتا", "بيتزا بيبروني", "بيتزا خضروات"],
    priceRange: [12000, 25000],
  },
  LAPTOP: {
    imgs: [
      "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000",
    ],
    desc: "ساندوتشات طازجة مشغولة بأجود أنواع اللحوم والخضروات.",
    names: ["ساندوتش دجاج مشوي", "ساندوتش تونة", "ساندوتش لحم مدخن"],
    priceRange: [8000, 15000],
  },
  WEBCAMS: {
    imgs: [
      "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000",
    ],
    desc: "مقبلات شهية تكمل وجبتك بلمسة من السعادة.",
    names: ["بطاطس مقلية مقرمشة", "حلقات البصل الذهبية", "أصابع الموزاريلا"],
    priceRange: [5000, 9000],
  },
  HARD_DRIVES: {
    imgs: [
      "https://images.unsplash.com/photo-1437418747212-8d9709afab22?q=80&w=1000",
    ],
    desc: "مشروبات باردة ومنعشة تروي عطشك وتضفي انتعاشاً على وجبتك.",
    names: ["عصير برتقال طبيعي", "بيبسي بارد", "ماء معدني"],
    priceRange: [1500, 5000],
  },
  HEADSETS: {
    imgs: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    ],
    desc: "مشروبات ساخنة مميزة مُعدة من أجود أنواع البن.",
    names: ["قهوة سوداء", "لاتيه", "كابتشينو"],
    priceRange: [3000, 7000],
  },
  KEYBOARDS: {
    imgs: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000",
    ],
    desc: "حلويات غنية بالطعم لتجربة حلوة لا تُنسى.",
    names: ["تشيز كيك فروت", "بلاك فورست", "كنافة بالجبن"],
    priceRange: [7000, 18000],
  },
  SPEAKERS: {
    imgs: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    ],
    desc: "سلطات طازجة ومغذية محضرة يومياً بأفضل المكونات.",
    names: ["سلطة سيزر", "سلطة يونانية", "تبولة"],
    priceRange: [6000, 12000],
  },
  PRINTERS: {
    imgs: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
    ],
    desc: "وجبات عائلية متكاملة تشبع جميع أفراد الأسرة.",
    names: ["صندوق العائلة الكبير", "وجبة الأصدقاء الرياضية"],
    priceRange: [25000, 40000],
  },
  MICROPHONES: {
    imgs: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
    ],
    desc: "إضافات مميزة تمنح طبقك المذاق الذي تحبه.",
    names: ["صوص الثوم", "صوص حار", "جبنة إضافية"],
    priceRange: [1000, 3000],
  },
  MONITORS: {
    imgs: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
    ],
    desc: "بيتزا إيطالية رقيقة ومخبوزة على الحجر.",
    names: ["بيتزا فروتي دي ماري", "بيتزا فونغي إيطالية"],
    priceRange: [18000, 32000],
  },
  SSD: {
    imgs: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000",
    ],
    desc: "بيتزا شرقية بنكهاتنا المحلية والأصيلة.",
    names: ["بيتزا لحم مفروم", "بيتزا بالسجق الشرقي"],
    priceRange: [15000, 28000],
  },
  MOUSES: {
    imgs: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000",
    ],
    desc: "وجبات سريعة وخفيفة مثالية للأيام المشغولة.",
    names: ["برجر كلاسيك", "وجبة دجاج ناجتس"],
    priceRange: [9000, 19000],
  },
};

const MODIFIERS = ["حجم كبير", "دبل", "إكسترا", "سبايسي", "كلاسيك"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get("pass");

  // Basic security to prevent accidental seeding
  if (process.env.NODE_ENV === "production" && pass !== "seed_me_2024") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const categories = Object.keys(
      CATEGORY_DATA,
    ) as (keyof typeof CATEGORY_DATA)[];

    // Create 10 products for each category
    const allPromises = categories.flatMap((catKey) => {
      const config = (CATEGORY_DATA as any)[catKey];

      return Array.from({ length: 10 }).map((_, index) => {
        const randomName =
          config.names[Math.floor(Math.random() * config.names.length)];
        const useModifier = index < 3; // Only first 3 products get modifiers
        const modifier =
          MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
        const randomImg =
          config.imgs[Math.floor(Math.random() * config.imgs.length)];
        const baseCost = Math.floor(
          Math.random() * (config.priceRange[1] - config.priceRange[0]) +
            config.priceRange[0],
        );
        // Round to nearest 100 to avoid fractions
        const cost = Math.round(baseCost / 100) * 100;

        return addDoc(productsRef, {
          p_name: useModifier ? `${randomName} - ${modifier}` : randomName,
          p_cost: cost,
          p_cat: catKey,
          p_details: config.desc,
          p_imgs: [{ url: randomImg }],
          p_qu: Math.floor(Math.random() * 15) + 5,
          createdAt: serverTimestamp(),
          isFeatured: Math.random() > 0.9, // 20% chance of being featured
        });
      });
    });

    await Promise.all(allPromises);

    return NextResponse.json(
      {
        success: true,
        count: allPromises.length,
        message: `Database seeded successfully.`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: "Seeding failed" },
      { status: 500 },
    );
  }
}
