"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Trash2, Check, Plus } from "lucide-react";
import { ProductType } from "@/types/productsTypes";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/Loading";

type CartProduct = ProductType & { p_qu: number };
const CART_KEY = "sh";

function CartBtn({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState("1");
  const [inCart, setInCart] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getCart = (): CartProduct[] =>
    JSON.parse(localStorage.getItem(CART_KEY) || "[]");

  const saveCart = (cart: CartProduct[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    import("@/hooks/useCart").then(({ dispatchCartUpdate }) =>
      dispatchCartUpdate(),
    );
  };

  useEffect(() => {
    const item = getCart().find((p) => p.id === product.id);
    if (item) {
      setInCart(true);
      setQuantity(item.p_qu.toString());
    }
  }, [product.id]);

  const upsert = useCallback(
    (q: string) => {
      setIsUpdating(true);
      const cart = getCart().filter((p) => p.id !== product.id);
      cart.push({ ...product, p_qu: Number(q) });
      saveCart(cart);
      setInCart(true);

      // Artificial delay for tactile feedback
      setTimeout(() => setIsUpdating(false), 400);
    },
    [product],
  );

  const remove = useCallback(() => {
    saveCart(getCart().filter((p) => p.id !== product.id));
    setInCart(false);
    setQuantity("1");
  }, [product.id]);

  return (
    <div className="group flex items-center gap-3 w-full">
      {/* --- QUANTITY SELECTOR --- */}
      <div className="w-24 shrink-0">
        <Select
          value={quantity}
          onValueChange={(v) => {
            setQuantity(v);
            if (inCart) upsert(v);
          }}
        >
          <SelectTrigger className="w-full h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl font-black text-xs ring-offset-primary focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <SelectItem
                key={n}
                value={n.toString()}
                className="text-xs font-bold uppercase tracking-tighter"
              >
                {n.toString().padStart(2, "0")} قطع
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* --- MAIN ACTION BUTTON --- */}
      <div className="flex-1 flex items-center gap-2">
        <button
          onClick={() => upsert(quantity)}
          className={cn(
            "relative flex-1 h-12 flex items-center justify-center gap-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.97] overflow-hidden",
            inCart
              ? "bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 ring-2 ring-primary/20"
              : "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90",
          )}
        >
          {isUpdating ? (
            <Spinner size="sm" />
          ) : inCart ? (
            <>
              <Check
                size={16}
                strokeWidth={3}
                className="text-primary-foreground"
              />
              تحديث
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={3} />
              إضافة
            </>
          )}
        </button>

        {/* --- REMOVE BUTTON --- */}
        {inCart && (
          <button
            onClick={remove}
            title="إزالة من السلة"
            className="h-12 w-12 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-90 border border-red-100 dark:border-red-500/20 shrink-0"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CartBtn;
