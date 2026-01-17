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
} from "lucide-react";
import { OrderData } from "@/types/orderTypes";
import { cn } from "@/lib/utils";
import { getOrdersWh, getUserOrdersStats } from "@/services/ordersServices";
import { getDriver } from "@/services/driversServices";
import Link from "next/link";
import Loading from "@/components/Loading";
import { Truck } from "lucide-react";

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
              <SimpleOrderCard key={order.id} order={order} />
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

function SimpleOrderCard({ order }: { order: OrderData }) {
  const { data: driver } = useSWR(
    order.driverId ? `driver-${order.driverId}` : null,
    () => getDriver(order.driverId!),
    { revalidateOnFocus: false },
  );

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Processing":
        return "قيد التحضير";
      case "Shipped":
        return "في الطريق";
      case "Delivered":
        return "تم التوصيل";
      case "Cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  return (
    <Link
      href={`/orders/${order.id}` as any}
      className="group block border border-border hover:border-primary/30 transition-all duration-300 rounded-[2rem] bg-card hover:shadow-lg overflow-hidden"
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center text-muted-foreground">
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
                {getStatusLabel(order.status)}
              </span>
              {order.isOffer && (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Tag size={10} strokeWidth={3} />
                  عرض
                </span>
              )}
              <h4 className="text-[14px] font-black tracking-tighter">
                #{order.id.slice(-6)}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold">
              <span>{order.totalAmount.toLocaleString()} جنية</span>
              <span>•</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("ar-EG")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all -rotate-45 group-hover:rotate-0">
            <ArrowRight size={14} />
          </div>
          {driver && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
              <Truck size={12} className="text-primary" />
              <span className="max-w-[80px] truncate">{driver.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
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
