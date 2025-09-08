const jwt = require('jsonwebtoken');

function auth(requiredRoles = []) {
	return (req, res, next) => {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
		if (!token) return res.status(401).json({ message: 'No token' });
		try {
			const secret = process.env.JWT_SECRET || 'devsecret';
			const payload = jwt.verify(token, secret);
			req.user = payload;
			if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
				return res.status(403).json({ message: 'Forbidden' });
			}
			next();
		} catch (e) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	};
}

module.exports = auth;


