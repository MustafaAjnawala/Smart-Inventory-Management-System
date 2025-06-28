const {
  Product,
  Purchase,
  Return,
  Bill,
  SyncLog,
} = require("../models/models");

async function handleAddNewProduct(req, res) {
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
}

async function handleGetAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleAddNewPurchase(req, res) {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function handleGetAllPurchases(req, res) {
  try {
    const purchases = await Purchase.find().sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleGetAllBills(req, res) {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleGetAllExpiringPurchases(req, res) {
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
}

async function handleProcessReturn(req, res) {
  try {
    const { purchaseId, returnedQty, expectedRefund, actualRefund } = req.body;
    if (!purchaseId || !returnedQty || !expectedRefund || !actualRefund)
      res.status(400).json({ error: "Please enter all fields" });

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not Found" });
    }
    //check if enough stock
    if (returnedQty > purchase.remainingQty) {
      return res.status(400).json({
        error: "Remaining Quantity is less than enter quantity to be returned",
      });
    }

    //decrease the stock
    purchase.remainingQty -= returnedQty;
    await purchase.save();

    //creating the return record
    const returnRecord = await Return.create({
      purchaseId,
      returnedQty,
      expectedRefund,
      actualRefund,
    });

    return res.status(201).json({
      msg: "Return processed succesfully",
      return: returnRecord,
      currentnINventory: purchase.remainingQty,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleBillProcessing(req, res) {
  try {
    const {
      billNo,
      customerName,
      totalAmount,
      paidAmount,
      paymentMethod,
      items,
    } = req.body;

    for (let item of items) {
      let qtyToDeduct = item.quantity;

      //finding all the purchases entry for particular product
      const batches = await Purchase.find({
        productName: item.productName,
        remainingQty: { $gt: 0 },
      }).sort({ purchaseDate: 1 }); //sorting to get the oldest order first (FIFO)

      for (let batch of batches) {
        if (qtyToDeduct <= 0) break; //if all is deducted

        const deductQty = Math.min(batch.remainingQty, qtyToDeduct);
        qtyToDeduct -= deductQty;
        batch.remainingQty -= deductQty;

        await batch.save();
      }
      //means not enough stock
      if (qtyToDeduct > 0) {
        res
          .status(400)
          .json({ err: `Not enough stock for ${item.productName}` });
      }
    }
    //if all good then save the bill
    const bill = await Bill.create({
      billNo,
      customerName,
      totalAmount,
      paidAmount,
      paymentMethod,
      items,
    });

    res.status(201).json(bill);
  } catch (err) {}
}

module.exports = {
  handleAddNewProduct,
  handleGetAllProducts,
  handleAddNewPurchase,
  handleGetAllPurchases,
  handleGetAllBills,
  handleGetAllExpiringPurchases,
  handleProcessReturn,
  handleBillProcessing,
};
