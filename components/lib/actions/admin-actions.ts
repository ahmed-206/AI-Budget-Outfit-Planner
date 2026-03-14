"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

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

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const stockStr = formData.get("stock") as string;
    const stock = parseInt(stockStr, 10);
    const categoryId = formData.get("categoryId") as string;
    
    // Images: comma-separated URLs
    const imagesStr = formData.get("images") as string;
    const images = imagesStr ? imagesStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
    
    // Sizes
    const sizesStr = formData.get("sizes") as string;
    const sizes = sizesStr ? sizesStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
    
    // Colors
    const colorsStr = formData.get("colors") as string;
    const colors = colorsStr ? colorsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

    if (!name || isNaN(price) || isNaN(stock) || !categoryId) {
      return { success: false, error: "Missing required fields or invalid number format." };
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: price,
        stock: stock,
        categoryId,
        images,
        sizes,
        colors,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop"); // Assuming there's a shop page

    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
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

export async function editProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const stockStr = formData.get("stock") as string;
    const stock = parseInt(stockStr, 10);
    const categoryId = formData.get("categoryId") as string;
    
    // Images: comma-separated URLs
    const imagesStr = formData.get("images") as string;
    const images = imagesStr ? imagesStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
    
    // Sizes
    const sizesStr = formData.get("sizes") as string;
    const sizes = sizesStr ? sizesStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
    
    // Colors
    const colorsStr = formData.get("colors") as string;
    const colors = colorsStr ? colorsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

    if (!name || isNaN(price) || isNaN(stock) || !categoryId) {
      return { success: false, error: "Missing required fields or invalid number format." };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || "",
        price: price,
        stock: stock,
        categoryId,
        images,
        sizes,
        colors,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`); // Adjust path as necessary
    revalidatePath("/shop"); 

    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Error editing product:", error);
    return { success: false, error: "Failed to edit product" };
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
