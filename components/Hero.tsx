import React from "react";
import { ArrowRight, Grid2X2 } from "lucide-react";

function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[25vh] items-center justify-center overflow-hidden bg-background py-4 md:py-6 transition-colors duration-500"
    >
      {/* Background Glows & Grid */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(to right, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)",
          }}
        />
        {/* Dynamic Blobs */}
        <div
          className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[80px] hidden md:block animate-pulse"
          style={{ willChange: "transform" }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[80px] hidden md:block animate-pulse [animation-delay:2s]"
          style={{ willChange: "transform" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-foreground">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 md:backdrop-blur-md border border-primary/20 px-4 py-1.5 text-[10px] font-black text-primary uppercase tracking-[0.3em] transition-all hover:bg-primary/20 active:scale-95">
            أفضل بيتزا في المدينة
            <ArrowRight size={10} className="text-primary/60 rotate-180" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl text-foreground leading-[1.1]">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              تذوق طعم السعادة
            </span>
            <br />
            <span className="opacity-90">في كل قطعة بيتزا</span>
          </h1>
        </div>

        <p className="mx-auto mt-2 max-w-2xl text-base opacity-70 md:text-lg">
          نقدم لكم أشهى أنواع البيتزا المخبوزة بعناية فائقة، باستخدام أجود
          المكونات الطازجة لتجربة طعم لا تُنسى.
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-row justify-center items-center gap-3">
          <a
            href="#shop"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-radius-md bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              اطلب الآن{" "}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:-translate-x-1 rotate-180" />
            </span>
            <div className="absolute inset-0 translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:-translate-x-full" />
          </a>

          <a
            href="#categories"
            className="group inline-flex items-center justify-center gap-2 rounded-radius-md bg-secondary/10 md:backdrop-blur-md border border-secondary/20 px-4 py-2 text-sm font-black text-foreground transition-all hover:bg-secondary/20 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Grid2X2 className="h-5 w-5 text-primary" />
              <span>تصفح القائمة</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
