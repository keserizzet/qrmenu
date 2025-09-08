const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const router = express.Router();

// Public menu endpoints
router.get('/menu', async (req, res) => {
	const categories = await Category.find().sort('name');
	const products = await Product.find().populate('category');
	res.json({ categories, products });
});

router.post('/orders', async (req, res) => {
	const { tableNumber, items } = req.body;
	if (!tableNumber || !Array.isArray(items) || !items.length) {
		return res.status(400).json({ message: 'Invalid order' });
	}
	const computedItems = items.map((it) => ({
		product: it.productId,
		name: it.name,
		price: it.price,
		quantity: it.quantity,
	}));
	const total = computedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
	const order = await Order.create({ tableNumber, items: computedItems, total });
	req.app.get('io').emit('order:new', order);
	res.json(order);
});

module.exports = router;


