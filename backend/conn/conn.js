const mongoose = require("mongoose");

const conn = async () => {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB:", mongoose.connection.name);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
};

conn();
