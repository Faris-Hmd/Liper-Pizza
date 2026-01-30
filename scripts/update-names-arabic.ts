import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// --- Configuration ---
// Map DB Categories (e.g. "PC") to Arabic Name Lists
const NAME_MAPPING: Record<string, string[]> = {
  // Pizzas (PC)
  PC: [
    "بيتزا مارغريتا",
    "بيتزا بيبروني",
    "بيتزا دجاج رانش",
    "بيتزا سوبر سوبريم",
    "بيتزا خضروات مشكلة",
    "بيتزا فصول الأربعة",
    "بيتزا عشاق الجبن",
    "بيتزا تونة",
    "بيتزا باربيكيو دجاج",
    "بيتزا هوت دوج",
  ],
  // Sandwiches (LAPTOP)
  LAPTOP: [
    "ساندوتش فاهيتا دجاج",
    "ساندوتش شاورما لحم",
    "برجر كلاسيك",
    "تشيكن فيليه",
    "ساندوتش كفتة",
    "ساندوتش جمبري مقلي",
    "شيش طاووق رول",
    "برجر دبل تشيز",
  ],
  // Appetizers (WEBCAMS)
  WEBCAMS: [
    "بطاطس محمرة",
    "حلقات بصل مقرمشة",
    "أصابع موزاريلا",
    "وينجز حار",
    "بطاطس بالجبنة",
    "سبر링 رول خضار",
    "تشيكن ستربس",
  ],
  // Cold Drinks (HARD_DRIVES)
  HARD_DRIVES: [
    "بيبسي بارد",
    "كوكاكولا زجاج",
    "سفن أب",
    "ميرندا برتقال",
    "ميرندا تفاح",
    "عصير برتقال فريش",
    "عصير ليمون نعناع",
    "مياه معدنية",
  ],
  // Hot Drinks (HEADSETS)
  HEADSETS: [
    "شاي أحمر",
    "شاي أخضر",
    "قهوة تركية",
    "كابتشينو",
    "لاتيه",
    "هووت شوكليت",
    "اسبريسو",
  ],
  // Sweets (KEYBOARDS)
  KEYBOARDS: [
    "تشيز كيك فراولة",
    "مولتن كيك",
    "وافل نوتيلا",
    "كريب شيكولاتة",
    "أرز باللبن",
    "أم علي",
    "براونيز",
  ],
  // Salads (SPEAKERS)
  SPEAKERS: [
    "سلطة خضراء بلدي",
    "سلطة سيزر الدجاج",
    "كول سلو",
    "سلطة طحينة",
    "سلطة فواكه",
    "سلطة يونانية",
  ],
  // Others
  PRINTERS: ["وجبة عائلية مكس", "بوكس التوفير", "وليمة المشويات"],
  MONITORS: ["بيتزا إيطالية مميزة", "بيتزا نابولي"],
  SSD: ["فطيرة مشلتت", "فطيرة سجق", "فطيرة جبن"],
  MOUSES: ["وجبة سريعة 1", "وجبة سريعة 2"],
};

const DETAILS_MAPPING: Record<string, string> = {
  PC: "عجينة إيطالية هشة ومقرمشة مع صلصة طماطم طازجة وطبقة غنية من جبنة الموزاريلا وأجود الإضافات.",
  LAPTOP:
    "خبز طازج مخبوز يومياً مع حشوات غنية وصوصات مميزة، يقدم ساخناً لضمان أفضل مذاق.",
  WEBCAMS:
    "مقبلات شهية محضرة بعناية، مثالية للمشاركة أو كوجبة خفيفة بجانب طبقك الرئيسي.",
  HARD_DRIVES: "مشروبات منعشة وباردة تروي عطشك وتكمل وجبتك.",
  HEADSETS: "مشروبات ساخنة محضرة من أجود أنواع البن والشاي لتعديل المزاج.",
  KEYBOARDS: "حلويات شرقية وغربية لذيذة لتختم وجبتك بمذاق حلو لا يقاوم.",
  SPEAKERS: "سلطات طازجة وصحية محضرة يومياً من أجود الخضروات.",
};

// --- Env Loader ---
const loadEnv = () => {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");

      content.split("\n").forEach((line) => {
        const cleanLine = line.split("#")[0]?.trim();
        if (!cleanLine) {
          if (line.includes("NEXT_PUBLIC_FIREBASE_API_KEY")) {
            const parts = line.split("=");
            if (parts[1]) process.env.FIREBASE_API_KEY = parts[1].trim();
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
    }
  } catch (e) {
    console.error(e);
  }
};
loadEnv();

// --- Firebase ---
const apiKey =
  process.env.FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyACa5a0MmohKo2h4-fN2ffnl7BlgLDr4iQ";
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function renameProducts() {
  console.log("🚀 Starting Arabic Renaming...");

  const productsRef = collection(db, "pizza_products");
  const snapshot = await getDocs(productsRef);

  if (snapshot.empty) {
    console.log("⚠ No products found.");
    return;
  }

  let updatedCount = 0;

  // Group docs by category to cycle names correctly
  const docsByCategory: Record<string, any[]> = {};
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const cat = data.p_cat;
    if (!docsByCategory[cat]) docsByCategory[cat] = [];
    docsByCategory[cat].push(doc);
  });

  for (const [cat, docs] of Object.entries(docsByCategory)) {
    const names = NAME_MAPPING[cat] || [`منتج ${cat}`];
    const baseDetails = DETAILS_MAPPING[cat] || "منتج مميز بجودة عالية.";

    console.log(`\n📂 Category: ${cat} (${docs.length} items)`);
    console.log(`   Using names: ${names.slice(0, 3).join(", ")}...`);

    const batchPromises = docs.map(async (docSnap, index) => {
      // Cycle through names
      const newName = names[index % names.length];

      // Add slight variation to price if multiple items have same name?
      // Actually, duplicate names are fine if they are generic, but better to rotate.

      try {
        await updateDoc(doc(db, "pizza_products", docSnap.id), {
          p_name: newName,
          p_details: baseDetails,
        });
        updatedCount++;
      } catch (e) {
        console.error(`  ❌ Failed to update ${docSnap.id}`, e);
      }
    });

    await Promise.all(batchPromises);
  }

  console.log(`\n🎉 Renamed ${updatedCount} products successfully!`);
  process.exit(0);
}

renameProducts().catch((e) => {
  console.error("Fatal Error:", e);
  process.exit(1);
});
