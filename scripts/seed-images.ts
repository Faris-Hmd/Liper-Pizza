import fs from "fs";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// --- Configuration ---
const INPUT_DIR = path.join(process.cwd(), "public");
const TARGET_WIDTH = 1200; // Resize width
const TARGET_QUALITY = 90;

// Legacy Category Mapping (Folder Name -> database p_cat)
const CATEGORY_MAP: Record<string, string> = {
  pizzas: "PC",
  "cold-drinks": "HARD_DRIVES",
  "hot-drinks": "HEADSETS",
  sweets: "KEYBOARDS",
  salads: "SPEAKERS",
  sandwiches: "LAPTOP",
  appetizers: "WEBCAMS",
};

// --- Env Loader (Simple parser for .env.local) ---
const loadEnv = () => {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");

      content.split("\n").forEach((line) => {
        // Remove comments
        const cleanLine = line.split("#")[0]?.trim();
        if (!cleanLine) {
          // Check if the user commented out the key (common in this project)
          if (line.includes("NEXT_PUBLIC_FIREBASE_API_KEY")) {
            const parts = line.split("=");
            if (parts[1]) {
              process.env.FIREBASE_API_KEY = parts[1].trim();
            }
          }
          return;
        }

        const match = cleanLine.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const val = match[2]
            .trim()
            .replace(/^"(.*)"$/, "$1")
            .replace(/^'(.*)'$/, "$1");
          process.env[key] = val;
        }
      });
      console.log("✔ Loaded .env.local");
    } else {
      console.warn("⚠ .env.local not found, relying on process.env");
    }
  } catch (e) {
    console.error("Error loading .env.local", e);
  }
};

loadEnv();

// --- Validation ---
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("❌ Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local");
  process.exit(1);
}

// Fallback for API Key if not found in env
const apiKey =
  process.env.FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyACa5a0MmohKo2h4-fN2ffnl7BlgLDr4iQ";

// --- Firebase Init ---
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("❌ Missing Firebase Configuration (API Key).");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Main Script ---
async function seedImages() {
  console.log("🚀 Starting Vercel Blob Seeding & Creation...");

  const publicFolders = fs
    .readdirSync(INPUT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "menu")
    .map((dirent) => dirent.name);

  for (const folder of publicFolders) {
    const categoryId = CATEGORY_MAP[folder];
    if (!categoryId) {
      console.log(`ℹ Skipping folder '${folder}' (No category mapping found)`);
      continue;
    }

    console.log(`\n📂 Processing folder: ${folder} (Category: ${categoryId})`);

    const sourcePath = path.join(INPUT_DIR, folder);
    const files = fs
      .readdirSync(sourcePath)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    const uploadedItems: { url: string; name: string }[] = [];

    // Process & Upload Images
    for (const file of files) {
      const inputFile = path.join(sourcePath, file);
      const filename = path.parse(file).name;
      const blobPath = `menu/${filename}.webp`;

      try {
        // 1. Optimize Image
        const buffer = await sharp(inputFile)
          .resize(TARGET_WIDTH, null, { withoutEnlargement: true })
          .webp({ quality: TARGET_QUALITY })
          .toBuffer();

        // 2. Upload to Vercel Blob
        console.log(`  ⬆ Uploading ${file} to ${blobPath}...`);
        const blob = await put(blobPath, buffer, {
          access: "public",
        });

        console.log(`  ✨ Uploaded: ${blob.url}`);
        uploadedItems.push({ url: blob.url, name: filename });
      } catch (err) {
        console.error(`  ❌ Failed to process/upload ${file}:`, err);
      }
    }

    if (uploadedItems.length === 0) {
      console.log("  ⚠ No images were successfully uploaded for this folder.");
      continue;
    }

    // 3. Create New Firestore Products
    console.log("  🌱 Creating new products in Firestore...");

    let createdCount = 0;
    const batchPromises = uploadedItems.map(async (item) => {
      // Generate Dummy Data
      let cleanName = item.name
        .replace(/slazzer[-_ ]?preview/gi, "") // Remove common edit artifacts
        .replace(/[-_.]/g, " "); // Replace separators with spaces

      // Capitalize Words
      const productName =
        cleanName.trim().replace(/\b\w/g, (c) => c.toUpperCase()) ||
        "منتج جديد";

      const randomPrice = Math.floor(Math.random() * (400 - 100 + 1)) + 100;

      const productData = {
        p_name: productName,
        p_cost: randomPrice,
        p_cat: categoryId,
        p_details:
          "وصف افتراضي للوجبة الشهية. يتم إعداده بأحدث المكونات الطازجة.",
        p_imgs: [{ url: item.url }],
        p_qu: 1,
        isFeatured: Math.random() < 0.3, // 30% chance to be featured
        createdAt: new Date().toISOString(),
      };

      try {
        await addDoc(collection(db, "pizza_products"), productData);
        createdCount++;
      } catch (e) {
        console.error(`  ❌ Err creating product for ${item.name}:`, e);
      }
    });

    await Promise.all(batchPromises);
    console.log(`  ✅ Created ${createdCount} new products in ${folder}.`);
  }

  console.log("\n🎉 Seeding Complete!");
  process.exit(0);
}

seedImages().catch((err) => {
  console.error("Wait, something went wrong:", err);
  process.exit(1);
});
