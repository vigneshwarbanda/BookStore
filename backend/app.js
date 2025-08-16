const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn"); // your DB connection file

const User = require("./routes/user"); // user routes
const Books = require("./routes/book");  // book routes
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Admin = require("./routes/Admin");


app.use(cors());
app.use(express.json()); // to parse JSON requests

// Mount routes
app.use("/api/v1", User);
app.use("/api/v1", Books);   // <<< Mount book routes here
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1", Admin);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
