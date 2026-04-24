import mongoose from 'mongoose';
import Product from './modules/Product.js';

const baseProducts = [
  {
    name: "Sony WH-1000XM4 Wireless Headphones",
    category: "Audio",
    price: 349,
    discountPrice: 299,
    stock: 45,
    status: "Active",
    sku: "SONY-WH1000XM4",
    description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life.",
    imageUpload: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599813296068-07e923ceb322?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Apple MacBook Pro 14 (M3)",
    category: "Laptops",
    price: 1599,
    discountPrice: 1499,
    stock: 20,
    status: "Active",
    sku: "MAC-PRO-14-M3",
    description: "The 14-inch MacBook Pro blasts forward with M3, an incredibly advanced chip that brings serious speed and capability. With up to 22 hours of battery life and a beautiful Liquid Retina XDR display.",
    imageUpload: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    price: 1299,
    discountPrice: 1199,
    stock: 30,
    status: "Active",
    sku: "SAM-S24-ULTRA",
    description: "Meet the new Galaxy S24 Ultra. The ultimate smartphone experience featuring Galaxy AI, revolutionary camera capabilities, and a titanium frame.",
    imageUpload: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Nike Air Max 270",
    category: "Fashion",
    price: 150,
    discountPrice: 130,
    stock: 60,
    status: "Active",
    sku: "NIKE-AM270",
    description: "Boasting the first-ever Max Air unit created specifically for Nike Sportswear, the Nike Air Max 270 delivers an air that absorbs and gives back energy with every springy step.",
    imageUpload: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Canon EOS R5 Mirrorless Camera",
    category: "Cameras",
    price: 3899,
    discountPrice: 3599,
    stock: 12,
    status: "Active",
    sku: "CANON-R5",
    description: "The EOS R5 builds off of the powerful legacy of Canon's full frame cameras offering next generation refinements in image quality, performance and reliability.",
    imageUpload: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519943265882-626a4574cc82?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Dyson V15 Detect Absolute",
    category: "Home",
    price: 749,
    discountPrice: 699,
    stock: 25,
    status: "Active",
    sku: "DYSON-V15",
    description: "Dyson's most powerful, intelligent cordless vacuum. Reveals invisible dust. Automatically adapts suction power. Scientific proof of a deep clean.",
    imageUpload: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584281720815-4ba8ea28cbab?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596752763261-26dd0f41ad70?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Keychron Q1 Custom Mechanical Keyboard",
    category: "Accessories",
    price: 199,
    discountPrice: 179,
    stock: 35,
    status: "Active",
    sku: "KEY-Q1",
    description: "A fully customizable 75% layout mechanical keyboard packed with all premium features and unlimited possibilities.",
    imageUpload: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618365908648-e71bf5716b51?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "DJI Mini 3 Pro Drone",
    category: "Cameras",
    price: 759,
    discountPrice: 729,
    stock: 18,
    status: "Active",
    sku: "DJI-MINI-3",
    description: "The mini-sized, mega-capable DJI Mini 3 Pro is just as powerful as it is portable. Weighing less than 249 g.",
    imageUpload: [
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524143878510-5ee28085d775?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506947653526-17b5deef71ac?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Oculus Quest 3 VR Headset",
    category: "Gaming",
    price: 499,
    discountPrice: 489,
    stock: 50,
    status: "Active",
    sku: "OCULUS-Q3",
    description: "Dive into extraordinary mixed reality and breakthrough VR with the most powerful Quest yet.",
    imageUpload: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622692244247-f5bc8cf38b17?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Asus ROG Zephyrus G14",
    category: "Laptops",
    price: 1399,
    discountPrice: 1249,
    stock: 22,
    status: "Active",
    sku: "ASUS-G14",
    description: "The ROG Zephyrus G14 makes powerful, ultraportable Windows 11 Pro gaming accessible to everyone.",
    imageUpload: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop"
    ]
  },
  {
    name: "Bose QuietComfort Earbuds II",
    category: "Audio",
    price: 299,
    discountPrice: 249,
    stock: 45,
    status: "Active",
    sku: "BOSE-QCE2",
    description: "Next-generation wireless earbuds designed with pioneering CustomTune sound calibration to personalize your audio.",
    imageUpload: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aecb3b9b46?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572569028738-411a54fb142a?q=80&w=1000&auto=format&fit=crop"
    ]
  }
];

const seedProducts = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/iyan");
        console.log("Connected to MongoDB for bulk seeding...");

        await Product.deleteMany({});
        console.log("Cleared existing products.");

        let allProductsToInsert = [];

        // Duplicate the list 4 times (0 to 3) => Total will be 44 products
        for (let i = 0; i < 4; i++) {
            const batch = baseProducts.map((p) => ({
                ...p,
                // Make name and sku unique to avoid conflicts and identify copies easily
                name: i === 0 ? p.name : `${p.name} (Copy ${i})`,
                sku: i === 0 ? p.sku : `${p.sku}-COPY-${i}`
            }));
            
            allProductsToInsert = allProductsToInsert.concat(batch);
        }

        const insertedProducts = await Product.insertMany(allProductsToInsert);
        console.log(`${insertedProducts.length} products inserted successfully (Collection duplicated 4 times).`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

seedProducts();
