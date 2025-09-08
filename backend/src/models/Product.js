const { Schema, model, Types } = require('mongoose');

const productSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	price: { type: Number, required: true },
	imageUrl: { type: String },
	category: { type: Types.ObjectId, ref: 'Category' },
	stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('Product', productSchema);


