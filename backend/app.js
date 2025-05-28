const express = require("express");
const app = express();
const cors = require("cors");
require("./conn/conn.js");
const auth = require("./routes/auth.js");
const list = require("./routes/list.js");

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://todo-one-alpha-50.vercel.app',
  credentials: true
}));



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});