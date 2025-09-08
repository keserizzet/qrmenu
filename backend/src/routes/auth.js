const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const secret = process.env.JWT_SECRET || 'devsecret';
		const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });
		res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
	} catch (e) {
		res.status(500).json({ message: 'Login error' });
	}
});

module.exports = router;


