const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("./authMiddleware");

const prisma = new PrismaClient();

// Public route to get all diary entries (no authentication required)
router.get("/public", async (req, res) => {
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

// Protected route to add a new diary entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const newEntry = await prisma.diaryEntry.create({
      data: {
        title,
        content,
        userId,
      },
    });

    res.json(newEntry);
  } catch (error) {
    console.error("Error adding diary entry:", error);
    res
      .status(500)
      .json({ message: "Error adding diary entry", error: error.message });
  }
});

// Protected route to get user's diary entries
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await prisma.diaryEntry.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
