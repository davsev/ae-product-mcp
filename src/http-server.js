import express from "express";
import { fetchAliProduct } from "./scraper.js";

const app = express();
app.use(express.json());

app.post("/fetch", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    const result = await fetchAliProduct(url);
    res.json(result);
  } catch (err) {
    console.error("SCRAPER ERROR:", err);
    res.status(500).json({
      error: err.message || "scraper failed"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("HTTP scraper running on port", PORT);
});
