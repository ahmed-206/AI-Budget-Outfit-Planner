import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().default(""),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.string().transform((val) => 
    val ? val.split(",").map((s) => s.trim()).filter(Boolean) : []
  ),
  sizes: z.string().transform((val) => 
    val ? val.split(",").map((s) => s.trim()).filter(Boolean) : []
  ),
  colors: z.string().transform((val) => 
    val ? val.split(",").map((s) => s.trim()).filter(Boolean) : []
  ),
});