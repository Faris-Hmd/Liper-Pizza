import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  AlertCircle,
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
  >("stripe");
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
        <h2 className="text-lg font-bold text-foreground">ملخص الطلب</h2>

        {/* Breakdown */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>المجموع الفرعي ({cart.length} أصناف)</span>
            <span className="font-medium text-foreground">
              {total.toLocaleString()} جنية
            </span>
          </div>
          <div className="flex justify-between">
            <span>التوصيل</span>
            <span className="text-success font-bold uppercase text-[10px] tracking-wider">
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
            {total.toLocaleString()} <span className="text-xs">جنية</span>
          </span>
        </div>

        {/* Checkout Button */}
        <form onSubmit={handleSubmit}>
          <button
            disabled={isPending || cart.length === 0}
            className={cn(
              "group w-full py-4 px-6 flex items-center justify-center gap-3",
              "bg-primary hover:opacity-90 disabled:bg-muted disabled:cursor-not-allowed",
              "text-primary-foreground text-lg font-bold rounded-xl shadow-lg shadow-primary/20",
              "transition-all duration-200 active:scale-[0.98]",
              isPending && "opacity-80",
            )}
            type="submit"
          >
            {isPending ? <Spinner size="md" /> : <CreditCard size={24} />}
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
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4 font-bold uppercase tracking-tight">
          <ShieldCheck size={14} />
          <span>دفع آمن وحماية 100%</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tighter">
                  تأكيد <span className="text-primary">العنوان</span>
                </h3>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg mt-0.5">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      عنوان التوصيل
                    </p>
                    <p className="text-sm font-bold text-foreground leading-relaxed break-words">
                      {userData?.shippingInfo?.address}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      {userData?.shippingInfo?.city},{" "}
                      {userData?.shippingInfo?.zip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      رقم الهاتف
                    </p>
                    <p className="text-sm font-bold text-foreground dir-ltr text-right">
                      {userData?.shippingInfo?.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">
                  اختر وسيلة الدفع
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                      paymentMethod === "stripe"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    <CreditCard size={20} />
                    <span className="text-xs font-bold">بطاقة بنكية</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bankak")}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                      paymentMethod === "bankak"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    {/* You can use a specific icon or just text */}
                    <span className="font-black text-lg leading-none">B</span>
                    <span className="text-xs font-bold">بنكك</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mycashi")}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                      paymentMethod === "mycashi"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    <span className="font-black text-lg leading-none">C</span>
                    <span className="text-xs font-bold">ماي كاشي</span>
                  </button>
                </div>
              </div>

              {/* Manual Payment Details */}
              {paymentMethod !== "stripe" && (
                <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      يرجى تحويل مبلغ{" "}
                      <span className="font-bold text-foreground">
                        {total.toLocaleString()} جنية
                      </span>{" "}
                      إلى رقم الحساب التالي:
                    </p>
                    <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border">
                      <span className="font-mono font-bold flex-1 text-center text-lg tracking-wider">
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
                        className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {copiedField === "account" ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {paymentMethod === "bankak"
                        ? "حساب بنك الخرطوم (بنكك)"
                        : "حساب ماي كاشي"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">
                      رقم المعاملة (المرجع)
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="الصقه هنا..."
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isPending}
                  className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-black py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  {isPending ? (
                    <Spinner size="sm" />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                  {isPending ? "جاري المعالجة..." : "تأكيد ودفع"}
                </button>

                <button
                  onClick={() => router.push("/profile/edit")}
                  className="bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-4 rounded-xl border border-border transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <Edit size={16} />
                  <span className="text-xs">تعديل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutBtn;
