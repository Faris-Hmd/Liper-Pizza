import { getDocs, doc, getDoc, query, limit } from "firebase/firestore";
import { offersRef, productsRef } from "@/lib/firebase";
import { Offer } from "@/types/offerTypes";
import { DUMMY_OFFERS } from "@/data/dummyOffers";
import { ProductType } from "@/types/productsTypes";

function mapProduct(id: string, data: any): ProductType {
  return {
    id,
    p_name: data.p_name ?? "",
    p_cat: data.p_cat ?? "",
    p_cost: data.p_cost ?? 0,
    p_details: data.p_details ?? "",
    p_imgs: data.p_imgs ?? [],
    createdAt: data.createdAt?.toMillis?.() ?? null,
    isFeatured: data.isFeatured ?? false,
  };
}

export async function getOffers(): Promise<Offer[]> {
  try {
    const snap = await getDocs(offersRef);
    const firestoreOffers = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Offer,
    );

    // Fetch some real products to populate dummy offers
    const productsSnap = await getDocs(query(productsRef, limit(20)));
    const dbProducts = productsSnap.docs.map((d) => mapProduct(d.id, d.data()));

    // Populate dummy offers with real products if available
    const populatedDummies = DUMMY_OFFERS.map((offer, index) => {
      // Use different subsets of products for each offer
      const start = (index * 3) % Math.max(1, dbProducts.length);
      const offerProducts =
        dbProducts.length > 0 ? dbProducts.slice(start, start + 3) : [];

      return {
        ...offer,
        products: offerProducts.length > 0 ? offerProducts : offer.products,
      };
    });

    // Merge with dummy offers
    const allOffers = [...populatedDummies, ...firestoreOffers];

    return allOffers.filter((o) => o.products && o.products.length > 0);
  } catch (err) {
    console.error("getOffers error:", err);
    return DUMMY_OFFERS; // Fallback to dummy data
  }
}

export async function getOffer(id: string): Promise<Offer | null> {
  try {
    // Check dummy offers first
    const dummy = DUMMY_OFFERS.find((o) => o.id === id);
    if (dummy) {
      // Also populate the single dummy offer with real products
      const productsSnap = await getDocs(query(productsRef, limit(20)));
      const dbProducts = productsSnap.docs.map((d) =>
        mapProduct(d.id, d.data()),
      );

      const index = DUMMY_OFFERS.indexOf(dummy);
      const start = (index * 3) % Math.max(1, dbProducts.length);
      const offerProducts =
        dbProducts.length > 0 ? dbProducts.slice(start, start + 3) : [];

      return {
        ...dummy,
        products: offerProducts.length > 0 ? offerProducts : dummy.products,
      };
    }

    const snap = await getDoc(doc(offersRef, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Offer;
  } catch (err) {
    console.error("getOffer error:", err);
    return null;
  }
}
