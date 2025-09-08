const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Table = require('./models/Table');

dotenv.config();

async function seed() {
	await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qrmenu');
	console.log('Connected to Mongo');

	await Promise.all([
		Category.deleteMany({}),
		Product.deleteMany({}),
		User.deleteMany({}),
		Table.deleteMany({}),
	]);

	const categories = await Category.insertMany([
		{ name: 'İçecekler' },
		{ name: 'Yemekler' },
		{ name: 'Tatlılar' },
	]);

	const [drinks, foods, desserts] = categories;

	await Product.insertMany([
		{ name: 'Türk Kahvesi', description: 'Orta şekerli', price: 50, category: drinks._id, stock: 100 },
		{ name: 'Latte', description: 'Sıcak', price: 70, category: drinks._id, stock: 100 },
		{ name: 'Burger', description: 'Cheddar ve patates', price: 180, category: foods._id, stock: 50 },
		{ name: 'Cheesecake', description: 'Frambuazlı', price: 90, category: desserts._id, stock: 30 },
	]);

	const adminPass = await bcrypt.hash('admin123', 10);
	await User.create({ name: 'Admin', email: 'admin@cafe.com', passwordHash: adminPass, role: 'admin' });

	await Table.insertMany([ { number: 1 }, { number: 2 }, { number: 3 }, { number: 5 } ]);

	console.log('Seeded.');
	await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });


