const { Schema, model } = require('mongoose');

const tableSchema = new Schema({
	number: { type: Number, required: true, unique: true },
	qrCodeData: { type: String },
}, { timestamps: true });

module.exports = model('Table', tableSchema);


