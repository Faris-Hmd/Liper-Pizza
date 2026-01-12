import React from "react";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <header className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1>
            معلومات <span className="text-primary">التوصيل</span>
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">توصيل سريع وموثوق</h2>
            <p className="max-w-2xl mx-auto">
              نتفهم أن جوعك لا يمكنه الانتظار. لهذا قمنا بتحسين عمليات التوصيل
              لدينا لنصل إليك في أسرع وقت ممكن في جميع أنحاء الخرطوم.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ShippingCard
              icon={<Clock className="text-primary" />}
              title="توصيل الخرطوم"
              description="يتم توصيل الطلبات داخل الخرطوم وأم درمان وبحري في غضون 30 إلى 60 دقيقة."
            />
            <ShippingCard
              icon={<MapPin className="text-primary" />}
              title="توصيل الولايات"
              description="خدمة التوصيل للولايات الأخرى متاحة لبعض المنتجات المغلفة وتستغرق من 2-4 أيام."
            />
            <ShippingCard
              icon={<ShieldCheck className="text-primary" />}
              title="تغليف حراري"
              description="يتم تغليف جميع الوجبات بعناية فائقة في صناديق حرارية للحفاظ على سخونتها وجودتها."
            />
            <ShippingCard
              icon={<Truck className="text-primary" />}
              title="تتبع الطلب"
              description="احصل على تحديثات فورية لحالة طلبك عبر الموقع أو الرسائل النصية."
            />
          </div>

          <div className="bg-muted p-8 rounded-3xl border border-border">
            <h3 className="font-bold text-xl mb-4">الاستبدال والإرجاع</h3>
            <p className="text-sm leading-relaxed mb-6">
              نسعى لتقديم الأفضل دائماً، إذا واجهت أي مشكلة في جودة الوجبة أو
              خطأ في الطلب، يرجى التواصل معنا فوراً وسنقوم بمعالجة الأمر في أسرع
              وقت.
            </p>
            <div className="flex flex-wrap gap-4 font-bold text-xs uppercase tracking-widest opacity-60">
              <span className="flex items-center gap-2 italic">
                ● فحص الجودة
              </span>
              <span className="flex items-center gap-2 italic">
                ● توصيل آمن
              </span>
              <span className="flex items-center gap-2 italic">● دعم محلي</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ShippingCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border p-6 rounded-3xl hover:shadow-xl hover:shadow-primary/5 transition-all">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-extrabold text-lg mb-2">{title}</h4>
      <p className="m-0 text-sm opacity-70 leading-relaxed">{description}</p>
    </div>
  );
}
