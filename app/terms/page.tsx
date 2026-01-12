"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Term = {
  title: string;
  content: string;
};

const terms: Term[] = [
  {
    title: "قبول الشروط",
    content:
      "باستخدامك لموقعنا، فإنك تقبل هذه الشروط بالكامل. إذا كنت لا توافق على أي جزء منها، يجب عليك عدم استخدام خدماتنا.",
  },
  {
    title: "استخدام الخدمات",
    content:
      "أنت توافق على استخدام خدماتنا للأغراض المشروعة فقط. لا يجوز لك استخدام موقعنا لرفع أو نشر أو نقل أي محتوى ضار أو غير قانوني أو مسيء.",
  },
  {
    title: "الملكية الفكرية",
    content:
      "جميع المحتويات والرسومات والشعارات والتصاميم الموجودة على هذا الموقع هي ملك للشركة ومحمية بموجب قوانين حقوق النشر.",
  },
  {
    title: "تحديد المسؤولية",
    content:
      "نحن غير مسؤولين عن أي أضرار مباشرة أو غير مباشرة تنشأ عن استخدام موقعنا أو خدماتنا. استخدم خدماتنا على مسؤوليتك الخاصة.",
  },
  {
    title: "الخصوصية",
    content:
      "يتم التعامل مع معلوماتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا. باستخدامك لخدماتنا، فإنك توافق على جمع واستخدام معلوماتك كما هو موضح.",
  },
  {
    title: "تغيير الشروط",
    content:
      "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستكون التغييرات فعالة فور نشرها على موقعنا.",
  },
  {
    title: "القانون الحاكم",
    content:
      "تخضع هذه الشروط للقوانين المحلية. أي نزاعات تنشأ بموجب هذه الشروط سيتم حلها تحت اختصاص المحاكم المختصة.",
  },
];

function TermsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="page-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <h1>
            الشروط <span className="text-primary">والأحكام</span>
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Intro */}
        <div className="text-center space-y-4">
          <p className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg font-medium leading-relaxed m-0">
            باستخدامك لموقعنا، فإنك توافق على الشروط التالية. يرجى مراجعة
            معاييرنا التشغيلية بعناية.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                className="w-full flex justify-between items-center px-6 sm:px-8 py-4 sm:py-6 text-right font-black text-lg hover:bg-muted/50 transition-colors outline-none group"
                onClick={() => toggle(index)}
              >
                <span className="group-hover:text-primary transition-colors text-base sm:text-lg">
                  {term.title}
                </span>
                <div
                  className={`p-2 rounded-xl bg-muted shadow-sm transition-all ${openIndex === index ? "rotate-180 bg-primary text-primary-foreground" : ""}`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                  <p className="p-4 sm:p-6 bg-muted/30 rounded-2xl border border-border m-0">
                    {term.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] m-0">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لييبر بيتزا
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
