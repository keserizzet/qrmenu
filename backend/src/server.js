const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_ORIGIN || '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE']
	}
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*'}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Basic health route
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// Socket.io basic connection
io.on('connection', (socket) => {
	console.log('Socket connected', socket.id);
	socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qrmenu';

mongoose.connect(MONGO_URI).then(() => {
	console.log('MongoDB connected');
	server.listen(PORT, () => console.log(`Server running on :${PORT}`));
}).catch((err) => {
	console.error('Mongo connection error', err);
	process.exit(1);
});


