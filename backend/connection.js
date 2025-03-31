const mongoose = require('mongoose');
require('dotenv').config();

console.log("MongoDB URL from .env:", process.env.MONGO_URL); // Debugging line

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
