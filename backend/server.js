const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/scrape/github-developers", async (req, res) => {
  const result = [];
  const { date = "daily" } = req.query;

  try {
    const { data } = await axios.get(
      `https://github.com/trending/developers?since=${date}`
    );
    const $ = cheerio.load(data);

    $("article.Box-row").each((i, elem) => {
      const name = $(elem).find("h1.h3.lh-condensed a").text().trim();
      const username = $(elem).find("p.f4.text-normal.mb-1 a").text().trim();
      const avatar = $(elem).find("img").attr("src");

      const repo = $(elem).find("h1.h4.lh-condensed a").text().trim();
      const repo_url = $(elem).find("h1.h4.lh-condensed a").attr("href");
      const description = $(elem)
        .find("div.f6.color-fg-muted.mt-1")
        .text()
        .trim();

      result.push({
        name,
        username,
        avatar,
        repo: repo || "N/A",
        repo_url: repo_url ? `https://github.com${repo_url}` : "N/A",
        description: description || "N/A",
      });
    });

    res.json(result);
  } catch (err) {
    console.error("Scraping failed:", err.message);
    res.status(500).send("Error scraping developers");
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
