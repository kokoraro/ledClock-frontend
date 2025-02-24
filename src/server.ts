// Import necessary packages
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

// Initialize Express app
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

process.on("SIGTERM", process.exit);
process.on("SIGINT", process.exit);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from 'public' directory
app.use(express.static("public"));

app.get("/js/utils.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.render("utils", { ledServerURL: process.env.LED_SERVER_URL });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
