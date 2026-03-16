"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ActionResponse, ProductWithCategory} from "@/types";
import { ProductSchema } from "@/lib/validations/product";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function addProduct(formData: FormData): Promise<ActionResponse<ProductWithCategory>> {
  try {
    // التحقق من البيانات
    const validatedFields = ProductSchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.flatten().fieldErrors.name?.[0] || "Invalid data" };
    }

    const newProduct = await prisma.product.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, data: newProduct };
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    return { success: false, error: "Database error: Could not add product" };
  }
}

export async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return { success: true, products };
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Delete associated cart items and order items first if needed, or rely on cascade 
    // Wait, the schema does not have onDelete: Cascade. So we must delete related CartItems and OrderItems.
    
    await prisma.cartItem.deleteMany({
      where: { productId: id }
    });
    
    await prisma.orderItem.deleteMany({
      where: { productId: id }
    });

    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop"); 
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function editProduct(id: string, formData: FormData): Promise<ActionResponse<ProductWithCategory>> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = ProductSchema.safeParse(rawData);

    if (!validated.success) {
      return { success: false, error: "بيانات غير صالحة" };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validated.data, // هنا الـ Mapping تلقائي لأن Prisma update أكثر مرونة
      include: { category: true }
    }) as ProductWithCategory;

    revalidatePath("/admin/products");
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("EDIT_PRODUCT_ERROR:", error);
    return { success: false, error: "فشل تحديث البيانات" };
  }
}

export async function getAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}
