"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import {
  Clock,
  CheckCircle2,
  Wallet,
  HistoryIcon,
  PackageOpen,
  ReceiptText,
  ArrowRight,
  Tag,
  XCircle,
  Package,
  Phone,
  MessageSquare,
  Truck,
} from "lucide-react";
import { OrderData } from "@/types/orderTypes";
import { cn } from "@/lib/utils";
import { getOrdersWh, getUserOrdersStats } from "@/services/ordersServices";
import { getDriver } from "@/services/driversServices";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();

  const { data: statsData } = useSWR<{ count: number; totalSpend: number }>(
    session?.user?.email ? `customer-orders-stats/${session.user.email}` : null,
    () => getUserOrdersStats(session?.user?.email as string),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    },
  );

  const { data: ordersData, isLoading } = useSWR<OrderData[]>(
    session?.user?.email ? `customer-all-orders/${session.user.email}` : null,
    () =>
      getOrdersWh([
        { field: "customer_email", op: "==", val: session?.user?.email },
        { field: "status", op: "!=", val: "Delivered" },
      ]),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      revalidateIfStale: true,
    },
  );

  const { stats } = useMemo(() => {
    if (!statsData)
      return { stats: { active: 0, completed: 0, totalSpend: 0 } };
    const activeOrders = ordersData?.length || 0;
    const completedOrders = statsData.count - activeOrders;
    return {
      stats: {
        active: activeOrders,
        completed: completedOrders,
        totalSpend: statsData.totalSpend,
      },
    };
  }, [statsData, ordersData]);

  if (status === "loading" || isLoading)
    return <Loading size="lg" text="جاري مزامنة الطلبات..." />;

  return (
    <div className="min-h-screen bg-background pb-32 animate-in fade-in duration-700">
      <header className="page-header border-b border-border bg-card sticky top-0 z-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-foreground uppercase tracking-tighter">
              طلباتي <span className="text-primary">الحالية</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
              تتبع مسار وجباتك
            </p>
          </div>
          <Link
            href="/orders/history"
            className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-radius-md hover:bg-primary/20 transition-all group"
          >
            <HistoryIcon
              size={16}
              className="text-primary group-hover:rotate-[-15deg] transition-transform"
            />
            <span className="text-xs font-black uppercase text-primary">
              السجل الكامل
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 p-2 bg-card border border-border rounded-radius-lg shadow-sm">
          <StatBox
            icon={<Clock className="text-warning" size={14} />}
            label="قيد التنفيذ"
            value={stats.active}
            color="warning"
          />
          <StatBox
            icon={<CheckCircle2 className="text-success" size={14} />}
            label="المستلمة"
            value={stats.completed}
            color="success"
          />
          <StatBox
            icon={<Wallet className="text-primary" size={14} />}
            label="الإجمالي"
            value={stats.totalSpend}
            suffix="جنية"
            color="primary"
          />
        </div>

        {/* LIST */}
        <div className="space-y-6">
          <div className="grid gap-4">
            {ordersData && ordersData.length > 0 ? (
              ordersData.map((order, idx) => (
                <div
                  key={order.id}
                  className="animate-in slide-in-from-bottom-4 fill-mode-both"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <SimpleOrderCard order={order} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-card/30 rounded-radius-lg border border-dashed border-border text-center animate-in zoom-in duration-500">
                <div className="p-6 bg-muted/50 rounded-full mb-6">
                  <PackageOpen size={48} className="text-primary/20" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                  سجلك نظيف حالياً
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs font-medium">
                  لا توجد طلبات نشطة في الوقت الحالي. ابدأ بطلب وجبتك المفضلة
                  الآن!
                </p>
                <Link
                  href="/products"
                  className="mt-8 px-8 py-3 bg-primary text-primary-foreground font-black text-sm rounded-radius-md shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                >
                  عرض القائمة
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleOrderCard({ order }: { order: OrderData }) {
  const router = useRouter();
  const { data: driver } = useSWR(
    order.driverId ? `driver-${order.driverId}` : null,
    () => getDriver(order.driverId!),
    { revalidateOnFocus: false },
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Processing":
        return {
          styles: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          icon: <Clock size={10} />,
          label: "قيد التحضير",
        };
      case "Shipped":
        return {
          styles: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: <Truck size={10} />,
          label: "في الطريق",
        };
      case "Delivered":
        return {
          styles: "bg-green-500/10 text-green-600 border-green-500/20",
          icon: <CheckCircle2 size={10} />,
          label: "تم التوصيل",
        };
      case "Cancelled":
        return {
          styles: "bg-red-500/10 text-red-600 border-red-500/20",
          icon: <XCircle size={10} />,
          label: "ملغي",
        };
      default:
        return {
          styles: "bg-primary/10 text-primary border-primary/20",
          icon: <Package size={10} />,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="group block border border-border hover:border-primary/40 transition-all duration-500 rounded-radius-lg bg-card hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-radius-md bg-muted group-hover:bg-primary/5 group-hover:text-primary transition-all flex items-center justify-center text-muted-foreground border border-border group-hover:border-primary/20">
              <ReceiptText size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-lg font-black tracking-tighter">
                  #{order.id.slice(-6).toUpperCase()}
                </h4>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                    statusConfig.styles,
                  )}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold">
                <span className="text-foreground">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="opacity-30">•</span>
                <span>
                  {new Date(order.createdAt).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 text-right">
            <div className="text-xl font-black text-primary tracking-tighter leading-none">
              {order.totalAmount.toLocaleString()}
              <span className="text-[10px] mr-1 opacity-60">جنية</span>
            </div>
            {order.isOffer && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-radius-sm bg-primary text-primary-foreground flex items-center gap-1 uppercase tracking-widest">
                <Tag size={10} strokeWidth={3} />
                باقة توفير
              </span>
            )}
          </div>
        </div>

        {/* Items Preview */}
        {!order.isOffer &&
          order.productsList &&
          order.productsList.length > 0 && (
            <div className="bg-muted/30 rounded-radius-md p-3 mb-6 flex flex-wrap gap-2 border border-border/50">
              {order.productsList.slice(0, 3).map((p, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold bg-background px-2 py-1 rounded-radius-sm border border-border shadow-sm"
                >
                  {p.p_name}
                </span>
              ))}
              {order.productsList.length > 3 && (
                <span className="text-[10px] font-bold text-muted-foreground flex items-center px-1">
                  +{order.productsList.length - 3} أخرى
                </span>
              )}
            </div>
          )}

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            {driver ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-radius-md border border-border">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Truck size={12} className="text-primary" />
                  </div>
                  <span className="max-w-[120px] truncate">{driver.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${driver.phone}`}
                    className="w-8 h-8 flex items-center justify-center rounded-radius-sm bg-primary/10 text-primary hover:bg-primary transition-all hover:text-white border border-primary/20"
                    title="اتصال"
                  >
                    <Phone size={14} />
                  </a>
                  <a
                    href={`https://wa.me/${driver.phone.replace(/\+/g, "")}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center rounded-radius-sm bg-green-500/10 text-green-600 hover:bg-green-500 transition-colors hover:text-white border border-green-500/20"
                    title="واتساب"
                  >
                    <MessageSquare size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse" />
                جاري تخصيص مندوب...
              </div>
            )}
          </div>

          <Link
            href={`/orders/${order.id}` as any}
            className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn hover:underline decoration-2 underline-offset-4"
          >
            التفاصيل
            <ArrowRight
              size={16}
              className="group-hover/btn:translate-x-1.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  color: "primary" | "warning" | "success";
}) {
  const colorMap = {
    primary: "bg-primary/5 border-primary/10",
    warning: "bg-warning/5 border-warning/10",
    success: "bg-success/5 border-success/10",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-4 rounded-radius-md border transition-colors",
        colorMap[color],
      )}
    >
      <div className="flex items-center gap-2 mb-2 opacity-80">
        {icon}
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-lg font-black tracking-tighter">
        {value}{" "}
        {suffix && (
          <span className="text-[10px] opacity-40 mr-0.5">{suffix}</span>
        )}
      </p>
    </div>
  );
}
