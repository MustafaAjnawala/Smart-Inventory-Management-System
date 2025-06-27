const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    specific: {
      flavor: { type: String },
      color: { type: String },
      weight: { type: String },
      volume: { type: String },
    },
  },
  { timestamps: true }
);

const purchaseSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    purchaseDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 }, //in percent
    mrp: { type: Number, required: true },
    expiryDate: { type: Date },
    remainingQty: { type: Number, required: true },
  },
  { timestamps: true }
);

const returnSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    returnedQty: { type: Number, required: true },
    expectedRefund: { type: Number, required: true },
    actualRefund: { type: Number, required: true },
    returnDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const billSchema = new mongoose.Schema(
  {
    billNo: { type: String, required: true, unique: true },
    customerName: { type: String },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Other"],
      default: "Cash",
    },
    items: [
      {
        productName: { type: String },
        quantity: { type: Number },
        pricePerUnit: { type: Number },
        total: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const syncLogSchema = new Schema(
  {
    syncType: { type: String, enum: ["auto", "manual"], default: "auto" },
    syncedAt: { type: Date, default: Date.now },
    success: { type: Boolean, default: true },
    errorMsg: { type: String },
  },
  { timestamps: true }
);

const Product = new mongoose.model("Products", productSchema);
const Purchase = new mongoose.model("Purchase", purchaseSchema);
const Return = new mongoose.model("Return", returnSchema);
const Bill = new mongoose.model("Bill", billSchema);
const SyncLog = new mongoose.model("SyncLog", syncLogSchema);

module.exports = { Product, Purchase, Return, Bill, SyncLog };
