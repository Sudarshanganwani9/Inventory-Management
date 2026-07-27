require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/products", require("./routes/productRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on the port ${PORT}`);
});
