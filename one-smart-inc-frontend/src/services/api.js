import axios from "axios";
import * as localdb from "./localdb";

const API_BASE_URL =
  "https://careeco-inventory-management-system.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: check online status
function isOnline() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

// Products API
export const productsAPI = {
  getAll: async () => {
    if (isOnline()) {
      const res = await api.get("/products");
      await localdb.putBulk("products", res.data);
      return res;
    } else {
      return { data: await localdb.getAll("products") };
    }
  },
  create: async (productData) => {
    if (isOnline()) {
      const res = await api.post("/products", productData);
      await localdb.put("products", res.data.product);
      return res;
    } else {
      // Generate a temp _id for offline
      const offlineProduct = { ...productData, _id: Date.now().toString() };
      await localdb.put("products", offlineProduct);
      return { data: { product: offlineProduct, offline: true } };
    }
  },
};

// Purchases API
export const purchasesAPI = {
  getAll: async () => {
    if (isOnline()) {
      const res = await api.get("/purchases");
      await localdb.putBulk("purchases", res.data);
      return res;
    } else {
      return { data: await localdb.getAll("purchases") };
    }
  },
  create: async (purchaseData) => {
    if (isOnline()) {
      const res = await api.post("/purchases", purchaseData);
      await localdb.put("purchases", res.data);
      return res;
    } else {
      const offlinePurchase = { ...purchaseData, _id: Date.now().toString() };
      await localdb.put("purchases", offlinePurchase);
      return { data: offlinePurchase, offline: true };
    }
  },
  getExpiring: async () => {
    if (isOnline()) {
      const res = await api.get("/purchases/expiring");
      await localdb.putBulk("purchases", res.data); // update local
      return res;
    } else {
      // Filter locally
      const all = await localdb.getAll("purchases");
      const now = new Date();
      const next30 = new Date();
      next30.setDate(now.getDate() + 30);
      const expiring = all.filter(
        (p) =>
          p.expiryDate &&
          new Date(p.expiryDate) >= now &&
          new Date(p.expiryDate) <= next30
      );
      return { data: expiring };
    }
  },
};

// Returns API
export const returnsAPI = {
  create: async (returnData) => {
    if (isOnline()) {
      const res = await api.post("/returns", returnData);
      await localdb.put("returns", res.data.return);
      // Also update purchase in localdb
      if (res.data.updatedInventory) {
        const purchase = await localdb
          .getAll("purchases")
          .then((arr) => arr.find((p) => p._id === returnData.purchaseId));
        if (purchase) {
          purchase.remainingQty = res.data.updatedInventory;
          await localdb.put("purchases", purchase);
        }
      }
      return res;
    } else {
      // Save return locally
      const offlineReturn = { ...returnData, _id: Date.now().toString() };
      await localdb.put("returns", offlineReturn);
      // Update purchase locally
      const purchase = await localdb
        .getAll("purchases")
        .then((arr) => arr.find((p) => p._id === returnData.purchaseId));
      if (purchase) {
        purchase.remainingQty =
          (purchase.remainingQty || 0) - (returnData.returnedQty || 0);
        await localdb.put("purchases", purchase);
      }
      return { data: { return: offlineReturn, offline: true } };
    }
  },
};

// Bills API
export const billsAPI = {
  getAll: async () => {
    if (isOnline()) {
      const res = await api.get("/bills");
      await localdb.putBulk("bills", res.data);
      return res;
    } else {
      return { data: await localdb.getAll("bills") };
    }
  },
  create: async (billData) => {
    if (isOnline()) {
      const res = await api.post("/bills", billData);
      await localdb.put("bills", res.data);
      return res;
    } else {
      const offlineBill = {
        ...billData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await localdb.put("bills", offlineBill);
      return { data: offlineBill, offline: true };
    }
  },
};

// Sync API for offline/online sync
export const syncAPI = {
  downloadAll: () => api.get("/sync"),
  uploadAll: (data) => api.post("/sync", data),
};

export default api;
