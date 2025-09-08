const { Schema, model, Types } = require('mongoose');

const orderItemSchema = new Schema({
	product: { type: Types.ObjectId, ref: 'Product', required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true },
}, { _id: false });

const orderSchema = new Schema({
	tableNumber: { type: Number, required: true },
	items: [orderItemSchema],
	status: { type: String, enum: ['pending', 'preparing', 'ready', 'served'], default: 'pending' },
	total: { type: Number, required: true },
}, { timestamps: true });

module.exports = model('Order', orderSchema);


