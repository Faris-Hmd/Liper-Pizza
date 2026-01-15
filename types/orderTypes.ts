import { ProductType } from "./productsTypes";
import { ShippingInfo } from "./userTypes";

export type OrderData = {
  id: string;
  customer_email: string | null;
  customer_name?: string;
  shippingInfo?: ShippingInfo;
  productsList: ProductType[];
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  deliveredAt: string;
  createdAt: string;
  deleveratstamp?: any;
  totalAmount: number;
  driverId?: string;
  paymentMethod?: string;
  transactionReference?: string;
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
