import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/product.model.js";

const sampleProducts = [
  // Electronics
  {
    name: "Mechanical Wireless Keyboard",
    description: "Crafted with hot-swappable tactile brown switches, wireless Bluetooth pairing, and an anodized aluminum frame for quiet luxury.",
    price: 4999,
    category: "Electronics",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Studio Acoustic Headphones",
    description: "Precision-engineered 45mm neodymium drivers delivering immersive high-fidelity spatial audio and active noise cancellation.",
    price: 7499,
    category: "Electronics",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Ergonomic Precision Mouse",
    description: "Sculpted thumb rest with dual connection modes, hyper-fast electromagnetic scroll wheel, and 8000 DPI sensor.",
    price: 2499,
    category: "Electronics",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Minimalist Desk Audio Monitors",
    description: "Compact wooden desktop sound monitors with silk dome tweeters and custom woven kevlar drivers for studio playback.",
    price: 8999,
    category: "Electronics",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85"
    ]
  },

  // Home
  {
    name: "Hand-Thrown Ceramic Vase",
    description: "Artisanal stoneware vase sculpted with a matte chalk glaze and organic ribbed silhouette for modern interiors.",
    price: 1899,
    category: "Home",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Minimalist Fluted Stoneware Mug",
    description: "Comfortable tactile ribbed mug crafted from speckled cream ceramic, glazed with organic earthen textures.",
    price: 849,
    category: "Home",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Botanical Soy Wax Candle",
    description: "Hand-poured 100% natural soy wax candle scented with smoked sandalwood, amber, and crisp cedar notes.",
    price: 1299,
    category: "Home",
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Sculptural Walnut Wood Tray",
    description: "Solid American walnut serving and valet tray finished with food-safe botanical oils and beveled edges.",
    price: 2199,
    category: "Home",
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=85"
    ]
  },

  // Fashion
  {
    name: "Organic Linen Oversized Shirt",
    description: "Breathable French flax linen shirt in an unbleached neutral oat tone, tailored with a relaxed camp collar.",
    price: 3299,
    category: "Fashion",
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Relaxed Heavyweight Cotton Tee",
    description: "280 GSM premium combed organic cotton boxy fit t-shirt with reinforced rib collar in muted olive.",
    price: 1499,
    category: "Fashion",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Structured Wool Blend Overshirt",
    description: "Warm and durable double-faced wool jacket with utility chest pockets and natural horn buttons.",
    price: 5499,
    category: "Fashion",
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
    ]
  },

  // Accessories
  {
    name: "Full-Grain Leather Tote",
    description: "Handcrafted vegetable-tanned leather tote with antique brass hardware and dedicated 15-inch laptop sleeve.",
    price: 5999,
    category: "Accessories",
    stock: 16,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Minimalist Brass Desk Clock",
    description: "Solid brushed brass analog tabletop clock with silent sweeping quartz movement and weighted cylindrical base.",
    price: 2799,
    category: "Accessories",
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Woven Canvas Travel Duffle",
    description: "Water-resistant 18oz heavy duck canvas duffle bag with full-grain leather straps and antique brass zippers.",
    price: 4499,
    category: "Accessories",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85"
    ]
  },

  // Beauty
  {
    name: "Botanical Hydrating Facial Elixir",
    description: "Cold-pressed rosehip, squalane, and frankincense botanical facial oil for deep cellular hydration and natural glow.",
    price: 1999,
    category: "Beauty",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1608248597359-0f04f2f764a7?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Artisanal Sandalwood Eau de Parfum",
    description: "Smoky cedarwood, Australian sandalwood, cardamom, and subtle iris in a UV-protective amber glass flacon.",
    price: 4299,
    category: "Beauty",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Calming Herbal Mineral Bath Salts",
    description: "Dead Sea mineral salts infused with organic French lavender blossoms, bergamot oil, and wild eucalyptus.",
    price: 999,
    category: "Beauty",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=85"
    ]
  },

  // Books
  {
    name: "The Architecture of Quiet Spaces",
    description: "Hardcover photography volume surveying minimalist Japanese and Scandinavian residential spaces.",
    price: 2499,
    category: "Books",
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    name: "Tactile Living: The Art of Slow Living",
    description: "An inspiring compendium of artisanal craft, sustainable textiles, and intentional interior philosophy.",
    price: 1899,
    category: "Books",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=85"
    ]
  }
];

const seedProducts = async () => {
  try {
    if (!process.env.dbUrl) {
      throw new Error("dbUrl missing from .env");
    }

    console.log("Connecting to database to seed products...");
    await mongoose.connect(process.env.dbUrl);
    console.log("Database connected successfully.");

    let insertedCount = 0;
    let existingCount = 0;

    for (const prodData of sampleProducts) {
      const existing = await Product.findOne({ name: prodData.name });
      if (existing) {
        existingCount++;
      } else {
        await Product.create(prodData);
        insertedCount++;
        console.log(`+ Added: ${prodData.name} (${prodData.category}) - ₹${prodData.price}`);
      }
    }

    const totalProducts = await Product.countDocuments();
    console.log("\n=================================");
    console.log(`Seeding complete!`);
    console.log(`New products added: ${insertedCount}`);
    console.log(`Existing products kept: ${existingCount}`);
    console.log(`Total products in catalog: ${totalProducts}`);
    console.log("=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
