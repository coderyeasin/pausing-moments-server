const express = require("express");
const app = express();
const port = process.env || 5000;

app.get("/", (req, res) => {
  res.send("Pausing Moments");
});

app.listen(port, () => {
  console.log(`Moments Listening on ${port}`);
});
