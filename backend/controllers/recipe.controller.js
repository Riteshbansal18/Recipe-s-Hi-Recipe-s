const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Notification = require("../models/Notification.model");

/* =========================
   ADD NEW RECIPE (SOCKET ENABLED)
========================= */
exports.addNewRecipe = async (req, res) => {
  try {
    const images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => images.push(file.path));
    }

    const newRecipe = new Recipe({
      ...req.body,
      userId: req.userId,
      images,
    });

    await newRecipe.save();

    // populate for frontend use
    const populatedRecipe = await Recipe.findById(newRecipe._id)
      .populate("userId")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      });

    // notification for self
    const user = await User.findById(req.userId);

    const notification = new Notification({
      message: "You created a new recipe post",
      time: new Date(),
      type: "post",
      userId: req.userId,
      senderImage: user?.profileImage || null,
    });

    await notification.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { recipes: newRecipe._id },
    });

    // 🔥 SOCKET EMIT (CORRECT WAY)
    const io = req.app.get("io");
    if (io) {
      io.emit("new-recipe", populatedRecipe);
    }

    res.status(201).json({
      message: "Recipe created successfully",
      recipe: populatedRecipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recipe creation failed" });
  }
};

/* =========================
   GET ALL RECIPES (EXPLORE)
========================= */
exports.getAllRecipe = async (req, res) => {
  try {
    const { cuisine, impression, veg } = req.query;
    const filter = {};
    const sort = {};

    if (cuisine) {
      filter.cuisine = { $in: JSON.parse(cuisine) };
    }

    if (veg === "veg" || veg === "non-veg") {
      filter.veg = veg === "veg";
    }

    if (impression === "asc") sort.likes = 1;
    if (impression === "desc") sort.likes = -1;

    const recipes = await Recipe.find(filter)
      .sort(sort)
      .populate("userId")
      .populate("likes")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to get recipes" });
  }
};

/* =========================
   GET MY RECIPES (PROFILE)
========================= */
exports.getMyRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("recipes")
      .populate("likedRecipes")
      .populate("savedRecipes");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get your recipes" });
  }
};

/* =========================
   UPDATE MY RECIPE
========================= */
exports.updateMyRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("userId");

    res.status(200).json({
      message: "Recipe updated successfully",
      updatedRecipe: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

/* =========================
   DELETE MY RECIPE (SECURE)
========================= */
exports.deleteMyRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

/* =========================
   USER FEED (FRIENDS + SELF)
========================= */
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friendIds = user.friends.map((f) => f._id);

    const feed = await Recipe.find({
      userId: { $in: [req.userId, ...friendIds] },
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      });

    res.status(200).json({ message: "User feed fetched", feed });
  } catch (error) {
    res.status(500).json({ message: "Couldn't fetch feed" });
  }
};

/* =========================
   SINGLE RECIPE
========================= */
exports.getSingleRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("userId")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      });

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Couldn't fetch recipe" });
  }
};
