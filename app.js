const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// middlewares
app.use(express.json());
app.use(cors());

// schema design
const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name for this product'],
			trim: true, // delete spaces
			unique: [true, 'Name must be unique'],
			minLength: [3, 'name must be at least 3 characters'],
			maxLength: [100, 'Name is too large'],
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: [0, "price can't be negative"],
		},
		unit: {
			type: String,
			required: true,
			enum: {
				values: ['kg', 'litre', 'pcs'],
				message: "unit value can't be {VALUE}, must be kg/litre/pcs",
			},
		},
		quantity: {
			type: Number,
			required: true,
			min: [0, "quantity can't be negative"],
			validate: {
				validator: (value) => {
					const isInteger = Number.isInteger(value);
					if (isInteger) {
						return true;
					} else {
						return false;
					}
				},
			},
			message: 'Quantity must be an integer',
		},
		status: {
			type: String,
			enum: {
				values: ['in-stock', 'out-of-stock', 'discontinued'],
				message: "status can't be {VALUE}",
			},
		},
		// categories: [
		// 	{
		// 		name: {
		// 			type: String,
		// 			required: true,
		// 		},
		// 		_id: mongoose.Schema.Types.ObjectId,
		// 	},
		// ],
		// supplier: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'Supplier',
		// },
		// createdAt: {
		// 	type: Date,
		// 	default: Date.now,
		// },
		// updatedAt: {
		// 	type: Date,
		// 	default: Date.now,
		// },
	},
	{
		timestamps: true,
	}
);

// mongoose middlewares for saving data: pre / post
productSchema.pre('save', function (next) {
	if (this.quantity == 0) {
		this.status = 'out-of-stock';
	}
	next();
});

// productSchema.post('save', function (doc, next) {
// 	console.log('After saving data');
// 	next();
// });

// instence methods: inject a function
productSchema.methods.logger = function () {
	console.log(`Data saved for ${this.name}`);
};

// SCHEMA -> MODEL -> QUERY

const Product = mongoose.model('Product', productSchema);

app.get('/', (req, res) => {
	res.send('Router is working! YaY');
});

// posting to database
app.post('/api/v1/product', async (req, res, next) => {
	try {
		// save or create
		const result = await Product.create(req.body);
		result.logger();
		// const product = new Product(req.body);
		// const result = await product.save();
		res.status(200).json({
			status: 'success',
			message: 'Data inserted successfully!',
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: 'Data is not inserted',
			error: error.message,
		});
	}
});

/**
 * @find
 * mongoose has 3 methods to find(get) data from mongodb
 * 1. find, 2. findOne, 3. findById
 */

app.get('/api/v1/product', async (req, res, next) => {
	try {
		// const product = await Product.where('name')
		// 	.equals(/\w/)
		// 	.where('quantity')
		// 	.gt(100)
		// 	.lt(600)
		// 	.limit(2)
		// 	.sort({ quantity: -1 });

		const product = await Product.findById('63a124bc15116ec644ef4903');
		res.status(200).json({
			status: 'success',
			data: product,
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: "can't get the data",
			error: error.message,
		});
	}
});

module.exports = app;
