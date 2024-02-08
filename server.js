require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

const DB = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(DB).then((val) => {
  console.log("connected at :", val.connection.host);
});

const server = app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
