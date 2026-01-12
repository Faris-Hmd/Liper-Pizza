import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <header className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1>
            اتصل <span className="text-primary">بنا</span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-black">تواصل معنا</h2>
              <p>
                هل لديك استفسار عن وجباتنا؟ هل تحتاج لمساعدة في طلبك؟ نحن هنا
                لخدمة زبائننا في كل وقت.
              </p>
            </div>

            <div className="space-y-6">
              <ContactMethod
                icon={<Mail className="text-primary" />}
                title="البريد الإلكتروني"
                value="hello@liperpizza.com"
              />
              <ContactMethod
                icon={<Phone className="text-primary" />}
                title="الهاتف"
                value="+249 912 345 678"
              />
              <ContactMethod
                icon={<MapPin className="text-primary" />}
                title="موقع المطعم"
                value="الخرطوم، السودان - شارع العمارات"
              />
            </div>
          </section>

          <section className="bg-card border border-border p-6 sm:p-10 rounded-3xl shadow-xl shadow-primary/5">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                    الاسم
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted border border-border p-3 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="اسمك الكريم"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="w-full bg-muted border border-border p-3 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="عنوان البريد الإلكتروني"
                  />
                </div>
              </div>
              <div className="space-y-2 border-radius-small">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  الرسالة
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-muted border border-border p-3 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="كيف يمكننا مساعدتك؟"
                ></textarea>
              </div>
              <button className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                <Send size={18} className="rotate-180" />
                إرسال الرسالة
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function ContactMethod({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm tracking-tight">{title}</h4>
        <p className="m-0 text-base">{value}</p>
      </div>
    </div>
  );
}
