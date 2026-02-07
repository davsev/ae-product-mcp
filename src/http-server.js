import express from "express";
import { fetchAliProduct } from "./scraper.js";

const app = express();
app.use(express.json());

app.post("/fetch", async (req, res) => {
  try {
    const { url } = req.body;
    const result = await fetchAliProduct(url);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("HTTP scraper running on port", PORT);
});
