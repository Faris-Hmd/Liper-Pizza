import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Category Mappings (Folder Name -> Category Code)
const FOLDER_TO_CAT_MAP: Record<string, string> = {
  "pizza img": "PC",
  "cold drink": "HARD_DRIVES",
  "hot drink": "HEADSETS",
  saled: "SPEAKERS",
  sweet: "KEYBOARDS",
};

// Generic Names for random generation if file name isn't descriptive
const DEFAULT_NAMES: Record<string, string> = {
  PC: "بيتزا",
  HARD_DRIVES: "مشروب بارد",
  HEADSETS: "مشروب ساخن",
  SPEAKERS: "سلطة",
  KEYBOARDS: "حلوى",
};

export async function GET() {
  try {
    const productsRef = collection(db, "pizza_products"); // Back to main connection? Or pizza_products?
    // User used "pizza_products" before but if we are seeding ALL, we probably want "products".
    // I'll stick to 'products' to be safe for the main app, or maybe 'pizza_products' was a temporary test?
    // Given the request to observe new folders (plural), I'll assume we want to seed everything correctly.

    // I will use "products" collection as it is the standard one used by the app.

    const publicBaseDir = path.join(process.cwd(), "public");
    const foldersToProcess = Object.keys(FOLDER_TO_CAT_MAP);

    const uploadedProducts = [];

    for (const folderName of foldersToProcess) {
      const folderPath = path.join(publicBaseDir, folderName);
      const categoryCode = FOLDER_TO_CAT_MAP[folderName];

      // Check if directory exists
      try {
        await fs.access(folderPath);
      } catch {
        console.log(`Skipping ${folderName}, not found`);
        continue;
      }

      const files = await fs.readdir(folderPath);

      for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        const filePath = path.join(folderPath, file);
        const fileBuffer = await fs.readFile(filePath);

        // 1. Resize Image
        const resizedBuffer = await sharp(fileBuffer)
          .resize(600)
          .webp({ quality: 60 })
          .toBuffer();

        // 2. Upload to Vercel Blob
        const safeName = file.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const newName = `seed-${categoryCode}-${Date.now()}-${safeName}.webp`;

        const blob = await put(newName, resizedBuffer, {
          access: "public",
        });

        // 3. Create Product in Firebase
        const baseName = DEFAULT_NAMES[categoryCode] || "منتج";
        const productData = {
          p_name: `${baseName} ${Math.floor(Math.random() * 1000)}`, // Unique-ish name
          p_cat: categoryCode,
          p_cost: 100 + Math.floor(Math.random() * 200), // Random price 100-300
          p_details: "وصف تلقائي للمنتج يتم تحديثه لاحقاً.",
          p_imgs: [{ url: blob.url, alt: baseName }],
          createdAt: new Date(),
          isFeatured: Math.random() > 0.8, // 20% chance featured
        };

        const docRef = await addDoc(productsRef, productData);

        uploadedProducts.push({
          id: docRef.id,
          url: blob.url,
          category: categoryCode,
          originalName: file,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${uploadedProducts.length} images across ${foldersToProcess.length} categories`,
      products: uploadedProducts,
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
