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
  MapPin,
  Phone,
  ExternalLink,
  ChevronDown,
  ReceiptText,
} from "lucide-react";
import OrderList from "./components/orderList";
import { OrderData } from "@/types/productsTypes";
import { cn } from "@/lib/utils";
import { getOrdersWh, getUserOrdersStats } from "@/services/ordersServices";
import Link from "next/link";
import Loading from "@/components/Loading";

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
    <div className="min-h-screen bg-background pb-32">
      <header className="page-header">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-foreground uppercase tracking-tighter">
            طلباتي <span className="text-primary">الحالية</span>
          </h1>
          <Link
            href="/orders/history"
            className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg hover:bg-primary/20 transition-all"
          >
            <HistoryIcon size={16} className="text-primary" />
            <span className="text-[11px] font-black uppercase text-primary hidden md:block">
              السجل
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-2 bg-card border py-3 rounded-2xl shadow-sm">
          <StatBox
            icon={<Clock className="text-warning" size={10} />}
            label="قيد التنفيذ"
            value={stats.active}
          />
          <StatBox
            icon={<CheckCircle2 className="text-success" size={10} />}
            label="المستلمة"
            value={stats.completed}
          />
          <StatBox
            icon={<Wallet className="text-primary" size={10} />}
            label="الإجمالي"
            value={stats.totalSpend}
            suffix="جنية"
          />
        </div>

        {/* LIST */}
        <div className="space-y-4 pt-2">
          {ordersData && ordersData.length > 0 ? (
            ordersData.map((order) => (
              <SingleCollapsibleOrder key={order.id} order={order} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-[2.5rem] border border-dashed text-center">
              <PackageOpen size={32} className="text-primary/40 mb-4" />
              <h3 className="text-lg font-black text-foreground uppercase">
                لا توجد طلبات
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SingleCollapsibleOrder({ order }: { order: OrderData }) {
  const [isOpen, setIsOpen] = useState(false);

  // Status Color Logic
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "group cursor-pointer overflow-hidden border transition-all duration-300 rounded-[2.5rem] bg-card",
        isOpen
          ? "shadow-xl border-primary/40 ring-8 ring-primary/5"
          : "shadow-sm border-border hover:border-primary/30",
      )}
    >
      {/* HEADER SECTION */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              isOpen
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            <ReceiptText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                  getStatusStyles(order.status),
                )}
              >
                {order.status}
              </span>
              <h4 className="text-[14px] font-black tracking-tighter">
                #{order.id.slice(-6)}
              </h4>
            </div>
            <p className="text-[11px] text-muted-foreground font-bold">
              {order.totalAmount} جنية •{" "}
              {new Date(order.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={cn(
            "text-muted-foreground transition-transform duration-500",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </div>

      {/* COLLAPSIBLE BODY */}
      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-8 space-y-6 border-t border-dashed border-border mt-2 pt-6">
            {/* 1. Item List */}
            <OrderList order={order} />

            {/* 2. Status Bill / Pricing Summary */}
            <div className="bg-muted/30 rounded-3xl p-5 border border-border/50">
              <h5 className="text-[10px] font-black text-muted-foreground uppercase mb-3 tracking-widest text-right">
                تفاصيل الفاتورة
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-foreground">
                    {order.totalAmount} جنية
                  </span>
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-success">مجاني</span>
                  <span className="text-muted-foreground">التوصيل</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center text-[13px] font-black">
                  <span className="text-primary">{order.totalAmount} جنية</span>
                  <span className="text-foreground">الإجمالي النهائي</span>
                </div>
              </div>
            </div>

            {/* 3. Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 bg-muted/20 p-4 rounded-2xl">
                <MapPin size={18} className="text-primary shrink-0" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    موقع التسليم
                  </p>
                  <p className="text-[11px] font-bold leading-relaxed">
                    {order.shippingInfo?.address}
                  </p>
                  {order.shippingInfo?.googleMapsLink && (
                    <a
                      href={order.shippingInfo.googleMapsLink}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-blue-500 font-bold mt-1 block hover:underline"
                    >
                      الخرائط ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl">
                <Phone size={18} className="text-primary shrink-0" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    رقم الهاتف
                  </p>
                  <p className="text-[12px] font-black">
                    {order.shippingInfo?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-1.5 mb-1 opacity-60">
        {icon}
        <span className="text-[11px] font-black text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      <p className="text-[13px] font-black">
        {value}{" "}
        {suffix && <span className="text-[10px] opacity-40">{suffix}</span>}
      </p>
    </div>
  );
}
