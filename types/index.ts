export type PriceHistoryItem = {
  price: number;
};

export type User = {
  email: string;
};

export type Product = {
  productId?: string;
  productUrl?: string;
  currency?: string;
  image?: string;
  title?: string;
  currentPrice?: number;
  originalPrice?: number;
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
  discountRate?: number;
  isOutOfStock?: boolean;
  priceHistory?: PriceHistoryItem[] | [];
  createdAt?: Date;
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
