"use client";

import React from "react";
import { Offer } from "@/types/offerTypes";
import { dispatchCartUpdate, useCart } from "@/hooks/useCart";
import { PlusCircle } from "lucide-react";

interface OfferClientActionsProps {
  offer: Offer;
}

const OfferClientActions: React.FC<OfferClientActionsProps> = ({ offer }) => {
  const { cart } = useCart();

  const handleAddOffer = () => {
    let currentCart = [...cart];

    offer.products.forEach((product) => {
      const existing = currentCart.find((p) => p.id === product.id);
      if (existing) {
        existing.p_qu = (existing.p_qu || 1) + 1;
      } else {
        currentCart.push({ ...product, p_qu: 1 });
      }
    });

    localStorage.setItem("sh", JSON.stringify(currentCart));
    dispatchCartUpdate();

    alert(`تم إضافة عرض "${offer.title}" إلى السلة بنجاح!`);
  };

  return (
    <button
      onClick={handleAddOffer}
      className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all group"
    >
      <PlusCircle
        size={24}
        className="group-hover:rotate-90 transition-transform duration-500"
      />
      <span>أضف للسلة الآن</span>
    </button>
  );
};

export default OfferClientActions;
