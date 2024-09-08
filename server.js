const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const publicDiaryRoutes = require("./routes/publicDiary");
const diaryRoutes = require("./routes/diary");

// Public diary routes (no authentication)
app.use("/api/public-diary", publicDiaryRoutes);

// Mixed public and protected diary routes
app.use("/api/diary", diaryRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
