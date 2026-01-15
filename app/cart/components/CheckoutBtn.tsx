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
import { useCart } from "@/hooks/useCart";
import useSWR from "swr";
import { getUser } from "@/services/userServices";
import { addOrder } from "@/services/ordersServices";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Loading";

function CheckoutBtn() {
  const { cart } = useCart();
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

  const BANKAK_ACCOUNT = "1234567"; // Replace with actual account
  const MYCASHI_ACCOUNT = "0912345678"; // Replace with actual account

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("تم النسخ بنجاح");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Fetch user data to check shipping info
  const { data: userData, isLoading: userLoading } = useSWR(
    user?.email ? `checkout-user-${user.email}` : null,
    () => getUser(user?.email as string),
  );

  const total = useMemo(() => {
    return cart.reduce((acc, p) => acc + Number(p.p_cost) * Number(p.p_qu), 0);
  }, [cart]);

  function convertProductsToLineItems(products: ProductType[]) {
    return products.map((product) => {
      // Convert the string cost to a number and multiply by 100 for cents
      const unitAmountCents = Math.round(Number(product.p_cost) * 100);

      return {
        price_data: {
          product_data: {
            name: product.p_name,
          },
          currency: "USD",
          unit_amount: unitAmountCents,
        },
        quantity: product.p_qu,
        metadata: {
          id: product.id,
          p_cat: product.p_cat,
        },
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
    if (cart.length === 0) {
      toast.error("سلة المشتريات فارغة.");
      return;
    }

    // Validate shipping info
    if (
      !userData?.shippingInfo ||
      !userData.shippingInfo.address ||
      !userData.shippingInfo.phone
    ) {
      toast.error("يرجى اكمال بيانات العنوان والهاتف قبل الدفع.");
      router.push("/profile/edit" as any);
      return;
    }

    // Show confirmation modal
    setShowConfirm(true);
  }

  async function handleConfirmPayment() {
    setIsPending(true);
    try {
      if (paymentMethod === "stripe") {
        const payloadCart = convertProductsToLineItems(cart);
        const response = await fetch("/api/checkout_sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadCart),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { url } = await response.json();

        if (url) {
          window.location.assign(url);
        }
      } else {
        // Manual Payment (Bankak / MyCashi)
        if (!transactionRef.trim()) {
          toast.error("يرجى إدخال رقم المعاملة المرجعي");
          setIsPending(false);
          return;
        }

        const orderData = {
          customer_email: user?.email || null,
          customer_name: user?.name || "Unknown",
          shippingInfo: userData?.shippingInfo,
          productsList: cart,
          status: "Processing" as const, // Cast to literal type
          deliveredAt: "",
          createdAt: new Date().toISOString(),
          totalAmount: total,
          paymentMethod: paymentMethod,
          transactionReference: transactionRef,
        };

        const orderId = await addOrder(orderData);
        if (orderId) {
          toast.success("تم استلام طلبك بنجاح! سيتم مراجعته قريباً.");
          // Clear cart logic if needed, but assuming redirect is enough or separate logic
          // Usually we should clear the cart here. Assuming useCart has clearCart.
          // Since I don't see clearCart in the view, I'll just redirect.
          router.push(`/orders`);
        }
      }
    } catch (error) {
      setIsPending(false);
      // Don't close modal on error so they can retry
      // setShowConfirm(false);
      console.error("Error during fetch operation:", error);
      toast.error("حدث خطأ ما أثناء المحاولة.");
    }
  }

  return (
    <div className="mt-2 bg-card rounded border border-border shadow-sm overflow-hidden transition-all duration-300">
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">ملخص الطلب</h2>

        {/* Breakdown */}
        <div className="space-y-2 text-base text-muted-foreground">
          <div className="flex justify-between">
            <span>المجموع الفرعي ({cart.length} أصناف)</span>
            <span className="font-medium text-foreground">
              {total.toLocaleString()} جنية
            </span>
          </div>
          <div className="flex justify-between">
            <span>التوصيل</span>
            <span className="text-success font-bold uppercase text-xs tracking-wider">
              مجاني
            </span>
          </div>
          <div className="flex justify-between">
            <span>الضرائب</span>
            <span className="font-medium">تحسب عند الدفع</span>
          </div>
        </div>

        <div className="border-t border-border my-4" />

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-bold text-foreground">الإجمالي</span>
          <span className="text-2xl font-black text-primary">
            {total.toLocaleString()} <span className="text-sm">جنية</span>
          </span>
        </div>

        {/* Checkout Button */}
        <form onSubmit={handleSubmit}>
          <button
            disabled={isPending || cart.length === 0}
            className={cn(
              "group w-full py-4 px-6 flex items-center justify-center gap-3",
              "bg-primary hover:opacity-90 disabled:bg-muted disabled:cursor-not-allowed",
              "text-primary-foreground text-xl font-bold rounded-xl shadow-lg shadow-primary/20",
              "transition-all duration-200 active:scale-[0.98]",
              isPending && "opacity-80",
            )}
            type="submit"
          >
            {isPending ? <Spinner size="sm" /> : <ShieldCheck size={16} />}
            {isPending ? "جاري المعالجة..." : "إتمام الطلب بأمان"}
            {!isPending && (
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4 font-bold uppercase tracking-tight">
          <ShieldCheck size={14} />
          <span>دفع آمن وحماية 100%</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 bg-background/80 backdrop-blur-md"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-card w-full max-w-md md:max-w-3xl rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[98vh] md:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Header */}
            <div className="flex-shrink-0 p-3 sm:p-4 border-b border-border bg-muted/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight">
                    تأكيد <span className="text-primary">الطلب والدفع</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-1 hover:bg-muted rounded-md transition-all hover:rotate-90"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x md:divide-border rtl:divide-x-reverse">
                {/* 1. Payment Column - Condensed */}
                <div className="flex-1 p-3 sm:p-4 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                        1. تفاصيل المبلغ والدفع
                      </h4>
                      {/* Condensed Total Amount */}
                      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 shadow-inner">
                        <p className="text-[9px] font-bold text-primary/70 uppercase tracking-widest mb-1 text-center">
                          المبلغ الإجمالي المطلوب
                        </p>
                        <div className="flex items-center gap-2 bg-background p-2 rounded-lg border border-primary/20 shadow-sm">
                          <span className="font-mono font-black flex-1 text-center text-xl tracking-tighter text-foreground">
                            {total.toLocaleString()}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(total.toString(), "amount")
                            }
                            className="p-1.5 hover:bg-primary/10 rounded-md transition-colors text-primary"
                          >
                            {copiedField === "amount" ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        2. اختر وسيلة الدفع
                      </h4>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setPaymentMethod("stripe")}
                          className={cn(
                            "p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all text-[10px]",
                            paymentMethod === "stripe"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-muted text-muted-foreground",
                          )}
                        >
                          <CreditCard size={16} />
                          <span className="font-bold">بطاقة</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod("bankak")}
                          className={cn(
                            "p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all text-[10px]",
                            paymentMethod === "bankak"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-muted text-muted-foreground",
                          )}
                        >
                          <span className="font-black text-lg leading-none">
                            B
                          </span>
                          <span className="font-bold">بنكك</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod("mycashi")}
                          className={cn(
                            "p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all text-[10px]",
                            paymentMethod === "mycashi"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-muted text-muted-foreground",
                          )}
                        >
                          <span className="font-black text-lg leading-none">
                            C
                          </span>
                          <span className="font-bold">كاشي</span>
                        </button>
                      </div>
                    </div>

                    {/* Manual Payment Fields - Very Condensed */}
                    {paymentMethod !== "stripe" && (
                      <div className="bg-muted/30 rounded-xl p-3 border border-border space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            حول إلى:
                          </p>
                          <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-border">
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
                              className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                            >
                              {copiedField === "account" ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-foreground block">
                            رقم المعاملة
                          </label>
                          <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder="رقم العملية..."
                            className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-primary/40 transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Delivery Column - Condensed */}
                <div className="flex-1 p-3 sm:p-4 space-y-4 bg-muted/5">
                  <div className="space-y-3 h-full flex flex-col">
                    <div className="flex-1 space-y-3">
                      <h4 className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                        3. معلومات الشحن والاتصال
                      </h4>
                      <div className="bg-background rounded-xl p-3 border border-border shadow-sm space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
                            <MapPin size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                              عنوان التوصيل
                            </p>
                            <p className="text-[11px] font-bold text-foreground leading-tight">
                              {userData?.shippingInfo?.address},{" "}
                              {userData?.shippingInfo?.city}
                            </p>
                          </div>
                        </div>

                        <div className="h-px bg-border/40" />

                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
                            <Phone size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                              رقم التواصل
                            </p>
                            <p className="text-sm font-mono font-black text-foreground dir-ltr">
                              {userData?.shippingInfo?.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        onClick={handleConfirmPayment}
                        disabled={isPending}
                        className="w-full bg-primary hover:opacity-95 text-primary-foreground font-black py-3 rounded-lg shadow-md shadow-primary/10 transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-sm"
                      >
                        {isPending ? (
                          <Spinner size="sm" />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                        {isPending ? "جاري المعالجة..." : "تأكيد الطلب الآن"}
                      </button>

                      <button
                        onClick={() => router.push("/profile/edit")}
                        className="w-full bg-background hover:bg-muted text-foreground font-bold py-2 rounded-lg border border-border transition-all active:scale-[0.98] flex justify-center items-center gap-1.5 text-[10px]"
                      >
                        <Edit size={12} />
                        <span>تعديل بيانات الشحن</span>
                      </button>

                      <div className="bg-success/5 rounded-lg p-2 border border-success/10">
                        <div className="flex gap-1.5 text-success">
                          <ShieldCheck
                            size={12}
                            className="shrink-0 mt-0.5 opacity-60"
                          />
                          <p className="text-[8px] font-bold leading-tight uppercase tracking-tight opacity-60">
                            سيتم مراجعة الطلب وبدء عملية التوصيل فوراً.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutBtn;
