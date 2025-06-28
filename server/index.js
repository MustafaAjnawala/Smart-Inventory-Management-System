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

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
