/* Generates favicon files from public/logo.png.
   Usage: node public/favicons.mjs
*/

import fs from "node:fs";
import path from "node:path";

async function main() {
  const sharp = (await import("sharp")).default;

  const logoPath = path.join(process.cwd(), "public", "logo.png");
  if (!fs.existsSync(logoPath)) throw new Error(`Missing ${logoPath}`);

  const faviconIcoPath = path.join(process.cwd(), "public", "favicon.ico");
  const applePngPath = path.join(process.cwd(), "public", "apple-touch-icon.png");

  // Apple touch icon (180x180)
  await sharp(logoPath).resize(180, 180).png().toFile(applePngPath);

  // Favicon (ICO). sharp can write ICO directly via the `ico` output format.
  await sharp(logoPath)
    .resize(32, 32)
    .toFile(faviconIcoPath);

  console.log("Generated:");
  console.log(`- ${path.relative(process.cwd(), applePngPath)}`);
  console.log(`- ${path.relative(process.cwd(), faviconIcoPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

