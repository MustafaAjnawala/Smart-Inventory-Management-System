const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./connectToDb");
const { Product, Purchase, Return, Bill, SyncLog } = require("./models/models");
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
app.post("/api/products", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) throw new Error("Product name is compulsory");

    const result = await Product.create({
      name: body.name,
      specific: {
        flavor: body.specific?.flavor || null,
        color: body.specific?.color || null,
        weight: body.specific?.weight || null,
        volume: body.specific?.volume || null,
      },
    });

    res
      .status(201)
      .json({ msg: "Product created successfully", product: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new inventory purchase
app.post("/api/purchases", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//get all inventory purchases (newest first)
app.get("/api/purchases", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get SKUs expiring in next 30 days
app.get("/api/purchases/expiring", async (req, res) => {
  try {
    const now = new Date();
    const next30 = new Date();
    next30.setDate(now.getDate() + 30);

    const expiring = await Purchase.find({
      expiryDate: { $gte: now, $lte: next30 },
    });

    res.json(expiring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
