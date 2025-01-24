const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5001;

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo_generator",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// Create a new demo
app.post("/api/demos", upload.array("images", 5), (req, res) => {
  const { captions } = req.body;
  const imagePaths = req.files.map((file) => file.path);

  const sql = "INSERT INTO demos (images, captions) VALUES (?, ?)";
  db.query(
    sql,
    [JSON.stringify(imagePaths), JSON.stringify(captions)],
    (err, result) => {
      if (err) throw err;
      res.json({
        id: result.insertId,
        images: imagePaths,
        captions: JSON.parse(captions),
      });
    }
  );
});

// Get list of all demos
app.get("/api/demos", (req, res) => {
  const sql = "SELECT * FROM demos";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(
      results.map((row) => ({
        id: row.id,
        images: JSON.parse(row.images),
        captions: JSON.parse(row.captions),
      }))
    );
  });
});

// Update a demo by ID
app.put("/api/demos/:id", (req, res) => {
  const { id } = req.params;
  const { captions } = req.body;

  const sql = "UPDATE demos SET captions = ? WHERE id = ?";
  db.query(sql, [JSON.stringify(captions), id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// Delete a demo by ID
app.delete("/api/demos/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM demos WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
