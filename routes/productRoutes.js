const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    purchaseProduct,
    restockProduct,
    getProductHistory,
} = require ("../controllers/productController");

router.post("/", createProduct);

router.get("/", getProducts);

router.post("/purchase", purchaseProduct);

router.post("/restock", restockProduct);

router.get("/:productId/history", getProductHistory);

module.exports = router;