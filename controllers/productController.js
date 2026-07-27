const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.createProduct = async (req, res) => {
    try {
        const { productName, price, availableStocks } = req.body;

        if(!productName || price <=0 || availableStocks < 0) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        const existing = await Product.findOne({ productName });

        if(existing) {
            return res.status(400).json({ message: "Product already exists" });
        }

        const product = await Product.create({
            productName,
            price,
            availableStocks,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.purchaseProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.availableStocks < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        product.availableStocks -= quantity;
        await product.save();

        const transaction = await Transaction.create({
            productId,
            transactionType: "Purchase",
            quantity,
            price: product.price * quantity
        });

        res.json({ message: "Purchase successful", product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.restockProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.availableStocks += quantity;
        await product.save();

        await Transaction.create({
            productId,
            transactionType: "Restock",
            quantity,
        });

        res.json({ message: "Restock successful", product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};

exports.getProductHistory = async (req, res) => {
    try {
        const history = await Transaction.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};