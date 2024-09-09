const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const entries = await prisma.diaryEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching public diary entries:", error);
    res
      .status(500)
      .json({ message: "Error fetching diary entries", error: error.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.diaryEntry.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      where: {
        category: {
          not: null,
          not: "",
        },
      },
    });
    const uniqueCategories = categories.map((c) => c.category).filter(Boolean);
    res.json(uniqueCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

module.exports = router;
