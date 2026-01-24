import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import {
  Pizza,
  Coffee,
  CupSoda,
  Utensils,
  IceCream,
  Users,
  PlusCircle,
  Soup,
  Beef,
  Flame,
  Salad,
  Sandwich,
} from "lucide-react";

const IconMap: Record<string, any> = {
  PC: Pizza,
  LAPTOP: Sandwich,
  WEBCAMS: Utensils,
  HARD_DRIVES: CupSoda,
  HEADSETS: Coffee,
  KEYBOARDS: IceCream,
  SPEAKERS: Salad,
  PRINTERS: Users,
  MICROPHONES: PlusCircle,
  MONITORS: Pizza,
  SSD: Pizza,
  MOUSES: Sandwich,
};

const LabelMap: Record<string, string> = {
  PC: "بيتزا",
  HARD_DRIVES: "مشروب بارد",
  HEADSETS: "مشروب ساخن",
  SPEAKERS: "سلطة",
  KEYBOARDS: "حلوى",
  LAPTOP: "ساندوتشات",
  WEBCAMS: "مقبلات",
  PRINTERS: "وجبات عائلية",
  MICROPHONES: "إضافات",
  MONITORS: "بيتزا إيطالية",
  SSD: "بيتزا شرقية",
  MOUSES: "وجبات سريعة",
};

export default function Categories() {
  return (
    <section id="categories" className="py-3 scroll-mt-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-1 bg-primary rounded-full mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3 transition-colors">
            تصفح حسب التصنيف
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-medium">
            اكتشف مجموعة متنوعة من الأطباق والوجبات السريعة
          </p>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {categories.map((cat) => {
            const Icon = IconMap[cat] || Utensils;
            const imageUrl = `https://lzmijym9f9dkp5qm.public.blob.vercel-storage.com/icons/${cat}.png`;
            const label = LabelMap[cat] || cat.replace(/_/g, " ");

            return (
              <Link
                key={cat}
                href={`/products/categories/${cat}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-radius-lg bg-card/50 border border-border transition-all duration-300 hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card rounded-radius-md shadow-sm border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  {Icon ? (
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground group-hover:text-primary transition-all" />
                  ) : (
                    <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform">
                      <Image
                        src={imageUrl}
                        alt={label}
                        fill
                        className="object-contain opacity-80 dark:opacity-60 dark:invert dark:brightness-200 group-hover:opacity-100 group-hover:brightness-100 transition-all"
                      />
                    </div>
                  )}
                </div>

                <span className="text-[10px] md:text-xs font-black text-muted-foreground text-center uppercase tracking-[0.1em] group-hover:text-primary transition-colors">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
