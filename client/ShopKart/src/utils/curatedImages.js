// High-resolution tactile luxury photography matching the Alcove aesthetic
// (warm ivory, beige, soft stone, muted sage, natural wood, quiet luxury)

export const CURATED_CATEGORY_IMAGES = {
  "Home": [
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85", // ceramic vases & warm linen
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85", // hand-thrown stoneware
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85", // minimalist interior bowl
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=85"  // artisanal dining objects
  ],
  "Objects": [
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85", // sculptural stone
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85", // fine leather goods & canvas
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85", // structured tote
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"  // artisanal brass & accessories
  ],
  "Clothing": [
    "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=85", // natural organic linen shirt
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85", // relaxed neutral attire
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85"  // minimalist slow fashion
  ],
  "Fashion": [
    "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85"
  ],
  "Electronics": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85", // minimalist acoustic headphones
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85", // tactile mechanical keyboard
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85"  // warm desktop objects
  ],
  "Beauty": [
    "https://images.unsplash.com/photo-1608248597359-0f04f2f764a7?auto=format&fit=crop&w=1000&q=85", // amber glass botanical serum
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85", // artisanal scent & botanical oil
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=85"  // natural skincare bottles
  ]
};

export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85";

export function getProductImages(product) {
  return [
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.image,
  ].filter(
    (image, imageIndex, images) =>
      typeof image === "string" &&
      image.trim() &&
      !/^(https?:\/\/)?(example\.com|via\.placeholder\.com)(\/|$)/i.test(image) &&
      images.indexOf(image) === imageIndex
  );
}

export function getProductDisplayImage(product, index = 0) {
  const productImages = getProductImages(product);

  if (productImages[index]) {
    return productImages[index];
  }

  // Derive hash from product id or name for consistent deterministic image assignment
  const key = product?.name || product?._id || "default";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const categoryImages = CURATED_CATEGORY_IMAGES[product?.category] || CURATED_CATEGORY_IMAGES["Home"];
  return categoryImages[(absHash + index) % categoryImages.length];
}
