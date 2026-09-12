// Generate two project images for GHAITI and URBANFLEX
// Matching the aesthetic of the existing Ghmoiya image:
// editorial, textured, premium product/branding photography on organic surfaces
// 4:3 aspect ratio (1152x864) to match the project card layout

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "/home/z/my-project/public";

const PROMPTS = [
  {
    name: "project-ghaiti.jpg",
    prompt:
      "Editorial product photography of event branding materials neatly arranged on a textured warm beige linen surface. The composition includes ivory paper event passes with thin purple neck lanyards, kraft cardstock name badges with elegant minimal typography, a folded event program booklet in matte black, and a small stack of business cards in deep purple. Soft directional natural window light from the left, gentle shadows, organic wrinkles in the linen, scattered cactus leaves as a subtle Moroccan accent in the corner. Premium, minimalist, sophisticated branding photography. Muted earth tones with deep violet accents. Shot on Hasselblad, shallow depth of field, high-end editorial aesthetic, 4:3 composition.",
  },
  {
    name: "project-urbanflex.jpg",
    prompt:
      "Editorial flat-lay product photography of modern digital agency branding materials arranged on a rough textured concrete surface in warm grey. The composition includes a black smartphone displaying a minimal website interface, a tablet showing analytics charts in monochrome, folded white paper brochures with subtle typography, a stack of business cards in soft black, and a thin metal pen. Stark directional daylight from the upper left, sharp defined shadows, raw concrete texture visible throughout. Premium, contemporary, urban aesthetic. Monochrome palette with a single tiny red accent on one card. Shot on medium format, top-down perspective, sophisticated branding photography, 4:3 composition.",
  },
];

async function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const zai = await ZAI.create();

  // Generate both in parallel
  const results = await Promise.all(
    PROMPTS.map(async ({ name, prompt }) => {
      const startedAt = Date.now();
      try {
        console.log(`→ Generating ${name}...`);
        const response = await zai.images.generations.create({
          prompt,
          size: "1152x864", // 4:3 landscape — matches project card aspect
        });

        const imageBase64 = response.data[0].base64;
        const buffer = Buffer.from(imageBase64, "base64");
        const outputPath = path.join(OUTPUT_DIR, name);
        fs.writeFileSync(outputPath, buffer);

        const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
        console.log(
          `✓ ${name} — ${(buffer.length / 1024).toFixed(0)} KB — ${elapsed}s`
        );
        return { name, success: true, path: outputPath, size: buffer.length };
      } catch (error) {
        console.error(`✗ ${name} failed: ${error.message}`);
        return { name, success: false, error: error.message };
      }
    })
  );

  console.log("\n=== Summary ===");
  results.forEach((r) => {
    console.log(
      r.success
        ? `✓ ${r.name} → ${r.path} (${(r.size / 1024).toFixed(0)} KB)`
        : `✗ ${r.name} → ${r.error}`
    );
  });
}

generateAll().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
