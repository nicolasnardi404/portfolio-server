const express = require("express");
const cors = require("cors");
const prisma = require("./prisma");

const app = express();

app.use(cors());
app.use(express.json());

const publicDiaryRoutes = require("./routes/publicDiary");
const diaryRoutes = require("./routes/diary");
const authRoutes = require("./routes/auth");

// Public diary routes (no authentication)
app.use("/api/public-diary", publicDiaryRoutes);

// Protected diary routes
app.use("/api/diary", diaryRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    prisma.$disconnect();
  });
});
