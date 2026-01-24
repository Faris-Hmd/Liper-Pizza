"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import OrderList from "../components/orderList";
import { useSession } from "next-auth/react";
import { ArrowLeft, Ban, PackageX } from "lucide-react";
import Link from "next/link";
import { OrderData } from "@/types/orderTypes";
import { getOrdersWh } from "@/services/ordersServices";
import Loading from "@/components/Loading";

export default function CancelledOrdersPage() {
  const { data: session, status } = useSession();

  const { data: orders, isLoading } = useSWR<OrderData[]>(
    session?.user?.email ? `cancelled-orders/${session.user.email}` : null,
    () =>
      getOrdersWh([
        { field: "customer_email", op: "==", val: session?.user?.email },
        { field: "status", op: "==", val: "Cancelled" },
      ]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 30000,
    },
  );

  // --- CALCULATE STATISTICS ---
  const stats = useMemo(() => {
    if (!orders) return { totalVal: 0, count: 0 };
    return orders.reduce(
      (acc, order) => {
        return {
          totalVal: acc.totalVal + (order.totalAmount || 0),
          count: acc.count + 1,
        };
      },
      { totalVal: 0, count: 0 },
    );
  }, [orders]);

  if (status === "loading" || isLoading) {
    return <Loading size="lg" text="جاري تحميل الطلبات الملغاة..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="page-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={"/orders" as any}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-black text-foreground uppercase tracking-tighter m-0 flex items-center gap-2">
              الطلبات <span className="text-error">الملغاة</span>
              <Ban size={20} className="text-error mb-0.5" />
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {/* List Header */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                سجل الإلغاء
              </h2>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {stats.count} إجمالي
              </span>
            </div>

            {/* History List */}
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderList key={order.id} order={order} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 md:p-20 text-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6 border border-success/20">
              <PackageX className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-lg font-black text-foreground uppercase tracking-tighter">
              لا توجد طلبات ملغاة
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto text-xs font-bold uppercase tracking-widest mt-2">
              جميع طلباتك تمت بنجاح. هذا رائع!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
