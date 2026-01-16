import Link from "next/link";
import { MoveLeft, Pizza, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Icon Area */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-card border border-border p-8 rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-110">
          <Pizza
            size={64}
            className="text-primary rotate-12 transition-transform duration-500 group-hover:rotate-0"
          />
          <div className="absolute -top-1 -right-1 bg-background p-2 rounded-full border border-border">
            <Search size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-foreground tracking-tighter italic select-none">
            404
          </h1>
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tight italic">
            عذراً، البيتزا مفقودة!
          </h2>
          <p className="text-muted-foreground font-medium text-lg">
            الصفحة التي تبحث عنها غير موجودة، ربما تم أكلها أو نقلها لمكان آخر.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={"/" as any}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <Home size={18} />
            <span>العودة للرئيسية</span>
          </Link>

          <Link
            href={"/shop" as any}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-muted text-foreground border border-border px-8 py-4 rounded-2xl font-black text-sm hover:bg-background transition-all"
          >
            <MoveLeft size={18} className="rtl:rotate-180" />
            <span>تصفح القائمة</span>
          </Link>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5">
        <span className="text-[30vw] font-black pointer-events-none select-none">
          LOST
        </span>
      </div>
    </div>
  );
}
