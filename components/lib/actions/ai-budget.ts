"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

// Define the schema for the input
const outfitSchema = z.object({
  budget: z.number().min(1, "Budget must be at least $1"),
  occasion: z.string().min(1, "Please select an occasion"),
  style: z.string().min(1, "Please select a style preference"),
});

export type OutfitState = {
  message: string;
  success: boolean;
  error?: {
    budget?: string[];
    occasion?: string[];
    style?: string[];
  };
  plan?: {
    outfits: Array<{
      name: string; // اسم الطقم (مثلاً: Casual Summer Look)
      category: string; // التصنيف (Formal, Casual...)
      items: string[]; // قطع الملابس المكونة للطقم
      estimatedPrice: number;
      matchScore: number; // نسبة ملاءمة الطقم للمناسبة
    }>;
    matchedProducts: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
    }>;
    totalCost: number;
    remainingBudget: number;
  };
};

export async function createOutfitPlan(
  prevState: OutfitState,
  formData: FormData,
): Promise<OutfitState> {
  const budget = Number(formData.get("budget"));
  const occasion = formData.get("occasion") as string;
  const style = formData.get("style") as string;

  // Validate inputs
  //لماذا safeParse ؟
  // لا ترمي error
  // تعيد نتيجة تحتوي success أو failure.
  const validation = outfitSchema.safeParse({ budget, occasion, style });

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      error: validation.error.flatten().fieldErrors,
    };
  }

  // 0. Fetch available products from DB to feed into AI

 const availableProducts = await prisma.product.findMany({
    select: { id: true, name: true, price: true, category: { select: { name: true } }, images: true },
  });

  // تحويل المنتجات إلى نص
  // الذكاء الاصطناعي يفهم النص.
 const productListString = availableProducts
    .map((p) => `- ${p.name} ($${Number(p.price).toFixed(2)}) [Category: ${p.category?.name}]`)
    .join("\n");

  // Real AI Call
  try {
    const { openai } = await import("@ai-sdk/openai");
    const { generateObject } = await import("ai");

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        outfits: z.array(
          z.object({
            name: z.string(),
            category: z.string(),
            items: z.array(z.string()),
            estimatedPrice: z.number(),
            matchScore: z.number().max(100),
          }),
        ),

        // We ask the AI to return the Exact Product Names from our list
        shoppingList: z.array(z.string()),
      }),
      system: `You are a professional AI Fashion Stylist.
            Your goal is to curate a selection of outfits for a customer based on their budget of $${budget}, for a ${occasion} occasion, and a ${style} style preference. (or as close as possible).
            
           **CRITICAL**: You must ONLY suggest products that exist in our inventory.
            Here is the list of available products:
            ${productListString}

            Guidelines:
            1. **Budget Adherence**: The total cost of the 'shoppingList' must not exceed $${budget}.
            2. **Style Consistency**: All suggested outfits must match the '${style}' aesthetic and be appropriate for '${occasion}'.
            3. **Inventory Integrity**: Do not invent clothing items. If we don't have a "Silk Tie", suggest an alternative from the list or omit it.
            4. **Shopping List**: This must contain the EXACT names of products from the list provided above.

            Output strictly valid JSON.`,
      prompt: `Curate a style plan for a ${occasion} occasion with a ${style} style. Total budget: $${budget}.`,
    });

    const aiResponse = result.object;

    // 2. Find products in DB based on shopping list (Exact match now since AI uses our names)
    const matchedProducts: {
      id: string;
      name: string;
      price: number;
      image: string;
    }[] = [];
    let totalCost = 0;

    for (const itemName of aiResponse.shoppingList) {
      // We can now do an exact match or extremely high confidence search
      const product = availableProducts.find((p) => p.name === itemName);

      if (product) {
        if (!matchedProducts.find((p) => p.id === product.id)) {
          matchedProducts.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images[0] ?? "",
          });
          totalCost += Number(product.price);
        }
      } else {
        // Fallback for slight hallucinations
        const fuzzyProduct = await prisma.product.findFirst({
          where: { name: { contains: itemName, mode: "insensitive" } },
        });
        if (
          fuzzyProduct &&
          !matchedProducts.find((p) => p.id === fuzzyProduct.id)
        ) {
          matchedProducts.push({
            id: fuzzyProduct.id,
            name: fuzzyProduct.name,
            price: Number(fuzzyProduct.price),
            image: fuzzyProduct.images[0] ?? "",
          });
          totalCost += Number(fuzzyProduct.price);
        }
      }
    }

    return {
     success: true,
      message: "Style plan generated successfully!",
      plan: {
        outfits: aiResponse.outfits,
        matchedProducts,
        totalCost,
        remainingBudget: budget - totalCost,
      },
    };
  } catch (error) {
    console.error("AI Stylist Error:", error);
    return {
      success: false,
      message:
        "Our stylist is busy right now. Please try again in a moment.",
    };
  }
}
