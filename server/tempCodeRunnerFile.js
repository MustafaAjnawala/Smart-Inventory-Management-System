app.post("/api/products", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) throw err;
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});