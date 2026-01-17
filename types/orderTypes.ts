import { ProductType } from "./productsTypes";
import { ShippingInfo } from "./userTypes";

export type OrderData = {
  id: string;
  customer_email: string | null;
  customer_name?: string;
  shippingInfo?: ShippingInfo;
  productsList: ProductType[];
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";

  // ✅ CHANGED: Now using milliseconds instead of string
  createdAt: number; // Milliseconds since epoch

  // ✅ CHANGED: Renamed from 'deleverAt' and using milliseconds, optional since only set when delivered
  deliveredAt?: number; // Milliseconds - delivery timestamp

  // ✅ REMOVED: deleveratstamp (consolidated into deliveredAt)

  totalAmount: number;
  driverId?: string;
  paymentMethod?: string;
  transactionReference?: string;

  // Offer fields
  isOffer?: boolean;
  offerId?: string;
  offerTitle?: string;
  offerImage?: string;
};

export interface CategoryDistribution {
  category: string;
  quantity: number;
  fill: string;
}

export interface DailySalesData {
  month: string;
  day: number;
  sales: number;
  orders: number;
}
