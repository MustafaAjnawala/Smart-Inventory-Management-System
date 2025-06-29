const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./connectToDb");
const { Product, Purchase, Return, Bill, SyncLog } = require("./models/models");
const {
  handleAddNewProduct,
  handleGetAllProducts,
  handleAddNewPurchase,
  handleGetAllPurchases,
  handleGetAllExpiringPurchases,
  handleProcessReturn,
  handleBillProcessing,
  handleGetAllBills,
} = require("./controllers/controllers");
require("dotenv").config();
const PORT = process.env.port;

connectToMongoDB(process.env.MONGOURI).then(() => {
  console.log("Connected to Database");
});

const app = express();

//middlwares
app.use(express.json());
app.use(cors());

//create a new product in DB
app.post("/api/products", handleAddNewProduct);

// Get all products
app.get("/api/products", handleGetAllProducts);

// Add a new inventory purchase
app.post("/api/purchases", handleAddNewPurchase);

//get all inventory purchases (newest first)
app.get("/api/purchases", handleGetAllPurchases);

// Get SKUs expiring in next 30 days
app.get("/api/purchases/expiring", handleGetAllExpiringPurchases);

// Get all bills
app.get("/api/bills", handleGetAllBills);

//route to accept the return entry and make changes in purchase Qnty
app.post("/api/returns", handleProcessReturn);

app.post("/api/bills", handleBillProcessing);

// SYNC: Download all data for offline cache
app.get("/api/sync", async (req, res) => {
  try {
    const [products, purchases, bills, returns] = await Promise.all([
      Product.find(),
      Purchase.find(),
      Bill.find(),
      Return.find(),
    ]);
    res.json({ products, purchases, bills, returns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SYNC: Upload local changes to cloud
app.post("/api/sync", async (req, res) => {
  try {
    const { products, purchases, bills, returns } = req.body;
    // Upsert logic for each collection
    // For simplicity, use insertMany with upsert for each (production: use better conflict resolution)
    if (products) {
      for (const p of products) {
        await Product.updateOne({ _id: p._id }, p, { upsert: true });
      }
    }
    if (purchases) {
      for (const p of purchases) {
        await Purchase.updateOne({ _id: p._id }, p, { upsert: true });
      }
    }
    if (bills) {
      for (const b of bills) {
        await Bill.updateOne({ _id: b._id }, b, { upsert: true });
      }
    }
    if (returns) {
      for (const r of returns) {
        await Return.updateOne({ _id: r._id }, r, { upsert: true });
      }
    }
    res.json({ msg: "Sync successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
