import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from 'fs';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// إعداد الاتصال لـ Prisma 7 و Neon
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // ====================================================
    // 1. (Categories) - إضافة الأقسام
    // ====================================================
    try {
        const categoriesPath = path.join(__dirname, 'categories.json');
        const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

        console.log('--- Seeding Categories ---');
        for (const category of categories) {
            await prisma.category.upsert({
                where: { slug: category.slug },
                update: category,
                create: category,
            });
            console.log(`✅ Category processed: ${category.name}`);
        }
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
    }

    // ====================================================
    // 2. (Products) - إضافة المنتجات وربطها
    // ====================================================
    try {
        const productsPath = path.join(__dirname, 'products.json');
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        console.log('--- Seeding Products ---');
        for (const product of products) {
            // البحث عن القسم الصحيح باستخدام الـ slug الموجود في ملف الـ JSON
            const targetCategory = await prisma.category.findUnique({
                where: { slug: product.categoryId }
            });

            if (!targetCategory) {
                console.error(`⚠️ Skipping product "${product.name}": Category "${product.categoryId}" not found.`);
                continue;
            }

            // التأكد من عدم تكرار المنتج وربطه بالـ ID الحقيقي للقسم
            const existing = await prisma.product.findFirst({
                where: { name: product.name }
            });

            if (!existing) {
                await prisma.product.create({
                    data: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        images: product.images,
                        sizes: product.sizes,
                        colors: product.colors,
                        stock: product.stock,
                        categoryId: targetCategory.id // الربط بالـ ID الصحيح من قاعدة البيانات
                    }
                });
                console.log(`✅ Created product: ${product.name}`);
            } else {
                console.log(`⏩ Skipping existing product: ${product.name}`);
            }
        }
    } catch (error) {
        console.error("❌ Error seeding products:", error);
    }

    console.log(`\n🚀 Seeding process finished successfully.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });