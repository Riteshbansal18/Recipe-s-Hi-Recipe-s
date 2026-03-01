require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../config/cloudinary");
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, filename) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "recipe-app",
      public_id: filename.split(".")[0], // Use original filename without extension
    });
    console.log(`✅ Uploaded: ${filename} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
};

// Migrate images from local to Cloudinary
const migrateImages = async () => {
  const imagesDir = path.join(__dirname, "../images");
  
  // Check if images directory exists
  if (!fs.existsSync(imagesDir)) {
    console.log("❌ Images directory not found");
    return;
  }

  const files = fs.readdirSync(imagesDir);
  
  if (files.length === 0) {
    console.log("✅ No images to migrate");
    return;
  }

  console.log(`\n📦 Found ${files.length} images to migrate\n`);

  const migrationMap = {}; // Map old filename to new Cloudinary URL

  // Upload all images to Cloudinary
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    
    // Skip if not a file
    if (!fs.statSync(filePath).isFile()) {
      continue;
    }

    const cloudinaryUrl = await uploadToCloudinary(filePath, file);
    
    if (cloudinaryUrl) {
      migrationMap[file] = cloudinaryUrl;
      migrationMap[`images/${file}`] = cloudinaryUrl; // Handle both formats
    }
  }

  console.log(`\n✅ Uploaded ${Object.keys(migrationMap).length / 2} images to Cloudinary\n`);

  // Update database records
  console.log("📝 Updating database records...\n");

  // Update Recipes
  const recipes = await Recipe.find();
  let recipesUpdated = 0;

  for (const recipe of recipes) {
    let updated = false;
    const newImages = recipe.images.map((img) => {
      if (migrationMap[img]) {
        updated = true;
        return migrationMap[img];
      }
      return img;
    });

    if (updated) {
      recipe.images = newImages;
      await recipe.save();
      recipesUpdated++;
      console.log(`✅ Updated recipe: ${recipe.title}`);
    }
  }

  // Update Users (profile images)
  const users = await User.find();
  let usersUpdated = 0;

  for (const user of users) {
    if (user.profileImage && migrationMap[user.profileImage]) {
      user.profileImage = migrationMap[user.profileImage];
      await user.save();
      usersUpdated++;
      console.log(`✅ Updated user profile: ${user.name}`);
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   - Images uploaded: ${Object.keys(migrationMap).length / 2}`);
  console.log(`   - Recipes updated: ${recipesUpdated}`);
  console.log(`   - Users updated: ${usersUpdated}`);
  console.log(`\n✅ Migration completed successfully!\n`);
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await migrateImages();
    console.log("🎉 All done! You can now safely delete the local images folder.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

main();
