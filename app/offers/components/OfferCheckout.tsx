"use client";

import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  Phone,
  Edit,
  X,
  Copy,
  Check,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ProductType } from "@/types/productsTypes";
import { Offer } from "@/types/offerTypes";
import useSWR from "swr";
import { getUser } from "@/services/userServices";
import { addOrder } from "@/services/ordersServices";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Loading";

export default function OfferCheckout({ offer }: { offer: Offer }) {
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "bankak" | "mycashi"
  >("bankak");
  const [transactionRef, setTransactionRef] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const BANKAK_ACCOUNT = "3052845";
  const MYCASHI_ACCOUNT = "0960504030";

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("تم النسخ بنجاح");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const { data: userData } = useSWR(
    user?.email ? `checkout-user-${user.email}` : null,
    () => getUser(user?.email as string),
  );

  const total = offer.price || 0;

  function convertProductsToLineItems(products: ProductType[]) {
    return products.map((product) => {
      const unitAmountCents = Math.round(Number(product.p_cost) * 100);
      return {
        price_data: {
          product_data: { name: product.p_name },
          currency: "USD",
          unit_amount: unitAmountCents,
        },
        quantity: 1,
        metadata: { id: product.id, p_cat: product.p_cat },
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("يرجى تسجيل الدخول للمتابعة.");
      return;
    }
    if (isPending) return;

    if (!userData?.shippingInfo?.address || !userData?.shippingInfo?.phone) {
      toast.error("يرجى اكمال بيانات العنوان والهاتف قبل الدفع.");
      router.push("/profile/edit" as any);
      return;
    }

    setShowConfirm(true);
  }

  async function handleConfirmPayment() {
    setIsPending(true);
    try {
      if (paymentMethod === "stripe") {
        const payload = convertProductsToLineItems(offer.products);
        const response = await fetch("/api/checkout_sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Stripe checkout failed");
        const { url } = await response.json();
        if (url) window.location.assign(url);
      } else {
        if (!transactionRef.trim()) {
          toast.error("يرجى إدخال رقم المعاملة المرجعي");
          setIsPending(false);
          return;
        }

        const orderData = {
          customer_email: user?.email || null,
          customer_name: user?.name || "Unknown",
          shippingInfo: userData?.shippingInfo,
          productsList: [], // Optimized: no need to send details for offers
          status: "Processing" as const,
          createdAt: Date.now(), // ✅ CHANGED: Using milliseconds
          totalAmount: total,
          paymentMethod: paymentMethod,
          transactionReference: transactionRef,
          isOffer: true,
          offerId: offer.id,
          offerTitle: offer.title,
          offerImage: offer.image,
        };

        const orderId = await addOrder(orderData);
        if (orderId) {
          toast.success("تم استلام طلب العرض بنجاح!");
          router.push(`/orders`);
        }
      }
    } catch (error) {
      setIsPending(false);
      console.error("Payment Error:", error);
      toast.error("حدث خطأ ما أثناء المحاولة.");
    }
  }

  return (
    <div className="bg-card rounded-radius-lg border border-border shadow overflow-hidden transition-all duration-500">
      {!showConfirm ? (
        <div className="p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-radius-md bg-primary/10 flex items-center justify-center">
              <CreditCard size={24} className="text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">
              ملخص <span className="text-primary">العرض</span>
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-base text-muted-foreground">
              <span>قيمة العرض</span>
              <span className="font-bold text-foreground">
                {total.toLocaleString()} جنية
              </span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="text-muted-foreground">خدمة التوصيل</span>
              <span className="text-success font-black text-xs uppercase tracking-[0.2em] bg-success/10 px-3 py-1 rounded-full border border-success/20">
                مجاني
              </span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-4" />

          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                المبلغ الإجمالي كلياً
              </p>
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tighter">
                {total.toLocaleString()}{" "}
                <span className="text-xs font-bold text-muted-foreground/50">
                  جنية
                </span>
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <button
              disabled={isPending}
              className={cn(
                "group w-full py-3 px-6 flex items-center justify-center gap-4",
                "bg-primary hover:opacity-95 disabled:bg-muted disabled:cursor-not-allowed",
                "text-primary-foreground text-lg font-black rounded-radius-md shadow-xl shadow-primary/20",
                "transition-all duration-300 active:scale-[0.98]",
              )}
              type="submit"
            >
              <span>طلب العرض الآن</span>
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.2em] pt-2">
            <ShieldCheck size={14} />
            <span>نظام دفع آمن ومشفر بنسبة 100%</span>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="p-4 border-b border-border bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-radius-md bg-primary/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                تأكيد <span className="text-primary">البيانات والدفع</span>
              </h3>
            </div>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors bg-muted/50 rounded-radius-sm border border-border/50"
            >
              <span>رجوع</span>
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-border rtl:divide-x-reverse">
            <div className="flex-1 p-4 sm:p-5 space-y-5">
              <div className="space-y-5">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
                    1. المبلغ ووسيلة الدفع
                  </h4>
                  <div className="bg-primary/5 rounded-radius-md p-4 border border-primary/10 shadow-inner">
                    <div className="flex items-center gap-3 bg-background p-3 rounded-radius-sm border border-primary/20 shadow-sm">
                      <span className="font-mono font-black flex-1 text-center text-2xl tracking-tighter text-foreground">
                        {total.toLocaleString()}{" "}
                        <span className="text-xs">جنية</span>
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(total.toString(), "amount")
                        }
                        className="p-2.5 hover:bg-primary/10 rounded-radius-sm transition-colors text-primary"
                      >
                        {copiedField === "amount" ? (
                          <Check size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={cn(
                      "p-3 rounded-radius-md border-2 flex flex-col items-center justify-center gap-2 transition-all",
                      paymentMethod === "stripe"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    <CreditCard size={20} />
                    <span className="text-[10px] font-bold">بطاقة</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bankak")}
                    className={cn(
                      "p-3 rounded-radius-md border-2 flex flex-col items-center justify-center gap-2 transition-all",
                      paymentMethod === "bankak"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    <span className="font-black text-xl leading-none">B</span>
                    <span className="text-[10px] font-bold">بنكك</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mycashi")}
                    className={cn(
                      "p-3 rounded-radius-md border-2 flex flex-col items-center justify-center gap-2 transition-all",
                      paymentMethod === "mycashi"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    <span className="font-black text-xl leading-none">C</span>
                    <span className="text-[10px] font-bold">كاشي</span>
                  </button>
                </div>

                {paymentMethod !== "stripe" && (
                  <div className="bg-muted/30 rounded-radius-md p-4 border border-border space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground">
                        حول المبلغ إلى:
                      </p>
                      <div className="flex items-center gap-2 bg-background p-3 rounded-radius-sm border border-border">
                        <span className="font-mono font-bold flex-1 text-center text-sm tracking-wider">
                          {paymentMethod === "bankak"
                            ? BANKAK_ACCOUNT
                            : MYCASHI_ACCOUNT}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              paymentMethod === "bankak"
                                ? BANKAK_ACCOUNT
                                : MYCASHI_ACCOUNT,
                              "account",
                            )
                          }
                          className="p-1.5 hover:bg-muted rounded-radius-sm transition-colors text-muted-foreground"
                        >
                          {copiedField === "account" ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold">
                        رقم المعاملة
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="رقم العملية هنا..."
                        className="w-full bg-background border border-border rounded-radius-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-5 space-y-5 bg-muted/5 flex flex-col">
              <div className="flex-1 space-y-5">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  2. معلومات التوصيل
                </h4>
                <div className="bg-background rounded-radius-md p-4 border border-border shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/10 rounded-radius-md text-secondary">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-muted-foreground">
                        العنوان
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {userData?.shippingInfo?.address},{" "}
                        {userData?.shippingInfo?.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/10 rounded-radius-md text-secondary">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-muted-foreground">
                        رقم الهاتف
                      </p>
                      <p className="text-lg font-mono font-black text-foreground dir-ltr">
                        {userData?.shippingInfo?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isPending}
                  className="w-full bg-primary hover:opacity-95 text-primary-foreground font-black py-3 rounded-radius-md shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-3 text-lg"
                >
                  {isPending ? (
                    <Spinner size="sm" />
                  ) : (
                    <ShieldCheck size={24} />
                  )}
                  {isPending ? "جاري المعالجة..." : "تأكيد الطلب الآن"}
                </button>

                <button
                  onClick={() => router.push("/profile/edit")}
                  className="w-full bg-background hover:bg-muted text-foreground font-bold py-3 rounded-radius-md border border-border transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-xs"
                >
                  <Edit size={16} />
                  <span>تعديل بيانات الشحن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
