// types/index.ts
import { 
  Product as PrismaProduct, 
  Category as PrismaCategory, 
  Order as PrismaOrder, 
  OrderItem as PrismaOrderItem 
} from "@prisma/client";


export type Category = PrismaCategory;

export type ProductWithCategory = PrismaProduct & {
  category?: Category;
};

export type OrderWithItems = PrismaOrder & {
  orderItems: (PrismaOrderItem & {
    product: PrismaProduct;
  })[];
};


export type ActionResponse<T = void> = {
  success: boolean;
  error?: string;
  data?: T; // البيانات ستكون من النوع الذي نحدده عند استدعاء الدالة
};