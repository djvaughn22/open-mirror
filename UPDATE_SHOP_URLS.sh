#!/bin/bash

# Update Etsy URLs in shop page
# Usage: ./UPDATE_SHOP_URLS.sh

echo "🛍️  Open Mirror Shop URL Updater"
echo "================================"
echo ""
echo "Enter the Etsy listing URLs as prompted."
echo "Format: https://www.etsy.com/listing/XXXXXXX/..."
echo ""

read -p "CrossHeartPray Prayer Cards URL: " PRAYER_CARDS_URL
read -p "Daily Hope Encouragement Cards URL: " DAILY_HOPE_URL
read -p "DontCloneMeTom Dog Stickers URL: " DOG_STICKERS_URL
read -p "iDontCry Dad Joke T-Shirt URL: " TSHIRT_URL
read -p "TheDJCares Playlist Card URL: " PLAYLIST_URL

echo ""
echo "✏️  Updating shop page..."

# Create a temporary file with the updated URLs
cat > /tmp/shop_update.ts << 'EOF'
"use client";

type ShopBrand = { name: string; emoji: string; accent: string; tagline: string; shopUrl?: string };
type Product = { title: string; price: string; url: string };
type BrandProducts = { [key: string]: Product[] };

const brands: ShopBrand[] = [
  { name: "CrossHeartPray", emoji: "✝️", accent: "#C4B5FD", tagline: "Prayer cards, Bible study aids, printables." },
  { name: "TheDJCares", emoji: "🎵", accent: "#A78BFA", tagline: "Encouragement cards, playlist bundles, digital downloads." },
  { name: "DontCloneMeTom", emoji: "🐶", accent: "#2DD4BF", tagline: "Dog rescue merchandise, adoption-focused apparel." },
  { name: "iDontCry", emoji: "😂", accent: "#38BDF8", tagline: "Dad jokes, family games, funny stickers." },
  { name: "StepInTheRing", emoji: "🥊", accent: "#60A5FA", tagline: "Build guides, idea templates, digital tools." },
  { name: "Digital Downloads", emoji: "📥", accent: "#7DD3FC", tagline: "Printables, wallpapers, journals, templates." },
];

const products: BrandProducts = {
  CrossHeartPray: [
    { title: "Prayer Cards Bundle — Daily Hope Prayers", price: "$4.99", url: "PRAYER_CARDS_URL_PLACEHOLDER" },
  ],
  TheDJCares: [
    { title: "30 Days of Hope — Encouragement Cards", price: "$6.99", url: "DAILY_HOPE_URL_PLACEHOLDER" },
    { title: "Gospel Music Playlist Card", price: "$4.99", url: "PLAYLIST_URL_PLACEHOLDER" },
  ],
  DontCloneMeTom: [
    { title: "Dog Rescue Sticker Pack — 12 Designs", price: "$3.99", url: "DOG_STICKERS_URL_PLACEHOLDER" },
  ],
  iDontCry: [
    { title: "I'm Not Crying T-Shirt — Dad Joke Edition", price: "$19.99", url: "TSHIRT_URL_PLACEHOLDER" },
  ],
};
EOF

# Replace placeholders
sed -i "s|PRAYER_CARDS_URL_PLACEHOLDER|$PRAYER_CARDS_URL|g" /tmp/shop_update.ts
sed -i "s|DAILY_HOPE_URL_PLACEHOLDER|$DAILY_HOPE_URL|g" /tmp/shop_update.ts
sed -i "s|DOG_STICKERS_URL_PLACEHOLDER|$DOG_STICKERS_URL|g" /tmp/shop_update.ts
sed -i "s|TSHIRT_URL_PLACEHOLDER|$TSHIRT_URL|g" /tmp/shop_update.ts
sed -i "s|PLAYLIST_URL_PLACEHOLDER|$PLAYLIST_URL|g" /tmp/shop_update.ts

# Extract the products and brands sections
head -n 27 /tmp/shop_update.ts > /tmp/products_section.ts

# Read the rest of the shop page and replace the products section
SHOP_FILE="/home/dj/OpenMirror/open-mirror/src/app/shop/page.tsx"

# Get line number of "const bg = " to know where to split
LINE_NUM=$(grep -n "const bg = " "$SHOP_FILE" | head -1 | cut -d: -f1)

# Replace only the first section (types, brands, products)
head -n $((LINE_NUM - 1)) "$SHOP_FILE" > /tmp/shop_new.tsx
cat /tmp/products_section.ts >> /tmp/shop_new.tsx
echo "" >> /tmp/shop_new.tsx
tail -n +$LINE_NUM "$SHOP_FILE" >> /tmp/shop_new.tsx

# Copy back
cp /tmp/shop_new.tsx "$SHOP_FILE"

echo "✅ Shop page updated!"
echo ""
echo "URLs added:"
echo "  • Prayer Cards: ${PRAYER_CARDS_URL}"
echo "  • Daily Hope: ${DAILY_HOPE_URL}"
echo "  • Dog Stickers: ${DOG_STICKERS_URL}"
echo "  • T-Shirt: ${TSHIRT_URL}"
echo "  • Playlist Card: ${PLAYLIST_URL}"
echo ""
echo "Next steps:"
echo "  1. Review the changes: git diff src/app/shop/page.tsx"
echo "  2. Test locally: npm run dev"
echo "  3. Commit: git add src/app/shop/page.tsx && git commit"
echo "  4. Push: git push"
echo ""
