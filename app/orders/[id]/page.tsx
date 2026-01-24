"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  MessageSquare,
  ReceiptText,
  Calendar,
  Tag,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderData } from "@/types/orderTypes";
import { getOrderById } from "@/services/ordersServices";
import { getDriver } from "@/services/driversServices";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const orderId = params?.id as string;

  const { data: order, isLoading } = useSWR<OrderData | null>(
    session?.user?.email && orderId ? `order-details-${orderId}` : null,
    () => getOrderById(orderId),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: driver } = useSWR(
    order?.driverId ? `driver-${order.driverId}` : null,
    () => getDriver(order!.driverId!),
    { revalidateOnFocus: false },
  );

  if (isLoading) return <Loading size="lg" text="جاري تحميل تفاصيل الطلب..." />;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">الطلب غير موجود</h2>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ArrowRight size={16} />
          العودة للقائمة
        </button>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Delivered":
        return {
          color: "text-success",
          bg: "bg-success/10",
          Icon: CheckCircle2,
          label: "تم التوصيل",
        };
      case "Shipped":
        return {
          color: "text-info",
          bg: "bg-info/10",
          Icon: Truck,
          label: "في الطريق",
        };
      case "Processing":
        return {
          color: "text-warning",
          bg: "bg-warning/10",
          Icon: Package,
          label: "قيد التحضير",
        };
      case "Cancelled":
        return {
          color: "text-error",
          bg: "bg-error/10",
          Icon: XCircle,
          label: "ملغي",
        };
      default:
        return {
          color: "text-muted-foreground",
          bg: "bg-muted",
          Icon: Clock,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="page-header sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-radius-md transition-colors"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-foreground uppercase tracking-tighter flex items-center gap-2">
                تفاصيل الطلب
                <span className="text-primary">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
              </h1>
              {order.isOffer && (
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 flex items-center gap-1">
                  <Tag size={10} strokeWidth={3} />
                  عرض خاص
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-bold">
              {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Status Card */}
        <div className="bg-card border border-border rounded-radius-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-radius-lg flex items-center justify-center",
                statusConfig.bg,
                statusConfig.color,
              )}
            >
              <statusConfig.Icon size={28} />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground mb-1">
                حالة الطلب
              </h2>
              <span
                className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full",
                  statusConfig.bg,
                  statusConfig.color,
                )}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        {driver && (
          <div className="bg-card border border-border rounded-radius-lg p-6 shadow-sm">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
              بيانات المندوب
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-radius-md flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground">
                    {driver.name}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {driver.vehicle}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${driver.phone}`}
                  className="w-10 h-10 flex items-center justify-center rounded-radius-md bg-muted text-foreground/70 hover:bg-muted/80 transition-colors"
                >
                  <Phone size={18} />
                </a>
                <a
                  href={`https://wa.me/${driver.phone.replace(/\+/g, "")}`}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-radius-md bg-[#25D366] text-white shadow-lg hover:opacity-90 transition-opacity"
                >
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-card border border-border rounded-radius-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ReceiptText size={14} />
              محتويات الطلب
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {order.isOffer &&
            (!order.productsList || order.productsList.length === 0) ? (
              <div className="p-6 flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-radius-md overflow-hidden shadow-md border border-border">
                  <img
                    src={order.offerImage || "/placeholder.png"}
                    alt={order.offerTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                      باقة توفير
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-foreground italic">
                    {order.offerTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    تم طلب هذا العرض كحزمة متكاملة وبسعر خاص.
                  </p>
                </div>
              </div>
            ) : (
              order.productsList.map((product, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-radius-sm  object-cover overflow-hidden">
                      {product.p_imgs?.[0]?.url ? (
                        <img
                          src={product.p_imgs[0].url}
                          alt={product.p_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">
                        {product.p_name}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground">
                        {product.p_qu} ×{" "}
                        {Number(product.p_cost).toLocaleString()} جنية
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-foreground">
                    {(
                      Number(product.p_cost) * (product.p_qu || 1)
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="bg-muted/30 p-6 space-y-3">
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>المجموع الفرعي</span>
              <span>{order.totalAmount.toLocaleString()} جنية</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>التوصيل</span>
              <span className="text-success font-bold">مجاني</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-sm font-black text-foreground">
                الإجمالي
              </span>
              <span className="text-xl font-black text-primary">
                {order.totalAmount.toLocaleString()}{" "}
                <span className="text-xs text-muted-foreground">جنية</span>
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-radius-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-radius-md text-primary mt-1">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">
                  عنوان التوصيل
                </h4>
                <p className="text-sm font-bold text-foreground leading-relaxed mb-2">
                  {order.shippingInfo?.address}
                </p>
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  {order.shippingInfo?.city}, {order.shippingInfo?.zip}
                </p>
                {order.shippingInfo?.googleMapsLink && (
                  <a
                    href={order.shippingInfo.googleMapsLink}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-radius-sm"
                  >
                    <span>فتح في الخرائط</span>
                    <ArrowRight size={12} className="-rotate-45" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-radius-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-green-500/10 p-3 rounded-radius-md text-green-600 mt-1">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">
                  معلومات الاتصال
                </h4>
                <p className="text-sm font-black text-foreground dir-ltr text-right">
                  {order.shippingInfo?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {(order.paymentMethod || order.transactionReference) && (
          <div className="bg-card border border-border rounded-radius-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500/10 p-3 rounded-radius-md text-purple-600 mt-1">
                {/* Import CreditCard if not already imported or use another icon */}
                <ReceiptText size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">
                  معلومات الدفع
                </h4>
                {order.paymentMethod && (
                  <div className="mb-2">
                    <p className="text-[10px] text-muted-foreground font-bold">
                      طريقة الدفع
                    </p>
                    <p className="text-sm font-black text-foreground capitalize">
                      {order.paymentMethod === "stripe"
                        ? "بطاقة بنكية"
                        : order.paymentMethod === "bankak"
                          ? "بنكك"
                          : order.paymentMethod === "mycashi"
                            ? "ماي كاشي"
                            : order.paymentMethod}
                    </p>
                  </div>
                )}
                {order.transactionReference && (
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold">
                      رقم المعاملة
                    </p>
                    <p className="text-sm font-mono font-bold text-foreground bg-muted/50 px-2 py-1 rounded-radius-sm select-all w-fit">
                      {order.transactionReference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
