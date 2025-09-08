const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Table = require('../models/Table');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const QRCode = require('qrcode');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Categories CRUD
router.get('/categories', auth(['admin','staff']), async (req, res) => {
	const items = await Category.find().sort('name');
	res.json(items);
});
router.post('/categories', auth(['admin']), async (req, res) => {
	const created = await Category.create(req.body);
	res.json(created);
});
router.put('/categories/:id', auth(['admin']), async (req, res) => {
	const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.json(updated);
});
router.delete('/categories/:id', auth(['admin']), async (req, res) => {
	await Category.findByIdAndDelete(req.params.id);
	res.json({ ok: true });
});

// Products CRUD
router.get('/products', auth(['admin','staff']), async (req, res) => {
	const items = await Product.find().populate('category');
	res.json(items);
});
router.post('/products', auth(['admin']), upload.single('image'), async (req, res) => {
	const { name, description, price, category, stock } = req.body;
	const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
	const created = await Product.create({ name, description, price, category, stock, imageUrl });
	res.json(created);
});
router.put('/products/:id', auth(['admin']), upload.single('image'), async (req, res) => {
	const { name, description, price, category, stock } = req.body;
	const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
	const updated = await Product.findByIdAndUpdate(
		req.params.id,
		{ name, description, price, category, stock, ...(imageUrl ? { imageUrl } : {}) },
		{ new: true }
	);
	res.json(updated);
});
router.delete('/products/:id', auth(['admin']), async (req, res) => {
	await Product.findByIdAndDelete(req.params.id);
	res.json({ ok: true });
});

// Tables & QR
router.get('/tables', auth(['admin','staff']), async (req, res) => {
	const items = await Table.find().sort('number');
	res.json(items);
});
router.post('/tables', auth(['admin']), async (req, res) => {
	const { number } = req.body;
	const baseUrl = process.env.CLIENT_ORIGIN?.replace(/\/$/, '') || 'http://localhost:5173';
	const url = `${baseUrl}/table/${number}`;
	const qrPngDataUrl = await QRCode.toDataURL(url);
	const created = await Table.create({ number, qrCodeData: qrPngDataUrl });
	res.json(created);
});
router.get('/tables/:number/qrcode', auth(['admin','staff']), async (req, res) => {
	const table = await Table.findOne({ number: req.params.number });
	if (!table) return res.status(404).json({ message: 'Not found' });
	const img = Buffer.from(table.qrCodeData.split(',')[1], 'base64');
	res.setHeader('Content-Type', 'image/png');
	res.setHeader('Content-Disposition', `attachment; filename=table-${table.number}.png`);
	res.send(img);
});

// Orders listing & status updates
router.get('/orders', auth(['admin','staff']), async (req, res) => {
	const { status } = req.query;
	const q = status ? { status } : {};
	const items = await Order.find(q).sort('-createdAt');
	res.json(items);
});
router.put('/orders/:id/status', auth(['admin','staff']), async (req, res) => {
	const { status } = req.body;
	const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
	req.app.get('io').emit('order:updated', updated);
	res.json(updated);
});

module.exports = router;


