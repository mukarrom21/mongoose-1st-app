require('dotenv').config();
const colors = require('colors');
const app = require('./app');
const port = process.env.PORT || 8080;

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
	console.log(`Database connected successful`.red.bold);
});

// server
app.listen(port, () => {
	console.log(`App is running on port ${port}`.yellow.bold);
});
