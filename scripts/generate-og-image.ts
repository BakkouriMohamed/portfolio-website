// Generate OG image for social media sharing (1200x630)
// Swiss-minimal aesthetic matching the site

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

const PROMPT = `Editorial social media banner, 1200x630 landscape, pure white background. 
Top left corner: small black square logo with white letters "MB" (50x50px). 
Centered: massive bold black sans-serif text "MOHAMED BAKKOURI" in uppercase, extremely tight letter-spacing, taking up 70% of width. 
Below the name: smaller text "SPÉCIALISTE EN MARKETING DIGITAL" in monospace, uppercase, gray color. 
Bottom right: small Swiss red square accent (40x40px) with white text "2026" inside. 
Bottom left: small monospace text "FÈS, MAROC" in gray. 
Style: Swiss International Typographic Style, minimalist, massive whitespace, mathematical grid alignment, high contrast black on white, single red accent. 
No decorations, no gradients, no images, pure typography. 
Premium editorial design, clean, professional portfolio banner.`;

async function generate() {
  console.log("→ Generating OG image...");
  const zai = await ZAI.create();
  
  const response = await zai.images.generations.create({
    prompt: PROMPT,
    size: "1344x768", // closest supported size to 1200x630 (16:9-ish)
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, "base64");
  
  // Resize to standard OG image dimensions (1200x630) with sharp
  const sharp = require("sharp");
  const resizedBuffer = await sharp(buffer)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .png()
    .toBuffer();
  
  const outputPath = "/home/z/my-project/public/og-image.png";
  fs.writeFileSync(outputPath, resizedBuffer);
  
  console.log(`✓ OG image saved: ${outputPath} (${(resizedBuffer.length / 1024).toFixed(0)} KB)`);
}

generate().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
