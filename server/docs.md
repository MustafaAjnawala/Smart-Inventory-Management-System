# 📘 OneSmart Inventory & Billing API Documentation

## ✅ 1. Create Product

**POST** `/api/products`

Used to add a new product.

### 🔸 Request

```json
{
  "name": "Real Juice",
  "specific": {
    "flavor": "Mango",
    "color": "Yellow",
    "weight": "1L",
    "volume": "1000ml"
  }
}
```

### 🔸 Response

```json
{
  "msg": "Product created successfully",
  "product": { ... }
}
```

---

## ✅ 2. Get All Products

**GET** `/api/products`

### 🔸 Response

```json
[
  {
    "_id": "...",
    "name": "Real Juice",
    "specific": { ... },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

## ✅ 3. Add Purchase (Add Inventory Batch)

**POST** `/api/purchases`

### 🔸 Request

```json
{
  "productName": "Real Juice",
  "purchaseDate": "2025-06-26",
  "quantity": 100,
  "purchasePrice": 22.5,
  "discount": 10,
  "mrp": 28,
  "expiryDate": "2025-07-20",
  "remainingQty": 100
}
```

### 🔸 Response

```json
{
  "_id": "...",
  "productName": "...",
  ...
}
```

---

## ✅ 4. Get All Purchases

**GET** `/api/purchases`

Returns all purchase (inventory) entries, newest first.

### 🔸 Response

```json
[
  {
    "_id": "...",
    "productName": "...",
    "purchaseDate": "...",
    ...
  }
]
```

---

## ✅ 5. Get Expiring SKUs

**GET** `/api/purchases/expiring`

Returns items with `expiryDate` within next 30 days.

### 🔸 Response

```json
[
  {
    "_id": "...",
    "productName": "Real Juice",
    "expiryDate": "2025-07-15",
    ...
  }
]
```

---

## ✅ 6. Return Product

**POST** `/api/returns`

Registers a return against a specific purchase.

### 🔸 Request

```json
{
  "purchaseId": "665d4e12345678abcde00012",
  "returnedQty": 10,
  "expectedRefund": 185,
  "actualRefund": 180
}
```

### 🔸 Response

```json
{
  "msg": "Return processed successfully",
  "return": { ... },
  "updatedInventory": 90
}
```

---

## ✅ 7. Create Bill

**POST** `/api/bills`

Generates a customer invoice and updates inventory across multiple purchase batches.

### 🔸 Request

```json
{
  "billNo": "INV-001",
  "customerName": "Amit",
  "totalAmount": 180,
  "paidAmount": 180,
  "paymentMethod": "Cash",
  "items": [
    {
      "productName": "Real Juice",
      "quantity": 5,
      "pricePerUnit": 36,
      "total": 180
    }
  ]
}
```

### 🔸 Response

```json
{
  "_id": "...",
  "billNo": "INV-001",
  ...
}
```

---

## ✅ 8. Get Sync Logs (Optional) - dont bother for now

**GET** `/api/sync`

### 🔸 Response

```json
[
  {
    "syncType": "manual",
    "syncedAt": "2025-06-26T15:00:00Z",
    "success": true
  }
]
```

---

## ✅ 9. Log a Sync Event (Optional) - dont consider for now

**POST** `/api/sync`

### 🔸 Request

```json
{
  "syncType": "auto",
  "success": true,
  "errorMsg": ""
}
```

---

## 📝 Notes for Frontend Developer

- Always show product names in dropdowns for purchase/return/bill.
- `purchaseId` is required for returns.
- Billing should simulate FIFO (oldest inventory batch used first).
- Expiry alerts: fetch `/api/purchases/expiring` on app startup.
- Dates should be sent as `YYYY-MM-DD` format.
