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

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
