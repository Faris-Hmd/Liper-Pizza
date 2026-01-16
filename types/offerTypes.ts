import { ProductType } from "./productsTypes";

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
  badge?: string;
  price?: number; // Optional: A special total price for the offer
}
