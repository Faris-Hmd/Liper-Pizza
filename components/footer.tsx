import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Send,
  Pizza,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AppFooter() {
  return (
    <footer className="bg-card text-foreground border-t border-border transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link
              href="/"
              className="group flex items-center gap-3 text-xl font-bold tracking-tighter uppercase"
            >
              <div className="relative w-10 h-10 overflow-hidden rounded-xl border-2 border-border transition-transform group-hover:scale-105">
                <Image
                  src="/brand/logo-p.png"
                  alt="Liper Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight text-foreground">
                  لييبر<span className="text-primary"> بيتزا</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-muted-foreground">
              وجهتك الأولى لألذ بيتزا في المدينة. جودة عالية، مكونات طازجة، وطعم
              لا يقاوم.
            </p>
            <div className="flex space-x-5">
              {[Facebook, Instagram, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground">
              القائمة
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href={"/about" as any}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  عنا
                </Link>
              </li>
              <li>
                <Link
                  href={"/#categories" as any}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  التصنيفات
                </Link>
              </li>
              <li>
                <Link
                  href={"/contact-us" as any}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  اطلب الآن
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground">
              الدعم
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { label: "الشروط والأحكام", href: "terms" },
                { label: "معلومات التوصيل", href: "shipping-info" },
                { label: "اتصل بنا", href: "contact-us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${link.href}` as any}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground">
              ابق على اطلاع
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              احصل على آخر العروض وأخبار البيتزا الجديدة.
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full bg-muted border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-right"
              />
              <button className="absolute right-2 top-1.5 p-1 bg-primary rounded-md hover:opacity-90 transition-colors">
                <Send className="h-4 w-4 text-primary-foreground" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 pb-safe">
          <p className="text-xs text-muted-foreground text-center md:text-right">
            &copy; {new Date().getFullYear()} لييبر بيتزا. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-[10px] text-muted-foreground uppercase font-medium">
            <span>دفع آمن</span>
            <span>ضمان الجودة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
