const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("./authMiddleware");

const prisma = new PrismaClient();

// Public route to get all diary entries (no authentication required)
router.get("/public", async (req, res) => {
  try {
    const entries = await prisma.diaryEntry.findMany({
      where: { isPublic: true }, // Assuming you have an isPublic field
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
    const { title, content, category } = req.body;
    const userId = req.user.id;

    const newEntry = await prisma.diaryEntry.create({
      data: {
        title,
        content,
        category,
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

// Protected route to edit a diary entry
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const userId = parseInt(req.user.id);

    const updatedEntry = await prisma.diaryEntry.updateMany({
      where: {
        id: id,
        userId: userId,
      },
      data: { title, content },
    });

    if (updatedEntry.count === 0) {
      return res
        .status(404)
        .json({ msg: "Entry not found or you're not authorized to edit it" });
    }

    const entry = await prisma.diaryEntry.findUnique({
      where: { id: id },
    });

    res.json(entry);
  } catch (error) {
    console.error("Error updating diary entry:", error);
    res
      .status(500)
      .json({ message: "Error updating diary entry", error: error.message });
  }
});

// Protected route to delete a diary entry
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.user.id);

    const deletedEntry = await prisma.diaryEntry.deleteMany({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (deletedEntry.count === 0) {
      return res
        .status(404)
        .json({ msg: "Entry not found or you're not authorized to delete it" });
    }

    res.json({ msg: "Entry removed" });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    res
      .status(500)
      .json({ message: "Error deleting diary entry", error: error.message });
  }
});

// Get all unique categories
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
