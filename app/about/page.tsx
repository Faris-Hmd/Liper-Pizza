"use client";

import React from "react";
import Link from "next/link";
import {
  Pizza,
  Flame,
  Utensils,
  ShoppingBag,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <header className="page-header border-none m-0 shadow-none bg-foreground">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase text-background m-0">
            نصنع ألذ <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              لحظات السعادة
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-background/60 text-lg md:text-xl leading-relaxed font-medium mt-6 m-0">
            تأسس مطعم لييبر بيتزا في قلب الخرطوم ليكون الوجهة الأولى لعشاق
            البيتزا الأصيلة المخبوزة بعناية وبأجود المكونات الطازجة.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <section className="py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                مهمتنا
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                أكثر من مجرد وجبة، <br /> نحن نصنع تجربة فريدة.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium m-0">
                في لييبر بيتزا، نؤمن أن البيتزا المثالية تبدأ من الشغف. نحن لا
                نكتفي بتقديم الطعام فحسب، بل نهتم بكل تفصيلة من اختيار الدقيق
                وحتى درجة حرارة الفرن.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium m-0">
                لقد بدأنا برؤية بسيطة: تقديم بيتزا عالمية بنكهة محلية تناسب ذوق
                زبائننا وتفوق توقعاتهم في كل قضمة.
              </p>
            </div>

            {/* Stats Bento Box */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-8 rounded-[2rem] border border-border transition-all">
                <p className="text-4xl font-black text-primary m-0">+50 ألف</p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-2 m-0">
                  بيتزا مباعة
                </p>
              </div>
              <div className="bg-primary p-8 rounded-[2rem] text-primary-foreground transition-all shadow-xl shadow-primary/10">
                <p className="text-4xl font-black m-0">2026</p>
                <p className="text-xs text-primary-foreground/80 font-black uppercase tracking-widest mt-2 m-0">
                  عاماً من التميز
                </p>
              </div>
              <div className="bg-card p-8 rounded-[2rem] border border-border col-span-2 transition-all">
                <p className="text-4xl font-black text-foreground transition-colors m-0">
                  100%
                </p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-2 m-0">
                  مكونات طازجة وجودة مضمونة
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values - Modern Cards */}
        <section className="bg-muted/30 py-24 transition-colors">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter m-0">
              سر الجودة في لييبر
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "براعة التحضير",
                desc: "بيتزا مخبوزة على الحجر بأيدي أمهر الطهاة لضمان الطعم المقرمش والنكهة الغنية.",
                icon: Pizza,
              },
              {
                title: "مكونات أصلية",
                desc: "نستخدم فقط المكونات الطازجة والمستوردة لضمان جودة لا تضاهى في كل طلب.",
                icon: ShieldCheck,
              },
              {
                title: "توصيل فائق السرعة",
                desc: "نصل إليك في أسرع وقت ممكن لنضمن وصول البيتزا ساخنة وطازجة لباب بيتك.",
                icon: Truck,
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <value.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-3 m-0">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm font-bold m-0">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="bg-primary rounded-[3rem] p-10 md:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight m-0 text-primary-foreground">
                جاهز لتذوق أفضل بيتزا في الخرطوم؟
              </h2>
              <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto text-lg font-medium opacity-90 m-0">
                تصفح قائمتنا الآن واطلب وجبتك المفضلة لتصلك ساخنة في دقائق.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link
                  href={"/products" as any}
                  className="bg-background text-primary px-10 py-4 rounded-2xl font-black hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5"
                >
                  تصفح القائمة
                  <ArrowRight size={20} className="rotate-180" />
                </Link>
                <Link
                  href={"/contact" as any}
                  className="bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/20 px-10 py-4 rounded-2xl font-black hover:bg-primary-foreground/20 transition-all backdrop-blur-sm"
                >
                  اتصل بنا
                </Link>
              </div>
            </div>
            {/* Decorative Circle */}
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary-foreground/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-primary-foreground/20 rounded-full blur-3xl" />
          </div>
        </section>
      </div>
    </div>
  );
}
