import { getDocs, doc, getDoc } from "firebase/firestore";
import { offersRef } from "@/lib/firebase";
import { Offer } from "@/types/offerTypes";

export async function getOffers(): Promise<Offer[]> {
  try {
    const snap = await getDocs(offersRef);
    const firestoreOffers = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Offer,
    );

    return firestoreOffers.filter((o) => o.products && o.products.length > 0);
  } catch (err) {
    console.error("getOffers error:", err);
    return [];
  }
}

export async function getOffer(id: string): Promise<Offer | null> {
  try {
    const snap = await getDoc(doc(offersRef, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Offer;
  } catch (err) {
    console.error("getOffer error:", err);
    return null;
  }
}
